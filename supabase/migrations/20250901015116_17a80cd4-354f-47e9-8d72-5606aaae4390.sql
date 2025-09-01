-- Fix RLS policy for shared_links to allow service role and anonymous users
DROP POLICY IF EXISTS "Authenticated users can create shared links" ON public.shared_links;

-- Create new policy that allows service role and handles null shared_by
CREATE POLICY "Allow shared link creation" 
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