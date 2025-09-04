-- Fix security issue: Ensure pending_contacts table is completely protected from public access
-- Add explicit policy to deny public access and ensure all operations require proper authentication

-- First, let's add a policy that explicitly denies any public access
-- This will act as a fallback to prevent any potential bypass of authentication
CREATE POLICY "Deny all public access to pending_contacts" 
ON public.pending_contacts 
FOR ALL 
TO anon, public 
USING (false) 
WITH CHECK (false);

-- Ensure the service role policy is more explicit about authentication requirements
DROP POLICY IF EXISTS "contact_submissions_service_role_only" ON public.pending_contacts;
CREATE POLICY "contact_submissions_service_role_only" 
ON public.pending_contacts 
FOR INSERT 
TO service_role
WITH CHECK (
  -- Double-check that this is actually from service role
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

-- Update admin policies to be more explicit about authentication requirements
DROP POLICY IF EXISTS "pending_contacts_admin_access_only" ON public.pending_contacts;
CREATE POLICY "pending_contacts_admin_access_only" 
ON public.pending_contacts 
FOR SELECT 
TO authenticated
USING (
  -- Must be authenticated AND have admin role
  auth.uid() IS NOT NULL AND 
  has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "pending_contacts_admin_update_only" ON public.pending_contacts;
CREATE POLICY "pending_contacts_admin_update_only" 
ON public.pending_contacts 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  has_role(auth.uid(), 'admin'::app_role)
) 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "pending_contacts_admin_delete_only" ON public.pending_contacts;
CREATE POLICY "pending_contacts_admin_delete_only" 
ON public.pending_contacts 
FOR DELETE 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  has_role(auth.uid(), 'admin'::app_role)
);