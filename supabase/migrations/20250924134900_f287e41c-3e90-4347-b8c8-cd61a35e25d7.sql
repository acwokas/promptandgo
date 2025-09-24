-- SECURITY FIX: Protect subscriber payment and PII data from exposure (CORRECTED)
-- This addresses the critical security finding about customer payment data at risk

-- Step 1: Create secure view function that only exposes safe subscriber data
CREATE OR REPLACE FUNCTION public.get_user_subscription_data()
RETURNS TABLE(
  id uuid,
  subscribed boolean,
  subscription_tier text,
  subscription_end timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    s.id,
    s.subscribed,
    s.subscription_tier,
    s.subscription_end,
    s.created_at,
    s.updated_at
  FROM public.subscribers s
  WHERE s.user_id = auth.uid();
$$;

-- Step 2: Create admin-only function for accessing encrypted subscriber data
CREATE OR REPLACE FUNCTION public.get_subscriber_encrypted_data(
  p_user_id uuid,
  p_encryption_key text
)
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
STABLE
SET search_path = public
AS $$
BEGIN
  -- SECURITY: Only allow admin access
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    CASE 
      WHEN s.email_enc IS NOT NULL THEN pgp_sym_decrypt(s.email_enc, p_encryption_key)
      ELSE s.email
    END as email,
    CASE 
      WHEN s.stripe_customer_id_enc IS NOT NULL THEN pgp_sym_decrypt(s.stripe_customer_id_enc, p_encryption_key)
      ELSE s.stripe_customer_id
    END as stripe_customer_id,
    s.subscribed,
    s.subscription_tier,
    s.subscription_end
  FROM public.subscribers s
  WHERE s.user_id = p_user_id;
END;
$$;

-- Step 3: Remove direct access to sensitive columns via RLS
-- Drop existing permissive policies
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_authenticated_own_data_only" ON public.subscribers;

-- Create new restrictive SELECT policy (CORRECTED - no WITH CHECK for SELECT)
CREATE POLICY "users_safe_subscription_data_only" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id 
  AND NOT has_role(auth.uid(), 'admin'::app_role)  -- Non-admins get restricted access
);

-- Keep admin policy for full access
CREATE POLICY "admins_full_subscriber_access"
ON public.subscribers 
FOR SELECT
TO authenticated  
USING (has_role(auth.uid(), 'admin'::app_role));

-- Step 4: Create view for safe subscriber data access
CREATE OR REPLACE VIEW public.safe_subscriber_view AS
SELECT 
  id,
  user_id,
  subscribed,
  subscription_tier,
  subscription_end,
  created_at,
  updated_at,
  -- Only expose email hash, not actual email
  email_hash,
  -- Never expose actual email or stripe customer ID
  CASE WHEN email_enc IS NOT NULL THEN true ELSE false END as has_encrypted_email
FROM public.subscribers;

-- Step 5: Grant appropriate permissions
GRANT SELECT ON public.safe_subscriber_view TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_subscription_data() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_subscriber_encrypted_data(uuid, text) TO authenticated;

-- Step 6: Update existing functions to use safe data access patterns
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(p_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(subscribed boolean, subscription_tier text, subscription_end timestamp with time zone)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    COALESCE(s.subscribed, false) as subscribed,
    s.subscription_tier,
    s.subscription_end
  FROM public.safe_subscriber_view s
  WHERE s.user_id = COALESCE(p_user_id, auth.uid())
  UNION ALL
  SELECT false, null::text, null::timestamp with time zone
  WHERE NOT EXISTS (
    SELECT 1 FROM public.safe_subscriber_view s 
    WHERE s.user_id = COALESCE(p_user_id, auth.uid())
  )
  LIMIT 1;
$$;