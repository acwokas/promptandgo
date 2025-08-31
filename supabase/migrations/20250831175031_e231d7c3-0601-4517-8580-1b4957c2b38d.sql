-- COMPREHENSIVE SECURITY FIXES MIGRATION (Part 1)
-- Fix critical security vulnerabilities identified in audit

-- 1. Enable pgcrypto extension (needed for secure_upsert_subscriber function)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Fix subscribers table RLS policies - CRITICAL SECURITY ISSUE
-- Drop the overly permissive service role policy that allows unrestricted access
DROP POLICY IF EXISTS "subscribers_service_role_all_operations" ON public.subscribers;

-- Create secure, specific policies for subscribers table
CREATE POLICY "subscribers_service_role_insert_only" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

CREATE POLICY "subscribers_service_role_update_only" 
ON public.subscribers 
FOR UPDATE 
USING (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
) 
WITH CHECK (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

-- Admin can view all subscriber data (for management purposes)
CREATE POLICY "subscribers_admin_select_all" 
ON public.subscribers 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add security comments for documentation
COMMENT ON POLICY "subscribers_service_role_insert_only" ON public.subscribers IS 'SECURITY: Only service role can insert subscriber records';
COMMENT ON POLICY "subscribers_service_role_update_only" ON public.subscribers IS 'SECURITY: Only service role can update subscriber records';
COMMENT ON POLICY "subscribers_admin_select_all" ON public.subscribers IS 'SECURITY: Only admins can view subscriber data';

-- Add security comment on the table
COMMENT ON TABLE public.subscribers IS 'SECURITY: Subscriber data with encrypted PII. Access restricted to service role and admins only.';