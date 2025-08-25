
-- 1) Lock down subscribers_admin_view (views don’t have RLS; use explicit grants)
REVOKE ALL ON TABLE public.subscribers_admin_view FROM anon, authenticated;

-- 2) Restrict shared_links base table and expose a safe public view

-- Drop public SELECT policy on shared_links if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public'
      AND tablename = 'shared_links'
      AND policyname = 'Anyone can read shared links'
  ) THEN
    EXECUTE 'DROP POLICY "Anyone can read shared links" ON public.shared_links';
  END IF;
END$$;

-- Ensure SELECT is limited to authenticated users and service_role
-- (If these policies already exist, drop/recreate to be safe)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='shared_links' 
      AND policyname='Authenticated can view shared links'
  ) THEN
    EXECUTE 'DROP POLICY "Authenticated can view shared links" ON public.shared_links';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='shared_links' 
      AND policyname='Service role can view shared links'
  ) THEN
    EXECUTE 'DROP POLICY "Service role can view shared links" ON public.shared_links';
  END IF;
END$$;

CREATE POLICY "Authenticated can view shared links"
  ON public.shared_links
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can view shared links"
  ON public.shared_links
  FOR SELECT
  TO service_role
  USING (true);

-- Create a restricted public view that exposes no user identifiers
DROP VIEW IF EXISTS public.shared_links_public;
CREATE VIEW public.shared_links_public AS
SELECT 
  short_code,
  original_url,
  content_type,
  content_id,
  title,
  created_at,
  updated_at
FROM public.shared_links;

-- Ensure anon/auth can read the public view
GRANT SELECT ON public.shared_links_public TO anon, authenticated;
