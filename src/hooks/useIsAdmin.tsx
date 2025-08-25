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
      console.log("useIsAdmin: Starting admin check");

      if (!user) {
        console.log("useIsAdmin: No user found");
        if (active) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      try {
        // 1) Try direct read from user_roles (RLS: users can read their own roles)
        console.log("useIsAdmin: Querying user_roles for:", user.id);
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        let hasRole = !!data;
        console.log("useIsAdmin: user_roles result", { hasRole, error });

        // 2) Fallback to SECURITY DEFINER function to avoid any edge RLS issues
        if (!hasRole) {
          try {
            const { data: rpcData, error: rpcError } = await supabase.rpc("has_role", {
              _user_id: user.id,
              _role: "admin",
            });
            if (rpcError) throw rpcError;
            hasRole = !!rpcData;
            console.log("useIsAdmin: has_role RPC result", { rpcData, hasRole });
          } catch (rpcErr) {
            console.error("useIsAdmin: has_role RPC failed", rpcErr);
          }
        }

        // 3) Temporary safety net: allowlist known admin email if DB checks fail
        const allowlist = ["me@adrianwatkins.com"];
        const hasEmailAllow = allowlist.includes(user.email || "");
        const finalAdmin = hasRole || hasEmailAllow;

        console.log("useIsAdmin: Final admin decision", {
          hasRole,
          hasEmailAllow,
          finalAdmin,
          active,
        });

        if (active) setIsAdmin(finalAdmin);
      } catch (e) {
        console.error("useIsAdmin: Error in admin check", e);
        if (active) setIsAdmin(false);
      } finally {
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
