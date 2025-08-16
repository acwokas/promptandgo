-- Update AI usage limits to provide higher quotas for different membership tiers
-- Monthly members get 2x the standard limits, lifetime members get 3x

CREATE OR REPLACE FUNCTION public.get_user_ai_limits(user_id_param uuid)
 RETURNS TABLE(daily_generator_limit integer, daily_suggestions_limit integer, daily_assistant_limit integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  user_subscribed BOOLEAN := FALSE;
  user_tier TEXT := NULL;
  base_generator INTEGER := 25;
  base_suggestions INTEGER := 15;
  base_assistant INTEGER := 50;
BEGIN
  -- Check if user has active subscription
  SELECT s.subscribed, s.subscription_tier 
  INTO user_subscribed, user_tier
  FROM public.subscribers s 
  WHERE s.user_id = user_id_param 
    AND s.subscribed = true 
    AND (s.subscription_end IS NULL OR s.subscription_end > now());
  
  -- Return limits based on subscription status
  IF user_subscribed THEN
    -- Paid subscribers get multiplied limits based on their tier
    CASE LOWER(user_tier)
      WHEN 'basic', 'monthly' THEN
        -- Monthly membership: 2x base limits
        RETURN QUERY SELECT base_generator * 2, base_suggestions * 2, base_assistant * 2;
      WHEN 'premium', 'lifetime' THEN
        -- Lifetime membership: 3x base limits  
        RETURN QUERY SELECT base_generator * 3, base_suggestions * 3, base_assistant * 3;
      ELSE
        -- Default paid: standard base limits
        RETURN QUERY SELECT base_generator, base_suggestions, base_assistant;
    END CASE;
  ELSE
    -- Free users get limited queries
    RETURN QUERY SELECT 5, 3, 10; -- Free limits
  END IF;
END;
$function$;