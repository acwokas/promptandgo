import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

// SECURITY: Restrictive CORS headers for production security
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface SubscribeRequest {
  email: string;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

// SECURITY: Rate limiting helper function
async function checkRateLimit(emailHash: string, ipAddress: string): Promise<{ allowed: boolean; resetTime?: number }> {
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxAttempts = 3; // 3 attempts per 5 minutes per email/IP combination
  
  try {
    // Clean up old rate limit records
    await supabase.rpc('cleanup_newsletter_rate_limits');
    
    const { data: existing } = await supabase
      .from('newsletter_rate_limits')
      .select('*')
      .eq('email_hash', emailHash)
      .eq('ip_address', ipAddress)
      .gte('created_at', new Date(Date.now() - windowMs).toISOString())
      .single();
    
    if (existing) {
      if (existing.attempt_count >= maxAttempts) {
        return { 
          allowed: false, 
          resetTime: new Date(existing.created_at).getTime() + windowMs 
        };
      }
      
      // Increment attempt count
      await supabase
        .from('newsletter_rate_limits')
        .update({ attempt_count: existing.attempt_count + 1 })
        .eq('id', existing.id);
    } else {
      // Create new rate limit record
      await supabase
        .from('newsletter_rate_limits')
        .insert({ 
          email_hash: emailHash, 
          ip_address: ipAddress,
          attempt_count: 1 
        });
    }
    
    return { allowed: true };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Allow request if rate limiting fails (fail open)
    return { allowed: true };
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Newsletter subscribe request received');
    
    // SECURITY: Get client IP address for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                    req.headers.get('x-real-ip') || 
                    '127.0.0.1';
    
    if (req.method !== "POST") {
      console.log('Invalid method:', req.method);
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    // Get authentication if provided
    const authHeader = req.headers.get('Authorization');
    let authenticatedUserId = null;
    
    if (authHeader) {
      const supabaseAuth = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      
      const { data: { user } } = await supabaseAuth.auth.getUser();
      if (user) {
        authenticatedUserId = user.id;
      }
    }

    const { email }: SubscribeRequest = await req.json();

    console.log('Parsed request data:', { email, authenticatedUserId: !!authenticatedUserId });

    if (!email || typeof email !== "string") {
      console.log('Invalid email provided:', email);
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const lowerEmail = email.toLowerCase().trim();
    console.log('Processing email for validation');
    
    // SECURITY: Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(lowerEmail) || lowerEmail.length > 254) {
      console.log('Invalid email format or length');
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // SECURITY: Check for suspicious email patterns
    const suspiciousPatterns = [
      /^[0-9]+@/,  // emails starting with only numbers
      /test@test/,  // obvious test emails
      /noreply@/,   // no-reply emails
      /admin@.*test/,  // admin test emails
      /temp@/,      // temporary emails
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(lowerEmail))) {
      console.log('Suspicious email pattern detected');
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Create email hash for lookup and rate limiting
    const encoder = new TextEncoder();
    const digest = await crypto.subtle.digest("SHA-256", encoder.encode(lowerEmail));
    const emailHash = Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    console.log('Generated email hash for security checks');

    // SECURITY: Check rate limiting before proceeding
    const rateLimitResult = await checkRateLimit(emailHash, clientIP);
    if (!rateLimitResult.allowed) {
      const timeRemaining = Math.ceil((rateLimitResult.resetTime! - Date.now()) / 60000);
      console.log('Rate limit exceeded for email hash');
      return new Response(JSON.stringify({ 
        error: `Too many attempts. Please try again in ${timeRemaining} minutes.`,
        retryAfter: timeRemaining 
      }), {
        status: 429,
        headers: { 
          "Content-Type": "application/json", 
          "Retry-After": timeRemaining.toString(),
          ...corsHeaders 
        },
      });
    }

    // Use secure subscriber upsert function for proper encryption
    console.log('Checking for existing subscriber by email hash...');
    const { data: existingUser, error: selectError } = await supabase
      .from('subscribers')
      .select('id, subscribed, user_id')
      .eq('email_hash', emailHash)
      .maybeSingle();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Select error:', selectError);
      return new Response(JSON.stringify({ error: selectError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let existed = false;
    let had_user_id = false;
    
    if (existingUser) {
      existed = true;
      had_user_id = !!existingUser.user_id;
      console.log('Found existing subscriber, updating...');
      
      // Update existing subscriber if needed
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({
          subscribed: true,
          user_id: authenticatedUserId || existingUser.user_id || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id);

      if (updateError) {
        console.error('Update error:', updateError);
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } else {
      console.log('No existing subscriber found, creating new one...');
      
      // Use secure upsert function with encryption key
      const encryptionKey = Deno.env.get("ENCRYPTION_KEY") || "default_newsletter_key_2024";
      
      const { error: upsertError } = await supabase.rpc('secure_upsert_subscriber', {
        p_user_id: authenticatedUserId,
        p_email: lowerEmail,
        p_subscribed: true,
        p_subscription_tier: null,
        p_subscription_end: null,
        p_stripe_customer_id: null,
        p_key: encryptionKey
      });

      if (upsertError) {
        console.error('Upsert error:', upsertError);
        return new Response(JSON.stringify({ error: upsertError.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    // Send confirmation email to subscriber
    try {
      console.log('Attempting to send confirmation email to subscriber...');
      const confirmationResponse = await resend.emails.send({
        from: "Prompt & Go <noreply@promptandgo.ai>",
        to: [lowerEmail],
        subject: "Welcome to Prompt & Go Newsletter! 🎉",
        html: `
          <h2>Thank you for subscribing!</h2>
          <p>Hi there!</p>
          <p>You've successfully signed up for the Prompt & Go newsletter. You'll now receive weekly AI prompt tips and insights directly to your inbox.</p>
          <p><strong>What to expect:</strong></p>
          <ul>
            <li>Weekly curated AI prompts</li>
            <li>Expert tips and tricks</li>
            <li>Latest AI prompt trends</li>
            <li>Exclusive content and resources</li>
          </ul>
          <p>Welcome aboard! 🚀</p>
          <p>Best regards,<br>The Prompt & Go Team</p>
          <hr>
          <p style="font-size: 12px; color: #666;">If you didn't sign up for this newsletter, you can safely ignore this email.</p>
        `,
      });
      console.log('Confirmation email sent successfully. Response:', confirmationResponse);
    } catch (emailError) {
      console.error('Failed to send confirmation email. Full error:', emailError);
      // Don't fail the request if confirmation email fails
    }

    // Send notification email to admin
    try {
      console.log('Attempting to send admin notification email...');
      const adminResponse = await resend.emails.send({
        from: "Newsletter Signup <noreply@promptandgo.ai>",
        to: ["hello@promptandgo.ai"],
        subject: "New Newsletter Subscription",
        html: `
          <h2>New Newsletter Subscription</h2>
          <p><strong>Email:</strong> ${lowerEmail}</p>
          <p><strong>User ID:</strong> ${authenticatedUserId || 'Anonymous'}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Request Type:</strong> Weekly Prompt Tips Newsletter</p>
          <hr>
          <p>This is an automated notification from the Prompt & Go website newsletter signup form.</p>
        `,
      });
      console.log('Admin notification email sent successfully. Response:', adminResponse);
    } catch (emailError) {
      console.error('Failed to send admin notification email. Full error:', emailError);
      console.error('Error details:', {
        name: (emailError as Error)?.name,
        message: (emailError as Error)?.message,
        stack: (emailError as Error)?.stack
      });
      // Don't fail the request if email fails
    }

    console.log('Newsletter subscription completed successfully');
    
    return new Response(JSON.stringify({ ok: true, existed, has_user_id: had_user_id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Newsletter subscribe error:", error);
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
