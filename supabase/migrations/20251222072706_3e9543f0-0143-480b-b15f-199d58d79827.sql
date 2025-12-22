-- Create analytics thresholds table for configuring alerts
CREATE TABLE public.analytics_thresholds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  threshold_name TEXT NOT NULL,
  metric_type TEXT NOT NULL, -- 'sessions', 'conversions', 'page_views', 'events'
  comparison TEXT NOT NULL, -- 'greater_than', 'less_than', 'spike_percent'
  threshold_value INTEGER NOT NULL,
  time_window_minutes INTEGER NOT NULL DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  notify_email BOOLEAN DEFAULT true,
  notify_browser BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications log table
CREATE TABLE public.analytics_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  threshold_id UUID REFERENCES public.analytics_thresholds(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value INTEGER NOT NULL,
  threshold_value INTEGER NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL, -- 'email', 'browser', 'both'
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID
);

-- Create browser push subscriptions table
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Enable RLS
ALTER TABLE public.analytics_thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS for analytics_thresholds
CREATE POLICY "Admins can manage thresholds"
ON public.analytics_thresholds
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS for analytics_notifications
CREATE POLICY "Admins can view notifications"
ON public.analytics_notifications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can insert notifications"
ON public.analytics_notifications
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can update notifications"
ON public.analytics_notifications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS for push_subscriptions
CREATE POLICY "Users can manage their own subscriptions"
ON public.push_subscriptions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can read subscriptions"
ON public.push_subscriptions
FOR SELECT
USING (auth.role() = 'service_role');

-- Insert default thresholds
INSERT INTO public.analytics_thresholds (threshold_name, metric_type, comparison, threshold_value, time_window_minutes) VALUES
  ('Traffic Spike Alert', 'sessions', 'greater_than', 50, 60),
  ('Conversion Goal', 'conversions', 'greater_than', 10, 60),
  ('High Event Activity', 'events', 'greater_than', 200, 60),
  ('Low Traffic Warning', 'sessions', 'less_than', 5, 1440);

-- Create function to check thresholds
CREATE OR REPLACE FUNCTION public.check_analytics_thresholds()
RETURNS TABLE (
  threshold_id UUID,
  threshold_name TEXT,
  metric_type TEXT,
  current_value BIGINT,
  threshold_value INTEGER,
  is_triggered BOOLEAN,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH threshold_checks AS (
    SELECT 
      t.id as threshold_id,
      t.threshold_name,
      t.metric_type,
      t.comparison,
      t.threshold_value,
      t.time_window_minutes,
      t.last_triggered_at,
      CASE t.metric_type
        WHEN 'sessions' THEN (
          SELECT COUNT(*) FROM analytics_sessions 
          WHERE session_start >= now() - (t.time_window_minutes || ' minutes')::interval
        )
        WHEN 'conversions' THEN (
          SELECT COUNT(*) FROM analytics_sessions 
          WHERE session_start >= now() - (t.time_window_minutes || ' minutes')::interval
          AND converted = true
        )
        WHEN 'page_views' THEN (
          SELECT COUNT(*) FROM analytics_page_views 
          WHERE created_at >= now() - (t.time_window_minutes || ' minutes')::interval
        )
        WHEN 'events' THEN (
          SELECT COUNT(*) FROM site_analytics_events 
          WHERE created_at >= now() - (t.time_window_minutes || ' minutes')::interval
        )
        ELSE 0
      END as current_value
    FROM analytics_thresholds t
    WHERE t.is_active = true
  )
  SELECT 
    tc.threshold_id,
    tc.threshold_name,
    tc.metric_type,
    tc.current_value,
    tc.threshold_value,
    CASE 
      WHEN tc.comparison = 'greater_than' AND tc.current_value > tc.threshold_value THEN true
      WHEN tc.comparison = 'less_than' AND tc.current_value < tc.threshold_value THEN true
      ELSE false
    END as is_triggered,
    CASE 
      WHEN tc.comparison = 'greater_than' AND tc.current_value > tc.threshold_value 
        THEN tc.threshold_name || ': ' || tc.current_value || ' ' || tc.metric_type || ' in last ' || tc.time_window_minutes || ' min (threshold: ' || tc.threshold_value || ')'
      WHEN tc.comparison = 'less_than' AND tc.current_value < tc.threshold_value 
        THEN tc.threshold_name || ': Only ' || tc.current_value || ' ' || tc.metric_type || ' in last ' || tc.time_window_minutes || ' min (expected: >' || tc.threshold_value || ')'
      ELSE 'No alert'
    END as message
  FROM threshold_checks tc
  WHERE (
    (tc.comparison = 'greater_than' AND tc.current_value > tc.threshold_value) OR
    (tc.comparison = 'less_than' AND tc.current_value < tc.threshold_value)
  )
  AND (tc.last_triggered_at IS NULL OR tc.last_triggered_at < now() - interval '30 minutes');
END;
$$;