-- Create security monitoring function for unusual admin access patterns
CREATE OR REPLACE FUNCTION public.detect_unusual_admin_access()
RETURNS TABLE(
  user_id uuid,
  action_count bigint,
  last_action timestamp with time zone,
  risk_level text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admin users to run this monitoring function
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required for security monitoring';
  END IF;
  
  RETURN QUERY
  WITH admin_activity AS (
    SELECT 
      sal.user_id,
      COUNT(*) as action_count,
      MAX(sal.created_at) as last_action,
      CASE 
        WHEN COUNT(*) > 50 THEN 'HIGH'
        WHEN COUNT(*) > 20 THEN 'MEDIUM'
        ELSE 'LOW'
      END as risk_level
    FROM public.security_audit_log sal
    WHERE sal.created_at >= now() - interval '1 hour'
      AND sal.user_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.user_roles ur 
        WHERE ur.user_id = sal.user_id 
        AND ur.role = 'admin'::app_role
      )
    GROUP BY sal.user_id
  )
  SELECT * FROM admin_activity 
  WHERE action_count > 10 -- Only show potentially unusual activity
  ORDER BY action_count DESC;
END;
$$;

-- Create function to log security events with enhanced metadata
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_severity text DEFAULT 'INFO',
  p_description text DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    user_agent,
    created_at
  ) VALUES (
    auth.uid(),
    p_event_type || '_' || p_severity,
    'security_events',
    NULL,
    COALESCE(p_description, '') || CASE 
      WHEN p_metadata IS NOT NULL THEN ' | ' || p_metadata::text 
      ELSE '' 
    END,
    now()
  );
END;
$$;

-- Create API key rotation tracking table
CREATE TABLE IF NOT EXISTS public.api_key_rotation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  rotation_date timestamp with time zone NOT NULL DEFAULT now(),
  rotated_by uuid,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on API key rotation log
ALTER TABLE public.api_key_rotation_log ENABLE ROW LEVEL SECURITY;

-- Create policies for API key rotation log
CREATE POLICY "Admins can manage API key rotation log"
ON public.api_key_rotation_log
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create function to check API key age and recommend rotation
CREATE OR REPLACE FUNCTION public.check_api_key_rotation_status()
RETURNS TABLE(
  service_name text,
  last_rotation timestamp with time zone,
  days_since_rotation integer,
  rotation_recommended boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admin users
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  -- Return API key rotation status (30+ days = recommended)
  RETURN QUERY
  WITH key_services AS (
    SELECT unnest(ARRAY[
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY',
      'STRIPE_SECRET_KEY',
      'RESEND_API_KEY',
      'GROQ_API_KEY',
      'DEEPSEEK_API_KEY'
    ]) as service
  ),
  rotation_data AS (
    SELECT 
      ks.service as service_name,
      COALESCE(MAX(akrl.rotation_date), '2024-01-01'::timestamp with time zone) as last_rotation
    FROM key_services ks
    LEFT JOIN public.api_key_rotation_log akrl ON akrl.service_name = ks.service
    GROUP BY ks.service
  )
  SELECT 
    rd.service_name,
    rd.last_rotation,
    EXTRACT(days FROM now() - rd.last_rotation)::integer as days_since_rotation,
    (EXTRACT(days FROM now() - rd.last_rotation) > 30) as rotation_recommended
  FROM rotation_data rd
  ORDER BY days_since_rotation DESC;
END;
$$;

-- Create enhanced rate limiting function with security alerting
CREATE OR REPLACE FUNCTION public.enhanced_security_rate_limit(
  p_identifier text,
  p_action text,
  p_limit integer DEFAULT 5,
  p_window_minutes integer DEFAULT 15
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count integer := 0;
  window_start timestamp with time zone;
  is_blocked boolean := false;
BEGIN
  -- Calculate window start
  window_start := date_trunc('minute', now()) - (extract(minute from now())::int % p_window_minutes) * interval '1 minute';
  
  -- Get current count
  SELECT COALESCE(count, 0) INTO current_count
  FROM public.rate_limits
  WHERE key = p_identifier || '_' || p_action
    AND window_start = window_start;
  
  -- Check if limit exceeded
  IF current_count >= p_limit THEN
    is_blocked := true;
    
    -- Log security event for excessive attempts
    PERFORM public.log_security_event(
      'RATE_LIMIT_EXCEEDED',
      'WARNING',
      'Rate limit exceeded for action: ' || p_action,
      jsonb_build_object(
        'identifier', p_identifier,
        'action', p_action,
        'attempts', current_count,
        'limit', p_limit
      )
    );
  ELSE
    -- Increment counter
    INSERT INTO public.rate_limits (key, count, window_start)
    VALUES (p_identifier || '_' || p_action, 1, window_start)
    ON CONFLICT (key, window_start)
    DO UPDATE SET count = rate_limits.count + 1;
  END IF;
  
  RETURN NOT is_blocked;
END;
$$;