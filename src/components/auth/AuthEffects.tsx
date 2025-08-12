import { useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";

const AuthEffects = () => {
  const { user } = useSupabaseAuth();

  useEffect(() => {
    if (!user) return;
    // Fire-and-forget reconciliation and subscription check on login
    supabase.functions.invoke('reconcile-orders').catch(() => {});
    supabase.functions.invoke('check-subscription').catch(() => {});
  }, [user]);

  return null;
};

export default AuthEffects;
