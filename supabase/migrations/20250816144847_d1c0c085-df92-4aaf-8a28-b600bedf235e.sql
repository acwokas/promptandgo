-- Create user ratings table
CREATE TABLE IF NOT EXISTS public.user_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prompt_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for user ratings
DROP POLICY IF EXISTS "Users can view their own ratings" ON public.user_ratings;
DROP POLICY IF EXISTS "Users can view their own ratings" ON public.user_ratings;
CREATE POLICY "Users can view their own ratings" 
ON public.user_ratings 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own ratings" ON public.user_ratings;
DROP POLICY IF EXISTS "Users can insert their own ratings" ON public.user_ratings;
CREATE POLICY "Users can insert their own ratings" 
ON public.user_ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own ratings" ON public.user_ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON public.user_ratings;
CREATE POLICY "Users can update their own ratings" 
ON public.user_ratings 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own ratings" ON public.user_ratings;
DROP POLICY IF EXISTS "Users can delete their own ratings" ON public.user_ratings;
CREATE POLICY "Users can delete their own ratings" 
ON public.user_ratings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
DROP TRIGGER IF EXISTS update_user_ratings_updated_at ON public.user_ratings;
CREATE TRIGGER update_user_ratings_updated_at
BEFORE UPDATE ON public.user_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get average rating for a prompt
CREATE OR REPLACE FUNCTION public.get_prompt_rating(prompt_id_param uuid)
RETURNS TABLE(average_rating numeric, total_ratings bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT 
    COALESCE(ROUND(AVG(rating::numeric), 1), 0) as average_rating,
    COUNT(rating) as total_ratings
  FROM public.user_ratings 
  WHERE prompt_id = prompt_id_param;
$$;

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."user_ratings" ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."user_ratings" TO authenticated;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."user_ratings"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."user_ratings"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;
