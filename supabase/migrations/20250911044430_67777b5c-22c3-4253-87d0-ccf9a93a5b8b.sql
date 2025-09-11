-- Fix the get_user_subscription_status function to work correctly
DROP FUNCTION IF EXISTS public.get_user_subscription_status(uuid);

CREATE OR REPLACE FUNCTION public.get_user_subscription_status(p_user_id uuid DEFAULT auth.uid())
 RETURNS TABLE(subscribed boolean, subscription_tier text, subscription_end timestamp with time zone)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = 'public'
AS $$
  SELECT 
    COALESCE(s.subscribed, false) as subscribed,
    s.subscription_tier,
    s.subscription_end
  FROM public.subscribers s
  WHERE s.user_id = COALESCE(p_user_id, auth.uid())
  UNION ALL
  SELECT false, null::text, null::timestamp with time zone
  WHERE NOT EXISTS (
    SELECT 1 FROM public.subscribers s 
    WHERE s.user_id = COALESCE(p_user_id, auth.uid())
  )
  LIMIT 1;
$$;