import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { AI_PROVIDERS } from '@/lib/promptRewriter';

interface AIPreference {
  id: string;
  user_id: string;
  provider_id: string;
  is_enabled: boolean;
}

export function useAIPreferences() {
  const { user } = useSupabaseAuth();
  const [preferences, setPreferences] = useState<AIPreference[]>([]);
  const [loading, setLoading] = useState(true);

  // Get enabled provider IDs
  const enabledProviders = preferences
    .filter(pref => pref.is_enabled)
    .map(pref => pref.provider_id);

  // Get filtered AI providers based on user preferences
  const getFilteredProviders = () => {
    if (!user || enabledProviders.length === 0) {
      return AI_PROVIDERS; // Show all if not logged in or no preferences set
    }
    return AI_PROVIDERS.filter(provider => enabledProviders.includes(provider.id));
  };

  const fetchPreferences = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_ai_preferences')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setPreferences(data || []);
    } catch (error) {
      console.error('Error fetching AI preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (providerId: string, enabled: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_ai_preferences')
        .upsert({
          user_id: user.id,
          provider_id: providerId,
          is_enabled: enabled
        }, {
          onConflict: 'user_id,provider_id'
        });

      if (error) throw error;
      
      // Update local state
      setPreferences(prev => {
        const existing = prev.find(p => p.provider_id === providerId);
        if (existing) {
          return prev.map(p => 
            p.provider_id === providerId ? { ...p, is_enabled: enabled } : p
          );
        } else {
          return [...prev, {
            id: `temp-${Date.now()}`,
            user_id: user.id,
            provider_id: providerId,
            is_enabled: enabled
          }];
        }
      });
    } catch (error) {
      console.error('Error updating AI preference:', error);
    }
  };

  const initializeDefaultPreferences = async () => {
    if (!user) return;

    // Set default preferences for new users (enable ChatGPT, Claude, and Perplexity by default)
    const defaultProviders = ['chatgpt', 'claude', 'perplexity'];
    
    try {
      // Use upsert to avoid duplicate key errors - only insert if not exists
      const { error } = await supabase
        .from('user_ai_preferences')
        .upsert(
          defaultProviders.map(providerId => ({
            user_id: user.id,
            provider_id: providerId,
            is_enabled: true
          })),
          { 
            onConflict: 'user_id,provider_id',
            ignoreDuplicates: true // Don't update existing records, just ignore duplicates
          }
        );

      if (error) throw error;
      await fetchPreferences();
    } catch (error) {
      console.error('Error initializing default preferences:', error);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  useEffect(() => {
    if (user && !loading && preferences.length === 0) {
      initializeDefaultPreferences();
    }
  }, [user, loading, preferences.length]);

  return {
    preferences,
    enabledProviders,
    getFilteredProviders,
    updatePreference,
    loading,
    isLoggedIn: !!user
  };
}