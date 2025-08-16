import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

// SECURITY: Persistent rate limiting using database
async function checkPersistentRateLimit(supabase: any, key: string, limit = 3, windowMs = 60000): Promise<{ allowed: boolean; resetTime?: number }> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);
  
  // Clean up old entries and get current count
  await supabase.from('rate_limits').delete().lt('window_start', windowStart.toISOString());
  
  const { data: existing } = await supabase
    .from('rate_limits')
    .select('count, window_start')
    .eq('key', key)
    .gte('window_start', windowStart.toISOString())
    .single();

  if (!existing) {
    // First request in window
    await supabase.from('rate_limits').insert({
      key,
      count: 1,
      window_start: now.toISOString(),
    });
    return { allowed: true };
  }

  if (existing.count >= limit) {
    const resetTime = new Date(existing.window_start).getTime() + windowMs;
    return { allowed: false, resetTime };
  }

  // Increment counter
  await supabase
    .from('rate_limits')
    .update({ count: existing.count + 1 })
    .eq('key', key)
    .gte('window_start', windowStart.toISOString());

  return { allowed: true };
}

function validateSecureInput(input: string, maxLength = 5000): { isValid: boolean; error?: string } {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Input is required' };
  }
  
  if (input.length > maxLength) {
    return { isValid: false, error: `Input exceeds maximum length of ${maxLength} characters` };
  }
  
  // Check for potential security threats
  const suspiciousPatterns = [
    /ignore\s+previous\s+instructions/i,
    /system\s*:\s*you\s+are/i,
    /forget\s+everything/i,
    /new\s+instructions/i,
    /admin\s+mode/i,
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /xss/i,
    /alert\s*\(/i
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(input)) {
      return { isValid: false, error: 'Input contains potentially harmful content' };
    }
  }
  
  return { isValid: true };
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, ' ').replace(/[<>]/g, '');
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  return `contact-${ip}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // SECURITY: Enhanced rate limiting
    const rateLimitKey = getRateLimitKey(req);
    const { allowed, resetTime } = await checkPersistentRateLimit(supabaseService, rateLimitKey, 3, 300000); // 3 per 5 min
    
    if (!allowed) {
      const headers = { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil((resetTime! - Date.now()) / 1000).toString()
      };
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.',
        resetTime 
      }), {
        status: 429,
        headers,
      });
    }

    const payload: ContactPayload = await req.json();

    // SECURITY: Enhanced validation
    if (!payload.name || !payload.email || !payload.message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const nameValidation = validateSecureInput(payload.name, 100);
    if (!nameValidation.isValid) {
      return new Response(JSON.stringify({ error: `Name validation failed: ${nameValidation.error}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!validateEmail(payload.email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const messageValidation = validateSecureInput(payload.message, 5000);
    if (!messageValidation.isValid) {
      return new Response(JSON.stringify({ error: `Message validation failed: ${messageValidation.error}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // SECURITY: Sanitize inputs
    const sanitizedName = sanitizeInput(payload.name);
    const sanitizedEmail = sanitizeInput(payload.email);
    const sanitizedMessage = sanitizeInput(payload.message);

    // SECURITY: Store in pending_contacts for verification (existing pattern)
    const confirmationToken = crypto.randomUUID();
    
    const { error: insertError } = await supabaseService
      .from('pending_contacts')
      .insert({
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
        confirmation_token: confirmationToken,
        confirmed: false,
        processed: false,
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to submit contact form' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // TODO: Add email confirmation step here using Resend
    // For now, we'll use the existing pattern but enhanced

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Contact form submitted successfully. We will review and respond soon.' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});