-- Fix the search path issues and null handling in daily AI sends functions

-- Update get_sgt_date function to set search_path
CREATE OR REPLACE FUNCTION get_sgt_date()
RETURNS date
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT (now() AT TIME ZONE 'Asia/Singapore')::date;
$$;

-- Updated function to get daily AI sends count with proper null handling
CREATE OR REPLACE FUNCTION public.get_daily_ai_sends_count(p_user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_count INTEGER := 0;
  daily_limit INTEGER := 20;
  sgt_date DATE;
BEGIN
  -- Get current SGT date
  SELECT get_sgt_date() INTO sgt_date;
  
  -- Get current count for today (SGT), default to 0 if no record exists
  SELECT COALESCE(send_count, 0) INTO current_count
  FROM public.daily_ai_sends
  WHERE user_id = p_user_id AND send_date = sgt_date;
  
  -- If no record found, current_count is already 0 from COALESCE
  IF NOT FOUND THEN
    current_count := 0;
  END IF;
  
  RETURN json_build_object(
    'count', current_count,
    'remaining', daily_limit - current_count,
    'daily_limit', daily_limit,
    'limit_reached', current_count >= daily_limit
  );
END;
$function$;

-- Updated function to check and increment daily AI sends with proper null handling
CREATE OR REPLACE FUNCTION public.check_and_increment_daily_ai_sends(p_user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_count INTEGER := 0;
  daily_limit INTEGER := 20;
  record_exists BOOLEAN := FALSE;
  sgt_date DATE;
BEGIN
  -- Get current SGT date
  SELECT get_sgt_date() INTO sgt_date;
  
  -- Check if user has a record for today (SGT)
  SELECT send_count INTO current_count
  FROM public.daily_ai_sends
  WHERE user_id = p_user_id AND send_date = sgt_date;
  
  IF FOUND THEN
    record_exists := TRUE;
  ELSE
    current_count := 0;
  END IF;
  
  -- Check if user has reached daily limit
  IF current_count >= daily_limit THEN
    RETURN json_build_object(
      'success', false,
      'remaining', 0,
      'limit_reached', true,
      'daily_limit', daily_limit
    );
  END IF;
  
  -- Increment or create record
  IF record_exists THEN
    UPDATE public.daily_ai_sends 
    SET send_count = send_count + 1
    WHERE user_id = p_user_id AND send_date = sgt_date;
    current_count := current_count + 1;
  ELSE
    INSERT INTO public.daily_ai_sends (user_id, send_date, send_count)
    VALUES (p_user_id, sgt_date, 1);
    current_count := 1;
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'remaining', daily_limit - current_count,
    'limit_reached', false,
    'daily_limit', daily_limit
  );
END;
$function$;