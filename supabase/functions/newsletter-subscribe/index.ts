import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
  user_id?: string | null;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Newsletter subscribe request received');
    
    if (req.method !== "POST") {
      console.log('Invalid method:', req.method);
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    const { email, user_id }: SubscribeRequest = await req.json();

    console.log('Parsed request data:', { email, user_id });

    if (!email || typeof email !== "string") {
      console.log('Invalid email provided:', email);
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const lowerEmail = email.toLowerCase().trim();
    console.log('Processing email:', lowerEmail);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(lowerEmail)) {
      console.log('Invalid email format:', lowerEmail);
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Create email hash for lookup
    const encoder = new TextEncoder();
    const digest = await crypto.subtle.digest("SHA-256", encoder.encode(lowerEmail));
    const emailHash = Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    console.log('Generated email hash for lookup');

    // Simple direct insert/update to subscribers table (for newsletter signups only)
    // This bypasses the encrypted storage complexity for simple newsletter subscriptions
    
    // First check if user already exists by email hash
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

    if (existingUser) {
      console.log('Found existing subscriber, updating...');
      // Update existing subscriber
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({
          subscribed: true,
          user_id: user_id || existingUser.user_id || null,
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
      // Insert new subscriber with email hash
      const { error: insertError } = await supabase
        .from('subscribers')
        .insert({
          user_id: user_id || null,
          email: null, // Use NULL to satisfy unique(email) and pass CHECK
          subscribed: true,
          email_hash: emailHash,
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    // Send notification email to admin
    try {
      console.log('Attempting to send admin notification email...');
      const emailResponse = await resend.emails.send({
        from: "Newsletter Signup <onboarding@resend.dev>",
        to: ["hello@promptandgo.ai"],
        subject: "New Newsletter Subscription",
        html: `
          <h2>New Newsletter Subscription</h2>
          <p><strong>Email:</strong> ${lowerEmail}</p>
          <p><strong>User ID:</strong> ${user_id || 'Anonymous'}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Request Type:</strong> Weekly Prompt Tips Newsletter</p>
          <hr>
          <p>This is an automated notification from the Prompt & Go website newsletter signup form.</p>
        `,
      });
      console.log('Admin notification email sent successfully. Response:', emailResponse);
    } catch (emailError) {
      console.error('Failed to send admin notification email. Full error:', emailError);
      console.error('Error details:', {
        name: emailError?.name,
        message: emailError?.message,
        stack: emailError?.stack
      });
      // Don't fail the request if email fails
    }

    console.log('Newsletter subscription completed successfully');
    
    return new Response(JSON.stringify({ ok: true }), {
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
