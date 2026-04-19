-- Fix linter issue: ensure the view runs with invoker privileges (enforces caller's RLS)
ALTER VIEW public.subscribers_safe SET (security_invoker = true);
