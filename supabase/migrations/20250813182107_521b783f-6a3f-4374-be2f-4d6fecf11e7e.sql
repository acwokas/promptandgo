-- Add ribbon column to prompts table for RECOMMENDED and other special ribbons
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS ribbon TEXT;

-- Add index for better performance when filtering by ribbon
CREATE INDEX IF NOT EXISTS idx_prompts_ribbon ON public.prompts(ribbon);

-- Insert default widget settings if they don't exist
INSERT INTO public.widget_settings (setting_key, setting_value, description)
VALUES 
  ('feedback_widget_enabled', true, 'Show/hide the feedback widget that appears on all pages'),
  ('context_popup_enabled', true, 'Show/hide the context popup that helps new users personalize their experience')
ON CONFLICT (setting_key) DO NOTHING;