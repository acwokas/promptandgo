-- SECURITY HARDENING: Fix subscribers table RLS policies and enforce encryption

-- 1. DROP existing overly permissive policies on subscribers table
DROP POLICY IF EXISTS "Allow public newsletter signups" ON public.subscribers;
DROP POLICY IF EXISTS "Secure subscription access" ON public.subscribers;
DROP POLICY IF EXISTS "Service role can insert subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Service role can update subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_select_own_record" ON public.subscribers;

-- 2. Create new restrictive RLS policies for subscribers table
-- Only allow users to view their own subscription data (no email/PII)
CREATE POLICY "subscribers_select_own_safe_data" ON public.subscribers
FOR SELECT TO authenticated
USING (
  auth.uid() = user_id AND user_id IS NOT NULL
);

-- Only allow admins to view all records (for admin dashboard)
CREATE POLICY "subscribers_select_admin_only" ON public.subscribers
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Only allow service role to INSERT/UPDATE/DELETE (for secure operations)
CREATE POLICY "subscribers_service_role_insert" ON public.subscribers
FOR INSERT TO service_role
WITH CHECK (true);

CREATE POLICY "subscribers_service_role_update" ON public.subscribers
FOR UPDATE TO service_role
USING (true);

CREATE POLICY "subscribers_service_role_delete" ON public.subscribers
FOR DELETE TO service_role
USING (true);

-- 3. Create trigger to enforce encryption for PII data
CREATE OR REPLACE FUNCTION public.enforce_subscriber_encryption()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Prevent insertion of plaintext email addresses
  IF NEW.email IS NOT NULL AND NEW.email != '[encrypted]' AND NEW.email != '' THEN
    RAISE EXCEPTION 'Direct email insertion not allowed. Use secure_upsert_subscriber function.';
  END IF;
  
  -- Prevent insertion of plaintext stripe customer IDs
  IF NEW.stripe_customer_id IS NOT NULL AND NEW.stripe_customer_id != '' THEN
    RAISE EXCEPTION 'Direct stripe_customer_id insertion not allowed. Use secure_upsert_subscriber function.';
  END IF;
  
  -- Ensure encrypted fields exist when email is provided
  IF NEW.email_enc IS NULL AND (NEW.email_hash IS NOT NULL OR NEW.subscribed = true) THEN
    RAISE EXCEPTION 'Email encryption required for subscriber records.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add trigger to enforce encryption on INSERT/UPDATE
DROP TRIGGER IF EXISTS enforce_encryption_trigger ON public.subscribers;
CREATE TRIGGER enforce_encryption_trigger
  BEFORE INSERT OR UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_subscriber_encryption();

-- 4. Fix function search paths for security
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

-- 5. Create secure function for checking subscription status without exposing PII
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(p_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(
  subscribed boolean,
  subscription_tier text,
  subscription_end timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    s.subscribed,
    s.subscription_tier,
    s.subscription_end
  FROM public.subscribers s
  WHERE s.user_id = p_user_id
  AND (s.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
$$;

-- 6. Restrict poll_votes access to prevent user tracking
DROP POLICY IF EXISTS "Users can view poll votes" ON public.poll_votes;
CREATE POLICY "poll_votes_aggregated_access_only" ON public.poll_votes
FOR SELECT TO authenticated
USING (
  -- Only allow access through specific functions that aggregate data
  has_role(auth.uid(), 'admin'::app_role)
);

-- 7. Restrict pending_contacts access
DROP POLICY IF EXISTS "Admin only can view contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Admins can view contacts (select)" ON public.pending_contacts;
CREATE POLICY "pending_contacts_admin_access_only" ON public.pending_contacts
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- 8. Add rate limiting table for newsletter signups
CREATE TABLE IF NOT EXISTS public.newsletter_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_hash text NOT NULL,
  ip_address inet,
  attempt_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(email_hash, ip_address)
);

ALTER TABLE public.newsletter_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rate_limits_service_role_only" ON public.newsletter_rate_limits
FOR ALL TO service_role
USING (true);

-- Clean up old rate limit records (keep only last 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_newsletter_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  DELETE FROM public.newsletter_rate_limits 
  WHERE created_at < (now() - interval '24 hours');
$$;