-- Update AI usage limits to the new proposed structure
-- Free: 5, 5, 10 | Monthly: 15, 15, 20 | Lifetime: 30, 30, 30

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
  
  -- Return limits based on subscription status
  IF user_subscribed THEN
    -- Paid subscribers get enhanced limits based on their tier
    CASE LOWER(user_tier)
      WHEN 'basic', 'monthly' THEN
        -- Monthly membership: 15, 15, 20
        RETURN QUERY SELECT 15, 15, 20;
      WHEN 'premium', 'lifetime' THEN
        -- Lifetime membership: 30, 30, 30
        RETURN QUERY SELECT 30, 30, 30;
      ELSE
        -- Default paid: same as monthly
        RETURN QUERY SELECT 15, 15, 20;
    END CASE;
  ELSE
    -- Free users: 5, 5, 10
    RETURN QUERY SELECT 5, 5, 10;
  END IF;
END;
$function$;