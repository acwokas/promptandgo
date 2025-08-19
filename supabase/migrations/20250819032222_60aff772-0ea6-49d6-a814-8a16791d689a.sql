-- Allow NULL values for user_id in subscribers table for anonymous newsletter subscriptions
ALTER TABLE public.subscribers ALTER COLUMN user_id DROP NOT NULL;