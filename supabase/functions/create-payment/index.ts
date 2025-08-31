import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create Stripe Checkout session for one-off payments (prompts, packs, lifetime)
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
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("Not authenticated");

    const body = await req.json();
    const items: Array<{ id?: string; type: 'prompt'|'pack'|'lifetime'; title?: string; unitAmountCents?: number; quantity?: number }> = body?.items || [];
    if (!Array.isArray(items) || items.length === 0) throw new Error("No items provided");

    const hasMembership = items.some(i => i.type === 'membership');
    if (hasMembership) throw new Error("Membership items not allowed in create-payment");

    const hasLifetime = items.some(i => i.type === 'lifetime');
    if (hasLifetime && items.length > 1) throw new Error("Lifetime purchase must be a single item");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const line_items = items.map((i) => {
      const quantity = i.quantity && i.quantity > 0 ? i.quantity : 1;
      if (i.type === 'prompt') {
        const name = `PRO Prompt${i.title ? `: ${i.title}` : ''}`;
        const unit_amount = i.unitAmountCents ?? 99;
        return { quantity, price_data: { currency: "usd", product_data: { name }, unit_amount } };
      }
      if (i.type === 'pack') {
        const name = `Power Pack${i.title ? `: ${i.title}` : ''}`;
        const unit_amount = i.unitAmountCents ?? 499;
        return { quantity, price_data: { currency: "usd", product_data: { name }, unit_amount } };
      }
      // lifetime
      const name = "Lifetime All-Access";
      const unit_amount = 34900; // $349.00
      return { quantity, price_data: { currency: "usd", product_data: { name }, unit_amount } };
    });

    const orderAmount = line_items.reduce((sum: number, li: any) => sum + li.price_data.unit_amount * (li.quantity ?? 1), 0);

    const supabaseService = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    // Create order + order_items as pending
    const { data: orderInsert, error: orderErr } = await supabaseService
      .from('orders')
      .insert({ user_id: user.id, mode: 'payment', status: 'pending', currency: 'usd', amount: orderAmount })
      .select('id')
      .single();
    if (orderErr) throw new Error(`Failed to create order: ${orderErr.message}`);
    const orderId = orderInsert.id as string;

    const orderItemsRows = items.map((i) => ({
      order_id: orderId,
      item_type: i.type,
      item_id: i.id ?? null,
      title: i.title ?? null,
      unit_amount: i.type === 'lifetime' ? 34900 : (i.unitAmountCents ?? (i.type === 'pack' ? 499 : 99)),
      quantity: i.quantity && i.quantity > 0 ? i.quantity : 1,
    }));
    const { error: oiErr } = await supabaseService.from('order_items').insert(orderItemsRows);
    if (oiErr) throw new Error(`Failed to create order items: ${oiErr.message}`);

    const origin = req.headers.get('origin') || 'https://promptandgo.ai';
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      payment_intent_data: { statement_descriptor: 'PROMPTANDGO' },
      success_url: `${origin}/checkout/success?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/canceled`,
      // SECURITY: Add metadata for additional verification
      metadata: {
        order_id: orderId,
        user_id: user.id,
      },
    });

    await supabaseService.from('orders').update({ stripe_session_id: session.id }).eq('id', orderId);

    return new Response(JSON.stringify({ url: session.url }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
  } catch (error: any) {
    const msg = error?.message || String(error);
    return new Response(JSON.stringify({ error: msg }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
