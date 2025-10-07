import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscriptionWelcomeRequest {
  userEmail: string;
  userName?: string;
  subscriptionTier: string;
  subscriptionEnd?: string;
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
    const { userEmail, userName, subscriptionTier, subscriptionEnd }: SubscriptionWelcomeRequest = await req.json();
    
    console.log("Sending subscription welcome email for:", userEmail, subscriptionTier);

    const logoUrl = "https://promptandgo.ai/lovable-uploads/9e8de25b-d91c-445a-b211-d156a28e4b33.png";
    const formattedEndDate = subscriptionEnd ? new Date(subscriptionEnd).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : null;

    // Get tier-specific benefits
    const getTierBenefits = (tier: string) => {
      const isLifetime = tier.toLowerCase().includes('lifetime') || tier.toLowerCase().includes('premium');
      
      if (isLifetime) {
        return {
          title: 'Lifetime Membership',
          description: 'One payment, lifetime access to everything!',
          billingInfo: 'No recurring charges - you own this forever!',
          benefits: [
            '🚀 60 AI prompt generations per day',
            '💡 60 AI suggestions per day',
            '🤖 60 AI assistant interactions per day', 
            '📚 Access to ALL current & future prompt packs',
            '⭐ Complete premium prompt library',
            '🎯 Priority customer support',
            '🔄 All future updates & features included',
            '💎 Exclusive lifetime member badge',
            '🎁 Early access to new features'
          ]
        };
      } else {
        return {
          title: 'Monthly Membership',
          description: 'Flexible monthly subscription with premium features!',
          billingInfo: formattedEndDate ? `Next billing: ${formattedEndDate}` : 'Recurring monthly billing',
          benefits: [
            '🚀 30 AI prompt generations per day',
            '💡 30 AI suggestions per day', 
            '🤖 40 AI assistant interactions per day',
            '📚 Access to premium prompt packs',
            '⭐ Premium prompt library access',
            '📧 Monthly feature updates',
            '💬 Standard customer support',
            '🔄 Cancel anytime'
          ]
        };
      }
    };

    const tierInfo = getTierBenefits(subscriptionTier);

    // Send welcome email to new subscriber
    const subscriberEmailResponse = await resend.emails.send({
      from: "promptandgo <hello@promptandgo.ai>",
      to: [userEmail],
      subject: `🎉 Welcome to ${tierInfo.title}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <!-- Header with Logo -->
          <div style="text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 2px solid #f0f0f0;">
            <img src="${logoUrl}" alt="promptandgo" style="max-width: 200px; height: auto;" />
          </div>

          <!-- Main Welcome Message -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; margin-bottom: 30px; text-align: center;">
            <h1 style="margin: 0 0 15px 0; font-size: 28px;">
              🎉 Welcome to ${tierInfo.title}!
            </h1>
            <p style="font-size: 18px; line-height: 1.6; margin: 0 0 15px 0;">
              Hi ${userName || 'there'}! Your subscription is now active and ready to supercharge your AI prompting.
            </p>
            <p style="font-size: 16px; line-height: 1.5; margin: 0; opacity: 0.9;">
              ${tierInfo.description}
            </p>
          </div>

          <!-- What You Get -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px;">
              🎯 What You Get Access To
            </h2>
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px;">
              ${tierInfo.benefits.map(benefit => `
                <div style="margin: 12px 0; font-size: 16px; line-height: 1.5;">
                  ${benefit}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Subscription Details -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px;">
              📋 Subscription Details
            </h2>
            <div style="background: white; border: 2px solid #e9ecef; border-radius: 10px; padding: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #eee;">Plan:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${tierInfo.title}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${userEmail}</td>
                </tr>
                 <tr>
                   <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #eee;">Billing:</td>
                   <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${tierInfo.billingInfo}</td>
                 </tr>
              </table>
            </div>
          </div>

          <!-- Welcome Bonus -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
            <h2 style="color: white; margin: 0 0 15px 0;">
              🎁 Your Welcome Bonus!
            </h2>
            <p style="margin: 0 0 20px 0; font-size: 16px;">
              As a thank you for joining, here's a special coupon code for your next purchase:
            </p>
            <div style="background: white; color: #667eea; padding: 15px 25px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px; display: inline-block;">
              WELCOME04!
            </div>
            <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.9;">
              Use this code at checkout to get your free welcome Power Pack!
            </p>
          </div>

          <!-- Quick Start -->
          <div style="background: #e3f2fd; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #1976d2; margin: 0 0 15px 0;">
              🚀 Quick Start Guide
            </h2>
            <div style="color: #333;">
              <p style="margin: 10px 0;"><strong>1.</strong> Visit your <a href="https://promptandgo.ai/account" style="color: #1976d2;">account dashboard</a> to see your new limits</p>
              <p style="margin: 10px 0;"><strong>2.</strong> Try the <a href="https://promptandgo.ai/ai/generator" style="color: #1976d2;">AI Prompt Generator</a> with your enhanced daily limits</p>
              <p style="margin: 10px 0;"><strong>3.</strong> Explore <a href="https://promptandgo.ai/packs" style="color: #1976d2;">Premium Prompt Packs</a> now available to you</p>
              <p style="margin: 10px 0;"><strong>4.</strong> Use your <strong>WELCOME04!</strong> coupon code to get a free Power Pack</p>
              <p style="margin: 10px 0;"><strong>5.</strong> Use the <a href="https://promptandgo.ai/ai/assistant" style="color: #1976d2;">AI Assistant</a> for personalized help</p>
            </div>
          </div>

          <!-- Support -->
          <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Need Help Getting Started?</h3>
            <p style="margin: 0 0 15px 0; color: #666;">
              Our team is here to help you make the most of your subscription.
            </p>
            <a href="https://promptandgo.ai/contact" 
               style="display: inline-block; background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Contact Support
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px;">
            <p style="margin: 0 0 10px 0;">
              Thank you for choosing promptandgo!
            </p>
            <p style="margin: 0;">
              <a href="https://promptandgo.ai" style="color: #667eea; text-decoration: none;">promptandgo.ai</a> |
              <a href="https://promptandgo.ai/account/purchases" style="color: #667eea; text-decoration: none; margin-left: 10px;">Manage Subscription</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Subscriber welcome email sent:", subscriberEmailResponse);

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "promptandgo <hello@promptandgo.ai>",
      to: ["hello@promptandgo.ai"],
      subject: `🎉 New ${tierInfo.title} Subscriber: ${userName || userEmail}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 2px solid #f0f0f0;">
            <img src="${logoUrl}" alt="promptandgo" style="max-width: 200px; height: auto;" />
          </div>

          <!-- Main Content -->
          <div style="background: #d4edda; padding: 30px; border-radius: 10px; margin-bottom: 30px; border: 1px solid #c3e6cb;">
            <h1 style="color: #155724; margin: 0 0 20px 0; text-align: center;">
              🎉 New Subscriber Alert!
            </h1>
            <p style="font-size: 18px; line-height: 1.6; text-align: center; margin: 0; color: #155724;">
              Someone just subscribed to <strong>${tierInfo.title}</strong>!
            </p>
          </div>

          <!-- Subscriber Details -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
              👤 New Subscriber Details
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
                  <td style="padding: 8px 15px 8px 0; font-weight: bold;">Plan:</td>
                  <td style="padding: 8px 0;">${tierInfo.title}</td>
                </tr>
                 <tr>
                   <td style="padding: 8px 15px 8px 0; font-weight: bold;">Billing:</td>
                   <td style="padding: 8px 0;">${tierInfo.billingInfo}</td>
                 </tr>
                <tr>
                  <td style="padding: 8px 15px 8px 0; font-weight: bold;">Date:</td>
                  <td style="padding: 8px 0;">${new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Benefits Granted -->
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #ffeeba;">
            <h3 style="color: #856404; margin: 0 0 15px 0;">
              ✅ Access Automatically Granted
            </h3>
            <div style="color: #856404; line-height: 1.6;">
              ${tierInfo.benefits.map(benefit => `<div style="margin: 8px 0;">${benefit}</div>`).join('')}
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

    console.log("Admin notification email sent:", adminEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      subscriberEmailId: subscriberEmailResponse.data?.id,
      adminEmailId: adminEmailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-subscription-welcome function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send subscription welcome emails" 
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