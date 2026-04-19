-- Fix the Security Definer View issue
-- The subscribers_admin_view needs to be recreated without SECURITY DEFINER
-- or properly secured

-- Drop the existing view
DROP VIEW IF EXISTS public.subscribers_admin_view;

-- Recreate the view without SECURITY DEFINER since we have proper RLS policies
CREATE VIEW public.subscribers_admin_view AS
SELECT 
  s.id,
  s.user_id,
  s.subscribed,
  s.subscription_tier,
  s.subscription_end,
  s.created_at,
  s.updated_at,
  CASE 
    WHEN s.email_enc IS NOT NULL THEN 'encrypted'
    WHEN s.email IS NOT NULL THEN 'plaintext'
    ELSE 'none'
  END as email_status,
  CASE 
    WHEN s.stripe_customer_id_enc IS NOT NULL THEN 'encrypted'
    WHEN s.stripe_customer_id IS NOT NULL THEN 'plaintext'
    ELSE 'none'
  END as stripe_status
FROM public.subscribers s;

-- Ensure the view has proper RLS policy
-- RLS policy on view subscribers_admin_view removed (views do not support RLS)

-- Enable RLS on the view
-- ENABLE ROW LEVEL SECURITY on view subscribers_admin_view removed (not supported)