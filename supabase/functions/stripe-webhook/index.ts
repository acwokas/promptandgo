// Stripe webhook handler.
//
// Receives events directly from Stripe (configured in Stripe Dashboard ->
// Developers -> Webhooks). Verifies signature with STRIPE_WEBHOOK_SECRET, then
// upserts entitlement state.
//
// Deployed as a Supabase Edge Function. JWT verification is OFF (Stripe doesn't
// send Supabase JWTs); authenticity comes from the signature check.
//
// Webhook URL once deployed:
//   https://<project-ref>.supabase.co/functions/v1/stripe-webhook
//
// Events handled:
//   - checkout.session.completed       (both one-off and subscription modes)
//   - customer.subscription.created
//   - customer.subscription.updated
//   - customer.subscription.deleted
//   - invoice.paid                     (logged; subscription.updated does the state write)
//   - invoice.payment_failed           (logged; subscription.updated handles state)
//
// Idempotency: writes use upserts; replaying the same event is safe.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { tierFromProductId } from "../_shared/stripe-prices.ts";

const log = (step: string, details?: unknown) => {
  const d = details ? ` ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${d}`);
};

const SUBSCRIPTION_TIERS = new Set(["pro_monthly", "pro_annual", "team_monthly", "team_annual"]);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const encryptionKey = Deno.env.get("SUBSCRIBERS_ENCRYPTION_KEY");

  if (!stripeKey) return new Response("Missing STRIPE_SECRET_KEY", { status: 500 });
  if (!webhookSecret) return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  if (!serviceRoleKey) return new Response("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing stripe-signature header", { status: 400 });

  const body = await req.text();
  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    log("Signature verification failed", { error: (err as Error).message });
    return new Response("Invalid signature", { status: 400 });
  }

  log("Event received", { type: event.type, id: event.id });

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(stripe, supabase, event.data.object as Stripe.Checkout.Session, encryptionKey);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpsert(stripe, supabase, event.data.object as Stripe.Subscription, encryptionKey);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(stripe, supabase, event.data.object as Stripe.Subscription, encryptionKey);
        break;

      case "invoice.paid":
      case "invoice.payment_failed":
        log("Invoice event (no-op; subscription.updated handles state)", {
          type: event.type,
          invoiceId: (event.data.object as Stripe.Invoice).id,
        });
        break;

      default:
        log("Unhandled event type", { type: event.type });
    }
  } catch (err) {
    log("Handler error", { type: event.type, error: (err as Error).message });
    // Return 500 so Stripe retries. Idempotency upserts make retries safe.
    return new Response((err as Error).message, { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

async function handleCheckoutCompleted(
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>,
  session: Stripe.Checkout.Session,
  encryptionKey: string | undefined,
) {
  log("Handling checkout.session.completed", {
    sessionId: session.id,
    mode: session.mode,
    paymentStatus: session.payment_status,
  });

  if (session.payment_status !== "paid" && session.mode !== "subscription") {
    log("Skipping non-paid one-off session", { paymentStatus: session.payment_status });
    return;
  }

  const userId = await resolveUserId(stripe, supabase, session);
  if (!userId) {
    log("Could not resolve user_id for session — entitlements not granted", { sessionId: session.id });
    return;
  }

  if (session.mode === "payment") {
    // One-off: order_id is in metadata; existing order_items drive entitlements.
    const orderId = session.metadata?.order_id;
    if (!orderId) {
      log("payment-mode session missing metadata.order_id", { sessionId: session.id });
      return;
    }
    await grantOneOffEntitlements(supabase, userId, session, orderId, encryptionKey);
  }
  // Subscription mode: entitlements are granted by the subscription.created event
  // that Stripe emits alongside this. We don't double-grant here.
}

async function grantOneOffEntitlements(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  session: Stripe.Checkout.Session,
  orderId: string,
  encryptionKey: string | undefined,
) {
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  const userEmail = session.customer_details?.email ?? null;

  // Mark order paid (idempotent).
  await supabase
    .from("orders")
    .update({
      status: "paid",
      amount: session.amount_total ?? undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  const { data: items, error: itemsErr } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);
  if (itemsErr) throw new Error(`Load order items: ${itemsErr.message}`);

  for (const it of items || []) {
    if (it.item_type === "prompt" && it.item_id) {
      await supabase.from("prompt_access").upsert({ user_id: userId, prompt_id: it.item_id });
      log("Granted prompt_access", { userId, promptId: it.item_id });
    } else if (it.item_type === "pack" && it.item_id) {
      await supabase.from("pack_access").upsert({ user_id: userId, pack_id: it.item_id });
      log("Granted pack_access", { userId, packId: it.item_id });
    } else if (it.item_type === "lifetime") {
      if (!encryptionKey) throw new Error("Missing SUBSCRIBERS_ENCRYPTION_KEY for lifetime grant");
      if (!userEmail) throw new Error("Lifetime grant requires customer email");
      await supabase.rpc("secure_upsert_subscriber", {
        p_key: encryptionKey,
        p_user_id: userId,
        p_email: userEmail,
        p_stripe_customer_id: customerId ?? null,
        p_subscribed: true,
        p_subscription_tier: "lifetime",
        p_subscription_end: null,
      });
      log("Granted lifetime subscription", { userId });
    }
  }
}

async function handleSubscriptionUpsert(
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>,
  sub: Stripe.Subscription,
  encryptionKey: string | undefined,
) {
  if (!encryptionKey) throw new Error("Missing SUBSCRIBERS_ENCRYPTION_KEY");

  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const { userId, email } = await resolveUserFromCustomer(stripe, supabase, customerId);
  if (!userId) {
    log("Could not resolve user for subscription", { subscriptionId: sub.id, customerId });
    return;
  }

  const item = sub.items.data[0];
  const productId = typeof item?.price.product === "string" ? item.price.product : item?.price.product.id;
  const tier = productId ? tierFromProductId(productId) : null;
  const subscriptionTier = tier && SUBSCRIPTION_TIERS.has(tier) ? tier : "unknown";

  const subscribed = sub.status === "active" || sub.status === "trialing";
  const subscriptionEnd = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  log("Upserting subscriber", { userId, subscribed, subscriptionTier, subscriptionEnd, status: sub.status });

  await supabase.rpc("secure_upsert_subscriber", {
    p_key: encryptionKey,
    p_user_id: userId,
    p_email: email,
    p_stripe_customer_id: customerId,
    p_subscribed: subscribed,
    p_subscription_tier: subscriptionTier,
    p_subscription_end: subscriptionEnd,
  });
}

async function handleSubscriptionDeleted(
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>,
  sub: Stripe.Subscription,
  encryptionKey: string | undefined,
) {
  if (!encryptionKey) throw new Error("Missing SUBSCRIBERS_ENCRYPTION_KEY");

  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const { userId, email } = await resolveUserFromCustomer(stripe, supabase, customerId);
  if (!userId) {
    log("Could not resolve user for cancelled subscription", { subscriptionId: sub.id, customerId });
    return;
  }

  log("Marking subscriber as cancelled", { userId, subscriptionId: sub.id });

  await supabase.rpc("secure_upsert_subscriber", {
    p_key: encryptionKey,
    p_user_id: userId,
    p_email: email,
    p_stripe_customer_id: customerId,
    p_subscribed: false,
    p_subscription_tier: null,
    p_subscription_end: null,
  });
}

// User resolution order:
//   1. session.metadata.user_id (set by create-payment for one-offs)
//   2. session.client_reference_id (convention for some integrations)
//   3. Lookup by stripe_customer_id in subscribers table
//   4. Lookup by customer email in auth.users
async function resolveUserId(
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>,
  session: Stripe.Checkout.Session,
): Promise<string | null> {
  if (session.metadata?.user_id) return session.metadata.user_id;
  if (session.client_reference_id) return session.client_reference_id;

  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (customerId) {
    const { userId } = await resolveUserFromCustomer(stripe, supabase, customerId);
    if (userId) return userId;
  }

  const email = session.customer_details?.email ?? session.customer_email;
  if (email) return await lookupUserByEmail(supabase, email);
  return null;
}

async function resolveUserFromCustomer(
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>,
  customerId: string,
): Promise<{ userId: string | null; email: string | null }> {
  const { data: existing } = await supabase
    .from("subscribers")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  let email: string | null = null;
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (typeof customer !== "string" && !customer.deleted) {
      email = customer.email ?? null;
    }
  } catch (err) {
    log("Customer retrieval failed", { customerId, error: (err as Error).message });
  }

  if (existing?.user_id) return { userId: existing.user_id, email };
  if (email) {
    const userId = await lookupUserByEmail(supabase, email);
    return { userId, email };
  }
  return { userId: null, email };
}

async function lookupUserByEmail(
  supabase: ReturnType<typeof createClient>,
  email: string,
): Promise<string | null> {
  // Service role can list users. Pagination not required at our scale; if
  // the user base grows past ~1000, switch to a direct query on auth.users.
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) {
    log("listUsers failed", { error: error.message });
    return null;
  }
  const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  return found?.id ?? null;
}
