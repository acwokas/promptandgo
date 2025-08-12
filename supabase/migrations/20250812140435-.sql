-- Security hardening for subscribers table
-- 1) Drop email-based access policies
-- 2) Enforce user_id-only access
-- 3) Add unique index on user_id to support safe upserts

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that allow email-based access
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;

-- Create strict policies using user_id only
CREATE POLICY "subscribers_select_by_user_id"
ON public.subscribers
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "subscribers_insert_own_row"
ON public.subscribers
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "subscribers_update_own_row"
ON public.subscribers
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Add unique index on user_id to support ON CONFLICT upserts and prevent duplicates
-- Note: multiple NULLs are allowed and fine for service writes that might not set user_id
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_user_id_unique ON public.subscribers (user_id);
