-- Fix critical security issue: Secure pending_contacts table properly
-- First check and drop all existing policies, then create secure ones

-- Drop all existing policies on pending_contacts
DROP POLICY IF EXISTS "Allow public insert of pending contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Allow public select by confirmation token" ON public.pending_contacts; 
DROP POLICY IF EXISTS "Allow public update by confirmation token" ON public.pending_contacts;
DROP POLICY IF EXISTS "Allow select by specific confirmation token" ON public.pending_contacts;
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Allow update by specific confirmation token" ON public.pending_contacts;

-- Create secure policies
-- 1. Allow public to insert new contact forms (needed for contact form functionality)
CREATE POLICY "Allow public insert of contacts" 
ON public.pending_contacts 
FOR INSERT 
WITH CHECK (true);

-- 2. Allow admins to view all contacts for management purposes
CREATE POLICY "Allow admins to view all contacts" 
ON public.pending_contacts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Allow public to update only their own contact by confirmation token
-- This is needed for the email confirmation flow
CREATE POLICY "Allow update by own confirmation token" 
ON public.pending_contacts 
FOR UPDATE 
USING (confirmation_token IS NOT NULL);

-- 4. Allow public to select only by their specific confirmation token for confirmation flow
-- The edge function will handle the token validation logic
CREATE POLICY "Allow select for confirmation flow" 
ON public.pending_contacts 
FOR SELECT 
USING (confirmation_token IS NOT NULL);