import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export function useIsAdmin() {
  const { user } = useSupabaseAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function check() {
      if (!user) {
        if (active) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      try {
        // Primary: check user_roles table (RLS allows users to read their own roles)
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .limit(1);
        if (error) throw error;
        const hasRole = (data?.length || 0) > 0;

        // Fallback: explicit email allowlist (requested)
        const emailAllow = user.email?.toLowerCase() === "me@adrianwatkins.com";

        if (active) setIsAdmin(!!hasRole || emailAllow);
      } catch (e) {
        console.error(e);
        if (active) setIsAdmin(user?.email?.toLowerCase() === "me@adrianwatkins.com");
      } finally {
        if (active) setLoading(false);
      }
    }
    check();
    return () => {
      active = false;
    };
  }, [user?.id, user?.email]);

  return { isAdmin, loading };
}
