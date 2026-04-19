-- COMPREHENSIVE SECURITY FIXES MIGRATION
-- Fix multiple critical security vulnerabilities identified in audit

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

-- 3. Lock down avatars storage bucket with strict policies
-- Users can only upload to their own folder and only specific file types
DROP POLICY IF EXISTS "avatars_authenticated_insert_own_folder" ON storage.objects;
DROP POLICY IF EXISTS "avatars_authenticated_insert_own_folder" ON storage.objects;
CREATE POLICY "avatars_authenticated_insert_own_folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND lower(right(name, 4)) IN ('.jpg', '.png', '.gif', '.bmp')
);

DROP POLICY IF EXISTS "avatars_authenticated_update_own_files" ON storage.objects;
DROP POLICY IF EXISTS "avatars_authenticated_update_own_files" ON storage.objects;
CREATE POLICY "avatars_authenticated_update_own_files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid()::text = (storage.foldername(name))[1]
) 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "avatars_authenticated_delete_own_files" ON storage.objects;
DROP POLICY IF EXISTS "avatars_authenticated_delete_own_files" ON storage.objects;
CREATE POLICY "avatars_authenticated_delete_own_files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add security comments for documentation (storage.objects excluded - not owner)
COMMENT ON POLICY "subscribers_service_role_insert_only" ON public.subscribers IS 'SECURITY: Only service role can insert subscriber records';
COMMENT ON POLICY "subscribers_service_role_update_only" ON public.subscribers IS 'SECURITY: Only service role can update subscriber records';
COMMENT ON POLICY "subscribers_admin_select_all" ON public.subscribers IS 'SECURITY: Only admins can view subscriber data';