-- Create analytics events table for storing all tracked events
CREATE TABLE public.site_analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID,
  user_id UUID,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_category TEXT,
  page_path TEXT,
  page_title TEXT,
  referrer TEXT,
  metadata JSONB DEFAULT '{}',
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  ip_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user sessions table for tracking user journeys
CREATE TABLE public.analytics_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  pages_viewed INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  max_scroll_depth INTEGER DEFAULT 0,
  total_time_seconds INTEGER DEFAULT 0,
  entry_page TEXT,
  exit_page TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  ip_hash TEXT,
  is_bounce BOOLEAN DEFAULT true,
  converted BOOLEAN DEFAULT false,
  conversion_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create page views table for detailed page analytics
CREATE TABLE public.analytics_page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.analytics_sessions(id) ON DELETE CASCADE,
  user_id UUID,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  time_on_page_seconds INTEGER DEFAULT 0,
  scroll_depth INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversion funnels table
CREATE TABLE public.analytics_funnels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_name TEXT NOT NULL,
  funnel_steps JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create funnel completions table
CREATE TABLE public.analytics_funnel_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id UUID REFERENCES public.analytics_funnels(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.analytics_sessions(id) ON DELETE CASCADE,
  user_id UUID,
  steps_completed JSONB NOT NULL DEFAULT '[]',
  completed_at TIMESTAMP WITH TIME ZONE,
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_analytics_events_session ON public.site_analytics_events(session_id);
CREATE INDEX idx_analytics_events_user ON public.site_analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON public.site_analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON public.site_analytics_events(created_at);
CREATE INDEX idx_analytics_events_page ON public.site_analytics_events(page_path);
CREATE INDEX idx_analytics_sessions_user ON public.analytics_sessions(user_id);
CREATE INDEX idx_analytics_sessions_start ON public.analytics_sessions(session_start);
CREATE INDEX idx_analytics_page_views_session ON public.analytics_page_views(session_id);
CREATE INDEX idx_analytics_page_views_path ON public.analytics_page_views(page_path);

-- Enable RLS on all tables
ALTER TABLE public.site_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_funnel_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_analytics_events
CREATE POLICY "Anyone can insert events"
ON public.site_analytics_events
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all events"
ON public.site_analytics_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own events"
ON public.site_analytics_events
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies for analytics_sessions
CREATE POLICY "Anyone can insert sessions"
ON public.analytics_sessions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update anonymous sessions"
ON public.analytics_sessions
FOR UPDATE
USING (true);

CREATE POLICY "Admins can view all sessions"
ON public.analytics_sessions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own sessions"
ON public.analytics_sessions
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies for analytics_page_views
CREATE POLICY "Anyone can insert page views"
ON public.analytics_page_views
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all page views"
ON public.analytics_page_views
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own page views"
ON public.analytics_page_views
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies for analytics_funnels
CREATE POLICY "Admins can manage funnels"
ON public.analytics_funnels
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active funnels"
ON public.analytics_funnels
FOR SELECT
USING (is_active = true);

-- RLS Policies for analytics_funnel_completions
CREATE POLICY "Anyone can insert funnel completions"
ON public.analytics_funnel_completions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update funnel completions"
ON public.analytics_funnel_completions
FOR UPDATE
USING (true);

CREATE POLICY "Admins can view all funnel completions"
ON public.analytics_funnel_completions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own funnel completions"
ON public.analytics_funnel_completions
FOR SELECT
USING (auth.uid() = user_id);

-- Create function to get analytics summary
CREATE OR REPLACE FUNCTION public.get_analytics_summary(
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
  total_sessions BIGINT,
  total_page_views BIGINT,
  total_events BIGINT,
  unique_visitors BIGINT,
  avg_session_duration NUMERIC,
  bounce_rate NUMERIC,
  conversion_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT s.id)::BIGINT as total_sessions,
    COALESCE(SUM(s.pages_viewed), 0)::BIGINT as total_page_views,
    COALESCE(SUM(s.events_count), 0)::BIGINT as total_events,
    COUNT(DISTINCT COALESCE(s.user_id::TEXT, s.ip_hash))::BIGINT as unique_visitors,
    ROUND(AVG(s.total_time_seconds)::NUMERIC, 2) as avg_session_duration,
    ROUND((COUNT(CASE WHEN s.is_bounce THEN 1 END)::NUMERIC / NULLIF(COUNT(*), 0) * 100)::NUMERIC, 2) as bounce_rate,
    ROUND((COUNT(CASE WHEN s.converted THEN 1 END)::NUMERIC / NULLIF(COUNT(*), 0) * 100)::NUMERIC, 2) as conversion_rate
  FROM public.analytics_sessions s
  WHERE s.session_start >= p_start_date AND s.session_start <= p_end_date;
END;
$$;

-- Create function to get top pages
CREATE OR REPLACE FUNCTION public.get_top_pages(
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  page_path TEXT,
  view_count BIGINT,
  avg_time_on_page NUMERIC,
  avg_scroll_depth NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pv.page_path,
    COUNT(*)::BIGINT as view_count,
    ROUND(AVG(pv.time_on_page_seconds)::NUMERIC, 2) as avg_time_on_page,
    ROUND(AVG(pv.scroll_depth)::NUMERIC, 2) as avg_scroll_depth
  FROM public.analytics_page_views pv
  WHERE pv.created_at >= p_start_date AND pv.created_at <= p_end_date
  GROUP BY pv.page_path
  ORDER BY view_count DESC
  LIMIT p_limit;
END;
$$;

-- Create function to get event counts by type
CREATE OR REPLACE FUNCTION public.get_event_counts(
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
  event_type TEXT,
  event_name TEXT,
  event_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.event_type,
    e.event_name,
    COUNT(*)::BIGINT as event_count
  FROM public.site_analytics_events e
  WHERE e.created_at >= p_start_date AND e.created_at <= p_end_date
  GROUP BY e.event_type, e.event_name
  ORDER BY event_count DESC;
END;
$$;