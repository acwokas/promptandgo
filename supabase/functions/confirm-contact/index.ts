import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    // Enhanced token validation
    if (!token || typeof token !== 'string' || token.length < 10) {
      return new Response(`
        <html>
          <head><title>Invalid Link</title></head>
          <body style="font-family: system-ui, sans-serif; text-align: center; padding: 50px;">
            <h1>Invalid Confirmation Link</h1>
            <p>The confirmation link is invalid or malformed.</p>
            <a href="https://promptandgo.ai/contact" style="color: #667eea;">Contact Us Again</a>
          </body>
        </html>
      `, { 
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders }
      });
    }

    // Basic token format validation
    const tokenRegex = /^[a-zA-Z0-9-_]{10,}$/;
    if (!tokenRegex.test(token)) {
      return new Response(`
        <html>
          <head><title>Invalid Token</title></head>
          <body style="font-family: system-ui, sans-serif; text-align: center; padding: 50px;">
            <h1>Invalid Token Format</h1>
            <p>The confirmation token format is invalid.</p>
            <a href="https://promptandgo.ai/contact" style="color: #667eea;">Contact Us Again</a>
          </body>
        </html>
      `, { 
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders }
      });
    }

    // Find and update the pending contact
    const { data: contact, error: fetchError } = await supabase
      .from('pending_contacts')
      .select('*')
      .eq('confirmation_token', token)
      .eq('confirmed', false)
      .eq('processed', false)
      .single();

    if (fetchError || !contact) {
      console.error("Contact not found or already processed", fetchError);
      return new Response(`
        <html>
          <head><title>Invalid Link</title></head>
          <body style="font-family: system-ui, sans-serif; text-align: center; padding: 50px;">
            <h1>Invalid or Expired Link</h1>
            <p>This confirmation link is invalid or has already been used.</p>
            <a href="https://promptandgo.ai" style="color: #667eea;">Return to PromptAndGo</a>
          </body>
        </html>
      `, { 
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // Check if link is expired (24 hours)
    const createdAt = new Date(contact.created_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 3600);
    
    if (hoursDiff > 24) {
      return new Response(`
        <html>
          <head><title>Link Expired</title></head>
          <body style="font-family: system-ui, sans-serif; text-align: center; padding: 50px;">
            <h1>Link Expired</h1>
            <p>This confirmation link has expired. Please submit your message again.</p>
            <a href="https://promptandgo.ai/contact" style="color: #667eea;">Contact Us Again</a>
          </body>
        </html>
      `, { 
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // Mark as confirmed and processed
    const { error: updateError } = await supabase
      .from('pending_contacts')
      .update({ 
        confirmed: true, 
        processed: true,
        updated_at: new Date().toISOString()
      })
      .eq('confirmation_token', token);

    if (updateError) {
      console.error("Failed to update contact", updateError);
      throw new Error("Failed to process confirmation");
    }

// Helper function to escape HTML entities for security
    const escapeHtml = (text: string): string => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    // Send the contact message to hello@promptandgo.ai
    const contactHtml = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">✅ New Confirmed Contact Message</h2>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <div style="margin-bottom: 20px;">
            <p style="margin: 0 0 8px; font-weight: 600; color: #374151;">Contact Information:</p>
            <p style="margin: 0 0 5px; color: #6b7280;"><strong>Name:</strong> ${contact.name.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")}</p>
            <p style="margin: 0 0 5px; color: #6b7280;"><strong>Email:</strong> ${contact.email.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")}</p>
            <p style="margin: 0 0 15px; color: #6b7280;">
              <strong>Free PowerPack Request:</strong> 
              <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; ${contact.newsletter_opt_in ? 'background: #10b981; color: white;' : 'background: #f3f4f6; color: #6b7280;'}">
                ${contact.newsletter_opt_in ? '✅ YES - Send PowerPack!' : '❌ No'}
              </span>
            </p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 20px 0;">
          
          <div>
            <p style="margin: 0 0 10px; font-weight: 600; color: #374151;">Message:</p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea; white-space: pre-wrap; line-height: 1.6; color: #374151;">
${contact.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
            📅 Submitted: ${createdAt.toLocaleString()}<br>
            ✅ Email confirmed and verified
          </p>
        </div>
      </div>
    `;

    const { error: contactEmailError } = await resend.emails.send({
      from: "PromptAndGo Contact <noreply@promptandgo.ai>",
      to: ["hello@promptandgo.ai"],
      replyTo: contact.email,
      subject: `✅ Confirmed Contact: ${contact.name}${contact.newsletter_opt_in ? ' (PowerPack Requested)' : ''}`,
      html: contactHtml,
    });

    if (contactEmailError) {
      console.error("Failed to send contact email", contactEmailError);
    }

    // Send welcome email to user
    const welcomeHtml = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🎉 Welcome to PromptAndGo!</h1>
          <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">Your message has been confirmed and sent!</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin: 0 0 20px;">Hi ${contact.name.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")}! 👋</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px;">
            Thank you for confirming your email! We've received your message and our team will get back to you within 24 hours.
          </p>
          
          ${contact.newsletter_opt_in ? `
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin: 0 0 10px; font-size: 18px;">🚀 Your Free PowerPack is Coming!</h3>
            <p style="margin: 0; opacity: 0.95;">
              Since you requested our free PowerPack, we'll be sending you our premium prompt collection to help supercharge your AI workflows. Keep an eye on your inbox!
            </p>
          </div>
          ` : ''}
          
          <div style="margin: 30px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px;">While you wait, explore these resources:</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 15px;">
              <a href="https://promptandgo.ai/library" style="background: #f3f4f6; color: #374151; text-decoration: none; padding: 15px 20px; border-radius: 8px; display: block; transition: background 0.2s; flex: 1; min-width: 200px;">
                📚 <strong>Prompt Library</strong><br>
                <span style="font-size: 14px; opacity: 0.8;">Browse 1000+ AI prompts</span>
              </a>
              <a href="https://promptandgo.ai/blog" style="background: #f3f4f6; color: #374151; text-decoration: none; padding: 15px 20px; border-radius: 8px; display: block; transition: background 0.2s; flex: 1; min-width: 200px;">
                ✍️ <strong>Blog & Guides</strong><br>
                <span style="font-size: 14px; opacity: 0.8;">Learn AI best practices</span>
              </a>
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
            Best regards,<br>
            <strong>The PromptAndGo Team</strong><br>
            <a href="https://promptandgo.ai" style="color: #667eea;">promptandgo.ai</a>
          </p>
        </div>
      </div>
    `;

    const { error: welcomeEmailError } = await resend.emails.send({
      from: "PromptAndGo Team <noreply@promptandgo.ai>",
      to: [contact.email],
      subject: `🎉 Welcome to PromptAndGo${contact.newsletter_opt_in ? ' + Your Free PowerPack is Coming!' : '!'}`,
      html: welcomeHtml,
    });

    if (welcomeEmailError) {
      console.error("Failed to send welcome email", welcomeEmailError);
    }

    // Redirect to the React page instead of returning HTML
    const redirectUrl = `https://promptandgo.ai/email-confirmed?name=${encodeURIComponent(contact.name)}&powerpack=${contact.newsletter_opt_in}`;
    
    return new Response(null, {
      status: 302,
      headers: {
        "Location": redirectUrl
      }
    });

  } catch (err: any) {
    console.error("confirm-contact error", err);
    return new Response(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: system-ui, sans-serif; text-align: center; padding: 50px;">
          <h1>Something went wrong</h1>
          <p>We encountered an error processing your confirmation. Please try again or contact support.</p>
          <a href="https://promptandgo.ai/contact" style="color: #667eea;">Contact Us Again</a>
        </body>
      </html>
    `, { 
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
});