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
        // SECURITY FIX: Use secure RPC instead of direct table access
        const { data, error } = await supabase
          .rpc('get_user_newsletter_status')
          .single();

        if (error) {
          console.error('Error checking newsletter subscription:', error);
          setIsNewsletterSubscribed(false);
        } else {
          // User is newsletter subscribed if they have an entry with email_hash (indicating newsletter signup)
          setIsNewsletterSubscribed(!!data?.newsletter_subscribed);
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