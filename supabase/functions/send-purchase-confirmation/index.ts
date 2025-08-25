import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PurchaseConfirmationRequest {
  orderId: string;
  userEmail: string;
  userName?: string;
  totalAmount: number;
  currency: string;
  items: Array<{
    type: string;
    title: string;
    unitAmount: number;
    quantity: number;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { orderId, userEmail, userName, totalAmount, currency, items }: PurchaseConfirmationRequest = await req.json();
    
    console.log("Sending purchase confirmation emails for order:", orderId);

    const logoUrl = "https://promptandgo.ai/lovable-uploads/9e8de25b-d91c-445a-b211-d156a28e4b33.png";
    const formattedAmount = (totalAmount / 100).toFixed(2);
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Generate items HTML
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.unitAmount / 100).toFixed(2)}</td>
      </tr>
    `).join('');

    // Create access information based on item types
    const accessInfo = items.map(item => {
      if (item.type === 'lifetime') {
        return "🚀 <strong>Lifetime Access</strong> - Unlimited AI prompts and premium features";
      } else if (item.type === 'pack') {
        return `📦 <strong>${item.title}</strong> - Access granted to your account`;
      } else if (item.type === 'prompt') {
        return `⚡ <strong>${item.title}</strong> - Available in your prompt library`;
      }
      return `✅ <strong>${item.title}</strong> - Access granted`;
    }).join('<br>');

    // Send confirmation email to buyer
    const buyerEmailResponse = await resend.emails.send({
      from: "promptandgo <hello@promptandgo.ai>",
      to: [userEmail],
      subject: `Purchase Confirmation - Order #${orderId.slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <!-- Header with Logo -->
          <div style="text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 2px solid #f0f0f0;">
            <img src="${logoUrl}" alt="promptandgo" style="max-width: 200px; height: auto;" />
          </div>

          <!-- Main Content -->
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h1 style="color: #28a745; margin: 0 0 20px 0; text-align: center;">
              🎉 Thank you for your purchase!
            </h1>
            <p style="font-size: 18px; line-height: 1.6; text-align: center; margin: 0;">
              Hi ${userName || 'there'}! Your order has been processed successfully.
            </p>
          </div>

          <!-- Order Details -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              📋 Order Details
            </h2>
            <table style="width: 100%; margin: 20px 0;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold;">Order Number:</td>
                <td style="padding: 10px 0;">#${orderId.slice(-8)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold;">Date:</td>
                <td style="padding: 10px 0;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0;">${userEmail}</td>
              </tr>
            </table>
          </div>

          <!-- Items Purchased -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              🛒 Items Purchased
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background: #007bff; color: white;">
                  <th style="padding: 15px; text-align: left;">Item</th>
                  <th style="padding: 15px; text-align: center;">Quantity</th>
                  <th style="padding: 15px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr style="background: #f8f9fa; font-weight: bold;">
                  <td style="padding: 15px;" colspan="2">Total</td>
                  <td style="padding: 15px; text-align: right; font-size: 18px; color: #28a745;">$${formattedAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Access Information -->
          <div style="background: #e3f2fd; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #1976d2; margin: 0 0 15px 0;">
              🎯 Your Access is Ready!
            </h2>
            <div style="font-size: 16px; line-height: 1.8;">
              ${accessInfo}
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <a href="https://promptandgo.ai/account" 
                 style="display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Access Your Account →
              </a>
            </div>
          </div>

          <!-- Support -->
          <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; color: #666;">
              Need help? We're here for you!
            </p>
            <a href="https://promptandgo.ai/contact" style="color: #007bff; text-decoration: none;">
              Contact Support
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px;">
            <p style="margin: 0;">
              Thank you for choosing promptandgo!<br>
              <a href="https://promptandgo.ai" style="color: #007bff; text-decoration: none;">promptandgo.ai</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Buyer confirmation email sent:", buyerEmailResponse);

    // Send notification email to seller
    const sellerEmailResponse = await resend.emails.send({
      from: "promptandgo <hello@promptandgo.ai>",
      to: ["hello@promptandgo.ai"],
      subject: `💰 New Sale - $${formattedAmount} from ${userName || userEmail}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 2px solid #f0f0f0;">
            <img src="${logoUrl}" alt="promptandgo" style="max-width: 200px; height: auto;" />
          </div>

          <!-- Main Content -->
          <div style="background: #d4edda; padding: 30px; border-radius: 10px; margin-bottom: 30px; border: 1px solid #c3e6cb;">
            <h1 style="color: #155724; margin: 0 0 20px 0; text-align: center;">
              💰 New Sale Alert!
            </h1>
            <p style="font-size: 18px; line-height: 1.6; text-align: center; margin: 0; color: #155724;">
              You just made a sale of <strong>$${formattedAmount}</strong>!
            </p>
          </div>

          <!-- Customer Details -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
              👤 Customer Information
            </h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 15px 8px 0; font-weight: bold;">Name:</td>
                  <td style="padding: 8px 0;">${userName || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 15px 8px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0;">${userEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 15px 8px 0; font-weight: bold;">Order ID:</td>
                  <td style="padding: 8px 0;">#${orderId.slice(-8)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 15px 8px 0; font-weight: bold;">Date:</td>
                  <td style="padding: 8px 0;">${date}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Sale Details -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
              🛒 Items Sold
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background: #28a745; color: white;">
                  <th style="padding: 15px; text-align: left;">Item</th>
                  <th style="padding: 15px; text-align: center;">Qty</th>
                  <th style="padding: 15px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr style="background: #f8f9fa; font-weight: bold;">
                  <td style="padding: 15px;" colspan="2">Total Revenue</td>
                  <td style="padding: 15px; text-align: right; font-size: 18px; color: #28a745;">$${formattedAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Access Granted -->
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #ffeeba;">
            <h3 style="color: #856404; margin: 0 0 15px 0;">
              ✅ Access Automatically Granted
            </h3>
            <div style="color: #856404; line-height: 1.6;">
              ${accessInfo}
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px;">
            <p style="margin: 0;">
              <strong>Time:</strong> ${new Date().toLocaleString('en-US', { 
                timeZone: 'UTC',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </p>
          </div>
        </div>
      `,
    });

    console.log("Seller notification email sent:", sellerEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      buyerEmailId: buyerEmailResponse.data?.id,
      sellerEmailId: sellerEmailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-purchase-confirmation function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send purchase confirmation emails" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);