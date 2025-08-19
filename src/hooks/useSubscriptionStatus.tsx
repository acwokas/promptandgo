import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "./useSupabaseAuth";

export function useSubscriptionStatus() {
  const { user } = useSupabaseAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setIsSubscribed(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('subscribers')
          .select('subscribed')
          .eq('user_id', user.id)
          .eq('subscribed', true)
          .maybeSingle();

        if (error) {
          console.error('Error checking subscription:', error);
          setIsSubscribed(false);
        } else {
          setIsSubscribed(!!data);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setIsSubscribed(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [user]);

  return { isSubscribed, loading };
}