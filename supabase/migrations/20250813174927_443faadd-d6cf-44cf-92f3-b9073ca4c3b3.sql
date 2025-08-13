-- Fix critical security issue: Secure pending_contacts table
-- Remove overly permissive public select policy and replace with proper restrictions

-- Drop the existing overly permissive select policy
DROP POLICY IF EXISTS "Allow public select by confirmation token" ON public.pending_contacts;

-- Create a new policy that only allows selecting by specific confirmation token
-- This is needed for the confirmation flow to work
CREATE POLICY "Allow select by specific confirmation token" 
ON public.pending_contacts 
FOR SELECT 
USING (confirmation_token = ANY(string_to_array(current_setting('request.headers', true)::json->>'confirmation-token', ',')));

-- Alternative approach: Allow admins to view all contacts for management
CREATE POLICY "Admins can view all contacts" 
ON public.pending_contacts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Also restrict the update policy to only allow updates by confirmation token
DROP POLICY IF EXISTS "Allow public update by confirmation token" ON public.pending_contacts;

CREATE POLICY "Allow update by specific confirmation token" 
ON public.pending_contacts 
FOR UPDATE 
USING (confirmation_token = ANY(string_to_array(current_setting('request.headers', true)::json->>'confirmation-token', ',')));

-- Keep the public insert policy as it's needed for the contact form
-- The existing "Allow public insert of pending contacts" policy is fine