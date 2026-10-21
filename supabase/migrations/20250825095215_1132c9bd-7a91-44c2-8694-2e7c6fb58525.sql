-- Fix RLS policies for subscribers table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create proper RLS policies for subscribers table
-- Allow users to view their own subscription info
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscribers;
CREATE POLICY "Users can view own subscription" ON public.subscribers
FOR SELECT
USING (auth.uid() = user_id OR auth.email() = email);

-- Allow edge functions to insert subscription info (service role bypass)
DROP POLICY IF EXISTS "Service role can insert subscriptions" ON public.subscribers;
CREATE POLICY "Service role can insert subscriptions" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Allow edge functions to update subscription info (service role bypass)
DROP POLICY IF EXISTS "Service role can update subscriptions" ON public.subscribers;
CREATE POLICY "Service role can update subscriptions" ON public.subscribers
FOR UPDATE
USING (true);

-- Ensure RLS is enabled
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."subscribers" ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON TABLE public."subscribers" TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public."subscribers" TO authenticated;
GRANT SELECT, UPDATE ON TABLE public."subscribers" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."subscribers"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."subscribers"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO anon, authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;
