import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { resolvePriceId } from "../_shared/stripe-prices.ts";

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

    const hasMembership = items.some((i: any) => i.type === 'membership');
    if (hasMembership) throw new Error("Membership items not allowed in create-payment");

    const hasLifetime = items.some(i => i.type === 'lifetime');
    if (hasLifetime && items.length > 1) throw new Error("Lifetime purchase must be a single item");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // TODO 4 — default-price resolution via _shared/stripe-prices.ts.
    // When the caller passes `unitAmountCents` we honour it (promotional
    // pricing per item via inline price_data). When it's omitted we look
    // up the live Stripe product's default_price so price changes in the
    // Dashboard propagate without a redeploy.
    //
    // TODO 5 (b) shipped 2026-05-11: lifetime is now a first-class
    // resolver tier (STRIPE_PROD_LIFETIME). The inline $349 hardcode is
    // gone — Stripe Dashboard is source of truth for the lifetime price.
    //
    // Fallback unit_amounts in the resolver path are last-resort defaults
    // that only fire if Stripe returns a price with null unit_amount
    // (shouldn't happen for default_price on a real product). Updated
    // 2026-05-11 to match Adrian's locked pricing:
    //   per_prompt: $1.99 (was $0.99 placeholder)
    //   per_pack:   $9.99 (was $4.99 placeholder)
    //   lifetime:   $349.00
    //
    // Each entry produces both:
    //   - lineItem: what Stripe sees (either { price } or { price_data })
    //   - unitAmount: what we write to order_items.unit_amount in the DB
    //     (resolved by retrieving the Stripe price when we used `{ price }`)
    const enriched = await Promise.all(items.map(async (i) => {
      const quantity = i.quantity && i.quantity > 0 ? i.quantity : 1;
      if (i.type === 'prompt') {
        const name = `PRO Prompt${i.title ? `: ${i.title}` : ''}`;
        if (i.unitAmountCents != null) {
          return {
            lineItem: { quantity, price_data: { currency: "usd", product_data: { name }, unit_amount: i.unitAmountCents } },
            unitAmount: i.unitAmountCents,
            quantity,
          };
        }
        const priceId = await resolvePriceId(stripe, 'per_prompt');
        const price = await stripe.prices.retrieve(priceId);
        return { lineItem: { quantity, price: priceId }, unitAmount: price.unit_amount ?? 199, quantity };
      }
      if (i.type === 'pack') {
        const name = `Power Pack${i.title ? `: ${i.title}` : ''}`;
        if (i.unitAmountCents != null) {
          return {
            lineItem: { quantity, price_data: { currency: "usd", product_data: { name }, unit_amount: i.unitAmountCents } },
            unitAmount: i.unitAmountCents,
            quantity,
          };
        }
        const priceId = await resolvePriceId(stripe, 'per_pack');
        const price = await stripe.prices.retrieve(priceId);
        return { lineItem: { quantity, price: priceId }, unitAmount: price.unit_amount ?? 999, quantity };
      }
      // lifetime — resolver path. unitAmountCents override is still
      // honoured for promotional pricing, otherwise resolver picks up
      // the live Stripe price for STRIPE_PROD_LIFETIME.
      if (i.unitAmountCents != null) {
        const name = "Lifetime All-Access";
        return {
          lineItem: { quantity, price_data: { currency: "usd", product_data: { name }, unit_amount: i.unitAmountCents } },
          unitAmount: i.unitAmountCents,
          quantity,
        };
      }
      const priceId = await resolvePriceId(stripe, 'lifetime');
      const price = await stripe.prices.retrieve(priceId);
      return { lineItem: { quantity, price: priceId }, unitAmount: price.unit_amount ?? 34900, quantity };
    }));
    const line_items = enriched.map((e) => e.lineItem);
    const orderAmount = enriched.reduce((sum, e) => sum + e.unitAmount * e.quantity, 0);

    const supabaseService = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    // Create order + order_items as pending
    const { data: orderInsert, error: orderErr } = await supabaseService
      .from('orders')
      .insert({ user_id: user.id, mode: 'payment', status: 'pending', currency: 'usd', amount: orderAmount })
      .select('id')
      .single();
    if (orderErr) throw new Error(`Failed to create order: ${orderErr.message}`);
    const orderId = orderInsert.id as string;

    // Use the unitAmount we already resolved (Stripe price for the
    // resolver path, caller's override for the inline path, $349 for
    // lifetime) — no more bucket-default guessing.
    const orderItemsRows = items.map((i, idx) => ({
      order_id: orderId,
      item_type: i.type,
      item_id: i.id ?? null,
      title: i.title ?? null,
      unit_amount: enriched[idx].unitAmount,
      quantity: enriched[idx].quantity,
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
        business_name: 'promptandgo.ai'
      },
    });

    await supabaseService.from('orders').update({ stripe_session_id: session.id }).eq('id', orderId);

    return new Response(JSON.stringify({ url: session.url }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
  } catch (error: any) {
    const msg = error?.message || String(error);
    return new Response(JSON.stringify({ error: msg }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
