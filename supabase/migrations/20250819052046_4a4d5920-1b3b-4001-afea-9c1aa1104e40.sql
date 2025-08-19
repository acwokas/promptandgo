-- Make subscribers.email nullable to support anonymous newsletter signups stored via email_hash
ALTER TABLE public.subscribers ALTER COLUMN email DROP NOT NULL;