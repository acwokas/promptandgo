-- Create countdown settings table
CREATE TABLE IF NOT EXISTS public.countdown_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT false,
  offer_text TEXT NOT NULL DEFAULT '🚀 50% OFF All Premium Packs - Limited Time Only!',
  expiry_hours INTEGER NOT NULL DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default settings
INSERT INTO public.countdown_settings (enabled, offer_text, expiry_hours)
VALUES (true, '🚀 50% OFF All Premium Packs - Limited Time Only!', 24)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.countdown_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (admin only access)
CREATE POLICY "Only admins can view countdown settings" 
ON public.countdown_settings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Only admins can update countdown settings" 
ON public.countdown_settings 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_countdown_settings_updated_at
  BEFORE UPDATE ON public.countdown_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();