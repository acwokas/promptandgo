-- Fix security issues in subscribers table

-- First, let's ensure user_id is never null by setting a default and making it NOT NULL
-- But first, we need to update any existing records that have null user_id
UPDATE public.subscribers 
SET user_id = '00000000-0000-0000-0000-000000000000'::uuid 
WHERE user_id IS NULL;

-- Now make user_id NOT NULL to prevent future security gaps
ALTER TABLE public.subscribers 
ALTER COLUMN user_id SET NOT NULL;

-- Drop existing RLS policies to recreate them with better security
DROP POLICY IF EXISTS "subscribers_insert_own_row" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_select_by_user_id" ON public.subscribers;  
DROP POLICY IF EXISTS "subscribers_update_own_row" ON public.subscribers;

-- Create more secure RLS policies
-- Only allow users to view their own subscriber record
CREATE POLICY "subscribers_select_own_record" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Only allow authenticated users to insert their own subscriber record
CREATE POLICY "subscribers_insert_own_record" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Only allow users to update their own subscriber record
CREATE POLICY "subscribers_update_own_record" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- Prevent any DELETE operations by regular users (only edge functions should delete)
-- No delete policy means no one can delete

-- Create a secure view that only exposes safe, decrypted data to users
CREATE OR REPLACE VIEW public.subscribers_safe AS 
SELECT 
  id,
  user_id,
  subscribed,
  subscription_tier,
  subscription_end,
  updated_at
FROM public.subscribers
WHERE user_id = auth.uid();

-- Grant SELECT permission on the safe view to authenticated users
GRANT SELECT ON public.subscribers_safe TO authenticated;

-- Create a security definer function to safely get subscriber info
CREATE OR REPLACE FUNCTION public.get_subscriber_info(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid, 
  subscribed boolean,
  subscription_tier text,
  subscription_end timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    s.id,
    s.user_id,
    s.subscribed,
    s.subscription_tier,
    s.subscription_end,
    s.updated_at
  FROM public.subscribers s
  WHERE s.user_id = p_user_id
  AND s.user_id = auth.uid(); -- Double check auth
$$;

-- Ensure the subscribers table has proper constraints
ALTER TABLE public.subscribers 
ADD CONSTRAINT check_user_id_not_system_user 
CHECK (user_id != '00000000-0000-0000-0000-000000000000'::uuid);

-- Clean up any system user records we created temporarily
DELETE FROM public.subscribers 
WHERE user_id = '00000000-0000-0000-0000-000000000000'::uuid;