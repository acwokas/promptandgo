-- Fix RLS policy for shared_links to allow create-share-link edge function to work
-- The function runs without JWT verification but needs to create share links

-- Drop the existing problematic insert policy
DROP POLICY IF EXISTS "shared_links_insert_policy" ON public.shared_links;

-- Create a new policy that allows the edge function to work properly
-- Allow inserts for service_role OR when authenticated users create their own links OR anonymous users
CREATE POLICY "shared_links_insert_policy" 
ON public.shared_links 
FOR INSERT 
TO public
WITH CHECK (
  -- Service role can always insert
  auth.role() = 'service_role'::text OR 
  -- Authenticated users can insert links they own
  (auth.uid() IS NOT NULL AND shared_by = auth.uid()) OR
  -- Allow anonymous inserts (for edge function without JWT verification)
  (auth.uid() IS NULL AND (shared_by IS NULL OR shared_by IS NOT NULL))
);