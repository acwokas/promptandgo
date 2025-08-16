import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

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

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    const { email, user_id }: SubscribeRequest = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const lowerEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(lowerEmail)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Compute SHA-256 hash of email to match encrypted records
    const encoder = new TextEncoder();
    const digest = await crypto.subtle.digest("SHA-256", encoder.encode(lowerEmail));
    const hashHex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Try to find existing subscriber by email hash (since emails are encrypted at rest)
    const { data: existing, error: selectError } = await supabase
      .from("subscribers")
      .select("id, subscribed, user_id")
      .eq("email_hash", hashHex)
      .maybeSingle();

    if (selectError) {
      console.error("Select subscriber error:", selectError);
    }

    if (existing) {
      // Update existing subscriber (reactivate + attach user if provided)
      const { error: updateError } = await supabase
        .from("subscribers")
        .update({
          subscribed: true,
          user_id: existing.user_id ?? (user_id ?? undefined),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateError) {
        console.error("Update subscriber error:", updateError);
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } else {
      // Insert new subscriber securely via RPC (handles encryption + placeholders)
      const key = Deno.env.get("SUBSCRIBERS_ENCRYPTION_KEY");
      if (!key) {
        console.error("Missing SUBSCRIBERS_ENCRYPTION_KEY env var");
        return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Deterministic UUID from email hash if user_id not provided (to avoid duplicates)
      const base = hashHex.slice(0, 32);
      const derivedUserId = `${base.slice(0, 8)}-${base.slice(8, 12)}-${base.slice(12, 16)}-${base.slice(16, 20)}-${base.slice(20, 32)}`;
      const effectiveUserId = user_id ?? derivedUserId;

      const { error: rpcError } = await supabase.rpc("secure_upsert_subscriber", {
        p_key: key,
        p_user_id: effectiveUserId,
        p_email: lowerEmail,
        p_stripe_customer_id: null,
        p_subscribed: true,
        p_subscription_tier: null,
        p_subscription_end: null,
      });

      if (rpcError) {
        console.error("secure_upsert_subscriber RPC error:", rpcError);
        return new Response(JSON.stringify({ error: rpcError.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

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
