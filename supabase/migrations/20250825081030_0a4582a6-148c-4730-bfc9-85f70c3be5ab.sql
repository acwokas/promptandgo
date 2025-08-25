-- Fix the Security Definer View issue properly
-- Drop the problematic view since it doesn't provide additional security
DROP VIEW IF EXISTS public.subscribers_admin_view;