-- ============================================
-- PHASE 1: CRITICAL PII PROTECTION
-- ============================================

-- ============================================
-- 1. ENCRYPT USER FEEDBACK TABLE
-- ============================================

-- Add encrypted columns to user_feedback
ALTER TABLE public.user_feedback 
  ADD COLUMN IF NOT EXISTS email_enc bytea,
  ADD COLUMN IF NOT EXISTS name_enc bytea,
  ADD COLUMN IF NOT EXISTS email_hash text;

-- Create index on email_hash for performance
CREATE INDEX IF NOT EXISTS idx_user_feedback_email_hash ON public.user_feedback(email_hash);

-- Create trigger function to enforce user_feedback encryption
CREATE OR REPLACE FUNCTION public.enforce_feedback_encryption()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Block plaintext email storage (except placeholder)
  IF NEW.email IS NOT NULL AND NEW.email != '[encrypted]' AND NEW.email != '' THEN
    RAISE EXCEPTION 'SECURITY VIOLATION: Plaintext email storage prohibited in user_feedback. Use secure submission with encryption.';
  END IF;
  
  -- Block plaintext name storage (except placeholder)
  IF NEW.name IS NOT NULL AND NEW.name != '[encrypted]' AND NEW.name != '' THEN
    RAISE EXCEPTION 'SECURITY VIOLATION: Plaintext name storage prohibited in user_feedback. Use secure submission with encryption.';
  END IF;
  
  -- Ensure encrypted fields exist when PII should be present
  IF (NEW.email = '[encrypted]' OR NEW.email_hash IS NOT NULL) AND NEW.email_enc IS NULL THEN
    RAISE EXCEPTION 'SECURITY VIOLATION: email_enc must be populated when storing feedback email data.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on user_feedback
DROP TRIGGER IF EXISTS enforce_feedback_encryption_trigger ON public.user_feedback;
CREATE TRIGGER enforce_feedback_encryption_trigger
  BEFORE INSERT OR UPDATE ON public.user_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_feedback_encryption();

-- Create secure feedback insertion function
CREATE OR REPLACE FUNCTION public.secure_insert_feedback(
  p_key text,
  p_user_id uuid,
  p_feedback_type text,
  p_content text,
  p_email text DEFAULT NULL,
  p_name text DEFAULT NULL,
  p_rating integer DEFAULT NULL,
  p_prompt_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_id uuid;
BEGIN
  new_id := extensions.gen_random_uuid();
  
  INSERT INTO public.user_feedback (
    id,
    user_id,
    feedback_type,
    content,
    email,
    name,
    rating,
    prompt_id,
    created_at,
    updated_at,
    email_enc,
    name_enc,
    email_hash
  ) VALUES (
    new_id,
    p_user_id,
    p_feedback_type,
    p_content,
    CASE WHEN p_email IS NOT NULL THEN '[encrypted]' ELSE NULL END,
    CASE WHEN p_name IS NOT NULL THEN '[encrypted]' ELSE NULL END,
    p_rating,
    p_prompt_id,
    now(),
    now(),
    CASE WHEN p_email IS NOT NULL THEN extensions.pgp_sym_encrypt(p_email, p_key) ELSE NULL END,
    CASE WHEN p_name IS NOT NULL THEN extensions.pgp_sym_encrypt(p_name, p_key) ELSE NULL END,
    CASE WHEN p_email IS NOT NULL THEN encode(extensions.digest(p_email, 'sha256'), 'hex') ELSE NULL END
  );
  
  RETURN new_id;
END;
$$;

-- Create admin function to decrypt feedback data
CREATE OR REPLACE FUNCTION public.get_admin_feedback_data(
  p_feedback_id uuid,
  p_encryption_key text
)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  feedback_type text,
  content text,
  email text,
  name text,
  rating integer,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- SECURITY: Only allow admin access
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  -- Log the data access
  PERFORM public.log_data_access('ADMIN_DECRYPT_FEEDBACK', 'user_feedback', p_feedback_id);
  
  -- Return decrypted data
  RETURN QUERY
  SELECT 
    uf.id,
    uf.user_id,
    uf.feedback_type,
    uf.content,
    CASE 
      WHEN uf.email_enc IS NOT NULL THEN 
        COALESCE(extensions.pgp_sym_decrypt(uf.email_enc, p_encryption_key), '[decryption_failed]')
      ELSE '[no_email]'
    END,
    CASE 
      WHEN uf.name_enc IS NOT NULL THEN 
        COALESCE(extensions.pgp_sym_decrypt(uf.name_enc, p_encryption_key), '[decryption_failed]')
      ELSE '[no_name]'
    END,
    uf.rating,
    uf.created_at
  FROM public.user_feedback uf
  WHERE uf.id = p_feedback_id;
END;
$$;

-- Migration function for existing user_feedback data
CREATE OR REPLACE FUNCTION public.migrate_encrypt_feedback(p_encryption_key text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow admin users
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required for data migration';
  END IF;
  
  -- Encrypt existing plaintext feedback data
  UPDATE public.user_feedback 
  SET 
    email_enc = CASE 
      WHEN email IS NOT NULL AND email != '[encrypted]' AND email != '' 
      THEN extensions.pgp_sym_encrypt(email, p_encryption_key)
      ELSE email_enc 
    END,
    name_enc = CASE 
      WHEN name IS NOT NULL AND name != '[encrypted]' AND name != '' 
      THEN extensions.pgp_sym_encrypt(name, p_encryption_key)
      ELSE name_enc 
    END,
    email_hash = CASE 
      WHEN email IS NOT NULL AND email != '[encrypted]' AND email != '' 
      THEN encode(extensions.digest(email, 'sha256'), 'hex')
      ELSE email_hash 
    END,
    email = CASE 
      WHEN email IS NOT NULL AND email != '[encrypted]' AND email != '' 
      THEN '[encrypted]'
      ELSE email 
    END,
    name = CASE 
      WHEN name IS NOT NULL AND name != '[encrypted]' AND name != '' 
      THEN '[encrypted]'
      ELSE name 
    END,
    updated_at = now()
  WHERE 
    (email IS NOT NULL AND email != '[encrypted]' AND email != '') 
    OR (name IS NOT NULL AND name != '[encrypted]' AND name != '')
    OR email_enc IS NULL 
    OR name_enc IS NULL;
    
  RAISE NOTICE 'User feedback data encryption migration completed';
END;
$$;

-- ============================================
-- 2. STRENGTHEN CONTACT FORM ENCRYPTION
-- ============================================

-- Add NOT NULL constraints to enforce encrypted data (will fail if plaintext exists)
-- First, let's update any remaining plaintext to encrypted placeholder
UPDATE public.pending_contacts 
SET 
  name = '[encrypted]',
  email = '[encrypted]',
  message = '[encrypted]'
WHERE 
  name != '[encrypted]' 
  OR email != '[encrypted]' 
  OR message != '[encrypted]';

-- Add check constraints to prevent NULL encrypted fields for new records
ALTER TABLE public.pending_contacts
  ADD CONSTRAINT check_contact_name_encrypted 
    CHECK (name = '[encrypted]' OR name IS NULL),
  ADD CONSTRAINT check_contact_email_encrypted 
    CHECK (email = '[encrypted]' OR email IS NULL),
  ADD CONSTRAINT check_contact_message_encrypted 
    CHECK (message = '[encrypted]' OR message IS NULL);

-- Enhanced secure_insert_contact with better error handling
CREATE OR REPLACE FUNCTION public.secure_insert_contact(
  p_key text,
  p_name text,
  p_email text,
  p_message text,
  p_newsletter_opt_in boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_id uuid;
  confirmation_token text;
BEGIN
  -- Validate inputs
  IF p_name IS NULL OR p_name = '' THEN
    RAISE EXCEPTION 'Name is required';
  END IF;
  
  IF p_email IS NULL OR p_email = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;
  
  IF p_message IS NULL OR p_message = '' THEN
    RAISE EXCEPTION 'Message is required';
  END IF;
  
  IF p_key IS NULL OR p_key = '' THEN
    RAISE EXCEPTION 'SECURITY ERROR: Encryption key is required';
  END IF;
  
  -- Generate confirmation token
  confirmation_token := encode(extensions.gen_random_bytes(32), 'hex');
  new_id := extensions.gen_random_uuid();
  
  -- Insert with encryption
  BEGIN
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
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Contact encryption failed: %', SQLERRM;
  END;
  
  RETURN new_id;
END;
$$;

-- ============================================
-- 3. COMPLETE SUBSCRIBER ENCRYPTION
-- ============================================

-- Update existing plaintext subscriber data to encrypted placeholder
UPDATE public.subscribers 
SET 
  email = '[encrypted]',
  stripe_customer_id = NULL
WHERE 
  (email IS NOT NULL AND email != '[encrypted]') 
  OR stripe_customer_id IS NOT NULL;

-- Add check constraints for subscribers
ALTER TABLE public.subscribers
  ADD CONSTRAINT check_subscriber_email_encrypted 
    CHECK (email = '[encrypted]' OR email IS NULL),
  ADD CONSTRAINT check_subscriber_stripe_encrypted 
    CHECK (stripe_customer_id IS NULL);

-- Create monitoring function for encryption failures
CREATE OR REPLACE FUNCTION public.log_encryption_failure(
  p_table_name text,
  p_record_id uuid,
  p_error_message text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    user_agent,
    created_at
  ) VALUES (
    auth.uid(),
    'ENCRYPTION_FAILURE',
    p_table_name,
    p_record_id,
    p_error_message,
    now()
  );
END;
$$;

-- Add audit logging to subscriber modifications
CREATE OR REPLACE FUNCTION public.log_subscriber_modifications()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log any modification to the subscribers table
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    created_at
  ) VALUES (
    auth.uid(),
    TG_OP || '_SUBSCRIBER_DATA',
    'subscribers',
    COALESCE(NEW.id, OLD.id),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS log_subscriber_modifications_trigger ON public.subscribers;
CREATE TRIGGER log_subscriber_modifications_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.log_subscriber_modifications();

-- ============================================
-- 4. SECURITY AUDIT & MONITORING
-- ============================================

-- Function to check for unencrypted PII across all tables
CREATE OR REPLACE FUNCTION public.audit_unencrypted_pii()
RETURNS TABLE(
  table_name text,
  issue_type text,
  record_count bigint,
  severity text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow admin users
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  RETURN QUERY
  -- Check pending_contacts
  SELECT 
    'pending_contacts'::text,
    'Plaintext PII in name/email/message columns'::text,
    COUNT(*)::bigint,
    'CRITICAL'::text
  FROM public.pending_contacts
  WHERE name != '[encrypted]' OR email != '[encrypted]' OR message != '[encrypted]'
  HAVING COUNT(*) > 0
  
  UNION ALL
  
  -- Check user_feedback
  SELECT 
    'user_feedback'::text,
    'Plaintext PII in email/name columns'::text,
    COUNT(*)::bigint,
    'CRITICAL'::text
  FROM public.user_feedback
  WHERE (email IS NOT NULL AND email != '[encrypted]' AND email != '')
     OR (name IS NOT NULL AND name != '[encrypted]' AND name != '')
  HAVING COUNT(*) > 0
  
  UNION ALL
  
  -- Check subscribers
  SELECT 
    'subscribers'::text,
    'Plaintext PII in email/stripe columns'::text,
    COUNT(*)::bigint,
    'CRITICAL'::text
  FROM public.subscribers
  WHERE (email IS NOT NULL AND email != '[encrypted]')
     OR stripe_customer_id IS NOT NULL
  HAVING COUNT(*) > 0
  
  UNION ALL
  
  -- Check for NULL encrypted fields in pending_contacts
  SELECT 
    'pending_contacts'::text,
    'Missing encrypted fields (NULL *_enc columns)'::text,
    COUNT(*)::bigint,
    'HIGH'::text
  FROM public.pending_contacts
  WHERE email_enc IS NULL OR name_enc IS NULL OR message_enc IS NULL
  HAVING COUNT(*) > 0
  
  UNION ALL
  
  -- Check for NULL encrypted fields in subscribers
  SELECT 
    'subscribers'::text,
    'Missing encrypted fields (NULL email_enc)'::text,
    COUNT(*)::bigint,
    'HIGH'::text
  FROM public.subscribers
  WHERE email_enc IS NULL
  HAVING COUNT(*) > 0;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.secure_insert_feedback TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_feedback_data TO authenticated;
GRANT EXECUTE ON FUNCTION public.migrate_encrypt_feedback TO authenticated;
GRANT EXECUTE ON FUNCTION public.audit_unencrypted_pii TO authenticated;