-- Fix remaining functions without explicit search_path

-- Fix functions that still need search_path set
CREATE OR REPLACE FUNCTION public.get_subscribers_admin_view()
RETURNS TABLE(id uuid, user_id uuid, email_hash text, subscribed boolean, subscription_tier text, subscription_end timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- SECURITY: Only allow admin users
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  -- Return safe subscriber data (no encrypted fields or raw emails)
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.email_hash,
    s.subscribed,
    s.subscription_tier,
    s.subscription_end,
    s.updated_at
  FROM public.subscribers s;
END;
$$;

CREATE OR REPLACE FUNCTION public.secure_upsert_subscriber(p_key text, p_user_id uuid, p_email text, p_stripe_customer_id text, p_subscribed boolean, p_subscription_tier text, p_subscription_end timestamp with time zone)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.check_and_increment_usage(user_id_param uuid, usage_type_param text)
RETURNS TABLE(allowed boolean, current_usage integer, daily_limit integer, remaining integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_usage_count INTEGER := 0;
  limit_value INTEGER := 0;
  today_date DATE := CURRENT_DATE;
BEGIN
  -- SECURITY FIX: Enforce that users can only access their own usage
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  IF auth.uid() != user_id_param THEN
    RAISE EXCEPTION 'Access denied: cannot access other users usage data';
  END IF;
  
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
$$;

CREATE OR REPLACE FUNCTION public.get_user_ai_limits(user_id_param uuid)
RETURNS TABLE(daily_generator_limit integer, daily_suggestions_limit integer, daily_assistant_limit integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;