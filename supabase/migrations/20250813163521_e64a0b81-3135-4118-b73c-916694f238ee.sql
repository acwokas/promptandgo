-- Add admin role for adrian@watkinsworks.asia user (skip if user doesn't exist in this environment)
INSERT INTO public.user_roles (user_id, role)
SELECT '6889cd80-77e8-40df-abb9-e23ac21dc88a'::uuid, 'admin'::app_role
WHERE EXISTS (SELECT 1 FROM auth.users WHERE id = '6889cd80-77e8-40df-abb9-e23ac21dc88a'::uuid)
ON CONFLICT (user_id, role) DO NOTHING;