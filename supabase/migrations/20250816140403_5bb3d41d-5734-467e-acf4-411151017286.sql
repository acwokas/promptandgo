-- Double all AI usage quotas since we're using much cheaper OpenAI models (nano/mini)
-- This makes the service very cost-effective within budget constraints

CREATE OR REPLACE FUNCTION public.get_user_ai_limits(user_id_param uuid)
 RETURNS TABLE(daily_generator_limit integer, daily_suggestions_limit integer, daily_assistant_limit integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  user_subscribed BOOLEAN := FALSE;
  user_tier TEXT := NULL;
BEGIN
  -- Check if user has active subscription
  SELECT s.subscribed, s.subscription_tier 
  INTO user_subscribed, user_tier
  FROM public.subscribers s 
  WHERE s.user_id = user_id_param 
    AND s.subscribed = true 
    AND (s.subscription_end IS NULL OR s.subscription_end > now());
  
  -- Return doubled limits based on subscription status
  IF user_subscribed THEN
    -- Paid subscribers get enhanced limits based on their tier
    CASE LOWER(user_tier)
      WHEN 'basic', 'monthly' THEN
        -- Monthly membership: 30, 30, 40 (doubled from 15, 15, 20)
        RETURN QUERY SELECT 30, 30, 40;
      WHEN 'premium', 'lifetime' THEN
        -- Lifetime membership: 60, 60, 60 (doubled from 30, 30, 30)
        RETURN QUERY SELECT 60, 60, 60;
      ELSE
        -- Default paid: same as monthly
        RETURN QUERY SELECT 30, 30, 40;
    END CASE;
  ELSE
    -- Free users: 10, 10, 20 (doubled from 5, 5, 10)
    RETURN QUERY SELECT 10, 10, 20;
  END IF;
END;
$function$;