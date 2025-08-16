-- Fix critical RLS security issues

-- 1. Fix subscribers table - remove user insert/update policies that allow privilege escalation
DROP POLICY IF EXISTS "subscribers_insert_own_record" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_update_own_record" ON public.subscribers;

-- Keep only select policy for users to view their own subscription status
-- Subscription management should only happen via secure edge functions

-- 2. Fix ai_usage table - remove user insert/update policies that allow quota bypass
DROP POLICY IF EXISTS "Users can insert their own usage" ON public.ai_usage;
DROP POLICY IF EXISTS "Users can update their own usage" ON public.ai_usage;

-- Keep only select policy for users to view their usage
-- Usage management should only happen via the check_and_increment_usage function

-- 3. Fix shared_links table - prevent anonymous link creation
DROP POLICY IF EXISTS "Users can create shared links" ON public.shared_links;

-- Create new policy that requires authentication
CREATE POLICY "Authenticated users can create shared links" ON public.shared_links
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND shared_by = auth.uid());

-- 4. Add storage policies for avatars bucket to prevent malicious uploads
-- Create policy to ensure users can only manage their own avatar files
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Create secure storage policies
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid()::text = (storage.foldername(name))[1]
);