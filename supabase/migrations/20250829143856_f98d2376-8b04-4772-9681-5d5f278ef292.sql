-- Fix poll access for admin functionality while maintaining security

-- Drop the overly restrictive poll_votes policies
DROP POLICY IF EXISTS "poll_votes_no_direct_access" ON public.poll_votes;
DROP POLICY IF EXISTS "poll_votes_admin_only" ON public.poll_votes;

-- Create secure policies for poll_votes access
-- Allow admins to manage poll votes for administration
CREATE POLICY "poll_votes_admin_full_access" ON public.poll_votes
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow users to INSERT votes on active polls only (for voting functionality)
CREATE POLICY "poll_votes_insert_active_polls" ON public.poll_votes
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.polls 
    WHERE polls.id = poll_votes.poll_id 
    AND polls.is_active = true
  )
);

-- Allow reading poll votes ONLY through security definer functions (aggregated results)
CREATE POLICY "poll_votes_function_access_only" ON public.poll_votes
FOR SELECT TO authenticated
USING (
  -- Block direct SELECT but allow through security definer functions
  -- This prevents user tracking while allowing legitimate functionality
  has_role(auth.uid(), 'admin'::app_role) OR
  -- Allow access from specific security definer functions only
  current_setting('role', true) = 'supabase_admin'
);

-- Ensure poll results functions have proper security definer access
CREATE OR REPLACE FUNCTION public.get_poll_results(poll_id_param uuid)
RETURNS TABLE(option_id uuid, option_text text, option_icon text, vote_count bigint, percentage numeric)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH vote_counts AS (
    SELECT 
      po.id as option_id,
      po.text as option_text,
      po.icon as option_icon,
      COALESCE(COUNT(pv.id), 0) as vote_count
    FROM public.poll_options po
    LEFT JOIN public.poll_votes pv ON po.id = pv.option_id
    WHERE po.poll_id = poll_id_param
    GROUP BY po.id, po.text, po.icon, po.order_index
    ORDER BY po.order_index
  ),
  total_votes AS (
    SELECT SUM(vote_count) as total FROM vote_counts
  )
  SELECT 
    vc.option_id,
    vc.option_text,
    vc.option_icon,
    vc.vote_count,
    CASE 
      WHEN tv.total = 0 THEN 0
      ELSE ROUND((vc.vote_count::NUMERIC / tv.total::NUMERIC) * 100, 1)
    END as percentage
  FROM vote_counts vc
  CROSS JOIN total_votes tv
  ORDER BY vc.vote_count DESC, vc.option_text;
$$;

CREATE OR REPLACE FUNCTION public.get_poll_results_with_manual(poll_id_param uuid)
RETURNS TABLE(option_id uuid, option_text text, option_icon text, vote_count bigint, percentage numeric, is_manual boolean)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH vote_counts AS (
    SELECT 
      po.id as option_id,
      po.text as option_text,
      po.icon as option_icon,
      po.manual_percentage,
      po.use_manual_percentage,
      COALESCE(COUNT(pv.id), 0) as vote_count
    FROM public.poll_options po
    LEFT JOIN public.poll_votes pv ON po.id = pv.option_id
    WHERE po.poll_id = poll_id_param
    GROUP BY po.id, po.text, po.icon, po.order_index, po.manual_percentage, po.use_manual_percentage
    ORDER BY po.order_index
  ),
  total_votes AS (
    SELECT SUM(vote_count) as total FROM vote_counts
  )
  SELECT 
    vc.option_id,
    vc.option_text,
    vc.option_icon,
    vc.vote_count,
    CASE 
      WHEN vc.use_manual_percentage = true AND vc.manual_percentage IS NOT NULL THEN 
        vc.manual_percentage
      WHEN tv.total = 0 THEN 0
      ELSE ROUND((vc.vote_count::NUMERIC / tv.total::NUMERIC) * 100, 1)
    END as percentage,
    COALESCE(vc.use_manual_percentage, false) as is_manual
  FROM vote_counts vc
  CROSS JOIN total_votes tv
  ORDER BY 
    CASE 
      WHEN vc.use_manual_percentage = true AND vc.manual_percentage IS NOT NULL THEN 
        vc.manual_percentage
      WHEN tv.total = 0 THEN 0
      ELSE ROUND((vc.vote_count::NUMERIC / tv.total::NUMERIC) * 100, 1)
    END DESC, 
    vc.option_text;
$$;