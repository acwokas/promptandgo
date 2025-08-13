import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserContext {
  industry: string | null;
  project_type: string | null;
  preferred_tone: string | null;
  desired_outcome: string | null;
}

interface SmartSuggestion {
  title: string;
  reason: string;
  confidence: number;
  category: string;
}

export function useSmartSuggestions(userContext?: UserContext) {
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const generateSmartSuggestions = async (query?: string) => {
    if (!userContext) return;
    
    setIsLoadingSuggestions(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-prompt-assistant', {
        body: {
          type: 'smart_suggestions',
          prompt: query || 'general recommendations',
          userProfile: userContext,
          context: `User interests: ${userContext.desired_outcome}, Industry: ${userContext.industry}`
        }
      });

      if (error) throw error;

      if (Array.isArray(data.result)) {
        setSmartSuggestions(data.result);
      }
    } catch (error) {
      console.error('Error generating smart suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  return {
    smartSuggestions,
    isLoadingSuggestions,
    generateSmartSuggestions
  };
}