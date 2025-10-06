-- Create certification_completions table to track user progress
CREATE TABLE IF NOT EXISTS public.certification_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  completion_date timestamp with time zone NOT NULL DEFAULT now(),
  certificate_id text NOT NULL UNIQUE,
  quiz_score integer NOT NULL,
  total_xp integer NOT NULL DEFAULT 100,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certification_completions ENABLE ROW LEVEL SECURITY;

-- Users can view their own certifications
CREATE POLICY "Users can view own certifications"
  ON public.certification_completions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own certifications
CREATE POLICY "Users can insert own certifications"
  ON public.certification_completions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_certification_user_id ON public.certification_completions(user_id);
CREATE INDEX idx_certificate_id ON public.certification_completions(certificate_id);

-- Add certification fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_certified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS certification_badge_url text;