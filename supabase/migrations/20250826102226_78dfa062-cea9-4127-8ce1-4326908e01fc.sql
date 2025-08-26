-- Enforce RLS on pending_contacts to restrict reads to admins only
-- This preserves existing INSERT policies for public submissions

-- 1) Enable Row Level Security on the table (safe if already enabled)
ALTER TABLE public.pending_contacts ENABLE ROW LEVEL SECURITY;

-- 2) Ensure there is at least one restrictive SELECT policy in place
-- Note: We avoid dropping/recreating existing policies to prevent disruptions.
-- If a permissive SELECT policy exists, please let us know; we will remove it explicitly.
DO $$
BEGIN
  -- Create an admin-only SELECT policy if one with this name does not already exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'pending_contacts' 
      AND policyname = 'Admins can view contacts (select)'
  ) THEN
    CREATE POLICY "Admins can view contacts (select)" ON public.pending_contacts
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END$$;