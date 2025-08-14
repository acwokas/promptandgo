-- Fix critical security vulnerabilities in RLS policies

-- 1. Secure pending_contacts table - remove public read access
DROP POLICY IF EXISTS "Allow public insert of contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Allow admins to view all contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Allow admin update of contacts" ON public.pending_contacts;

-- Create secure policies for pending_contacts
CREATE POLICY "Allow public insert of contacts" 
ON public.pending_contacts 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Admins can view all contacts" 
ON public.pending_contacts 
FOR SELECT 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contacts" 
ON public.pending_contacts 
FOR UPDATE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Secure user_feedback table - remove NULL auth access
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.user_feedback;

-- Create secure policy that doesn't allow NULL auth access
CREATE POLICY "Users can view their own feedback" 
ON public.user_feedback 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- 3. Add additional security to subscribers table
DROP POLICY IF EXISTS "subscribers_select_own_record" ON public.subscribers;

CREATE POLICY "subscribers_select_own_record" 
ON public.subscribers 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- 4. Ensure all sensitive tables have proper RLS enabled
ALTER TABLE public.pending_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;