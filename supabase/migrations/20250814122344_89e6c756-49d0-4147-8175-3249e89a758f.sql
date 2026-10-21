-- SECURITY FIX: Remove public read access from pending_contacts table
-- Only authenticated admins should be able to view contact submissions
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.pending_contacts;
CREATE POLICY "Admins can view all contacts" 
ON public.pending_contacts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- SECURITY FIX: Secure subscribers table - ensure only account owners and admins can access
DROP POLICY IF EXISTS "subscribers_select_own_record" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_select_own_record" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_select_own_record" ON public.subscribers;
CREATE POLICY "subscribers_select_own_record" 
ON public.subscribers 
FOR SELECT 
USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- SECURITY FIX: Remove NULL user_id access from user_feedback table
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.user_feedback;
CREATE POLICY "Users can view their own feedback" 
ON public.user_feedback 
FOR SELECT 
USING (user_id = auth.uid() AND user_id IS NOT NULL);

-- SECURITY FIX: Ensure feedback insertion requires authentication
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Authenticated users can submit feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Authenticated users can submit feedback" ON public.user_feedback;
CREATE POLICY "Authenticated users can submit feedback" 
ON public.user_feedback 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."pending_contacts" ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public."pending_contacts" TO authenticated;

ALTER TABLE public."subscribers" ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public."subscribers" TO authenticated;
GRANT SELECT, UPDATE ON TABLE public."subscribers" TO service_role;

ALTER TABLE public."user_feedback" ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON TABLE public."user_feedback" TO authenticated;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."user_feedback"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."user_feedback"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;
