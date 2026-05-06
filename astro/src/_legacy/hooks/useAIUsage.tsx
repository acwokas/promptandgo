import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface UsageData {
  allowed: boolean;
  current_usage: number;
  daily_limit: number;
  remaining: number;
}

interface AIUsageState {
  generator: UsageData | null;
  assistant: UsageData | null;
  sends: UsageData | null;
  loading: boolean;
  error: string | null;
}

export function useAIUsage() {
  const { user } = useSupabaseAuth();
  const [usage, setUsage] = useState<AIUsageState>({
    generator: null,
    assistant: null,
    sends: null,
    loading: false,
    error: null
  });

  const fetchUsage = async (usageType: 'generator' | 'assistant' | 'sends') => {
    if (!user) return null;

    try {
      // Handle 'sends' usage type differently
      if (usageType === 'sends') {
        const { data, error } = await supabase.rpc('get_daily_ai_sends_count', { p_user_id: user.id });
        if (error) throw error;
        
        const sendsData = data as { count: number; remaining: number; daily_limit: number; limit_reached: boolean };
        
        return {
          allowed: sendsData.remaining > 0,
          current_usage: sendsData.count,
          daily_limit: sendsData.daily_limit,
          remaining: sendsData.remaining
        };
      }

      const { data, error } = await supabase.rpc('get_user_ai_limits', {
        user_id_param: user.id
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const limits = data[0];
        
        // Get current usage
        const { data: usageData, error: usageError } = await supabase
          .from('ai_usage')
          .select('queries_used')
          .eq('user_id', user.id)
          .eq('usage_type', usageType)
          .eq('reset_date', new Date().toISOString().split('T')[0])
          .maybeSingle();

        if (usageError) throw usageError;

        const currentUsage = usageData?.queries_used || 0;
        let dailyLimit: number;

        switch (usageType) {
          case 'generator':
            dailyLimit = limits.daily_generator_limit;
            break;
          case 'assistant':
            dailyLimit = limits.daily_assistant_limit;
            break;
        }

        return {
          allowed: currentUsage < dailyLimit,
          current_usage: currentUsage,
          daily_limit: dailyLimit,
          remaining: Math.max(0, dailyLimit - currentUsage)
        };
      }

      return null;
    } catch (error) {
      console.error(`Error fetching ${usageType} usage:`, error);
      return null;
    }
  };

  const loadAllUsage = async () => {
    if (!user) {
      setUsage(prev => ({ 
        ...prev, 
        generator: null, 
        assistant: null,
        sends: null,
        loading: false 
      }));
      return;
    }

    setUsage(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [generatorUsage, assistantUsage, sendsUsage] = await Promise.all([
        fetchUsage('generator'),
        fetchUsage('assistant'),
        fetchUsage('sends')
      ]);

      setUsage(prev => ({
        ...prev,
        generator: generatorUsage,
        assistant: assistantUsage,
        sends: sendsUsage,
        loading: false
      }));
    } catch (error: any) {
      setUsage(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load usage data'
      }));
    }
  };

  const refreshUsage = () => {
    loadAllUsage();
  };

  useEffect(() => {
    loadAllUsage();
  }, [user]);

  return {
    usage,
    refreshUsage,
    loadAllUsage
  };
}