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

      if (error) {
        // Handle usage limit exceeded
        if (error.message?.includes('Daily limit exceeded') || data?.usageExceeded) {
          window.location.href = `/ai-credits-exhausted?type=suggestions&usage=${data?.currentUsage || 0}&limit=${data?.dailyLimit || 0}`;
          return;
        }
        throw error;
      }

      if (Array.isArray(data.result)) {
        setSmartSuggestions(data.result);
      }
    } catch (error: any) {
      console.error('Error generating smart suggestions:', error);
      
      // Check if it's a usage limit error
      if (error.message?.includes('Daily limit exceeded')) {
        window.location.href = '/ai-credits-exhausted?type=suggestions';
        return;
      }
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