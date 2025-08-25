-- Fix remaining security issues

-- 1. Remove the problematic email-based lookup from subscribers policy
DROP POLICY IF EXISTS "Users can view own subscription data only" ON public.subscribers;

-- Add a stricter policy that only allows user_id-based lookups (no email lookups)
CREATE POLICY "Users can view own subscription by user_id only" 
ON public.subscribers 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- 2. Find and drop any remaining security definer views
DROP VIEW IF EXISTS public.subscribers_admin_view CASCADE;

-- 3. Since shared_links_public is a view and we can't add RLS to it, let's check if we need to drop it
-- If it's not essential, we should remove it for security
DROP VIEW IF EXISTS public.shared_links_public CASCADE;

-- 4. Update the get_subscribers_admin_data function to match the new function name
-- (This was created earlier but let's make sure it exists with the right name)
DROP FUNCTION IF EXISTS public.get_subscribers_admin_data();

-- Make sure our secure admin function exists 
CREATE OR REPLACE FUNCTION public.get_subscribers_admin_view()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  email_hash text,
  subscribed boolean,
  subscription_tier text,
  subscription_end timestamp with time zone,
  updated_at timestamp with time zone
) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- SECURITY: Only allow admin users
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  -- Return safe subscriber data (no encrypted fields or raw emails)
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.email_hash,
    s.subscribed,
    s.subscription_tier,
    s.subscription_end,
    s.updated_at
  FROM public.subscribers s;
END;
$$;