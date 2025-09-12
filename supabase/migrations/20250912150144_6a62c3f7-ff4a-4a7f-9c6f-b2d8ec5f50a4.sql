-- Security Fix: Protect Customer Contact Information and Sensitive Data
-- This migration addresses critical security vulnerabilities identified in the security scan

-- 1. Fix pending_contacts table - Remove conflicting policies and implement strict access control
DROP POLICY IF EXISTS "Deny all public access to pending_contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "contact_submissions_service_role_only" ON public.pending_contacts;
DROP POLICY IF EXISTS "pending_contacts_admin_access_only" ON public.pending_contacts;
DROP POLICY IF EXISTS "pending_contacts_admin_delete_only" ON public.pending_contacts;
DROP POLICY IF EXISTS "pending_contacts_admin_update_only" ON public.pending_contacts;

-- Create new, strict policies for pending_contacts
-- Only service role can insert (for edge functions processing contact forms)
CREATE POLICY "pending_contacts_service_insert_only" 
ON public.pending_contacts 
FOR INSERT 
TO service_role
WITH CHECK (auth.role() = 'service_role');

-- Only admins can view contact submissions
CREATE POLICY "pending_contacts_admin_select_only" 
ON public.pending_contacts 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can update contact submissions (for marking as processed)
CREATE POLICY "pending_contacts_admin_update_only" 
ON public.pending_contacts 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can delete contact submissions
CREATE POLICY "pending_contacts_admin_delete_only" 
ON public.pending_contacts 
FOR DELETE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- 2. Strengthen subscribers table security
-- Drop and recreate policies with explicit role targeting
DROP POLICY IF EXISTS "subscribers_service_role_insert_only" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_service_role_update_only" ON public.subscribers;

-- Only service role can insert/update subscribers (for payment processing)
CREATE POLICY "subscribers_service_insert_only" 
ON public.subscribers 
FOR INSERT 
TO service_role
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "subscribers_service_update_only" 
ON public.subscribers 
FOR UPDATE 
TO service_role
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3. Fix user_feedback table to prevent unauthorized access
-- Ensure only feedback authors and admins can access feedback
DROP POLICY IF EXISTS "Authenticated users can submit feedback" ON public.user_feedback;

-- Users can only insert their own feedback
CREATE POLICY "users_insert_own_feedback_only" 
ON public.user_feedback 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- 4. Add additional security function for double-checking admin access
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE has_role(auth.uid(), 'admin'::app_role)
  END;
$$;

-- 5. Add policy to prevent any anonymous access to sensitive tables
-- Ensure RLS is enabled on all sensitive tables (redundant but safe)
ALTER TABLE public.pending_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 6. Add explicit deny policies for anonymous users on sensitive tables
CREATE POLICY "pending_contacts_deny_anonymous" 
ON public.pending_contacts 
FOR ALL 
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "subscribers_deny_anonymous" 
ON public.subscribers 
FOR ALL 
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "user_feedback_deny_anonymous" 
ON public.user_feedback 
FOR ALL 
TO anon
USING (false)
WITH CHECK (false);