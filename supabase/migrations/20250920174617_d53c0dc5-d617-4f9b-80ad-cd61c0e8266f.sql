-- Update the daily AI sends functions to increase limit from 5 to 20
CREATE OR REPLACE FUNCTION public.check_and_increment_daily_ai_sends(p_user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_count INTEGER := 0;
  daily_limit INTEGER := 20; -- Updated from 5 to 20
  record_exists BOOLEAN := FALSE;
BEGIN
  -- Check if user has a record for today
  SELECT send_count INTO current_count
  FROM public.daily_ai_sends
  WHERE user_id = p_user_id AND send_date = CURRENT_DATE;
  
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
    WHERE user_id = p_user_id AND send_date = CURRENT_DATE;
    current_count := current_count + 1;
  ELSE
    INSERT INTO public.daily_ai_sends (user_id, send_date, send_count)
    VALUES (p_user_id, CURRENT_DATE, 1);
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

CREATE OR REPLACE FUNCTION public.get_daily_ai_sends_count(p_user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_count INTEGER := 0;
  daily_limit INTEGER := 20; -- Updated from 5 to 20
BEGIN
  -- Get current count for today
  SELECT COALESCE(send_count, 0) INTO current_count
  FROM public.daily_ai_sends
  WHERE user_id = p_user_id AND send_date = CURRENT_DATE;
  
  RETURN json_build_object(
    'count', current_count,
    'remaining', daily_limit - current_count,
    'daily_limit', daily_limit,
    'limit_reached', current_count >= daily_limit
  );
END;
$function$;