import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    // Send submission to company
    const submissionBodyLines = [
      `Title: ${title}`,
      `What for: ${whatFor}`,
      `Prompt:\n${prompt}`,
      excerpt ? `Excerpt:\n${excerpt}` : undefined,
      `---`,
      `Submitter: ${submitterName || 'Not provided'}`,
      `Email: ${submitterEmail}`,
    ].filter(Boolean) as string[];

    await resend.emails.send({
      from: "PromptAndGo Submissions <submissions@promptandgo.ai>",
      to: ["submitaprompt@promptandgo.ai"],
      subject: `New Prompt Submission: ${title}`,
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
          
          <p>Hi${submitterName ? ` ${submitterName}` : ''},</p>
          
          <p>We've received your prompt submission "<strong>${title}</strong>" and our team will review it shortly.</p>
          
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