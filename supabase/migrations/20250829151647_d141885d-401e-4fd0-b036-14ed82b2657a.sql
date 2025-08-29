-- Enable RLS and add policy for subscribers table so users can read their own subscription
ALTER TABLE IF EXISTS public.subscribers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'subscribers' AND policyname = 'Users can view their own subscription'
  ) THEN
    CREATE POLICY "Users can view their own subscription"
    ON public.subscribers
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END $$;