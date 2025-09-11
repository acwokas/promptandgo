import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => console.log(`[CHECK-SUBSCRIPTION] ${step}`, details ?? '');

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY is not set');

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header provided');
    const token = authHeader.replace('Bearer ', '');

    const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error('User not authenticated or email not available');

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep('No customer found; set unsubscribed');
      const encKey = Deno.env.get('SUBSCRIBERS_ENCRYPTION_KEY');
      if (encKey) {
        await supabase.rpc('secure_upsert_subscriber', {
          p_key: encKey,
          p_user_id: user.id,
          p_email: user.email,
          p_stripe_customer_id: null,
          p_subscribed: false,
          p_subscription_tier: null,
          p_subscription_end: null,
        });
      } else {
        // Fallback (no encryption key configured yet)
        await supabase.from('subscribers').upsert({
          email: user.email,
          user_id: user.id,
          stripe_customer_id: null,
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      }
      return new Response(JSON.stringify({ subscribed: false }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

    const customerId = customers.data[0].id;
    const subs = await stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 1 });
    const hasActive = subs.data.length > 0;
    let tier: string | null = null;
    let subEnd: string | null = null;

    if (hasActive) {
      const sub = subs.data[0];
      subEnd = new Date(sub.current_period_end * 1000).toISOString();
      const priceId = sub.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      tier = amount <= 1299 ? 'Basic' : amount <= 1999 ? 'Premium' : 'Enterprise';
    }

    const encKey = Deno.env.get('SUBSCRIBERS_ENCRYPTION_KEY');
    if (encKey) {
      await supabase.rpc('secure_upsert_subscriber', {
        p_key: encKey,
        p_user_id: user.id,
        p_email: user.email,
        p_stripe_customer_id: customerId,
        p_subscribed: hasActive,
        p_subscription_tier: tier,
        p_subscription_end: subEnd,
      });
      
      // Try to fix any orphaned subscriptions for this user
      try {
        // Check if there's an orphaned subscription with null user_id but matching email hash
        const emailHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(user.email))
          .then(buffer => Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0')).join(''));
        
        const { data: orphaned } = await supabase
          .from('subscribers')
          .select('id')
          .eq('email_hash', emailHash)
          .is('user_id', null)
          .eq('subscribed', true)
          .maybeSingle();
          
        if (orphaned) {
          // Update the orphaned record with the secure function
          await supabase.rpc('secure_upsert_subscriber', {
            p_key: encKey,
            p_user_id: user.id,
            p_email: user.email,
            p_stripe_customer_id: customerId,
            p_subscribed: true,
            p_subscription_tier: tier || 'lifetime',
            p_subscription_end: subEnd,
          });
          logStep('Fixed orphaned subscription record');
        }
      } catch (linkError) {
        console.warn('Could not fix orphaned subscription:', linkError);
      }
    } else {
      await supabase.from('subscribers').upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: customerId,
        subscribed: hasActive,
        subscription_tier: tier,
        subscription_end: subEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }

    // Send welcome email for new subscribers
    if (hasActive && tier) {
      try {
        const welcomeResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-subscription-welcome`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          },
          body: JSON.stringify({
            userEmail: user.email,
            userName: user.user_metadata?.full_name || user.user_metadata?.name,
            subscriptionTier: tier,
            subscriptionEnd: subEnd,
          }),
        });
        
        if (!welcomeResponse.ok) {
          console.error('Failed to send welcome email:', await welcomeResponse.text());
        } else {
          console.log('Welcome email sent successfully');
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail the subscription check if email fails
      }
    }

    return new Response(JSON.stringify({ subscribed: hasActive, subscription_tier: tier, subscription_end: subEnd }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error('[CHECK-SUBSCRIPTION] error', msg);
    return new Response(JSON.stringify({ error: msg }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
