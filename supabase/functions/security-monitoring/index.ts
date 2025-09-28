import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data:; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

interface SecurityMonitoringRequest {
  action: 'detect_admin_access' | 'check_api_rotation' | 'log_security_event';
  eventType?: string;
  severity?: string;
  description?: string;
  metadata?: Record<string, any>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Verify JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: corsHeaders }
      );
    }

    // Parse request body
    const body: SecurityMonitoringRequest = await req.json();

    switch (body.action) {
      case 'detect_admin_access': {
        const { data, error } = await supabase.rpc('detect_unusual_admin_access');
        
        if (error) {
          console.error('Error detecting admin access:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to detect admin access patterns' }),
            { status: 500, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: data || [],
            timestamp: new Date().toISOString()
          }),
          { status: 200, headers: corsHeaders }
        );
      }

      case 'check_api_rotation': {
        const { data, error } = await supabase.rpc('check_api_key_rotation_status');
        
        if (error) {
          console.error('Error checking API rotation:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to check API key rotation status' }),
            { status: 500, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: data || [],
            timestamp: new Date().toISOString()
          }),
          { status: 200, headers: corsHeaders }
        );
      }

      case 'log_security_event': {
        const { eventType, severity = 'INFO', description, metadata } = body;
        
        if (!eventType) {
          return new Response(
            JSON.stringify({ error: 'Event type is required' }),
            { status: 400, headers: corsHeaders }
          );
        }

        const { error } = await supabase.rpc('log_security_event', {
          p_event_type: eventType,
          p_severity: severity,
          p_description: description || null,
          p_metadata: metadata ? JSON.stringify(metadata) : null
        });

        if (error) {
          console.error('Error logging security event:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to log security event' }),
            { status: 500, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Security event logged successfully',
            timestamp: new Date().toISOString()
          }),
          { status: 200, headers: corsHeaders }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action specified' }),
          { status: 400, headers: corsHeaders }
        );
    }

  } catch (error) {
    console.error('Security monitoring error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});