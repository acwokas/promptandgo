import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "./useSupabaseAuth";
import { toast } from "sonner";

export interface UserXP {
  id: string;
  user_id: string;
  total_xp: number;
  available_xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface XPActivity {
  id: string;
  activity_key: string;
  activity_name: string;
  activity_description: string | null;
  xp_value: number;
  is_repeatable: boolean;
  repeat_interval: string | null;
  icon: string | null;
  is_active: boolean;
}

export interface XPTransaction {
  id: string;
  user_id: string;
  activity_key: string | null;
  transaction_type: 'earn' | 'spend';
  xp_amount: number;
  description: string | null;
  metadata: any;
  created_at: string;
}

export const useUserXP = () => {
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const { data: userXP, isLoading: isLoadingXP } = useQuery({
    queryKey: ['userXP', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_xp')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If no XP record exists, return default values
      if (!data) {
        return {
          id: '',
          user_id: user.id,
          total_xp: 0,
          available_xp: 0,
          level: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as UserXP;
      }

      return data as UserXP;
    },
    enabled: !!user?.id,
  });

  const { data: activities } = useQuery({
    queryKey: ['xpActivities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('xp_activities')
        .select('*')
        .eq('is_active', true)
        .order('xp_value', { ascending: false });

      if (error) throw error;
      return data as XPActivity[];
    },
  });

  const { data: transactions } = useQuery({
    queryKey: ['xpTransactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('xp_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as XPTransaction[];
    },
    enabled: !!user?.id,
  });

  const awardXP = useMutation({
    mutationFn: async ({
      activityKey,
      description,
      metadata,
      showToast = true,
    }: {
      activityKey: string;
      description?: string;
      metadata?: any;
      showToast?: boolean;
    }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('award-xp', {
        body: {
          userId: user.id,
          activityKey,
          description,
          metadata,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Refetch XP data
      queryClient.invalidateQueries({ queryKey: ['userXP', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['xpTransactions', user?.id] });

      if (data.success && variables.showToast !== false) {
        toast.success(`🎉 +${data.xpAwarded} XP earned!`, {
          description: data.message,
        });
      }
    },
    onError: (error: any) => {
      console.error('Error awarding XP:', error);
      toast.error('Failed to award XP', {
        description: error.message,
      });
    },
  });

  return {
    userXP,
    activities,
    transactions,
    isLoadingXP,
    awardXP: awardXP.mutate,
    isAwarding: awardXP.isPending,
  };
};
