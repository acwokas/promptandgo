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

## TODOs (not in this PR)

Things deferred until Adrian confirms decisions:

1. **Live price: $12 vs $12.99?** `create-checkout` hardcodes `unit_amount: 1299`. Brief and product IDs imply $12. Switching changes the price for new subs but not existing ones (Stripe doesn't retroactively re-price). If $12 is the answer, decide whether to migrate the existing $12.99 cohort.
2. **Annual + Team subscription support** in `create-checkout`. `BuyButton.tsx` already accepts `subscription_annual` and could accept `subscription_team_monthly` / `subscription_team_annual` — the function just needs branches that resolve the right product → price.
3. **Pricing page rebuild**. Current `astro/src/pages/pricing.astro` shows Free / Pro $12 / Team $32-seat. Brief asked for a 6-row table with annual toggle and per-prompt / per-pack rows. Pick one.
4. **Migrate `create-checkout` + `create-payment` to product-ID resolution** via `_shared/stripe-prices.ts` (rather than inline `price_data`). Better Stripe Dashboard hygiene; the helper is already written and ready to wire in.
5. **Lifetime $349 tier** — exists in `create-payment` but not on the pricing page. Keep, promote, or drop?
6. **Stale Supabase URL fallback** in `BuyButton.tsx:4` — fix in same PR as #1–#3, or now.
7. **Tier-value vocabulary mismatch.** `check-subscription/index.ts:88` derives tier from price amount as `'Basic' | 'Premium' | 'Enterprise'` (plus `'lifetime'`). This webhook writes `'pro_monthly' | 'pro_annual' | 'team_monthly' | 'team_annual'`. Functionally harmless — `getEntitlement()` only reads `subscribed` + `subscription_end`, not the tier label — but the `subscribers.subscription_tier` column will end up with mixed vocab depending on which function wrote it last. Pick one vocab and migrate the other writer.

## Pre-deploy checklist (when Adrian's ready)

1. Confirm CF Pages `PUBLIC_SUPABASE_URL` project ref.
2. `supabase functions deploy stripe-webhook --project-ref <ref>`
3. Set the six `STRIPE_PROD_*` env vars on that project's Edge Functions.
4. Mirror `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUBSCRIBERS_ENCRYPTION_KEY` from CF Pages env to Supabase Edge Functions env if not already.
5. Register webhook URL in Stripe Dashboard with the events listed above.
6. Paste returned `whsec_...` as `STRIPE_WEBHOOK_SECRET` in Supabase Edge Functions env.
7. Send a Stripe Dashboard "test event" → confirm 200 in Supabase function logs.
8. Run one real test-mode checkout → confirm `subscribers` / `prompt_access` / `pack_access` row appears.
9. Flip to live keys.

## CF Pages deploy

CF Pages auto-deploys on push to the **`astro`** branch (not `main` — `main` is the stale Lovable export, 24 commits behind). This webhook function is a Supabase Edge Function and is **not** part of the CF Pages build — it deploys separately via `supabase functions deploy`.
