import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupNotificationRequest {
  user: {
    email: string;
    name?: string;
    signupMethod: 'email' | 'google';
    industry?: string;
    projectType?: string;
    preferredTone?: string;
    desiredOutcome?: string;
  };
}

// HTML-escape untrusted user input before interpolation.
// Prevents attackers from injecting HTML/JS via profile fields into the notification email.
const escapeHtml = (input: string | undefined | null): string => {
  if (input == null) return '';
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;')
    .replace(/=/g, '&#61;');
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const { user }: SignupNotificationRequest = await req.json();

    console.log("New signup notification:", user);

    // All user-supplied fields are escaped before interpolation.
    const safeEmail = escapeHtml(user.email);
    const safeName = escapeHtml(user.name) || 'Not provided';
    const safeSignupMethod = escapeHtml(user.signupMethod);
    const safeIndustry = escapeHtml(user.industry);
    const safeProjectType = escapeHtml(user.projectType);
    const safePreferredTone = escapeHtml(user.preferredTone);
    const safeDesiredOutcome = escapeHtml(user.desiredOutcome);

    // Create email content with user details
    const userDetailsHtml = `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px 0; color: #333;">User Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 5px 10px 5px 0; font-weight: bold;">Email:</td><td style="padding: 5px 0;">${safeEmail}</td></tr>
          <tr><td style="padding: 5px 10px 5px 0; font-weight: bold;">Name:</td><td style="padding: 5px 0;">${safeName}</td></tr>
          <tr><td style="padding: 5px 10px 5px 0; font-weight: bold;">Signup Method:</td><td style="padding: 5px 0;">${safeSignupMethod}</td></tr>
          ${safeIndustry ? `<tr><td style="padding: 5px 10px 5px 0; font-weight: bold;">Industry:</td><td style="padding: 5px 0;">${safeIndustry}</td></tr>` : ''}
          ${safeProjectType ? `<tr><td style="padding: 5px 10px 5px 0; font-weight: bold;">Use Case:</td><td style="padding: 5px 0;">${safeProjectType}</td></tr>` : ''}
          ${safePreferredTone ? `<tr><td style="padding: 5px 10px 5px 0; font-weight: bold;">Preferred Tone:</td><td style="padding: 5px 0;">${safePreferredTone}</td></tr>` : ''}
          ${safeDesiredOutcome ? `<tr><td style="padding: 5px 10px 5px 0; font-weight: bold;">Desired Outcome:</td><td style="padding: 5px 0;">${safeDesiredOutcome}</td></tr>` : ''}
        </table>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "promptandgo <hello@promptandgo.ai>",
      to: ["hello@promptandgo.ai"],
      subject: `🎉 New User Signup - ${safeName === 'Not provided' ? safeEmail : safeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            🎉 New User Signup!
          </h1>
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            A new user has just signed up for promptandgo!
          </p>
          ${userDetailsHtml}
          <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <p style="margin: 0; color: #1976d2; font-size: 14px;">
              <strong>Time:</strong> ${new Date().toLocaleString('en-US', { 
                timeZone: 'UTC',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </p>
          </div>
        </div>
      `,
    });

    console.log("Signup notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-signup-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send signup notification" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);