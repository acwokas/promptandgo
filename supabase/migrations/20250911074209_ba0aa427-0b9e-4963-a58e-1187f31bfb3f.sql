-- Create articles table for the CMS
CREATE TABLE public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  synopsis text,
  thumbnail_url text,
  published_date timestamp with time zone,
  is_published boolean NOT NULL DEFAULT false,
  focus_keyword text,
  keyphrases text[],
  meta_description text,
  meta_title text,
  author_id uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create article_assets table for managing images and other assets
CREATE TABLE public.article_assets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  asset_type text NOT NULL, -- 'image', 'video', 'youtube', 'link'
  asset_url text NOT NULL,
  asset_title text,
  asset_description text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_assets ENABLE ROW LEVEL SECURITY;

-- Create policies for articles
CREATE POLICY "Public can view published articles"
ON public.articles
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage all articles"
ON public.articles
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for article_assets
CREATE POLICY "Public can view assets of published articles"
ON public.article_assets
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.articles 
  WHERE articles.id = article_assets.article_id 
  AND articles.is_published = true
));

CREATE POLICY "Admins can manage all article assets"
ON public.article_assets
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_published ON public.articles(is_published, published_date);
CREATE INDEX idx_article_assets_article_id ON public.article_assets(article_id);
CREATE INDEX idx_article_assets_type ON public.article_assets(asset_type);