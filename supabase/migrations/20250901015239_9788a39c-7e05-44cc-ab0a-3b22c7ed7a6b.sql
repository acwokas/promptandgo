-- First drop the existing policy and recreate with correct permissions
DROP POLICY IF EXISTS "Allow shared link creation" ON public.shared_links;
DROP POLICY IF EXISTS "Authenticated users can create shared links" ON public.shared_links;

-- Create comprehensive policy for shared link creation
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