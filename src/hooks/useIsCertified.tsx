import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "./useSupabaseAuth";

export function useIsCertified() {
  const { user } = useSupabaseAuth();
  const [isCertified, setIsCertified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCertification = async () => {
      if (!user) {
        setIsCertified(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("certification_completions")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error checking certification:", error);
          setIsCertified(false);
        } else {
          setIsCertified(!!data);
        }
      } catch (error) {
        console.error("Error checking certification:", error);
        setIsCertified(false);
      } finally {
        setLoading(false);
      }
    };

    checkCertification();
  }, [user]);

  return { isCertified, loading };
}
