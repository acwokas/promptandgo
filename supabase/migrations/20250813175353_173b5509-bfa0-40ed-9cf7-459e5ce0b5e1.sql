-- Add context-aware profile fields for better prompt personalization
ALTER TABLE public.profiles 
ADD COLUMN industry text,
ADD COLUMN project_type text, 
ADD COLUMN preferred_tone text,
ADD COLUMN desired_outcome text,
ADD COLUMN context_popup_dismissed boolean DEFAULT false,
ADD COLUMN context_fields_completed boolean DEFAULT false;