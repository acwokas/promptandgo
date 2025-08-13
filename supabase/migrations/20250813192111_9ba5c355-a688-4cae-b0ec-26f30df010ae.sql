-- Fix database function security settings by adding SET search_path = ''
-- This prevents search path manipulation attacks

-- Fix check_and_increment_usage function
CREATE OR REPLACE FUNCTION public.check_and_increment_usage(user_id_param uuid, usage_type_param text)
 RETURNS TABLE(allowed boolean, current_usage integer, daily_limit integer, remaining integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  current_usage_count INTEGER := 0;
  limit_value INTEGER := 0;
  today_date DATE := CURRENT_DATE;
BEGIN
  -- Get user limits
  CASE usage_type_param
    WHEN 'generator' THEN
      SELECT daily_generator_limit INTO limit_value FROM public.get_user_ai_limits(user_id_param);
    WHEN 'suggestions' THEN
      SELECT daily_suggestions_limit INTO limit_value FROM public.get_user_ai_limits(user_id_param);
    WHEN 'assistant' THEN
      SELECT daily_assistant_limit INTO limit_value FROM public.get_user_ai_limits(user_id_param);
  END CASE;
  
  -- Get or create today's usage record
  INSERT INTO public.ai_usage (user_id, usage_type, queries_used, reset_date)
  VALUES (user_id_param, usage_type_param, 0, today_date)
  ON CONFLICT (user_id, usage_type, reset_date) DO NOTHING;
  
  -- Get current usage
  SELECT queries_used INTO current_usage_count
  FROM public.ai_usage
  WHERE user_id = user_id_param 
    AND usage_type = usage_type_param 
    AND reset_date = today_date;
  
  -- Check if user can make another query
  IF current_usage_count < limit_value THEN
    -- Increment usage
    UPDATE public.ai_usage 
    SET queries_used = queries_used + 1, updated_at = now()
    WHERE user_id = user_id_param 
      AND usage_type = usage_type_param 
      AND reset_date = today_date;
    
    current_usage_count := current_usage_count + 1;
    
    RETURN QUERY SELECT 
      true, 
      current_usage_count, 
      limit_value, 
      limit_value - current_usage_count;
  ELSE
    RETURN QUERY SELECT 
      false, 
      current_usage_count, 
      limit_value, 
      0;
  END IF;
END;
$function$;

-- Fix get_user_ai_limits function
CREATE OR REPLACE FUNCTION public.get_user_ai_limits(user_id_param uuid)
 RETURNS TABLE(daily_generator_limit integer, daily_suggestions_limit integer, daily_assistant_limit integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
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
    -- Paid subscribers get higher limits
    CASE user_tier
      WHEN 'premium' THEN
        RETURN QUERY SELECT 100, 50, 200; -- Premium limits
      ELSE
        RETURN QUERY SELECT 50, 25, 100;  -- Standard paid limits
    END CASE;
  ELSE
    -- Free users get limited queries
    RETURN QUERY SELECT 5, 3, 10; -- Free limits
  END IF;
END;
$function$;

-- Fix get_subscriber_info function
CREATE OR REPLACE FUNCTION public.get_subscriber_info(p_user_id uuid)
 RETURNS TABLE(id uuid, user_id uuid, subscribed boolean, subscription_tier text, subscription_end timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
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

-- Fix increment_link_clicks function
CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_code text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  UPDATE public.shared_links 
  SET clicks = clicks + 1, updated_at = now()
  WHERE short_code = link_code;
END;
$function$;

-- Fix secure_upsert_subscriber function
CREATE OR REPLACE FUNCTION public.secure_upsert_subscriber(p_key text, p_user_id uuid, p_email text, p_stripe_customer_id text, p_subscribed boolean, p_subscription_tier text, p_subscription_end timestamp with time zone)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Enable pgcrypto extension if not exists
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
  
  INSERT INTO public.subscribers (
    user_id,
    email,
    stripe_customer_id,
    subscribed,
    subscription_tier,
    subscription_end,
    updated_at,
    email_enc,
    stripe_customer_id_enc,
    email_hash
  ) VALUES (
    p_user_id,
    '[encrypted]',
    NULL,
    p_subscribed,
    p_subscription_tier,
    p_subscription_end,
    now(),
    pgp_sym_encrypt(coalesce(p_email, ''), p_key),
    CASE WHEN p_stripe_customer_id IS NULL THEN NULL ELSE pgp_sym_encrypt(p_stripe_customer_id, p_key) END,
    CASE WHEN p_email IS NULL THEN NULL ELSE encode(digest(p_email, 'sha256'), 'hex') END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    subscribed = EXCLUDED.subscribed,
    subscription_tier = EXCLUDED.subscription_tier,
    subscription_end = EXCLUDED.subscription_end,
    updated_at = now(),
    email_enc = EXCLUDED.email_enc,
    stripe_customer_id_enc = EXCLUDED.stripe_customer_id_enc,
    email_hash = EXCLUDED.email_hash;
END;
$function$;