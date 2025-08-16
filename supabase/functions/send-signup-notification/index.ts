import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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

    // Create email content with user details
    const userDetailsHtml = `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px 0; color: #333;">User Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 5px 10px 5px 0; font-weight: bold;">Email:</td><td style="padding: 5px 0;">${user.email}</td></tr>
          <tr><td style="padding: 5px 10px 5px 0; font-weight: bold;">Name:</td><td style="padding: 5px 0;">${user.name || 'Not provided'}</td></tr>
          <tr><td style="padding: 5px 10px 5px 0; font-weight: bold;">Signup Method:</td><td style="padding: 5px 0;">${user.signupMethod}</td></tr>
          ${user.industry ? `<tr><td style="padding: 5px 10px 5px 0; font-weight: bold;">Industry:</td><td style="padding: 5px 0;">${user.industry}</td></tr>` : ''}
          ${user.projectType ? `<tr><td style="padding: 5px 10px 5px 0; font-weight: bold;">Use Case:</td><td style="padding: 5px 0;">${user.projectType}</td></tr>` : ''}
          ${user.preferredTone ? `<tr><td style="padding: 5px 10px 5px 0; font-weight: bold;">Preferred Tone:</td><td style="padding: 5px 0;">${user.preferredTone}</td></tr>` : ''}
          ${user.desiredOutcome ? `<tr><td style="padding: 5px 10px 5px 0; font-weight: bold;">Desired Outcome:</td><td style="padding: 5px 0;">${user.desiredOutcome}</td></tr>` : ''}
        </table>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "promptandgo <hello@promptandgo.ai>",
      to: ["hello@promptandgo.ai"],
      subject: `🎉 New User Signup - ${user.name || user.email}`,
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