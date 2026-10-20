-- Fix critical security vulnerabilities in RLS policies

-- 1. Secure pending_contacts table - remove public read access
DROP POLICY IF EXISTS "Allow public insert of contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Allow admins to view all contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Allow admin update of contacts" ON public.pending_contacts;

-- Create secure policies for pending_contacts
DROP POLICY IF EXISTS "Allow public insert of contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Allow public insert of contacts" ON public.pending_contacts;
CREATE POLICY "Allow public insert of contacts" 
ON public.pending_contacts 
FOR INSERT 
TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.pending_contacts;
CREATE POLICY "Admins can view all contacts" 
ON public.pending_contacts 
FOR SELECT 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Admins can update contacts" ON public.pending_contacts;
CREATE POLICY "Admins can update contacts" 
ON public.pending_contacts 
FOR UPDATE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Secure user_feedback table - remove NULL auth access
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.user_feedback;

-- Create secure policy that doesn't allow NULL auth access
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.user_feedback;
CREATE POLICY "Users can view their own feedback" 
ON public.user_feedback 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- 3. Add additional security to subscribers table
DROP POLICY IF EXISTS "subscribers_select_own_record" ON public.subscribers;

DROP POLICY IF EXISTS "subscribers_select_own_record" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_select_own_record" ON public.subscribers;
CREATE POLICY "subscribers_select_own_record" 
ON public.subscribers 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- 4. Ensure all sensitive tables have proper RLS enabled
ALTER TABLE public.pending_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."pending_contacts" ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON TABLE public."pending_contacts" TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public."pending_contacts" TO authenticated;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."pending_contacts"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."pending_contacts"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO anon, authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;

ALTER TABLE public."subscribers" ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public."subscribers" TO authenticated;
GRANT SELECT, UPDATE ON TABLE public."subscribers" TO service_role;

ALTER TABLE public."user_feedback" ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public."user_feedback" TO authenticated;
