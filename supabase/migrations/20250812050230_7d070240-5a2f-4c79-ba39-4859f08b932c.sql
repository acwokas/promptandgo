-- Tighten RLS on subscribers: restrict INSERT/UPDATE to authenticated users for their own rows
-- Drop overly permissive policies
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Insert policy: only authenticated users can insert their own record
CREATE POLICY "Users can insert their own subscription"
ON public.subscribers
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    user_id = auth.uid()
    OR (user_id IS NULL AND email = auth.email())
  )
);

-- Update policy: only authenticated users can update their own record
CREATE POLICY "Users can update their own subscription"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (
  (user_id = auth.uid()) OR (email = auth.email())
)
WITH CHECK (
  (user_id = auth.uid()) OR (email = auth.email())
);
