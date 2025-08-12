import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const encKey = Deno.env.get("SUBSCRIBERS_ENCRYPTION_KEY");
    if (!encKey) throw new Error("SUBSCRIBERS_ENCRYPTION_KEY not set");

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Missing Authorization" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 });
    const token = authHeader.replace("Bearer ", "");

    // Identify caller
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr) throw new Error(`Auth error: ${userErr.message}`);
    const user = userData.user;
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 });

    // Check admin role (allow only admins)
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    const isAdmin = (roles || []).some((r: any) => String(r.role).toLowerCase() === "admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 });
    }

    // Load subscribers needing backfill
    const { data: subs, error: subErr } = await supabase
      .from("subscribers")
      .select("id,user_id,email,stripe_customer_id,subscribed,subscription_tier,subscription_end,email_enc,stripe_customer_id_enc");
    if (subErr) throw subErr;

    let processed = 0;
    for (const s of subs || []) {
      const needsEmail = !s.email_enc || (s.email && s.email !== "[encrypted]");
      const needsStripe = (!!s.stripe_customer_id && !s.stripe_customer_id_enc);
      if (needsEmail || needsStripe) {
        await supabase.rpc("secure_upsert_subscriber", {
          p_key: encKey,
          p_user_id: s.user_id,
          p_email: s.email,
          p_stripe_customer_id: s.stripe_customer_id,
          p_subscribed: s.subscribed,
          p_subscription_tier: s.subscription_tier,
          p_subscription_end: s.subscription_end,
        });
        processed++;
      }
    }

    return new Response(JSON.stringify({ ok: true, processed }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[backfill-subscribers]", msg);
    return new Response(JSON.stringify({ error: msg }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
