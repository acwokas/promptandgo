import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting featured categories rotation...');

    // Get Supabase credentials from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    console.log('Calling rotate_featured_categories function...');

    // Call the rotation function
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/rotate_featured_categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error rotating categories:', errorText);
      throw new Error(`Failed to rotate categories: ${response.status} ${errorText}`);
    }

    console.log('Featured categories rotated successfully');

    // Get the current active categories to log them
    const categoriesResponse = await fetch(`${supabaseUrl}/rest/v1/featured_categories?is_active=eq.true&order=display_order.asc`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
      },
    });

    if (categoriesResponse.ok) {
      const activeCategories = await categoriesResponse.json();
      console.log('Active categories after rotation:', activeCategories.map((cat: any) => ({
        title: cat.title,
        usage: cat.usage_text
      })));
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Featured categories rotated successfully',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in rotate-featured-categories function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});