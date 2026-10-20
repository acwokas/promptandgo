-- Final security fix: Clean up all subscribers table policies

-- Drop ALL existing policies on subscribers table to start clean
DROP POLICY IF EXISTS "Service role only can insert subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Service role only can update subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Users can view own subscription by user_id only" ON public.subscribers;

-- Add single, clean, secure policies
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscribers;
CREATE POLICY "Service role can manage subscriptions" 
ON public.subscribers 
FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

DROP POLICY IF EXISTS "Users can view only their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can view only their own subscription" ON public.subscribers;
CREATE POLICY "Users can view only their own subscription" 
ON public.subscribers 
FOR SELECT 
USING (
  auth.uid() = user_id AND 
  auth.uid() IS NOT NULL
);

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."subscribers" ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public."subscribers" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."subscribers" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."subscribers"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."subscribers"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO service_role',seq);
  END IF; END LOOP;
END $grants_sequence$;
