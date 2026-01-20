import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const encryptionKey = Deno.env.get("SUBSCRIBERS_ENCRYPTION_KEY");

    if (!encryptionKey) {
      throw new Error("SUBSCRIBERS_ENCRYPTION_KEY not configured");
    }

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the user is an admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY")!
    ).auth.getUser(token);

    if (authError || !user) {
      throw new Error("Authentication failed");
    }

    // Check admin role
    const { data: roleData, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      throw new Error("Admin access required");
    }

    // Get all subscribers with decrypted data using the database function
    const { data: subscribers, error: queryError } = await supabaseClient.rpc(
      "get_subscribers_admin_view"
    );

    if (queryError) {
      throw queryError;
    }

    // Decrypt emails for each subscriber
    const decryptedSubscribers = [];
    for (const sub of subscribers || []) {
      if (sub.user_id) {
        const { data: decrypted, error: decryptError } = await supabaseClient.rpc(
          "get_subscriber_encrypted_data",
          { p_user_id: sub.user_id, p_encryption_key: encryptionKey }
        );

        if (!decryptError && decrypted && decrypted.length > 0) {
          decryptedSubscribers.push({
            ...sub,
            email: decrypted[0].email,
            stripe_customer_id: decrypted[0].stripe_customer_id,
          });
        } else {
          decryptedSubscribers.push({
            ...sub,
            email: "[decryption_failed]",
            stripe_customer_id: null,
          });
        }
      }
    }

    // Log the access
    await supabaseClient.rpc("log_data_access", {
      p_action: "ADMIN_DECRYPT_ALL_SUBSCRIBERS",
      p_table_name: "subscribers",
    });

    console.log(`Admin ${user.email} decrypted ${decryptedSubscribers.length} subscriber records`);

    return new Response(JSON.stringify({ subscribers: decryptedSubscribers }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
