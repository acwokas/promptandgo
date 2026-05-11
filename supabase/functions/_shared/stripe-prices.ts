// Runtime resolution of Stripe Product IDs -> Price IDs.
//
// We store STRIPE_PROD_* env vars (product IDs) rather than STRIPE_PRICE_*
// (price IDs) so price changes in the Stripe Dashboard don't require a redeploy.
// At checkout-session creation we expand the product's default_price and use it.

import Stripe from "https://esm.sh/stripe@14.21.0";

export type TierKey =
  | "per_prompt"
  | "per_pack"
  | "pro_monthly"
  | "pro_annual"
  | "team_monthly"
  | "team_annual";

const ENV_VAR_BY_TIER: Record<TierKey, string> = {
  per_prompt: "STRIPE_PROD_PER_PROMPT",
  per_pack: "STRIPE_PROD_PER_PACK",
  pro_monthly: "STRIPE_PROD_PRO_MONTHLY",
  pro_annual: "STRIPE_PROD_PRO_ANNUAL",
  team_monthly: "STRIPE_PROD_TEAM_MONTHLY",
  team_annual: "STRIPE_PROD_TEAM_ANNUAL",
};

export function getProductId(tier: TierKey): string {
  const envVar = ENV_VAR_BY_TIER[tier];
  const value = Deno.env.get(envVar);
  if (!value) throw new Error(`Missing env var ${envVar} for tier ${tier}`);
  return value;
}

export async function resolvePriceId(stripe: Stripe, tier: TierKey): Promise<string> {
  const productId = getProductId(tier);
  const product = await stripe.products.retrieve(productId, { expand: ["default_price"] });
  const defaultPrice = product.default_price;
  if (!defaultPrice || typeof defaultPrice === "string") {
    throw new Error(`Product ${productId} (${tier}) has no expanded default_price`);
  }
  return defaultPrice.id;
}

// Reverse lookup: given a Stripe product ID (from a subscription event),
// return the tier key we know it as. Used by the webhook to label subscribers.
export function tierFromProductId(productId: string): TierKey | null {
  for (const [tier, envVar] of Object.entries(ENV_VAR_BY_TIER) as [TierKey, string][]) {
    if (Deno.env.get(envVar) === productId) return tier;
  }
  return null;
}
