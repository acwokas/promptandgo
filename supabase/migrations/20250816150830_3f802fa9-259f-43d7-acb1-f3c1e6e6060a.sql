-- Fix AI usage RPC authorization (HIGH PRIORITY)
-- Add authorization check to prevent users from manipulating other users' usage
CREATE OR REPLACE FUNCTION public.check_and_increment_usage(user_id_param uuid, usage_type_param text)
RETURNS TABLE(allowed boolean, current_usage integer, daily_limit integer, remaining integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
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
$function$;

-- Fix subscribers admin view exposure (HIGH PRIORITY)
-- Revoke public access to the admin view
REVOKE ALL ON public.subscribers_admin_view FROM anon, authenticated;

-- Create secure RPC for admin access to subscriber data
CREATE OR REPLACE FUNCTION public.get_subscribers_admin_data()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  email text,
  stripe_customer_id text,
  subscribed boolean,
  subscription_tier text,
  subscription_end timestamp with time zone,
  updated_at timestamp with time zone,
  email_hash text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- SECURITY: Only allow admin users
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  -- Return the admin view data
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.email,
    s.stripe_customer_id,
    s.subscribed,
    s.subscription_tier,
    s.subscription_end,
    s.updated_at,
    s.email_hash
  FROM public.subscribers_admin_view s;
END;
$function$;

-- Revoke execute permissions from anon on sensitive functions
REVOKE EXECUTE ON FUNCTION public.check_and_increment_usage(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.check_and_increment_usage(uuid, text) TO authenticated;

-- Create table for persistent rate limiting (better than in-memory)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL,
  count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index for efficient rate limit lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_key_window ON public.rate_limits(key, window_start);

-- Enable RLS on rate limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Rate limits should only be accessible by service role (used in edge functions)
CREATE POLICY "Service role can manage rate limits" ON public.rate_limits
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Add storage bucket policies for avatars (if not exists)
-- These policies ensure users can only upload to their own folder
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatar uploads
CREATE POLICY "Users can upload their own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Add constraint to validate shared link URLs (prevent open redirects)
-- Using a check constraint for allowed domains
ALTER TABLE public.shared_links 
ADD CONSTRAINT check_allowed_domains 
CHECK (
  original_url ~* '^https?://(www\.)?(promptandgo\.ai|localhost|127\.0\.0\.1|.*\.lovableproject\.com)(/.*)?$'
);