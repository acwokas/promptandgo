-- ============================================
-- PHASE 1 FOLLOW-UP: FIX USER_FEEDBACK & SHARED_LINKS RLS (CORRECTED)
-- ============================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Public can view feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Anyone can view feedback" ON public.user_feedback;

-- Ensure strict RLS policies for user_feedback
-- Users can only see their own feedback
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.user_feedback;
CREATE POLICY "Users can view their own feedback"
  ON public.user_feedback
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND auth.uid() = user_id
  );

-- Admins can view all feedback (but it's encrypted)
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.user_feedback;
CREATE POLICY "Admins can view all feedback"
  ON public.user_feedback
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Block all anonymous access explicitly
DROP POLICY IF EXISTS "user_feedback_deny_anonymous" ON public.user_feedback;
DROP POLICY IF EXISTS "user_feedback_deny_anonymous" ON public.user_feedback;
DROP POLICY IF EXISTS "user_feedback_deny_anonymous" ON public.user_feedback;
CREATE POLICY "user_feedback_deny_anonymous"
  ON public.user_feedback
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Tighten shared_links policies
DROP POLICY IF EXISTS "shared_links_insert_policy" ON public.shared_links;
DROP POLICY IF EXISTS "Authenticated can view shared links" ON public.shared_links;
DROP POLICY IF EXISTS "Service role can view shared links" ON public.shared_links;
DROP POLICY IF EXISTS "Service role can insert shared links" ON public.shared_links;

-- Recreate with proper restrictions
DROP POLICY IF EXISTS "Authenticated users can create own links" ON public.shared_links;
DROP POLICY IF EXISTS "Authenticated users can create own links" ON public.shared_links;
CREATE POLICY "Authenticated users can create own links"
  ON public.shared_links
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND shared_by = auth.uid()
  );

DROP POLICY IF EXISTS "Service role can insert shared links" ON public.shared_links;
DROP POLICY IF EXISTS "Service role can insert shared links" ON public.shared_links;
CREATE POLICY "Service role can insert shared links"
  ON public.shared_links
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view own shared links" ON public.shared_links;
DROP POLICY IF EXISTS "Users can view own shared links" ON public.shared_links;
CREATE POLICY "Users can view own shared links"
  ON public.shared_links
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND (
      shared_by = auth.uid() 
      OR public.has_role(auth.uid(), 'admin'::app_role)
    )
  );

DROP POLICY IF EXISTS "Service role can view shared links" ON public.shared_links;
DROP POLICY IF EXISTS "Service role can view shared links" ON public.shared_links;
CREATE POLICY "Service role can view shared links"
  ON public.shared_links
  FOR SELECT
  USING (auth.role() = 'service_role');

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."shared_links" ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON TABLE public."shared_links" TO authenticated;
GRANT SELECT, INSERT ON TABLE public."shared_links" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."shared_links"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."shared_links"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated, service_role',seq);
  END IF; END LOOP;
END $grants_sequence$;

ALTER TABLE public."user_feedback" ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."user_feedback" TO authenticated;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."user_feedback"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."user_feedback"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;
