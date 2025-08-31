-- Fix security vulnerability in pending_contacts table RLS policies

-- Drop the existing insecure INSERT policy
DROP POLICY IF EXISTS "contact_submissions_service_role_only" ON public.pending_contacts;

-- Create a proper service-role-only INSERT policy
CREATE POLICY "contact_submissions_service_role_only" 
ON public.pending_contacts 
FOR INSERT 
WITH CHECK (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

-- Add missing DELETE policy for security completeness
-- Only admins should be able to delete contact submissions
CREATE POLICY "pending_contacts_admin_delete_only" 
ON public.pending_contacts 
FOR DELETE 
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Ensure the UPDATE policy is properly secured (verify existing policy)
-- The existing policy looks correct but let's make sure it's properly named
DROP POLICY IF EXISTS "Admin only can update contacts" ON public.pending_contacts;

CREATE POLICY "pending_contacts_admin_update_only" 
ON public.pending_contacts 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'admin'::app_role)
) 
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Verify SELECT policy is secure (the existing one looks correct)
-- pending_contacts_admin_access_only with has_role(auth.uid(), 'admin'::app_role)

-- Add a comment for documentation
COMMENT ON TABLE public.pending_contacts IS 'Stores contact form submissions. Access restricted to service role for INSERT and admin role for SELECT/UPDATE/DELETE operations.';

-- Create an index on confirmation_token for performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_pending_contacts_confirmation_token 
ON public.pending_contacts(confirmation_token);

-- Create an index on email for admin lookups (if not exists) 
CREATE INDEX IF NOT EXISTS idx_pending_contacts_email 
ON public.pending_contacts(email);