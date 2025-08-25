-- Final security fix: Clean up all subscribers table policies

-- Drop ALL existing policies on subscribers table to start clean
DROP POLICY IF EXISTS "Service role only can insert subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Service role only can update subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Users can view own subscription by user_id only" ON public.subscribers;

-- Add single, clean, secure policies
CREATE POLICY "Service role can manage subscriptions" 
ON public.subscribers 
FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

CREATE POLICY "Users can view only their own subscription" 
ON public.subscribers 
FOR SELECT 
USING (
  auth.uid() = user_id AND 
  auth.uid() IS NOT NULL
);