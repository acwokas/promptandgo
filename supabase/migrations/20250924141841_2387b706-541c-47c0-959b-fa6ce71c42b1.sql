-- SECURITY FIX: Address remaining security linter warnings
-- This migration fixes the remaining security warnings from the linter

-- 1. Move pgcrypto extension to a dedicated schema (fix extension in public warning)
-- First check if extensions schema exists, if not create it
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pgcrypto to extensions schema if it exists in public
DO $$
BEGIN
  -- Check if pgcrypto exists in public schema
  IF EXISTS (
    SELECT 1 FROM pg_extension 
    WHERE extname = 'pgcrypto' 
    AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    -- Move it to extensions schema
    ALTER EXTENSION pgcrypto SET SCHEMA extensions;
  ELSE
    -- Create it in extensions schema
    CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
  END IF;
END $$;

-- 2. Update all functions to use qualified pgcrypto function calls
-- Update secure_upsert_subscriber function
CREATE OR REPLACE FUNCTION public.secure_upsert_subscriber(p_key text, p_user_id uuid, p_email text, p_stripe_customer_id text, p_subscribed boolean, p_subscription_tier text, p_subscription_end timestamp with time zone)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.subscribers (
    user_id,
    email,
    stripe_customer_id,
    subscribed,
    subscription_tier,
    subscription_end,
    updated_at,
    email_enc,
    stripe_customer_id_enc,
    email_hash
  ) VALUES (
    p_user_id,
    '[encrypted]',
    NULL,
    p_subscribed,
    p_subscription_tier,
    p_subscription_end,
    now(),
    extensions.pgp_sym_encrypt(coalesce(p_email, ''), p_key),
    CASE WHEN p_stripe_customer_id IS NULL THEN NULL ELSE extensions.pgp_sym_encrypt(p_stripe_customer_id, p_key) END,
    CASE WHEN p_email IS NULL THEN NULL ELSE encode(extensions.digest(p_email, 'sha256'), 'hex') END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    subscribed = EXCLUDED.subscribed,
    subscription_tier = EXCLUDED.subscription_tier,
    subscription_end = EXCLUDED.subscription_end,
    updated_at = now(),
    email_enc = EXCLUDED.email_enc,
    stripe_customer_id_enc = EXCLUDED.stripe_customer_id_enc,
    email_hash = EXCLUDED.email_hash;
END;
$function$;

-- Update secure_insert_contact function
CREATE OR REPLACE FUNCTION public.secure_insert_contact(p_key text, p_name text, p_email text, p_message text, p_newsletter_opt_in boolean DEFAULT false)
RETURNS uuid
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_id uuid;
  confirmation_token text;
BEGIN
  -- Generate confirmation token
  confirmation_token := encode(extensions.gen_random_bytes(32), 'hex');
  new_id := extensions.gen_random_uuid();
  
  INSERT INTO public.pending_contacts (
    id,
    name,
    email,
    message,
    newsletter_opt_in,
    confirmation_token,
    confirmed,
    processed,
    created_at,
    updated_at,
    name_enc,
    email_enc,
    message_enc,
    email_hash
  ) VALUES (
    new_id,
    '[encrypted]',
    '[encrypted]',
    '[encrypted]',
    p_newsletter_opt_in,
    confirmation_token,
    false,
    false,
    now(),
    now(),
    extensions.pgp_sym_encrypt(p_name, p_key),
    extensions.pgp_sym_encrypt(p_email, p_key),
    extensions.pgp_sym_encrypt(p_message, p_key),
    encode(extensions.digest(p_email, 'sha256'), 'hex')
  );
  
  RETURN new_id;
END;
$function$;

-- Update migrate_encrypt_contacts function
CREATE OR REPLACE FUNCTION public.migrate_encrypt_contacts(p_encryption_key text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow admin users to run this migration
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required for data migration';
  END IF;
  
  -- Encrypt existing plaintext contact data
  UPDATE public.pending_contacts 
  SET 
    name_enc = extensions.pgp_sym_encrypt(name, p_encryption_key),
    email_enc = extensions.pgp_sym_encrypt(email, p_encryption_key),
    message_enc = extensions.pgp_sym_encrypt(message, p_encryption_key),
    email_hash = encode(extensions.digest(email, 'sha256'), 'hex'),
    name = '[encrypted]',
    email = '[encrypted]',
    message = '[encrypted]',
    updated_at = now()
  WHERE 
    name != '[encrypted]' 
    OR email != '[encrypted]' 
    OR message != '[encrypted]'
    OR name_enc IS NULL 
    OR email_enc IS NULL 
    OR message_enc IS NULL;
    
  RAISE NOTICE 'Contact data encryption migration completed';
END;
$function$;

-- Update migrate_encrypt_subscribers function
CREATE OR REPLACE FUNCTION public.migrate_encrypt_subscribers(p_encryption_key text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow admin users to run this migration
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required for data migration';
  END IF;
  
  -- Encrypt any remaining plaintext subscriber data
  UPDATE public.subscribers 
  SET 
    email_enc = CASE 
      WHEN email IS NOT NULL AND email != '[encrypted]' AND email != '' THEN extensions.pgp_sym_encrypt(email, p_encryption_key)
      ELSE email_enc 
    END,
    stripe_customer_id_enc = CASE 
      WHEN stripe_customer_id IS NOT NULL AND stripe_customer_id != '' THEN extensions.pgp_sym_encrypt(stripe_customer_id, p_encryption_key)
      ELSE stripe_customer_id_enc 
    END,
    email_hash = CASE 
      WHEN email IS NOT NULL AND email != '[encrypted]' AND email != '' THEN encode(extensions.digest(email, 'sha256'), 'hex')
      ELSE email_hash 
    END,
    email = '[encrypted]',
    stripe_customer_id = NULL,
    updated_at = now()
  WHERE 
    (email IS NOT NULL AND email != '[encrypted]' AND email != '') 
    OR (stripe_customer_id IS NOT NULL AND stripe_customer_id != '')
    OR email_enc IS NULL;
    
  RAISE NOTICE 'Subscriber data encryption migration completed';
END;
$function$;

-- Update admin data access functions
CREATE OR REPLACE FUNCTION public.get_admin_subscriber_data(p_user_id uuid, p_encryption_key text)
RETURNS TABLE(
  id uuid, 
  user_id uuid, 
  email text, 
  stripe_customer_id text, 
  subscribed boolean, 
  subscription_tier text, 
  subscription_end timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- SECURITY: Only allow admin access with proper authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  -- Log the data access
  PERFORM public.log_data_access('ADMIN_DECRYPT_SUBSCRIBER', 'subscribers', p_user_id);
  
  -- Return decrypted data only for admins
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    CASE 
      WHEN s.email_enc IS NOT NULL THEN 
        COALESCE(extensions.pgp_sym_decrypt(s.email_enc, p_encryption_key), '[decryption_failed]')
      ELSE '[no_email]'
    END as email,
    CASE 
      WHEN s.stripe_customer_id_enc IS NOT NULL THEN 
        COALESCE(extensions.pgp_sym_decrypt(s.stripe_customer_id_enc, p_encryption_key), '[decryption_failed]')
      ELSE NULL
    END as stripe_customer_id,
    s.subscribed,
    s.subscription_tier,
    s.subscription_end
  FROM public.subscribers s
  WHERE s.user_id = p_user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_admin_contact_data(p_contact_id uuid, p_encryption_key text)
RETURNS TABLE(
  id uuid, 
  name text, 
  email text, 
  message text, 
  newsletter_opt_in boolean, 
  confirmed boolean, 
  processed boolean, 
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- SECURITY: Only allow admin access with proper authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  -- Log the data access
  PERFORM public.log_data_access('ADMIN_DECRYPT_CONTACT', 'pending_contacts', p_contact_id);
  
  -- Return decrypted data only for admins
  RETURN QUERY
  SELECT 
    pc.id,
    CASE 
      WHEN pc.name_enc IS NOT NULL THEN 
        COALESCE(extensions.pgp_sym_decrypt(pc.name_enc, p_encryption_key), '[decryption_failed]')
      ELSE '[no_name]'
    END as name,
    CASE 
      WHEN pc.email_enc IS NOT NULL THEN 
        COALESCE(extensions.pgp_sym_decrypt(pc.email_enc, p_encryption_key), '[decryption_failed]')
      ELSE '[no_email]'
    END as email,
    CASE 
      WHEN pc.message_enc IS NOT NULL THEN 
        COALESCE(extensions.pgp_sym_decrypt(pc.message_enc, p_encryption_key), '[decryption_failed]')
      ELSE '[no_message]'
    END as message,
    pc.newsletter_opt_in,
    pc.confirmed,
    pc.processed,
    pc.created_at
  FROM public.pending_contacts pc
  WHERE pc.id = p_contact_id;
END;
$function$;

-- 3. Add security definer view warning mitigation
-- The security definer view warning is about safe_subscriber_view
-- Let's replace it with a more secure function-based approach
DROP VIEW IF EXISTS public.safe_subscriber_view;

-- Create a secure function instead of a security definer view
CREATE OR REPLACE FUNCTION public.get_safe_subscriber_view(p_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(
  id uuid,
  user_id uuid,
  subscribed boolean,
  subscription_tier text,
  subscription_end timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  email_hash text,
  has_encrypted_email boolean
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    s.id,
    s.user_id,
    s.subscribed,
    s.subscription_tier,
    s.subscription_end,
    s.created_at,
    s.updated_at,
    s.email_hash,
    (s.email_enc IS NOT NULL) as has_encrypted_email
  FROM public.subscribers s
  WHERE s.user_id = COALESCE(p_user_id, auth.uid())
    AND (
      -- Users can see their own data
      s.user_id = auth.uid()
      -- Or admins can see all data
      OR public.has_role(auth.uid(), 'admin'::app_role)
    );
$function$;

-- Update get_user_subscription_status to use the new function
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(p_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(subscribed boolean, subscription_tier text, subscription_end timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    COALESCE(s.subscribed, false) as subscribed,
    s.subscription_tier,
    s.subscription_end
  FROM public.get_safe_subscriber_view(COALESCE(p_user_id, auth.uid())) s
  UNION ALL
  SELECT false, null::text, null::timestamp with time zone
  WHERE NOT EXISTS (
    SELECT 1 FROM public.get_safe_subscriber_view(COALESCE(p_user_id, auth.uid()))
  )
  LIMIT 1;
$function$;

-- 4. Create enhanced security monitoring triggers
-- Add trigger to log sensitive table access
CREATE OR REPLACE FUNCTION public.audit_sensitive_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Log access to sensitive tables
  IF TG_OP = 'SELECT' THEN
    -- For SELECT operations, log the query
    INSERT INTO public.security_audit_log (
      user_id,
      action,
      table_name,
      record_id,
      created_at
    ) VALUES (
      auth.uid(),
      'SELECT_SENSITIVE_DATA',
      TG_TABLE_NAME,
      NULL,
      now()
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Note: We cannot add SELECT triggers in PostgreSQL, so we rely on function-based access logging
-- instead. The get_admin_* functions already include proper logging.

-- 5. Add rate limiting for admin functions
CREATE TABLE IF NOT EXISTS public.admin_rate_limits (
  id uuid NOT NULL DEFAULT extensions.gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  action text NOT NULL,
  count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, action, window_start)
);

-- Enable RLS on rate limits
ALTER TABLE public.admin_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only admins can view their own rate limits
CREATE POLICY "admins_view_own_rate_limits" 
ON public.admin_rate_limits 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id AND 
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Service role can manage rate limits
CREATE POLICY "service_manage_admin_rate_limits" 
ON public.admin_rate_limits 
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add rate limiting function
CREATE OR REPLACE FUNCTION public.check_admin_rate_limit(p_action text, p_limit integer DEFAULT 10, p_window_minutes integer DEFAULT 60)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_count integer := 0;
  window_start timestamp with time zone;
BEGIN
  -- Calculate window start time
  window_start := date_trunc('minute', now()) - (extract(minute from now())::int % p_window_minutes) * interval '1 minute';
  
  -- Get current count in window
  SELECT COALESCE(count, 0) INTO current_count
  FROM public.admin_rate_limits
  WHERE user_id = auth.uid()
    AND action = p_action
    AND window_start = window_start;
  
  -- If count exceeds limit, return false
  IF current_count >= p_limit THEN
    RETURN false;
  END IF;
  
  -- Increment counter
  INSERT INTO public.admin_rate_limits (user_id, action, count, window_start)
  VALUES (auth.uid(), p_action, 1, window_start)
  ON CONFLICT (user_id, action, window_start)
  DO UPDATE SET count = admin_rate_limits.count + 1;
  
  RETURN true;
END;
$function$;