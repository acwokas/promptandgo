import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface PendingOrder {
  id: string;
  user_id: string;
  amount: number;
  created_at: string;
  items: Array<{ title: string; unit_amount: number }>;
}

const generateEmailHtml = (
  userName: string,
  items: Array<{ title: string; unit_amount: number }>,
  totalCents: number,
  checkoutUrl: string
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #1f2937; font-size: 24px; margin: 0;">You left something behind! 🛒</h1>
    </div>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi${userName ? ` ${userName}` : ''},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      We noticed you didn't complete your purchase. Your items are still waiting for you:
    </p>
    
    <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 24px 0;">
      ${items.map(item => `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #374151; font-weight: 500;">${item.title}</span>
          <span style="color: #6b7280;">$${(item.unit_amount / 100).toFixed(2)}</span>
        </div>
      `).join('')}
      <div style="display: flex; justify-content: space-between; padding: 12px 0 0; margin-top: 8px;">
        <span style="color: #1f2937; font-weight: 600;">Total</span>
        <span style="color: #1f2937; font-weight: 600;">$${(totalCents / 100).toFixed(2)}</span>
      </div>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${checkoutUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Complete Your Purchase →
      </a>
    </div>
    
    <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 32px;">
      Questions? Just reply to this email — we're here to help!
    </p>
    
    <div style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 24px; text-align: center;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        PromptAndGo.ai — Your AI Prompt Library
      </p>
    </div>
  </div>
</body>
</html>
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find pending orders older than 1 hour but less than 24 hours
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    console.log("Fetching pending orders...");

    const { data: pendingOrders, error: ordersError } = await supabase
      .from("orders")
      .select(`
        id,
        user_id,
        amount,
        created_at,
        order_items (
          title,
          unit_amount
        )
      `)
      .eq("status", "pending")
      .lt("created_at", oneHourAgo)
      .gt("created_at", oneDayAgo);

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      throw ordersError;
    }

    console.log(`Found ${pendingOrders?.length || 0} pending orders`);

    const emailsSent: string[] = [];
    const errors: string[] = [];

    for (const order of pendingOrders || []) {
      try {
        // Get user email from auth
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(order.user_id);
        
        if (userError || !userData?.user?.email) {
          console.log(`Could not get email for user ${order.user_id}`);
          continue;
        }

        const userEmail = userData.user.email;
        const userName = userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || "";

        // Check if we already sent a recovery email for this order (use metadata or a simple check)
        // For now, we'll just send once per run - in production you'd track this

        const items = order.order_items || [];
        const totalCents = items.reduce((sum: number, item: any) => sum + (item.unit_amount || 0), 0);
        
        const checkoutUrl = `https://promptandgo.lovable.app/cart`;

        const html = generateEmailHtml(userName, items, totalCents, checkoutUrl);

        console.log(`Sending recovery email to ${userEmail}...`);

        const { error: emailError } = await resend.emails.send({
          from: "PromptAndGo <onboarding@resend.dev>",
          to: [userEmail],
          subject: "Complete your purchase - your prompts are waiting! 🎯",
          html,
        });

        if (emailError) {
          console.error(`Failed to send email to ${userEmail}:`, emailError);
          errors.push(`${userEmail}: ${emailError.message}`);
        } else {
          console.log(`Recovery email sent to ${userEmail}`);
          emailsSent.push(userEmail);
        }
      } catch (err) {
        console.error(`Error processing order ${order.id}:`, err);
        errors.push(`Order ${order.id}: ${err.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailsSent: emailsSent.length,
        emails: emailsSent,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in recover-abandoned-cart:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
