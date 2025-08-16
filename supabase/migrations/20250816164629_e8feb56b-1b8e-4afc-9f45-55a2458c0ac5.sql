-- Allow public users to insert newsletter subscriptions
CREATE POLICY "Allow public newsletter signups" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (true);