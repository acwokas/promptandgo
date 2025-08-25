import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Remove the in-memory rate limiting since we're using database now
// Enhanced security validation functions
const validateSecureInput = (input: string, maxLength = 5000): { isValid: boolean; error?: string } => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Input is required and must be a string' };
  }
  
  if (input.length > maxLength) {
    return { isValid: false, error: `Input exceeds maximum length of ${maxLength} characters` };
  }
  
  // Check for potential injection attempts
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /vbscript:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /ignore\s+previous\s+instructions/i,
    /system\s*:\s*you\s+are/i
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(input)) {
      return { isValid: false, error: 'Input contains potentially harmful content' };
    }
  }
  
  return { isValid: true };
};

const escapeHtml = (text: string): string => {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  
  return text.replace(/[&<>"'\/]/g, (match) => htmlEscapes[match]);
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ').substring(0, 5000);
};

const checkRateLimit = async (key: string, limit = 3, windowMs = 3600000): Promise<{ allowed: boolean; resetTime?: number }> => {
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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubmitPromptRequest {
  title: string;
  whatFor: string;
  prompt: string;
  excerpt?: string;
  submitterEmail: string;
  submitterName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { title, whatFor, prompt, excerpt, submitterEmail, submitterName }: SubmitPromptRequest = await req.json();
    
    // Enhanced IP-based rate limiting with persistent storage
    const userIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `submit_prompt_${userIP}`;
    
    // Check rate limit (2 submissions per hour per IP) 
    const rateLimitCheck = await checkRateLimit(rateLimitKey, 2, 3600000);
    if (!rateLimitCheck.allowed) {
      console.log(`Rate limit exceeded for prompt submission from IP: ${userIP}`);
      return new Response(JSON.stringify({ 
        error: 'Submission limit reached. Please try again later.',
        resetTime: rateLimitCheck.resetTime 
      }), {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    
    // Validate all inputs
    const titleValidation = validateSecureInput(title, 200);
    const whatForValidation = validateSecureInput(whatFor, 500);
    const promptValidation = validateSecureInput(prompt, 5000);
    const emailValidation = submitterEmail ? validateSecureInput(submitterEmail, 254) : { isValid: true };
    const nameValidation = submitterName ? validateSecureInput(submitterName, 100) : { isValid: true };
    const excerptValidation = excerpt ? validateSecureInput(excerpt, 1000) : { isValid: true };
    
    if (!titleValidation.isValid) {
      return new Response(JSON.stringify({ error: `Title: ${titleValidation.error}` }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    
    if (!whatForValidation.isValid) {
      return new Response(JSON.stringify({ error: `What for: ${whatForValidation.error}` }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    
    if (!promptValidation.isValid) {
      return new Response(JSON.stringify({ error: `Prompt: ${promptValidation.error}` }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    
    if (!emailValidation.isValid) {
      return new Response(JSON.stringify({ error: `Email: ${emailValidation.error}` }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    
    if (!nameValidation.isValid) {
      return new Response(JSON.stringify({ error: `Name: ${nameValidation.error}` }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    
    if (!excerptValidation.isValid) {
      return new Response(JSON.stringify({ error: `Excerpt: ${excerptValidation.error}` }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    
    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedWhatFor = sanitizeInput(whatFor);
    const sanitizedPrompt = sanitizeInput(prompt);
    const sanitizedExcerpt = excerpt ? sanitizeInput(excerpt) : undefined;
    const sanitizedEmail = sanitizeInput(submitterEmail);
    const sanitizedName = submitterName ? sanitizeInput(submitterName) : undefined;

    // Send submission to company - use escaped values for HTML
    const submissionBodyLines = [
      `Title: ${escapeHtml(sanitizedTitle)}`,
      `What for: ${escapeHtml(sanitizedWhatFor)}`,
      `Prompt:\n${escapeHtml(sanitizedPrompt)}`,
      sanitizedExcerpt ? `Excerpt:\n${escapeHtml(sanitizedExcerpt)}` : undefined,
      `---`,
      `Submitter: ${sanitizedName ? escapeHtml(sanitizedName) : 'Not provided'}`,
      `Email: ${escapeHtml(sanitizedEmail)}`,
    ].filter(Boolean) as string[];

    await resend.emails.send({
      from: "PromptAndGo Submissions <submissions@promptandgo.ai>",
      to: ["submitaprompt@promptandgo.ai"],
      subject: `New Prompt Submission: ${escapeHtml(sanitizedTitle)}`,
      html: `
        <h2>New Prompt Submission</h2>
        <div style="font-family: monospace; white-space: pre-wrap; background: #f5f5f5; padding: 20px; border-radius: 8px;">
${submissionBodyLines.join('\n\n')}
        </div>
      `,
    });

    // Send thank you email to submitter
    await resend.emails.send({
      from: "PromptAndGo Team <hello@promptandgo.ai>",
      to: [submitterEmail],
      subject: "Thank you for your prompt submission!",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; font-size: 24px;">Thank you for your submission!</h1>
          
          <p>Hi${sanitizedName ? ` ${escapeHtml(sanitizedName)}` : ''},</p>
          
          <p>We've received your prompt submission "<strong>${escapeHtml(sanitizedTitle)}</strong>" and our team will review it shortly.</p>
          
          <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #4f46e5;">🎉 Win 1 Month Free Premium!</h3>
            <p style="margin-bottom: 0;">If your prompt is successfully added to our library, you'll receive <strong>1 month of free premium membership</strong> as a thank you!</p>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>Our editorial team will review your submission</li>
            <li>We may reach out if we need any clarifications</li>
            <li>If approved, we'll notify you when it goes live</li>
            <li>Your free premium membership will be activated automatically</li>
          </ul>
          
          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            Please note: PromptAndGo reserves the right to edit and revise any portion of submitted prompts to ensure quality and consistency.
          </p>
          
          <p>Thanks for contributing to our community!</p>
          
          <p>Best regards,<br>
          The PromptAndGo Team</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in submit-prompt function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);