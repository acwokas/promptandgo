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
DROP POLICY IF EXISTS "Users can view own certifications" ON public.certification_completions;
DROP POLICY IF EXISTS "Users can view own certifications" ON public.certification_completions;
CREATE POLICY "Users can view own certifications"
  ON public.certification_completions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own certifications
DROP POLICY IF EXISTS "Users can insert own certifications" ON public.certification_completions;
DROP POLICY IF EXISTS "Users can insert own certifications" ON public.certification_completions;
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

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."certification_completions" ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON TABLE public."certification_completions" TO authenticated;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."certification_completions"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."certification_completions"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;
