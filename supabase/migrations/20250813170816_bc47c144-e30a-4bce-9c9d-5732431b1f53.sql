-- Create pack_tags table to link packs with tags (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.pack_tags (
  pack_id UUID NOT NULL,
  tag_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (pack_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE public.pack_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for pack_tags
CREATE POLICY "Public can view pack_tags" 
ON public.pack_tags 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can modify pack_tags" 
ON public.pack_tags 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add some initial tags for existing packs
-- First, let's add common tags that would be useful for packs
INSERT INTO public.tags (name) VALUES 
  ('marketing'),
  ('content'),
  ('social media'),
  ('business'),
  ('career'),
  ('productivity'),
  ('writing'),
  ('strategy'),
  ('branding'),
  ('automation'),
  ('analysis'),
  ('planning')
ON CONFLICT (name) DO NOTHING;

-- Now let's add tags to existing packs based on their names
-- We'll use a more robust approach by selecting pack and tag IDs first

-- Add tags for Content Marketing Goldmine
INSERT INTO public.pack_tags (pack_id, tag_id)
SELECT p.id, t.id 
FROM public.packs p, public.tags t 
WHERE p.name ILIKE '%content%marketing%' 
  AND t.name IN ('marketing', 'content', 'strategy', 'business', 'writing')
ON CONFLICT DO NOTHING;

-- Add tags for Social Media Power Pack
INSERT INTO public.pack_tags (pack_id, tag_id)
SELECT p.id, t.id 
FROM public.packs p, public.tags t 
WHERE p.name ILIKE '%social%media%' 
  AND t.name IN ('social media', 'marketing', 'content', 'branding', 'strategy')
ON CONFLICT DO NOTHING;

-- Add tags for Career Accelerator Pack
INSERT INTO public.pack_tags (pack_id, tag_id)
SELECT p.id, t.id 
FROM public.packs p, public.tags t 
WHERE p.name ILIKE '%career%' 
  AND t.name IN ('career', 'business', 'productivity', 'planning', 'strategy')
ON CONFLICT DO NOTHING;