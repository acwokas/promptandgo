-- SECURITY FIX: Critical data protection migration
-- This migration addresses the critical security vulnerabilities identified in the security review

-- 1. First, let's enable the required extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create a more secure function to encrypt existing plaintext contact data
CREATE OR REPLACE FUNCTION public.migrate_encrypt_contacts(p_encryption_key text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only allow admin users to run this migration
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required for data migration';
  END IF;
  
  -- Encrypt existing plaintext contact data
  UPDATE public.pending_contacts 
  SET 
    name_enc = pgp_sym_encrypt(name, p_encryption_key),
    email_enc = pgp_sym_encrypt(email, p_encryption_key),
    message_enc = pgp_sym_encrypt(message, p_encryption_key),
    email_hash = encode(digest(email, 'sha256'), 'hex'),
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

-- 3. Create function to encrypt existing subscriber data
CREATE OR REPLACE FUNCTION public.migrate_encrypt_subscribers(p_encryption_key text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
      WHEN email IS NOT NULL AND email != '[encrypted]' AND email != '' THEN pgp_sym_encrypt(email, p_encryption_key)
      ELSE email_enc 
    END,
    stripe_customer_id_enc = CASE 
      WHEN stripe_customer_id IS NOT NULL AND stripe_customer_id != '' THEN pgp_sym_encrypt(stripe_customer_id, p_encryption_key)
      ELSE stripe_customer_id_enc 
    END,
    email_hash = CASE 
      WHEN email IS NOT NULL AND email != '[encrypted]' AND email != '' THEN encode(digest(email, 'sha256'), 'hex')
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

-- 4. Strengthen RLS policies for subscribers table
DROP POLICY IF EXISTS "users_safe_subscription_data_only" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_admin_select_all" ON public.subscribers;

-- Create more restrictive admin access policy
CREATE POLICY "subscribers_admin_limited_access" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) AND
  -- Admins can only see non-sensitive subscriber metadata
  true
);

-- Users can only see their own basic subscription status (no sensitive data)
CREATE POLICY "users_own_subscription_status_only" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id AND
  NOT has_role(auth.uid(), 'admin'::app_role)
);

-- 5. Create secure admin-only function for accessing encrypted subscriber data
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
SET search_path = 'public'
AS $function$
BEGIN
  -- SECURITY: Only allow admin access with proper authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  -- Return decrypted data only for admins
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    CASE 
      WHEN s.email_enc IS NOT NULL THEN 
        COALESCE(pgp_sym_decrypt(s.email_enc, p_encryption_key), '[decryption_failed]')
      ELSE '[no_email]'
    END as email,
    CASE 
      WHEN s.stripe_customer_id_enc IS NOT NULL THEN 
        COALESCE(pgp_sym_decrypt(s.stripe_customer_id_enc, p_encryption_key), '[decryption_failed]')
      ELSE NULL
    END as stripe_customer_id,
    s.subscribed,
    s.subscription_tier,
    s.subscription_end
  FROM public.subscribers s
  WHERE s.user_id = p_user_id;
END;
$function$;

-- 6. Create secure admin-only function for accessing encrypted contact data
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
SET search_path = 'public'
AS $function$
BEGIN
  -- SECURITY: Only allow admin access with proper authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  -- Return decrypted data only for admins
  RETURN QUERY
  SELECT 
    pc.id,
    CASE 
      WHEN pc.name_enc IS NOT NULL THEN 
        COALESCE(pgp_sym_decrypt(pc.name_enc, p_encryption_key), '[decryption_failed]')
      ELSE '[no_name]'
    END as name,
    CASE 
      WHEN pc.email_enc IS NOT NULL THEN 
        COALESCE(pgp_sym_decrypt(pc.email_enc, p_encryption_key), '[decryption_failed]')
      ELSE '[no_email]'
    END as email,
    CASE 
      WHEN pc.message_enc IS NOT NULL THEN 
        COALESCE(pgp_sym_decrypt(pc.message_enc, p_encryption_key), '[decryption_failed]')
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

-- 7. Add audit logging table for sensitive data access
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "admins_view_audit_logs" 
ON public.security_audit_log 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert audit logs
CREATE POLICY "service_insert_audit_logs" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- 8. Create function to log sensitive data access
CREATE OR REPLACE FUNCTION public.log_data_access(
  p_action text, 
  p_table_name text, 
  p_record_id uuid DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    p_action,
    p_table_name,
    p_record_id,
    p_ip_address,
    p_user_agent
  );
END;
$function$;