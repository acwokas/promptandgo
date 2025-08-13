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
    const { original_url, content_type, content_id, title, shared_by } = await req.json();

    if (!original_url || !content_type || !content_id) {
      return new Response('Missing required fields', { status: 400, headers: corsHeaders });
    }

    // Check if a share link already exists for this content
    const { data: existing } = await supabase
      .from('shared_links')
      .select('short_code')
      .eq('content_type', content_type)
      .eq('content_id', content_id)
      .eq('shared_by', shared_by || null)
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
        title: title || null,
        shared_by: shared_by || null
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