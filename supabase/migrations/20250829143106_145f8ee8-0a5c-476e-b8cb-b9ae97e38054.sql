-- Final security hardening fixes

-- Fix remaining functions without search_path
CREATE OR REPLACE FUNCTION public.get_prompt_rating(prompt_id_param uuid)
RETURNS TABLE(average_rating numeric, total_ratings bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    COALESCE(ROUND(AVG(rating::numeric), 1), 0) as average_rating,
    COUNT(rating) as total_ratings
  FROM public.user_ratings 
  WHERE prompt_id = prompt_id_param;
$$;

CREATE OR REPLACE FUNCTION public.get_subscriber_info(p_user_id uuid)
RETURNS TABLE(id uuid, user_id uuid, subscribed boolean, subscription_tier text, subscription_end timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.shared_links 
  SET clicks = clicks + 1, updated_at = now()
  WHERE short_code = link_code;
END;
$$;

-- Remove any remaining permissive policies on pending_contacts
DROP POLICY IF EXISTS "Public can submit contact forms" ON public.pending_contacts;
DROP POLICY IF EXISTS "Allow validated contact submissions" ON public.pending_contacts;

-- Create more restrictive contact submission policy (INSERT only via edge function)
CREATE POLICY "contact_submissions_service_role_only" ON public.pending_contacts
FOR INSERT TO service_role
WITH CHECK (true);

-- Completely lock down subscribers table to authenticated users only (no anonymous access)
DROP POLICY IF EXISTS "subscribers_select_own_safe_data" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_select_admin_only" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_service_role_insert" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_service_role_update" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_service_role_delete" ON public.subscribers;

-- Ultra-restrictive subscribers policies - only service role and specific functions
CREATE POLICY "subscribers_authenticated_own_data_only" ON public.subscribers
FOR SELECT TO authenticated
USING (
  -- Only allow access to own basic subscription data, no PII
  auth.uid() = user_id AND user_id IS NOT NULL
);

CREATE POLICY "subscribers_service_role_all_operations" ON public.subscribers
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- Make sure poll_votes can only be read via aggregation functions, not directly
DROP POLICY IF EXISTS "poll_votes_aggregated_access_only" ON public.poll_votes;
CREATE POLICY "poll_votes_no_direct_access" ON public.poll_votes
FOR SELECT TO authenticated
USING (false); -- Completely block direct SELECT access

-- Only allow poll votes through specific admin functions or aggregation
CREATE POLICY "poll_votes_admin_only" ON public.poll_votes
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));