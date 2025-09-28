-- Fix the security warnings from the linter

-- Fix search_path for functions that don't have it set
ALTER FUNCTION public.secure_contact_validation() SET search_path = public;
ALTER FUNCTION public.confirm_contact_secure(text, text) SET search_path = public;
ALTER FUNCTION public.get_pending_contacts_admin(text) SET search_path = public;
ALTER FUNCTION public.log_contact_modifications() SET search_path = public;