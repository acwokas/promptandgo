-- ============================================
-- PHASE 1 FOLLOW-UP: FIX USER_FEEDBACK & SHARED_LINKS RLS (CORRECTED)
-- ============================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Public can view feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Anyone can view feedback" ON public.user_feedback;

-- Ensure strict RLS policies for user_feedback
-- Users can only see their own feedback
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
CREATE POLICY "Admins can view all feedback"
  ON public.user_feedback
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Block all anonymous access explicitly
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
CREATE POLICY "Authenticated users can create own links"
  ON public.shared_links
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND shared_by = auth.uid()
  );

CREATE POLICY "Service role can insert shared links"
  ON public.shared_links
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

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

CREATE POLICY "Service role can view shared links"
  ON public.shared_links
  FOR SELECT
  USING (auth.role() = 'service_role');