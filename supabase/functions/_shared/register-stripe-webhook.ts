#!/usr/bin/env -S deno run --allow-net --allow-env
/**
 * Programmatic Stripe webhook registration.
 *
 * Replaces the manual Dashboard flow (Stripe → Add endpoint → paste URL
 * → copy whsec → paste into Supabase env) with a one-shot Deno script
 * Adrian runs after a Supabase project ref change OR after first deploy.
 *
 * Behaviour:
 *   1. Reads STRIPE_SECRET_KEY from env (required).
 *   2. Resolves the webhook endpoint URL from env (PUBLIC_SUPABASE_URL or
 *      SUPABASE_URL) + the function name `stripe-webhook`. The handler
 *      itself can land later — Stripe stores the URL config regardless
 *      and will retry-then-fail until the handler exists.
 *   3. Lists existing webhook_endpoints; if one matches our URL + the
 *      expected enabled_events set, exits 0 with "noop" — idempotent.
 *   4. Otherwise POSTs /v1/webhook_endpoints with the required event list.
 *   5. Captures the returned signing secret (whsec_...).
 *   6. If SUPABASE_ACCESS_TOKEN + SUPABASE_PROJECT_REF are set, PATCHes
 *      the project's function secrets via the Supabase Management API to
 *      store STRIPE_WEBHOOK_SECRET there directly.
 *   7. Else prints the exact `supabase secrets set` command Adrian needs
 *      to run, plus the whsec value — fully copy-pastable.
 *
 * Locked 2026-05-11 as the canonical webhook-registration path. The
 * manual STRIPE_INTEGRATION.md flow (steps 5+6 of the deploy checklist)
 * collapses to one command: `deno run -A register-stripe-webhook.ts`.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_... \
 *   PUBLIC_SUPABASE_URL=https://sszxxmxqidkpkhlkstgs.supabase.co \
 *     deno run --allow-net --allow-env supabase/functions/_shared/register-stripe-webhook.ts
 *
 *   # Fully automated (if Adrian has a Supabase Management PAT):
 *   STRIPE_SECRET_KEY=sk_live_... \
 *   PUBLIC_SUPABASE_URL=https://sszxxmxqidkpkhlkstgs.supabase.co \
 *   SUPABASE_ACCESS_TOKEN=sbp_... \
 *   SUPABASE_PROJECT_REF=sszxxmxqidkpkhlkstgs \
 *     deno run --allow-net --allow-env supabase/functions/_shared/register-stripe-webhook.ts
 */

const REQUIRED_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
];

const STRIPE_API = "https://api.stripe.com/v1";
const SUPABASE_MGMT_API = "https://api.supabase.com/v1";

interface StripeWebhookEndpoint {
  id: string;
  url: string;
  enabled_events: string[];
  secret?: string;
  status: string;
}

function envOrFail(name: string): string {
  const v = Deno.env.get(name);
  if (!v) {
    console.error(`FATAL: ${name} is required in env`);
    Deno.exit(1);
  }
  return v;
}

function resolveWebhookUrl(): string {
  const base = Deno.env.get("PUBLIC_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL");
  if (!base) {
    console.error("FATAL: set PUBLIC_SUPABASE_URL or SUPABASE_URL");
    Deno.exit(1);
  }
  return `${base.replace(/\/$/, "")}/functions/v1/stripe-webhook`;
}

async function stripeRequest<T>(path: string, method: "GET" | "POST", body?: URLSearchParams): Promise<T> {
  const stripeKey = envOrFail("STRIPE_SECRET_KEY");
  const res = await fetch(`${STRIPE_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body?.toString(),
  });
  if (!res.ok) {
    throw new Error(`Stripe ${method} ${path} → HTTP ${res.status}: ${(await res.text()).slice(0, 400)}`);
  }
  return res.json() as Promise<T>;
}

async function listWebhooks(): Promise<StripeWebhookEndpoint[]> {
  const r = await stripeRequest<{ data: StripeWebhookEndpoint[] }>("/webhook_endpoints?limit=100", "GET");
  return r.data;
}

async function createWebhook(url: string): Promise<StripeWebhookEndpoint> {
  const body = new URLSearchParams();
  body.set("url", url);
  body.set("api_version", "2024-12-18.acacia");
  body.set("description", "promptandgo membership + payment events (registered programmatically)");
  for (const evt of REQUIRED_EVENTS) body.append("enabled_events[]", evt);
  return stripeRequest<StripeWebhookEndpoint>("/webhook_endpoints", "POST", body);
}

function eventsMatch(actual: string[], required: string[]): boolean {
  if (actual.length !== required.length) return false;
  const set = new Set(actual);
  return required.every((e) => set.has(e));
}

async function storeSecretViaMgmtApi(whsec: string): Promise<"stored" | "skipped"> {
  const token = Deno.env.get("SUPABASE_ACCESS_TOKEN");
  const ref = Deno.env.get("SUPABASE_PROJECT_REF");
  if (!token || !ref) return "skipped";
  const res = await fetch(`${SUPABASE_MGMT_API}/projects/${ref}/secrets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{ name: "STRIPE_WEBHOOK_SECRET", value: whsec }]),
  });
  if (!res.ok) {
    throw new Error(`Supabase secrets POST → HTTP ${res.status}: ${(await res.text()).slice(0, 400)}`);
  }
  return "stored";
}

async function main() {
  envOrFail("STRIPE_SECRET_KEY"); // fail fast
  const webhookUrl = resolveWebhookUrl();
  console.log(`Target webhook URL: ${webhookUrl}`);

  // Idempotency check
  const existing = await listWebhooks();
  const match = existing.find((w) => w.url === webhookUrl);
  if (match) {
    if (eventsMatch(match.enabled_events, REQUIRED_EVENTS) && match.status === "enabled") {
      console.log(`✓ Webhook already registered (${match.id}) with the right event set + enabled. No-op.`);
      console.log(`  If STRIPE_WEBHOOK_SECRET isn't already in Supabase secrets, you'll need to`);
      console.log(`  rotate it from the Dashboard (Stripe doesn't expose secrets on GET).`);
      return;
    }
    console.log(`⚠ Webhook exists (${match.id}) but with wrong event set or status.`);
    console.log(`  Event set: actual=[${match.enabled_events.join(",")}] required=[${REQUIRED_EVENTS.join(",")}]`);
    console.log(`  Status: ${match.status}`);
    console.log(`  Delete it from the Stripe Dashboard and re-run this script.`);
    Deno.exit(2);
  }

  // Create
  console.log(`Creating new webhook endpoint…`);
  const created = await createWebhook(webhookUrl);
  console.log(`✓ Created: ${created.id}`);
  console.log(`  URL: ${created.url}`);
  console.log(`  Events: ${created.enabled_events.length}`);

  const whsec = created.secret;
  if (!whsec) {
    console.error(`FATAL: webhook created (${created.id}) but Stripe didn't return a 'secret' field.`);
    console.error(`Visit the Stripe Dashboard to retrieve the signing secret manually.`);
    Deno.exit(3);
  }

  // Store via Management API (if Adrian has set it up) OR print instructions
  try {
    const result = await storeSecretViaMgmtApi(whsec);
    if (result === "stored") {
      console.log(`✓ STRIPE_WEBHOOK_SECRET stored in Supabase project secrets via Management API.`);
      console.log(`  Deploy your functions with: supabase functions deploy stripe-webhook`);
      return;
    }
  } catch (e) {
    console.error(`⚠ Management API call failed: ${(e as Error).message}`);
    console.error(`  Falling back to manual instructions.`);
  }

  console.log(`\nNext step — store the signing secret:`);
  console.log(`  supabase secrets set STRIPE_WEBHOOK_SECRET=${whsec}`);
  console.log(`\n(For fully-autonomous future runs: export SUPABASE_ACCESS_TOKEN=sbp_...`);
  console.log(` and SUPABASE_PROJECT_REF=${Deno.env.get("SUPABASE_PROJECT_REF") ?? "<your-project-ref>"}`);
  console.log(` before re-running this script.)`);
}

if (import.meta.main) {
  main().catch((e) => {
    console.error(`FATAL: ${e instanceof Error ? e.message : String(e)}`);
    Deno.exit(1);
  });
}
