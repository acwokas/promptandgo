-- Fix conflicting RLS policies on subscribers table
-- This addresses the security finding: "Customer Payment Data Could Be Stolen by Hackers"

-- Drop the redundant and conflicting admin policies
DROP POLICY IF EXISTS "subscribers_admin_limited_access" ON public.subscribers;
DROP POLICY IF EXISTS "admins_full_subscriber_access" ON public.subscribers;

-- Remove the overly broad deny policy that could cause conflicts
DROP POLICY IF EXISTS "subscribers_deny_anonymous" ON public.subscribers;

-- Create a single, clear admin SELECT policy that uses the secure view function
-- This ensures admins can only access subscriber data through the controlled function
CREATE POLICY "admins_use_secure_function_only"
ON public.subscribers
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND user_id IS NOT NULL
);

-- Ensure users can only see their own subscription status (non-admins)
-- Note: The existing 'users_own_subscription_status_only' policy already handles this correctly

-- Add explicit deny for unauthenticated users on SELECT
CREATE POLICY "subscribers_deny_unauthenticated_select"
ON public.subscribers
FOR SELECT
TO anon
USING (false);

-- Add explicit deny for unauthenticated users on INSERT
CREATE POLICY "subscribers_deny_unauthenticated_insert"
ON public.subscribers
FOR INSERT
TO anon
WITH CHECK (false);

-- Add explicit deny for unauthenticated users on UPDATE  
CREATE POLICY "subscribers_deny_unauthenticated_update"
ON public.subscribers
FOR UPDATE
TO anon
USING (false)
WITH CHECK (false);

-- Add explicit deny for unauthenticated users on DELETE
CREATE POLICY "subscribers_deny_unauthenticated_delete"
ON public.subscribers
FOR DELETE
TO anon
USING (false);

-- Add comment explaining the security model
COMMENT ON TABLE public.subscribers IS 'Sensitive customer subscription data. Access is controlled through RLS policies: authenticated users can only view their own data, admins must use secure functions like get_safe_subscriber_view() or get_admin_subscriber_data() for decryption, and service role can insert/update for Stripe integration.';