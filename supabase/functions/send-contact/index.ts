import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enhanced persistent rate limiting
const checkRateLimit = async (key: string, limit: number = 3, windowMs: number = 3600000): Promise<{ allowed: boolean; resetTime?: number }> => {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);
  
  try {
    // Clean old entries
    await supabase
      .from('rate_limits')
      .delete()
      .lt('window_start', windowStart.toISOString());
    
    // Get current count
    const { data: existing } = await supabase
      .from('rate_limits')
      .select('count, window_start')
      .eq('key', key)
      .gte('window_start', windowStart.toISOString())
      .single();
    
    if (!existing) {
      // First request in window
      await supabase
        .from('rate_limits')
        .insert({ key, count: 1, window_start: now.toISOString() });
      return { allowed: true };
    }
    
    if (existing.count >= limit) {
      const resetTime = new Date(existing.window_start).getTime() + windowMs;
      return { allowed: false, resetTime };
    }
    
    // Increment count
    await supabase
      .from('rate_limits')
      .update({ count: existing.count + 1 })
      .eq('key', key)
      .eq('window_start', existing.window_start);
    
    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Allow request on error to avoid blocking legitimate users
    return { allowed: true };
  }
};

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('cf-connecting-ip') || 'unknown';
  return `contact_${ip}`;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email) && email.length >= 5 && email.length <= 254;
}

function validateInput(input: string, minLength: number = 2, maxLength: number = 1000): { valid: boolean; error?: string } {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Input is required' };
  }
  
  const trimmed = input.trim();
  if (trimmed.length < minLength) {
    return { valid: false, error: `Minimum length is ${minLength} characters` };
  }
  
  if (trimmed.length > maxLength) {
    return { valid: false, error: `Maximum length is ${maxLength} characters` };
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i, /javascript:/i, /on\w+=/i, /data:text\/html/i,
    /union.*select/i, /insert.*into/i, /delete.*from/i,
    /ignore\s+previous\s+instructions/i, /system\s*:\s*you\s+are/i
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: 'Invalid content detected' };
    }
  }
  
  return { valid: true };
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '').substring(0, 1000);
}

function escapeHtml(input: string): string {
  return input.replace(/[<>&"']/g, (char) => 
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#x27;' }[char] || char)
  );
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Enhanced rate limiting with persistent storage
    const rateLimitKey = getRateLimitKey(req);
    const rateLimitCheck = await checkRateLimit(rateLimitKey, 3, 3600000); // 3 messages per hour
    
    if (!rateLimitCheck.allowed) {
      console.log(`Rate limit exceeded for contact submission`);
      return new Response(JSON.stringify({ 
        error: "Too many contact requests. Please try again later.",
        resetTime: rateLimitCheck.resetTime 
      }), {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { name, email, message }: ContactPayload = await req.json();

    // Enhanced validation
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Name, email, and message are all required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const nameValidation = validateInput(name, 2, 100);
    if (!nameValidation.valid) {
      return new Response(JSON.stringify({ error: `Name: ${nameValidation.error}` }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const messageValidation = validateInput(message, 10, 2000);
    if (!messageValidation.valid) {
      return new Response(JSON.stringify({ error: `Message: ${messageValidation.error}` }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ error: "Please provide a valid email address" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedMessage = sanitizeInput(message);

    // Send contact message directly to hello@promptandgo.ai
    const contactHtml = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">📧 New Contact Message</h2>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <div style="margin-bottom: 20px;">
            <p style="margin: 0 0 8px; font-weight: 600; color: #374151;">Contact Information:</p>
            <p style="margin: 0 0 5px; color: #6b7280;"><strong>Name:</strong> ${escapeHtml(sanitizedName)}</p>
            <p style="margin: 0 0 15px; color: #6b7280;"><strong>Email:</strong> ${escapeHtml(email)}</p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 20px 0;">
          
          <div>
            <p style="margin: 0 0 10px; font-weight: 600; color: #374151;">Message:</p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea; white-space: pre-wrap; line-height: 1.6; color: #374151;">
${escapeHtml(sanitizedMessage)}
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
            📅 Sent: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `;

    const { error: contactEmailError } = await resend.emails.send({
      from: "PromptAndGo Contact <noreply@promptandgo.ai>",
      to: ["hello@promptandgo.ai"],
      replyTo: email,
      subject: `New Contact Message: ${sanitizedName}`,
      html: contactHtml,
    });

    if (contactEmailError) {
      console.error("Failed to send contact email", contactEmailError);
      return new Response(JSON.stringify({ error: "Failed to send contact email" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Contact message sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Your message has been sent successfully!" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (err: any) {
    console.error("send-contact error", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Unexpected error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});