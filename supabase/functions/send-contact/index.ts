import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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

// Rate limiting store (in production, use a persistent store like Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 messages per minute per IP

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('cf-connecting-ip') || 'unknown';
  return `contact_${ip}`;
}

function checkRateLimit(key: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, resetTime: record.resetTime };
  }
  
  record.count++;
  return { allowed: true };
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
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

    // Check rate limit
    const rateLimitKey = getRateLimitKey(req);
    const rateLimitCheck = checkRateLimit(rateLimitKey);
    
    if (!rateLimitCheck.allowed) {
      return new Response(JSON.stringify({ 
        error: "Rate limit exceeded. Please try again later.",
        resetTime: rateLimitCheck.resetTime 
      }), {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { name, email, message }: ContactPayload = await req.json();

    // Validate inputs
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check length limits
    if (name.length > 100 || message.length > 2000) {
      return new Response(JSON.stringify({ error: "Input too long" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i, /javascript:/i, /on\w+=/i, /data:text\/html/i
    ];
    
    const allInput = `${name} ${email} ${message}`;
    if (suspiciousPatterns.some(pattern => pattern.test(allInput))) {
      return new Response(JSON.stringify({ error: "Invalid input content" }), {
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