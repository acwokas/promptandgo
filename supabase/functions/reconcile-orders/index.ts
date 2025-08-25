import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function grantEntitlements(supabaseService: any, userId: string, userEmail: string | null, orderId: string, customerId?: string) {
  const { data: items } = await supabaseService.from('order_items').select('*').eq('order_id', orderId);
  for (const it of items || []) {
    if (it.item_type === 'prompt' && it.item_id) {
      await supabaseService.from('prompt_access').insert({ user_id: userId, prompt_id: it.item_id }).onConflict('user_id,prompt_id').ignore();
    } else if (it.item_type === 'pack' && it.item_id) {
      await supabaseService.from('pack_access').insert({ user_id: userId, pack_id: it.item_id }).onConflict('user_id,pack_id').ignore();
    } else if (it.item_type === 'lifetime') {
      // Use secure_upsert_subscriber function for encrypted storage if key is available
      const encryptionKey = Deno.env.get("SUBSCRIBERS_ENCRYPTION_KEY");
      if (encryptionKey) {
        await supabaseService.rpc('secure_upsert_subscriber', {
          p_key: encryptionKey,
          p_user_id: userId,
          p_email: userEmail,
          p_stripe_customer_id: customerId ?? null,
          p_subscribed: true,
          p_subscription_tier: 'Lifetime',
          p_subscription_end: null
        });
      } else {
        // Fallback to direct update (less secure)
        await supabaseService.from('subscribers').upsert({
          user_id: userId,
          email: '[encrypted]', // Don't store plain text email
          subscribed: true,
          subscription_tier: 'Lifetime',
          subscription_end: null,
          stripe_customer_id: null, // Don't store plain text stripe ID
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      }
    }
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Missing STRIPE_SECRET_KEY secret");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY secret");

    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    const supabaseAuth = createClient(supabaseUrl, anonKey);
    const { data: userData } = await supabaseAuth.auth.getUser(token);
    const user = userData.user;
    if (!user) throw new Error("Not authenticated");

    const supabaseService = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    const { data: pendingOrders } = await supabaseService
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending');

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    for (const order of pendingOrders || []) {
      if (!order.stripe_session_id) continue;
      const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
      if (session.payment_status === 'paid') {
        await supabaseService.from('orders').update({ status: 'paid', amount: session.amount_total ?? order.amount, updated_at: new Date().toISOString() }).eq('id', order.id);
        const customerId = typeof session.customer === 'string' ? session.customer : (session.customer as any)?.id;
        await grantEntitlements(supabaseService, user.id, user.email ?? null, order.id, customerId);
      }
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || String(error) }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
