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

// Input validation
function validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Only allow https and specific domains
      return urlObj.protocol === 'https:' && (
             urlObj.hostname === 'promptandgo.ai' || 
             urlObj.hostname.endsWith('.promptandgo.ai') ||
             urlObj.hostname.endsWith('.lovableproject.com') ||
             urlObj.hostname.endsWith('.lovable.dev')
           );
  } catch {
    return false;
  }
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '').substring(0, 255);
}

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
    // Get authentication header (optional for anonymous sharing)
    const authHeader = req.headers.get('Authorization');
    let user = null;

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      authHeader ? { global: { headers: { Authorization: authHeader } } } : {}
    );

    // Get the current user if authenticated
    if (authHeader) {
      const { data: { user: authUser }, error: userError } = await supabaseClient.auth.getUser();
      if (!userError && authUser) {
        user = authUser;
      }
    }

    const { original_url, content_type, content_id, title } = await req.json();

    // Validate inputs
    if (!original_url || !content_type || !content_id) {
      return new Response('Missing required fields', { status: 400, headers: corsHeaders });
    }

    // Validate URL for security
    if (!validateUrl(original_url)) {
      return new Response('Invalid URL - only HTTPS URLs from promptandgo.ai or lovableproject.com domains are allowed', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Validate content type
    const validContentTypes = ['prompt', 'pack', 'blog'];
    if (!validContentTypes.includes(content_type)) {
      return new Response('Invalid content type', { status: 400, headers: corsHeaders });
    }

    // Sanitize inputs
    const sanitizedTitle = title ? sanitizeInput(title) : null;
    const sanitizedContentType = sanitizeInput(content_type);
    const sanitizedContentId = sanitizeInput(content_id);

    // Rate limiting: prevent creating too many links per user (only for authenticated users)
    if (user?.id) {
      const { count } = await supabaseClient
        .from('shared_links')
        .select('*', { count: 'exact', head: true })
        .eq('shared_by', user.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (count && count > 50) {
        return new Response('Rate limit exceeded', { status: 429, headers: corsHeaders });
      }
    }

    // Check if a share link already exists for this content (only for authenticated users)
    let existing = null;
    if (user?.id) {
      const { data } = await supabaseClient
        .from('shared_links')
        .select('short_code')
        .eq('content_type', sanitizedContentType)
        .eq('content_id', sanitizedContentId)
        .eq('shared_by', user.id)
        .single();
      existing = data;
    }

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
    const { data, error } = await supabaseClient
      .from('shared_links')
      .insert({
        short_code: shortCode,
        original_url,
        content_type: sanitizedContentType,
        content_id: sanitizedContentId,
        title: sanitizedTitle,
        shared_by: user?.id || null
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