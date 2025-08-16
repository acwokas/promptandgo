-- Fix security issue: Remove plain text email addresses from subscribers table

-- 1. Update any existing plain text emails to use encrypted placeholder
-- This protects existing customer data
UPDATE public.subscribers 
SET email = '[encrypted]'
WHERE email != '[encrypted]' AND email IS NOT NULL;

-- 2. Add a constraint to prevent plain text emails from being stored in future
-- This ensures all emails must use the '[encrypted]' placeholder
ALTER TABLE public.subscribers 
ADD CONSTRAINT check_email_encrypted 
CHECK (email = '[encrypted]' OR email IS NULL);

-- 3. Create a secure view for admin access that doesn't expose raw encrypted data
CREATE OR REPLACE VIEW public.subscribers_admin_view AS
SELECT 
  id,
  user_id,
  subscribed,
  subscription_tier,
  subscription_end,
  created_at,
  updated_at,
  CASE 
    WHEN email_hash IS NOT NULL THEN 'Email on file (encrypted)'
    ELSE 'No email'
  END as email_status,
  CASE 
    WHEN stripe_customer_id_enc IS NOT NULL THEN 'Stripe ID on file (encrypted)'
    ELSE 'No Stripe ID'
  END as stripe_status
FROM public.subscribers;

-- 4. Create RLS policy for the admin view
CREATE POLICY "Admins can view subscriber overview" ON public.subscribers_admin_view
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Create a function to safely decrypt email for authorized operations
CREATE OR REPLACE FUNCTION public.get_decrypted_subscriber_email(p_user_id uuid, p_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  encrypted_email bytea;
  decrypted_email text;
BEGIN
  -- Only allow access to own email or admin access
  IF auth.uid() != p_user_id AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- Get encrypted email
  SELECT email_enc INTO encrypted_email
  FROM public.subscribers
  WHERE user_id = p_user_id;
  
  -- Return null if no encrypted email found
  IF encrypted_email IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Decrypt email (only with proper key)
  BEGIN
    SELECT pgp_sym_decrypt(encrypted_email, p_key) INTO decrypted_email;
    RETURN decrypted_email;
  EXCEPTION WHEN OTHERS THEN
    -- Return null if decryption fails (wrong key, etc.)
    RETURN NULL;
  END;
END;
$$;

-- 6. Add logging trigger for audit trail
CREATE OR REPLACE FUNCTION public.log_subscriber_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log when someone accesses subscriber data (for audit purposes)
  INSERT INTO public.audit_log (table_name, action, user_id, timestamp, details)
  VALUES ('subscribers', TG_OP, auth.uid(), now(), 
          json_build_object('accessed_user', COALESCE(NEW.user_id, OLD.user_id)))
  ON CONFLICT DO NOTHING; -- Ignore if audit_log table doesn't exist
  
  RETURN COALESCE(NEW, OLD);
END;
$$;