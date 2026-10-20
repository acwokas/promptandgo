-- Tighten RLS on subscribers: restrict INSERT/UPDATE to authenticated users for their own rows
-- Drop overly permissive policies
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Insert policy: only authenticated users can insert their own record
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscribers;
CREATE POLICY "Users can insert their own subscription"
ON public.subscribers
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    user_id = auth.uid()
    OR (user_id IS NULL AND email = auth.email())
  )
);

-- Update policy: only authenticated users can update their own record
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;
CREATE POLICY "Users can update their own subscription"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (
  (user_id = auth.uid()) OR (email = auth.email())
)
WITH CHECK (
  (user_id = auth.uid()) OR (email = auth.email())
);


-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."subscribers" ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON TABLE public."subscribers" TO authenticated;
GRANT SELECT, UPDATE ON TABLE public."subscribers" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."subscribers"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."subscribers"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;
