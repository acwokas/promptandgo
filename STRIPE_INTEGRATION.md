# Stripe integration

State of play on the `astro` branch.

## What's deployed today

| Surface | Where | Mode |
|---|---|---|
| Subscription checkout | `supabase/functions/create-checkout/` | Inline `price_data`, monthly only, hardcoded $12.99 |
| One-off checkout (prompt / pack / lifetime) | `supabase/functions/create-payment/` | Inline `price_data`, writes `orders` + `order_items` |
| Buy button (client) | `astro/src/components/BuyButton.tsx` | Calls one of the two functions above |
| Locked-prompt UI | `astro/src/components/PromptLock.tsx` | Reads `getEntitlement()` from `@astro/lib/auth-client` |
| Post-checkout verify (polling) | `supabase/functions/verify-payment/` | Client calls this on success page |
| Subscription poll | `supabase/functions/check-subscription/` | Reads Stripe directly, upserts `subscribers` |
| Customer portal | `supabase/functions/customer-portal/` | |
| Order reconcile (sweep) | `supabase/functions/reconcile-orders/` | |

Entitlement tables:
- `subscribers` — written via `secure_upsert_subscriber` RPC, needs `SUBSCRIBERS_ENCRYPTION_KEY`
- `prompt_access` — `(user_id, prompt_id)`
- `pack_access` — `(user_id, pack_id)`
- `orders` / `order_items` — purchase ledger

`getEntitlement()` returns `{ loggedIn, isSubscribed, ownedPromptIds, ownedPackIds }` by reading those tables.

## New in this PR

### `supabase/functions/stripe-webhook/`

Direct-from-Stripe webhook. Removes the dependency on the client hitting `verify-payment` after checkout — entitlements now get written even if the user closes the tab.

**Webhook URL** (paste into Stripe Dashboard → Developers → Webhooks → Add endpoint):

```
https://sszxxmxqidkpkhlkstgs.supabase.co/functions/v1/stripe-webhook
```

(Replace the project ref if Adrian's pointing the Astro app at a different one — see "Supabase project reference confusion" below.)

**Events to subscribe to:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

After registering, copy the signing secret (`whsec_...`) into the Supabase Edge Function env as `STRIPE_WEBHOOK_SECRET`.

### `supabase/functions/_shared/stripe-prices.ts`

Runtime resolver: given a tier key (`pro_monthly`, etc.) or product ID, returns the matching Stripe Price ID by expanding `default_price`. Lets us store product IDs (stable) rather than price IDs (change every time you tweak the price in Stripe).

Not yet wired into `create-checkout` / `create-payment` — see TODOs.

## Env vars

### To set in Supabase Edge Functions env (Dashboard → Project → Edge Functions → Secrets, or `supabase secrets set`)

All six product IDs are **not secrets**, but the convention is to keep all Stripe runtime config in one place.

```bash
supabase secrets set STRIPE_PROD_PER_PROMPT=prod_UUwoVQZwD8Omtq
supabase secrets set STRIPE_PROD_PER_PACK=prod_UUwqS3OTIsHbOx
supabase secrets set STRIPE_PROD_PRO_MONTHLY=prod_UUwrc0eL3HEP1q
supabase secrets set STRIPE_PROD_PRO_ANNUAL=prod_UUwscktRrqBLyb
supabase secrets set STRIPE_PROD_TEAM_MONTHLY=prod_UUwuYFNd2GyFQh
supabase secrets set STRIPE_PROD_TEAM_ANNUAL=prod_UUwuSSl5aIkSaA

# Set after registering the webhook in Stripe Dashboard:
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

Already set (per Adrian, on the CF Pages env — but the webhook needs them in the Supabase Edge Function env, NOT CF Pages):
- `STRIPE_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUBSCRIBERS_ENCRYPTION_KEY`
- `SUPABASE_URL`

⚠️ The webhook is a Supabase Edge Function, not a CF Pages function. Secrets set on the CF Pages project do NOT propagate to Supabase. If `STRIPE_SECRET_KEY` is currently only in CF Pages env, it needs to be mirrored to Supabase Edge Functions for the webhook to work.

### CF Pages env (already set or need to be set for client/Astro build)

```
PUBLIC_SUPABASE_URL=https://sszxxmxqidkpkhlkstgs.supabase.co
PUBLIC_SUPABASE_ANON_KEY=...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...   (only needed if we move to Stripe Elements; today's flow doesn't need it)
```

## Supabase project reference confusion

There are **two project IDs** in this repo:

- `dkdakwyrqyfdkyukqmqs` — old project. Hardcoded fallback in `astro/src/components/BuyButton.tsx:4`. Also in `supabase/config.toml` on the `astro` branch.
- `sszxxmxqidkpkhlkstgs` — current project. The `main` branch has a commit (`bd682c1`) that migrated to it; that commit is NOT yet on the `astro` branch.

Reality check needed before deploying the webhook:

1. Which project ref does CF Pages have `PUBLIC_SUPABASE_URL` pointing at? That's the live runtime DB.
2. Deploy the webhook to the SAME project. Run `supabase functions deploy stripe-webhook --project-ref <correct-ref>`.
3. Register the webhook URL in Stripe with the SAME project ref.
4. Fix the stale `dkdakwyrqyfdkyukqmqs` fallback in `BuyButton.tsx` so future env-var mishaps don't silently route to the wrong DB.
5. Fix `supabase/config.toml` `project_id` (or cherry-pick `bd682c1` from `main` onto `astro`).

## TODOs

**Shipped 2026-05-11** (autonomous decisions, see commits on this branch):

1. ✅ **Live price $12** — `create-checkout` unit_amount is now 1200. The existing $12.99 cohort is documented but not migrated (Stripe doesn't retroactively re-price live subs). Commit `be138d7`.
2. ✅ **Annual + Team subscription support** — `create-checkout` now accepts `tier: 'pro_monthly' | 'pro_annual' | 'team_monthly' | 'team_annual'` in the request body; default stays `pro_monthly` for backward compat. Commit `ff57ebf`.
3. ✅ **Pricing page rebuilt** to 6-tier structure aligned with `_shared/stripe-prices.ts`: per_prompt / per_pack / pro_monthly / pro_annual / team_monthly / team_annual. Free is now a callout banner above the grid. Commit `6fda772`. Feature-bullet copy is first-pass — review and refine before launch.
4. ✅ **create-checkout + create-payment migrated to product-ID resolution** via `_shared/stripe-prices.ts`. Both functions resolve the live Stripe price from the product's default_price. Commit `ff57ebf` (checkout) + same (payment).
6. ✅ **BuyButton.tsx fallback URL** updated from legacy `dkdakwyrqyfdkyukqmqs` to current `sszxxmxqidkpkhlkstgs`. Commit `be138d7`.
7. ✅ **Tier vocab in check-subscription** rewritten to use `tierFromProductId()` from the shared resolver. `'Basic'/'Premium'/'Enterprise'` bucket-bucketing gone. Migration `20260511230000_backfill_subscription_tier_vocab.sql` maps existing rows (Basic → pro_monthly; Premium/Enterprise → NULL, repopulated on next API call). Commit `f54387f`.

**Open — needs Adrian's call**:

5. 🔴 **Lifetime $349 tier** — currently lives in `create-payment` but not on the pricing page or in `_shared/stripe-prices.ts`. Three options:
   - **(a) Keep hidden** — leave in `create-payment`, accessible via direct buy URL only, no pricing-page slot.
   - **(b) Promote** — add `STRIPE_PROD_LIFETIME` env var + a `lifetime` tier to the resolver, wire a 7th card on the pricing page.
   - **(c) Drop** — remove from `create-payment`, drop `'lifetime'` from any DB tier enum, remove the lifetime branch in `check-subscription`.

   Which? The autonomous Stripe TODO pass parked this as the one decision-blocker. Until decided, the `create-payment` lifetime branch stays inline ($349) and `check-subscription` still has a `tier || 'lifetime'` orphan-fallback. Migration kept `'lifetime'` rows untouched in the backfill.

## Pre-deploy checklist (programmatic — 2026-05-11)

1. Confirm CF Pages `PUBLIC_SUPABASE_URL` project ref.
2. `supabase functions deploy stripe-webhook --project-ref <ref>`
3. Set the six `STRIPE_PROD_*` env vars on that project's Edge Functions.
4. Mirror `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUBSCRIBERS_ENCRYPTION_KEY` from CF Pages env to Supabase Edge Functions env if not already.
5. **`deno run --allow-net --allow-env supabase/functions/_shared/register-stripe-webhook.ts`** — registers the webhook URL with Stripe and stores `STRIPE_WEBHOOK_SECRET` in Supabase secrets in one shot. Idempotent: re-runs are a no-op if the endpoint already exists with the right event set. (Replaces the prior manual Dashboard "Add endpoint → copy whsec → paste" flow that was steps 5 + 6.)
6. Apply migration: `supabase migration up --project-ref <ref>` to backfill `subscribers.subscription_tier` to the new vocab.
7. Send a Stripe Dashboard "test event" → confirm 200 in Supabase function logs.
8. Run one real test-mode checkout → confirm `subscribers` / `prompt_access` / `pack_access` row appears.
9. Flip to live keys.

For fully-autonomous future webhook registrations (skip the Dashboard click-through entirely), export `SUPABASE_ACCESS_TOKEN` + `SUPABASE_PROJECT_REF` before running the registrar — it'll PATCH the project's function secrets via the Management API.

## CF Pages deploy

CF Pages auto-deploys on push to the **`astro`** branch (not `main` — `main` is the stale Lovable export, 24 commits behind). This webhook function is a Supabase Edge Function and is **not** part of the CF Pages build — it deploys separately via `supabase functions deploy`.
