-- Fix Security Definer View issue
-- Remove the problematic security_barrier setting and recreate the view properly

DROP VIEW IF EXISTS public.safe_subscriber_view;

-- Create view without security definer properties
CREATE VIEW public.safe_subscriber_view AS
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
FROM public.subscribers
WHERE auth.uid() = user_id; -- Built-in RLS in the view

-- Grant permissions properly
GRANT SELECT ON public.safe_subscriber_view TO authenticated;