import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  encryptionKey: string;
  action: 'encrypt_contacts' | 'encrypt_subscribers' | 'both';
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[SECURITY-MIGRATION] Starting security data migration process');
    
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const encryptionKey = Deno.env.get('SUBSCRIBERS_ENCRYPTION_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[SECURITY-MIGRATION] Missing required environment variables');
      throw new Error('Missing required Supabase configuration');
    }

    if (!encryptionKey) {
      console.error('[SECURITY-MIGRATION] Missing encryption key');
      throw new Error('Missing encryption key configuration');
    }

    // Get JWT from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[SECURITY-MIGRATION] No authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create authenticated Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify user authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('[SECURITY-MIGRATION] Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      console.error('[SECURITY-MIGRATION] Admin access required');
      return new Response(
        JSON.stringify({ error: 'Admin access required' }), 
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[SECURITY-MIGRATION] Admin user ${user.email} authenticated`);

    // Parse request body
    let body: RequestBody;
    try {
      body = await req.json();
    } catch (parseError) {
      // Default action if no body provided
      body = { encryptionKey, action: 'both' };
    }

    const results: any = {};

    // Run contact encryption migration
    if (body.action === 'encrypt_contacts' || body.action === 'both') {
      console.log('[SECURITY-MIGRATION] Running contact encryption migration');
      
      const { error: contactError } = await supabase.rpc('migrate_encrypt_contacts', {
        p_encryption_key: encryptionKey
      });

      if (contactError) {
        console.error('[SECURITY-MIGRATION] Contact encryption failed:', contactError.message);
        results.contacts = { success: false, error: contactError.message };
      } else {
        console.log('[SECURITY-MIGRATION] Contact encryption completed successfully');
        results.contacts = { success: true, message: 'Contact data encrypted successfully' };
      }
    }

    // Run subscriber encryption migration  
    if (body.action === 'encrypt_subscribers' || body.action === 'both') {
      console.log('[SECURITY-MIGRATION] Running subscriber encryption migration');
      
      const { error: subscriberError } = await supabase.rpc('migrate_encrypt_subscribers', {
        p_encryption_key: encryptionKey
      });

      if (subscriberError) {
        console.error('[SECURITY-MIGRATION] Subscriber encryption failed:', subscriberError.message);
        results.subscribers = { success: false, error: subscriberError.message };
      } else {
        console.log('[SECURITY-MIGRATION] Subscriber encryption completed successfully');
        results.subscribers = { success: true, message: 'Subscriber data encrypted successfully' };
      }
    }

    // Log the security action
    await supabase.rpc('log_data_access', {
      p_action: 'SECURITY_MIGRATION_EXECUTED',
      p_table_name: 'subscribers,pending_contacts',
      p_record_id: null,
      p_ip_address: null,
      p_user_agent: req.headers.get('User-Agent')
    });

    console.log('[SECURITY-MIGRATION] Migration completed successfully:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Security data migration completed',
        results
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[SECURITY-MIGRATION] Migration failed:', (error as Error).message);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message || 'Security migration failed'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});