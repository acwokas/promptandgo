-- Fix Security Issues Identified in Security Scan

-- 1. Fix pending_contacts table RLS policies
-- Drop existing overly permissive policy and add proper admin-only access
DROP POLICY IF EXISTS "Public can submit contact forms" ON public.pending_contacts;
DROP POLICY IF EXISTS "Admin users can view all pending contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Admin users can update pending contacts" ON public.pending_contacts;

-- Add strict RLS policies for pending_contacts
CREATE POLICY "Only allow anonymous contact submissions with validation" 
ON public.pending_contacts 
FOR INSERT 
WITH CHECK (
  name IS NOT NULL AND 
  email IS NOT NULL AND 
  message IS NOT NULL AND 
  length(trim(name)) >= 2 AND 
  length(trim(email)) >= 5 AND 
  length(trim(message)) >= 10 AND
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

CREATE POLICY "Admin users can view all pending contacts" 
ON public.pending_contacts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin users can update pending contacts" 
ON public.pending_contacts 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix shared_links_public table RLS
-- Enable RLS if not already enabled
ALTER TABLE public.shared_links_public ENABLE ROW LEVEL SECURITY;

-- Add policy to allow public read access to shared links (this is intentional for sharing)
CREATE POLICY "Allow public read access to shared links" 
ON public.shared_links_public 
FOR SELECT 
USING (true);

-- 3. Fix subscribers table RLS policies
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Allow public newsletter signups" ON public.subscribers;
DROP POLICY IF EXISTS "Service role can insert subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Service role can update subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_select_own_record" ON public.subscribers;

-- Add secure subscribers policies
CREATE POLICY "Service role only can insert subscriptions" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

CREATE POLICY "Service role only can update subscriptions" 
ON public.subscribers 
FOR UPDATE 
USING (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

CREATE POLICY "Users can view own subscription data only" 
ON public.subscribers 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- 4. Drop the security definer view that's causing the linter warning
-- and replace with a secure function-based approach
DROP VIEW IF EXISTS public.subscribers_admin_view;

-- Create a secure function to get subscriber admin data instead
CREATE OR REPLACE FUNCTION public.get_subscribers_admin_view()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  email_hash text,
  subscribed boolean,
  subscription_tier text,
  subscription_end timestamp with time zone,
  updated_at timestamp with time zone
) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- SECURITY: Only allow admin users
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  -- Return safe subscriber data (no encrypted fields)
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.email_hash,
    s.subscribed,
    s.subscription_tier,
    s.subscription_end,
    s.updated_at
  FROM public.subscribers s;
END;
$$;

-- 5. Create storage policies for avatars bucket
-- First, create policies for the avatars bucket to restrict write access
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

-- Remove any existing overly permissive policies
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;

-- Add secure storage policies for avatars
CREATE POLICY "Avatar images are publicly readable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars to their folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid() IS NOT NULL AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  (storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')
);

CREATE POLICY "Users can update their own avatar files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'avatars' AND 
  auth.uid() IS NOT NULL AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'avatars' AND 
  auth.uid() IS NOT NULL AND
  auth.uid()::text = (storage.foldername(name))[1]
);