-- Allow public users to insert newsletter subscriptions
DROP POLICY IF EXISTS "Allow public newsletter signups" ON public.subscribers;
DROP POLICY IF EXISTS "Allow public newsletter signups" ON public.subscribers;
CREATE POLICY "Allow public newsletter signups" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (true);

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."subscribers" ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON TABLE public."subscribers" TO anon;
GRANT INSERT ON TABLE public."subscribers" TO authenticated;
GRANT SELECT, UPDATE ON TABLE public."subscribers" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."subscribers"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."subscribers"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO anon, authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;
