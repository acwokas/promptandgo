-- Security hardening for subscribers table
-- 1) Drop email-based access policies
-- 2) Enforce user_id-only access
-- 3) Add unique index on user_id to support safe upserts

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that allow email-based access
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;

-- Create strict policies using user_id only
DROP POLICY IF EXISTS "subscribers_select_by_user_id" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_select_by_user_id" ON public.subscribers;
CREATE POLICY "subscribers_select_by_user_id"
ON public.subscribers
FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "subscribers_insert_own_row" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_insert_own_row" ON public.subscribers;
CREATE POLICY "subscribers_insert_own_row"
ON public.subscribers
FOR INSERT
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "subscribers_update_own_row" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_update_own_row" ON public.subscribers;
CREATE POLICY "subscribers_update_own_row"
ON public.subscribers
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Add unique index on user_id to support ON CONFLICT upserts and prevent duplicates
-- Note: multiple NULLs are allowed and fine for service writes that might not set user_id
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_user_id_unique ON public.subscribers (user_id);


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
