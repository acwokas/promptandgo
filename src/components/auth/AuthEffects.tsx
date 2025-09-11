import { useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";

const AuthEffects = () => {
  const { user } = useSupabaseAuth();

  useEffect(() => {
    if (!user) return;
    console.log('AuthEffects: Triggering background checks for user:', user.email);
    // Fire-and-forget reconciliation and subscription check on login
    supabase.functions.invoke('reconcile-orders').catch(console.error);
    supabase.functions.invoke('check-subscription').catch(console.error);
    // Attempt one-time security backfill (edge function enforces admin-only)
    supabase.functions.invoke('backfill-subscribers').catch(() => {});
  }, [user]);

  return null;
};

export default AuthEffects;
