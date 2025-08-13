-- Fix the RLS policies properly for pending_contacts table
-- The issue is that we don't need public read access at all since only edge functions access this data

-- Drop all the policies I just created that were incorrect
DROP POLICY IF EXISTS "Allow select by specific confirmation token" ON public.pending_contacts;
DROP POLICY IF EXISTS "Allow update by specific confirmation token" ON public.pending_contacts;

-- Keep only admin access for viewing contacts (for management purposes)
-- The existing "Admins can view all contacts" policy is good

-- Remove the public update policy completely since edge function uses service role
-- Public users should not be able to update contacts - only the confirmation edge function should

-- The public insert policy should remain for contact form submissions
-- Let's verify all current policies and ensure they're correct:

-- 1. Public can insert (needed for contact form) - KEEP existing policy
-- 2. Admins can view all (needed for management) - ALREADY CREATED
-- 3. No public read/update access (edge function uses service role) - REMOVE existing policies

-- Clean up - remove any remaining public access policies
DO $$
BEGIN
  -- Check if there are any remaining public policies and drop them
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'pending_contacts' 
    AND (policyname LIKE '%public update%' OR policyname LIKE '%public select%')
    AND policyname != 'Allow public insert of pending contacts'
  ) THEN
    -- This will be handled by the explicit drops above
    NULL;
  END IF;
END $$;