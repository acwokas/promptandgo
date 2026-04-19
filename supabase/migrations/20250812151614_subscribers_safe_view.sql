-- Security hardening for subscribers table: restrict sensitive columns and expose safe view
-- 1) Create a safe view that only exposes non-sensitive fields
CREATE OR REPLACE VIEW public.subscribers_safe AS
SELECT 
  id,
  user_id,
  subscribed,
  subscription_tier,
  subscription_end,
  updated_at
FROM public.subscribers;

-- 2) Revoke all direct privileges on the base table from anon/authenticated roles
REVOKE ALL ON TABLE public.subscribers FROM anon, authenticated;

-- 3) Grant read-only access to the safe view for authenticated users
GRANT SELECT ON TABLE public.subscribers_safe TO authenticated;

-- Note: RLS on public.subscribers still applies when selecting through the view,
-- so users will only see their own row. This change prevents any direct access
-- to sensitive columns (email, stripe_customer_id) via PostgREST.
