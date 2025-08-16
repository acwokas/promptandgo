import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Generate a random short code
function generateShortCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    // Create Supabase client with the user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const { original_url, content_type, content_id, title } = await req.json();

    if (!original_url || !content_type || !content_id) {
      return new Response('Missing required fields', { status: 400, headers: corsHeaders });
    }

    // Validate URL format
    try {
      new URL(original_url);
    } catch {
      return new Response('Invalid URL format', { status: 400, headers: corsHeaders });
    }

    // Validate content type
    const validContentTypes = ['prompt', 'pack', 'blog'];
    if (!validContentTypes.includes(content_type)) {
      return new Response('Invalid content type', { status: 400, headers: corsHeaders });
    }

    // Prevent creating too many links per user
    const { count } = await supabase
      .from('shared_links')
      .select('*', { count: 'exact', head: true })
      .eq('shared_by', user.id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

    if (count && count > 50) {
      return new Response('Rate limit exceeded', { status: 429, headers: corsHeaders });
    }

    // Check if a share link already exists for this content
    const { data: existing } = await supabase
      .from('shared_links')
      .select('short_code')
      .eq('content_type', content_type)
      .eq('content_id', content_id)
      .eq('shared_by', user.id)
      .single();

    if (existing) {
      // Return existing short link
      return new Response(JSON.stringify({
        short_code: existing.short_code,
        short_url: `https://promptandgo.ai/s/${existing.short_code}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate unique short code
    let shortCode = generateShortCode();
    let attempts = 0;
    
    while (attempts < 10) {
      const { data } = await supabase
        .from('shared_links')
        .select('short_code')
        .eq('short_code', shortCode)
        .single();

      if (!data) break; // Code is unique
      
      shortCode = generateShortCode();
      attempts++;
    }

    if (attempts >= 10) {
      throw new Error('Failed to generate unique short code');
    }

    // Create the shared link
    const { data, error } = await supabase
      .from('shared_links')
      .insert({
        short_code: shortCode,
        original_url,
        content_type,
        content_id,
        title: title ? title.substring(0, 255) : null, // Limit title length
        shared_by: user.id
      })
      .select('short_code')
      .single();

    if (error) throw error;

    const shortUrl = `https://promptandgo.ai/s/${shortCode}`;

    return new Response(JSON.stringify({
      short_code: shortCode,
      short_url: shortUrl
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Create share link error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});