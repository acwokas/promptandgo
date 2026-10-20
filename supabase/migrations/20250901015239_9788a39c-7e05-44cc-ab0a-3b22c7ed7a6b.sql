-- First drop the existing policy and recreate with correct permissions
DROP POLICY IF EXISTS "Allow shared link creation" ON public.shared_links;
DROP POLICY IF EXISTS "Authenticated users can create shared links" ON public.shared_links;

-- Create comprehensive policy for shared link creation
DROP POLICY IF EXISTS "shared_links_insert_policy" ON public.shared_links;
DROP POLICY IF EXISTS "shared_links_insert_policy" ON public.shared_links;
CREATE POLICY "shared_links_insert_policy" 
ON public.shared_links 
FOR INSERT 
WITH CHECK (
  -- Allow service role (used by edge functions)
  auth.role() = 'service_role'
  OR 
  -- Allow authenticated users to create links with their own ID
  (auth.uid() IS NOT NULL AND shared_by = auth.uid())
  OR
  -- Allow anonymous users (shared_by can be null)
  (shared_by IS NULL)
);

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
GRANT SELECT, INSERT ON TABLE public."shared_links" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."shared_links"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."shared_links"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO service_role',seq);
  END IF; END LOOP;
END $grants_sequence$;
