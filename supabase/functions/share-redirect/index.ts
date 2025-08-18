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

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const shortCode = url.pathname.split('/').pop();

    if (!shortCode) {
      return new Response('Missing short code', { status: 400 });
    }

    // Get the shared link
    const { data: sharedLink, error } = await supabase
      .from('shared_links')
      .select('original_url, title, content_type')
      .eq('short_code', shortCode)
      .single();

    if (error || !sharedLink) {
      console.error('Shared link not found:', error);
      // Get the referrer domain or fallback to promptandgo.ai
      const referer = req.headers.get('referer');
      let redirectUrl = 'https://promptandgo.ai';
      
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          if (refererUrl.hostname.endsWith('.lovableproject.com')) {
            redirectUrl = `${refererUrl.protocol}//${refererUrl.hostname}`;
          }
        } catch {
          // Use default if referer parsing fails
        }
      }
      
      return new Response(null, {
        status: 302,
        headers: { 'Location': redirectUrl }
      });
    }

    // Increment click count (fire and forget)
    supabase.rpc('increment_link_clicks', { link_code: shortCode })
      .catch(e => console.error('Failed to increment clicks:', e));

    // Redirect to original URL
    return new Response(null, {
      status: 302,
      headers: { 'Location': sharedLink.original_url }
    });

  } catch (error) {
    console.error('Share redirect error:', error);
    // Get the referrer domain or fallback to promptandgo.ai
    const referer = req.headers.get('referer');
    let redirectUrl = 'https://promptandgo.ai';
    
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        if (refererUrl.hostname.endsWith('.lovableproject.com')) {
          redirectUrl = `${refererUrl.protocol}//${refererUrl.hostname}`;
        }
      } catch {
        // Use default if referer parsing fails
      }
    }
    
    return new Response(null, {
      status: 302,
      headers: { 'Location': redirectUrl }
    });
  }
});