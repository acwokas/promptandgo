import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { userId, activityKey, description, metadata } = await req.json();

    if (!userId || !activityKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId, activityKey' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Awarding XP to user ${userId} for activity: ${activityKey}`);

    // Call the award_xp database function
    const { data, error } = await supabaseClient.rpc('award_xp', {
      p_user_id: userId,
      p_activity_key: activityKey,
      p_description: description || null,
      p_metadata: metadata || null
    });

    if (error) {
      console.error('Error awarding XP:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const result = data && data.length > 0 ? data[0] : { success: false, new_total_xp: 0, xp_awarded: 0 };

    console.log(`XP award result:`, result);

    return new Response(
      JSON.stringify({
        success: result.success,
        newTotalXp: result.new_total_xp,
        xpAwarded: result.xp_awarded,
        message: result.success
          ? `Successfully awarded ${result.xp_awarded} XP!`
          : 'XP not awarded - activity already completed or not available'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error in award-xp function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
