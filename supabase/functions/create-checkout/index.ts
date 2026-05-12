import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { resolvePriceId, type TierKey } from "../_shared/stripe-prices.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

// Create a membership checkout session
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  
  try {
    logStep("Function started");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Missing STRIPE_SECRET_KEY secret");
    logStep("Stripe key verified");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    // Create Supabase client with anon key for authentication
    const supabaseAuth = createClient(supabaseUrl, anonKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError) {
      logStep("Authentication error", { error: userError.message });
      throw new Error(`Auth error: ${userError.message}`);
    }
    const user = userData.user;
    if (!user?.email) {
      logStep("No user or email found");
      throw new Error("Not authenticated or missing email");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    logStep("Stripe initialized");
    
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId = customers.data.length ? customers.data[0].id : undefined;
    logStep("Customer lookup completed", { customerId: customerId || "none" });

    const origin = req.headers.get('origin') || 'https://promptandgo.ai';

    // TODO 2 + TODO 4 — tier is now a request param. Caller passes
    // `tier: 'pro_monthly' | 'pro_annual' | 'team_monthly' | 'team_annual'`
    // and we resolve the live Stripe price ID off the product's
    // default_price. Default stays `pro_monthly` so existing clients
    // that POST without a body keep working unchanged.
    let body: any = {};
    try { body = await req.json(); } catch { /* empty body is fine — falls through to pro_monthly */ }
    const requestedTier: string = body?.tier ?? 'pro_monthly';
    const SUBSCRIPTION_TIERS: TierKey[] = ['pro_monthly', 'pro_annual', 'team_monthly', 'team_annual'];
    if (!SUBSCRIPTION_TIERS.includes(requestedTier as TierKey)) {
      throw new Error(`Invalid tier '${requestedTier}'. Subscription tiers must be one of: ${SUBSCRIPTION_TIERS.join(', ')}. For prompt/pack/lifetime purchases use /functions/v1/create-payment instead.`);
    }
    const tier = requestedTier as TierKey;
    logStep("Resolving price for tier", { tier });
    const priceId = await resolvePriceId(stripe, tier);
    logStep("Price resolved", { tier, priceId });

    logStep("Creating checkout session", { origin, tier });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/membership/success`,
      cancel_url: `${origin}/membership/canceled`,
      subscription_data: {
        metadata: {
          business_name: 'promptandgo.ai',
          tier,
        }
      },
      metadata: {
        business_name: 'promptandgo.ai',
        tier,
      }
    });

    logStep("Checkout session created successfully", { sessionId: session.id, url: session.url });
    return new Response(JSON.stringify({ url: session.url }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 200 
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 500 
    });
  }
});
