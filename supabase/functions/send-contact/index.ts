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
  newsletterOptIn?: boolean;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    const subject = `Contact from ${name}`;
    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, sans-serif; line-height:1.6;">
        <h2 style="margin:0 0 12px;">New contact message</h2>
        <p style="margin:0 0 8px;"><strong>Name:</strong> ${name}</p>
        <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
        <p style="margin:0 0 8px;"><strong>Newsletter opt-in:</strong> ${newsletterOptIn ? "Yes" : "No"}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
        <p style="margin:0 0 8px;"><strong>Message:</strong></p>
        <div style="white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "PromptAndGo <onboarding@resend.dev>",
      to: ["hey@promptandgo.ai"],
      replyTo: email,
      subject,
      html,
    });

    if (error) {
      console.error("Resend send error", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to send" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
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
