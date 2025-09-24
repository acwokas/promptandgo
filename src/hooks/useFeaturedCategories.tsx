import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeaturedCategory {
  id: string;
  title: string;
  message: string;
  link: string;
  icon: string;
  usage_text: string;
  display_order: number;
}

export function useFeaturedCategories() {
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('featured_categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) {
          throw error;
        }

        setCategories(data || []);
      } catch (err: any) {
        console.error('Error fetching featured categories:', err);
        setError(err.message);
        
        // Fallback to hardcoded categories if database fetch fails
        setCategories([
          {
            id: 'fallback-1',
            title: "Marketing & Advertising",
            message: "Boost your campaigns today",
            link: "/library?category=Marketing%20%26%20Advertising",
            icon: "Briefcase",
            usage_text: "5x usage today",
            display_order: 1
          },
          {
            id: 'fallback-2',
            title: "Personal Growth & Mindfulness",
            message: "Transform your mindset",
            link: "/library?category=Personal%20Growth%20%26%20Mindfulness", 
            icon: "Heart",
            usage_text: "3x usage today",
            display_order: 2
          },
          {
            id: 'fallback-3',
            title: "Creative Writing & Content",
            message: "Unleash your creativity",
            link: "/library?category=Creative%20Writing%20%26%20Content",
            icon: "Edit3", 
            usage_text: "7x usage today",
            display_order: 3
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}