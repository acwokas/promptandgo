-- COMPREHENSIVE SECURITY FIXES MIGRATION
-- Fix multiple critical security vulnerabilities identified in audit

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

-- 3. Lock down avatars storage bucket with strict policies
-- Users can only upload to their own folder and only specific file types
CREATE POLICY "avatars_authenticated_insert_own_folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND lower(right(name, 4)) IN ('.jpg', '.png', '.gif', '.bmp')
);

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

CREATE POLICY "avatars_authenticated_delete_own_files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add security comments for documentation
COMMENT ON POLICY "subscribers_service_role_insert_only" ON public.subscribers IS 'SECURITY: Only service role can insert subscriber records';
COMMENT ON POLICY "subscribers_service_role_update_only" ON public.subscribers IS 'SECURITY: Only service role can update subscriber records';
COMMENT ON POLICY "subscribers_admin_select_all" ON public.subscribers IS 'SECURITY: Only admins can view subscriber data';
COMMENT ON POLICY "avatars_authenticated_insert_own_folder" ON storage.objects IS 'SECURITY: Users can only upload avatars to their own folder with allowed extensions';
COMMENT ON POLICY "avatars_authenticated_update_own_files" ON storage.objects IS 'SECURITY: Users can only update their own avatar files';
COMMENT ON POLICY "avatars_authenticated_delete_own_files" ON storage.objects IS 'SECURITY: Users can only delete their own avatar files';