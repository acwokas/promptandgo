-- Fix remaining security issues identified by the linter

-- Drop the current view as it has security definer issues
DROP VIEW IF EXISTS public.subscribers_safe;

-- Instead, we'll improve the RLS policies to handle this more securely
-- The subscribers_safe view is better handled as a regular view without SECURITY DEFINER

-- Create a regular view that relies on RLS policies for security
CREATE VIEW public.subscribers_safe AS 
SELECT 
  id,
  user_id,
  subscribed,
  subscription_tier,
  subscription_end,
  updated_at
FROM public.subscribers;

-- Grant access to authenticated users (RLS will handle the security)
GRANT SELECT ON public.subscribers_safe TO authenticated;

-- Fix the function to have a proper search path
CREATE OR REPLACE FUNCTION public.get_subscriber_info(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid, 
  subscribed boolean,
  subscription_tier text,
  subscription_end timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT 
    s.id,
    s.user_id,
    s.subscribed,
    s.subscription_tier,
    s.subscription_end,
    s.updated_at
  FROM public.subscribers s
  WHERE s.user_id = p_user_id
  AND s.user_id = auth.uid(); -- Double check auth
$$;

-- Ensure all sensitive data functions also have proper search paths
CREATE OR REPLACE FUNCTION public.secure_upsert_subscriber(p_key text, p_user_id uuid, p_email text, p_stripe_customer_id text, p_subscribed boolean, p_subscription_tier text, p_subscription_end timestamp with time zone)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
    pgp_sym_encrypt(coalesce(p_email, ''), p_key),
    CASE WHEN p_stripe_customer_id IS NULL THEN NULL ELSE pgp_sym_encrypt(p_stripe_customer_id, p_key) END,
    CASE WHEN p_email IS NULL THEN NULL ELSE encode(digest(p_email, 'sha256'), 'hex') END
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
$function$

-- Fix the has_role function to have proper search path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$function$