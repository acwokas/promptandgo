import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  thumbnail_url: string;
  published_date: string;
  focus_keyword: string;
  meta_description: string;
}

export const useLatestArticle = () => {
  const [latestArticle, setLatestArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestArticle();
  }, []);

  const fetchLatestArticle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, synopsis, thumbnail_url, published_date, focus_keyword, meta_description')
        .eq('is_published', true)
        .order('published_date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setLatestArticle(data);
    } catch (error: any) {
      console.error('Error fetching latest article:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { latestArticle, loading, error };
};