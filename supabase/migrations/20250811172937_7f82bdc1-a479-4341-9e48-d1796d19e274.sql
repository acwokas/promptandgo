-- Grant admin role to the current operator so CSV imports can create packs and prompts
-- Ensure id matches the logged-in user performing the upload
INSERT INTO public.user_roles (user_id, role)
SELECT '2402c1a6-b93b-4588-a7d0-259ba4f67b5b'::uuid, 'admin'::app_role
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = '2402c1a6-b93b-4588-a7d0-259ba4f67b5b'::uuid AND role = 'admin'::app_role
);
