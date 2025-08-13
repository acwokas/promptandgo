-- Add admin role for adrian@watkinsworks.asia user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('6889cd80-77e8-40df-abb9-e23ac21dc88a', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;