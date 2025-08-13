-- Fix remaining security issues with simpler approach

-- Fix the subscribers_safe view (drop and recreate without SECURITY DEFINER)
DROP VIEW IF EXISTS public.subscribers_safe;

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