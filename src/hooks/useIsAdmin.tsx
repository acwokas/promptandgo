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
      console.log("useIsAdmin: Starting admin check", { user: user?.email, userId: user?.id });
      
      if (!user) {
        console.log("useIsAdmin: No user found");
        if (active) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      
      try {
        console.log("useIsAdmin: Checking user_roles table for user:", user.id);
        // Primary: check user_roles table (RLS allows users to read their own roles)
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .limit(1);
          
        console.log("useIsAdmin: user_roles query result", { data, error });
        
        if (error) throw error;
        const hasRole = (data?.length || 0) > 0;

        // Fallback: explicit email allowlist (requested)
        const emailAllow = user.email?.toLowerCase() === "me@adrianwatkins.com";
        
        console.log("useIsAdmin: Admin check results", { 
          hasRole, 
          emailAllow, 
          userEmail: user.email,
          finalResult: !!hasRole || emailAllow,
          active: active 
        });

        const adminResult = !!hasRole || emailAllow;
        if (active) {
          console.log("useIsAdmin: Setting isAdmin to:", adminResult);
          setIsAdmin(adminResult);
        } else {
          console.log("useIsAdmin: Component unmounted, not setting admin state");
        }
      } catch (e) {
        console.error("useIsAdmin: Error in admin check", e);
        const fallbackResult = user?.email?.toLowerCase() === "me@adrianwatkins.com";
        console.log("useIsAdmin: Using fallback email check:", fallbackResult);
        if (active) setIsAdmin(fallbackResult);
      } finally {
        console.log("useIsAdmin: Setting loading to false, active:", active);
        if (active) setLoading(false);
      }
    }
    check();
    return () => {
      active = false;
    };
  }, [user?.id, user?.email]);

  console.log("useIsAdmin hook returning:", { isAdmin, loading });

  return { isAdmin, loading };
}
