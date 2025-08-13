-- Fix search_path security issue for get_subscriber_info function
-- This prevents potential security vulnerabilities from search_path manipulation

CREATE OR REPLACE FUNCTION public.get_subscriber_info(p_user_id uuid)
 RETURNS TABLE(id uuid, user_id uuid, subscribed boolean, subscription_tier text, subscription_end timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;