-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public) VALUES ('article-images', 'article-images', true);

-- Create storage policies for article images
CREATE POLICY "Article images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'article-images');

CREATE POLICY "Admins can upload article images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'article-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update article images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'article-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete article images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'article-images' AND has_role(auth.uid(), 'admin'::app_role));