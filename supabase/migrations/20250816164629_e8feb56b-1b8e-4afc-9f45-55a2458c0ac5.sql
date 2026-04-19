-- Allow public users to insert newsletter subscriptions
DROP POLICY IF EXISTS "Allow public newsletter signups" ON public.subscribers;
DROP POLICY IF EXISTS "Allow public newsletter signups" ON public.subscribers;
CREATE POLICY "Allow public newsletter signups" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (true);