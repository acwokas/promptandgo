-- SECURITY FIX: Remove public read access from pending_contacts table
-- Only authenticated admins should be able to view contact submissions
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.pending_contacts;
CREATE POLICY "Admins can view all contacts" 
ON public.pending_contacts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- SECURITY FIX: Secure subscribers table - ensure only account owners and admins can access
DROP POLICY IF EXISTS "subscribers_select_own_record" ON public.subscribers;
CREATE POLICY "subscribers_select_own_record" 
ON public.subscribers 
FOR SELECT 
USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- SECURITY FIX: Remove NULL user_id access from user_feedback table
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.user_feedback;
CREATE POLICY "Users can view their own feedback" 
ON public.user_feedback 
FOR SELECT 
USING (user_id = auth.uid() AND user_id IS NOT NULL);

-- SECURITY FIX: Ensure feedback insertion requires authentication
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.user_feedback;
CREATE POLICY "Authenticated users can submit feedback" 
ON public.user_feedback 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());