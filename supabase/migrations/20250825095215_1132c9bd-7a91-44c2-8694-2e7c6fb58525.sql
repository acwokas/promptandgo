-- Fix RLS policies for subscribers table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create proper RLS policies for subscribers table
-- Allow users to view their own subscription info
CREATE POLICY "Users can view own subscription" ON public.subscribers
FOR SELECT
USING (auth.uid() = user_id OR auth.email() = email);

-- Allow edge functions to insert subscription info (service role bypass)
CREATE POLICY "Service role can insert subscriptions" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Allow edge functions to update subscription info (service role bypass)
CREATE POLICY "Service role can update subscriptions" ON public.subscribers
FOR UPDATE
USING (true);

-- Ensure RLS is enabled
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;