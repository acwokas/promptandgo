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
  newsletterOptIn?: boolean;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

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

    const { name, email, message, newsletterOptIn }: ContactPayload = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomUUID();

    // Store pending contact in database
    const { data, error: dbError } = await supabase
      .from('pending_contacts')
      .insert({
        name,
        email,
        message,
        newsletter_opt_in: newsletterOptIn || false,
        confirmation_token: confirmationToken,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error", dbError);
      return new Response(JSON.stringify({ error: "Failed to store contact" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Send confirmation email to user
    const confirmationUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/confirm-contact?token=${confirmationToken}`;
    
    const confirmationHtml = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">PromptAndGo</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Please confirm your email</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin: 0 0 20px;">Hi ${name}!</h2>
          <p style="color: #4b5563; line-height: 1.6; margin: 0 0 25px;">
            Thanks for reaching out to us! To complete your message submission and ensure we can respond to you, please confirm your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; display: inline-block; transition: transform 0.2s;">
              Confirm Email Address
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${confirmationUrl}" style="color: #667eea; word-break: break-all;">${confirmationUrl}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            This confirmation link will expire in 24 hours. If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `;

    const { error: emailError } = await resend.emails.send({
      from: "PromptAndGo <noreply@promptandgo.ai>",
      to: [email],
      subject: "Please confirm your email - PromptAndGo",
      html: confirmationHtml,
    });

    if (emailError) {
      console.error("Email send error", emailError);
      return new Response(JSON.stringify({ error: "Failed to send confirmation email" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Please check your email and click the confirmation link to complete your message submission." 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("send-contact error", err);
    return new Response(JSON.stringify({ error: err?.message || "Unexpected error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
