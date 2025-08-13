-- Create shared_links table for tracking shared content
CREATE TABLE public.shared_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  short_code text NOT NULL UNIQUE,
  original_url text NOT NULL,
  content_type text NOT NULL, -- 'prompt', 'blog', 'pack', etc.
  content_id text NOT NULL, -- ID or slug of the content
  title text,
  shared_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  clicks integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create unique index for fast lookups
CREATE INDEX idx_shared_links_short_code ON public.shared_links(short_code);
CREATE INDEX idx_shared_links_content ON public.shared_links(content_type, content_id);

-- Enable RLS
ALTER TABLE public.shared_links ENABLE ROW LEVEL SECURITY;

-- Anyone can read shared links (needed for redirect function)
CREATE POLICY "Anyone can read shared links" ON public.shared_links
FOR SELECT USING (true);

-- Users can create shared links
CREATE POLICY "Users can create shared links" ON public.shared_links
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR shared_by IS NULL);

-- Update function for click tracking (service role will use this)
CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.shared_links 
  SET clicks = clicks + 1, updated_at = now()
  WHERE short_code = link_code;
END;
$$;