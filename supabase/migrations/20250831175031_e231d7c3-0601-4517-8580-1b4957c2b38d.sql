-- COMPREHENSIVE SECURITY FIXES MIGRATION (Part 1)
-- Fix critical security vulnerabilities identified in audit

-- 1. Enable pgcrypto extension (needed for secure_upsert_subscriber function)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Fix subscribers table RLS policies - CRITICAL SECURITY ISSUE
-- Drop the overly permissive service role policy that allows unrestricted access
DROP POLICY IF EXISTS "subscribers_service_role_all_operations" ON public.subscribers;

-- Create secure, specific policies for subscribers table
DROP POLICY IF EXISTS "subscribers_service_role_insert_only" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_service_role_insert_only" ON public.subscribers;
CREATE POLICY "subscribers_service_role_insert_only" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

DROP POLICY IF EXISTS "subscribers_service_role_update_only" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_service_role_update_only" ON public.subscribers;
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
DROP POLICY IF EXISTS "subscribers_admin_select_all" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_admin_select_all" ON public.subscribers;
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

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."subscribers" ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public."subscribers" TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public."subscribers" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."subscribers"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."subscribers"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO service_role',seq);
  END IF; END LOOP;
END $grants_sequence$;
