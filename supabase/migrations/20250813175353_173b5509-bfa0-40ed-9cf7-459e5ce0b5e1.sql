-- Add context-aware profile fields for better prompt personalization
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS industry text,
ADD COLUMN IF NOT EXISTS project_type text, 
ADD COLUMN IF NOT EXISTS preferred_tone text,
ADD COLUMN IF NOT EXISTS desired_outcome text,
ADD COLUMN IF NOT EXISTS context_popup_dismissed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS context_fields_completed boolean DEFAULT false;