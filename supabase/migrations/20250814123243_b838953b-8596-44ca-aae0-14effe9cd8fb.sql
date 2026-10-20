-- Create user-specific prompt preferences table
CREATE TABLE IF NOT EXISTS public.user_prompt_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  preference_type TEXT NOT NULL CHECK (preference_type IN ('liked', 'disliked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

-- Enable RLS
ALTER TABLE public.user_prompt_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_prompt_preferences;
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_prompt_preferences;
CREATE POLICY "Users can view their own preferences" 
ON public.user_prompt_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own preferences" ON public.user_prompt_preferences;
DROP POLICY IF EXISTS "Users can create their own preferences" ON public.user_prompt_preferences;
CREATE POLICY "Users can create their own preferences" 
ON public.user_prompt_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_prompt_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_prompt_preferences;
CREATE POLICY "Users can update their own preferences" 
ON public.user_prompt_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own preferences" ON public.user_prompt_preferences;
DROP POLICY IF EXISTS "Users can delete their own preferences" ON public.user_prompt_preferences;
CREATE POLICY "Users can delete their own preferences" 
ON public.user_prompt_preferences 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_prompt_preferences_user_id ON public.user_prompt_preferences(user_id);
CREATE INDEX idx_user_prompt_preferences_prompt_id ON public.user_prompt_preferences(prompt_id);

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."user_prompt_preferences" ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."user_prompt_preferences" TO authenticated;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."user_prompt_preferences"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."user_prompt_preferences"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;
