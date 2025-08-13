-- Drop the unsafe subscribers_safe view
-- The view serves no security purpose and potentially creates a security risk
-- Applications should directly query the subscribers table where RLS policies are properly enforced

DROP VIEW IF EXISTS public.subscribers_safe;