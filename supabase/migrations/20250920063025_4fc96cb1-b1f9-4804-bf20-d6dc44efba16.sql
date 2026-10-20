-- Add AI provider preferences for users
CREATE TABLE IF NOT EXISTS public.user_ai_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  provider_id text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider_id)
);

-- Enable RLS
ALTER TABLE public.user_ai_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own AI preferences" ON public.user_ai_preferences;
DROP POLICY IF EXISTS "Users can view their own AI preferences" ON public.user_ai_preferences;
CREATE POLICY "Users can view their own AI preferences" 
ON public.user_ai_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own AI preferences" ON public.user_ai_preferences;
DROP POLICY IF EXISTS "Users can insert their own AI preferences" ON public.user_ai_preferences;
CREATE POLICY "Users can insert their own AI preferences" 
ON public.user_ai_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own AI preferences" ON public.user_ai_preferences;
DROP POLICY IF EXISTS "Users can update their own AI preferences" ON public.user_ai_preferences;
CREATE POLICY "Users can update their own AI preferences" 
ON public.user_ai_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own AI preferences" ON public.user_ai_preferences;
DROP POLICY IF EXISTS "Users can delete their own AI preferences" ON public.user_ai_preferences;
CREATE POLICY "Users can delete their own AI preferences" 
ON public.user_ai_preferences 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_user_ai_preferences_updated_at ON public.user_ai_preferences;
CREATE TRIGGER update_user_ai_preferences_updated_at
BEFORE UPDATE ON public.user_ai_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."user_ai_preferences" ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."user_ai_preferences" TO authenticated;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."user_ai_preferences"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."user_ai_preferences"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;
