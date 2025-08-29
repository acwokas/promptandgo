import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "./useSupabaseAuth";

export function useNewsletterStatus() {
  const { user } = useSupabaseAuth();
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkNewsletterSubscription = async () => {
      if (!user) {
        setIsNewsletterSubscribed(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user has a newsletter subscription in the subscribers table
        const { data, error } = await supabase
          .from('subscribers')
          .select('subscribed, email_hash')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking newsletter subscription:', error);
          setIsNewsletterSubscribed(false);
        } else {
          // User is newsletter subscribed if they have an entry with email_hash (indicating newsletter signup)
          setIsNewsletterSubscribed(!!data?.email_hash);
        }
      } catch (error) {
        console.error('Error checking newsletter subscription:', error);
        setIsNewsletterSubscribed(false);
      } finally {
        setLoading(false);
      }
    };

    checkNewsletterSubscription();
  }, [user]);

  return { isNewsletterSubscribed, loading };
}