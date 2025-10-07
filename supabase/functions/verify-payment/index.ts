import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function grantEntitlements(supabaseService: any, userId: string, userEmail: string | null, orderId: string, customerId?: string) {
  const { data: items, error: itemsErr } = await supabaseService
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);
  if (itemsErr) throw new Error(`Load order items error: ${itemsErr.message}`);

  for (const it of items || []) {
    if (it.item_type === 'prompt' && it.item_id) {
      await supabaseService.from('prompt_access').upsert({ user_id: userId, prompt_id: it.item_id });
    } else if (it.item_type === 'pack' && it.item_id) {
      await supabaseService.from('pack_access').upsert({ user_id: userId, pack_id: it.item_id });
    } else if (it.item_type === 'lifetime') {
      // SECURITY: Always use secure_upsert_subscriber - no fallback to plaintext
      const encryptionKey = Deno.env.get("SUBSCRIBERS_ENCRYPTION_KEY");
      if (!encryptionKey) {
        console.error('[VERIFY-PAYMENT] CRITICAL: Missing SUBSCRIBERS_ENCRYPTION_KEY');
        throw new Error('Server configuration error: encryption not configured');
      }
      
      if (!userEmail) {
        throw new Error('User email required for lifetime subscription');
      }
      
      await supabaseService.rpc("secure_upsert_subscriber", {
        p_key: encryptionKey,
        p_user_id: userId,
        p_email: userEmail,
        p_stripe_customer_id: customerId ?? null,
        p_subscribed: true,
        p_subscription_tier: 'lifetime',
        p_subscription_end: null,
      });
    }
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    console.log("VERIFY-PAYMENT: Starting verification process");
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
    const orderId: string = body?.order_id;
    const sessionId: string = body?.session_id;
    if (!orderId || !sessionId) throw new Error("Missing order_id or session_id");

    const supabaseService = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    const { data: order, error: orderErr } = await supabaseService
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    if (orderErr) throw new Error(`Order not found: ${orderErr.message}`);
    if (order.user_id !== user.id) throw new Error("Order does not belong to user");
    
    // SECURITY FIX: Strictly enforce session ID matching - this was a critical vulnerability
    if (order.stripe_session_id !== sessionId) {
      console.error('SECURITY: Session ID mismatch - potential fraud attempt', { 
        orderId, 
        expectedSession: order.stripe_session_id, 
        providedSession: sessionId,
        userId: user.id
      });
      throw new Error("Invalid session ID for this order - security violation");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("VERIFY-PAYMENT: Retrieved Stripe session", { sessionId, paymentStatus: session.payment_status });
    
    // SECURITY: Additional validation - ensure session belongs to authenticated user
    if (session.customer) {
      const customer = await stripe.customers.retrieve(session.customer as string);
      if (typeof customer !== "string" && customer.email && customer.email !== user.email) {
        console.error('SECURITY: Customer email mismatch - potential fraud attempt', {
          sessionCustomerEmail: customer.email,
          userEmail: user.email,
          userId: user.id
        });
        throw new Error("Session does not belong to authenticated user");
      }
    }

    // SECURITY: Validate session metadata if available  
    if (session.metadata?.order_id && session.metadata.order_id !== orderId) {
      console.error('SECURITY: Order ID metadata mismatch', {
        sessionMetadataOrderId: session.metadata.order_id,
        requestOrderId: orderId
      });
      throw new Error("Session metadata validation failed");
    }
    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ status: session.payment_status }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

    await supabaseService.from('orders').update({ status: 'paid', amount: session.amount_total ?? order.amount, updated_at: new Date().toISOString() }).eq('id', orderId);

    const customerId = typeof session.customer === 'string' ? session.customer : (session.customer as any)?.id;
    await grantEntitlements(supabaseService, user.id, user.email ?? null, orderId, customerId);

    // Send purchase confirmation emails
    try {
      // Get order items for email
      const { data: orderItems, error: itemsError } = await supabaseService
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (!itemsError && orderItems && orderItems.length > 0) {
        const items = orderItems.map(item => ({
          type: item.item_type,
          title: item.title || `${item.item_type} item`,
          unitAmount: item.unit_amount,
          quantity: item.quantity
        }));

        // Extract user name from metadata if available
        const userName = user.user_metadata?.full_name || user.user_metadata?.name;

        await supabaseService.functions.invoke('send-purchase-confirmation', {
          body: {
            orderId: orderId,
            userEmail: user.email,
            userName: userName,
            totalAmount: session.amount_total ?? order.amount,
            currency: order.currency || 'usd',
            items: items
          }
        });

        console.log('Purchase confirmation emails sent successfully');
      }
    } catch (emailError) {
      console.error('Failed to send purchase confirmation emails:', emailError);
      // Don't fail the whole transaction if email fails
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error("VERIFY-PAYMENT: Error occurred", { error: msg, stack: error?.stack });
    return new Response(JSON.stringify({ error: msg }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
