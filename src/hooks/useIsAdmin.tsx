import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export function useIsAdmin() {
  const { user } = useSupabaseAuth();
  const [isAdmin, setIsAdmin] = useState(() => {
    // Initialize with cached value if available
    try {
      const cached = sessionStorage.getItem('isAdmin');
      return cached === 'true';
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function check() {
      console.log("useIsAdmin: Starting admin check", { user: user?.email, userId: user?.id });
      
      if (!user) {
        console.log("useIsAdmin: No user found");
        // Don't immediately reset admin status if we have a cached value
        // This handles the case where user state fluctuates during navigation
        const cachedAdmin = sessionStorage.getItem('isAdmin') === 'true';
        if (cachedAdmin && isAdmin) {
          console.log("useIsAdmin: Keeping cached admin status during auth fluctuation");
          if (active) setLoading(false);
          return;
        }
        
        if (active) {
          setIsAdmin(false);
          sessionStorage.removeItem('isAdmin');
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

        // Removed hardcoded email fallback for security
        
        console.log("useIsAdmin: Admin check results", { 
          hasRole, 
          userEmail: user.email,
          finalResult: !!hasRole,
          active: active 
        });

        const adminResult = !!hasRole;
        if (active) {
          console.log("useIsAdmin: Setting isAdmin to:", adminResult);
          setIsAdmin(adminResult);
          // Cache the result in sessionStorage
          try {
            sessionStorage.setItem('isAdmin', adminResult.toString());
          } catch (e) {
            console.warn("Could not cache admin status:", e);
          }
        } else {
          console.log("useIsAdmin: Component unmounted, not setting admin state");
        }
      } catch (e) {
        console.error("useIsAdmin: Error in admin check", e);
        console.log("useIsAdmin: Setting admin status to false due to error");
        if (active) {
          setIsAdmin(false);
          // Clear cached admin status on error
          try {
            sessionStorage.removeItem('isAdmin');
          } catch (e) {
            console.warn("Could not clear admin cache:", e);
          }
        }
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
