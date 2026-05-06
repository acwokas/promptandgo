import { useEffect, useState } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";

const AuthEffects = () => {
  const { user } = useSupabaseAuth();
  const [hasAwardedCreateAccount, setHasAwardedCreateAccount] = useState(false);
  const [lastLoginDate, setLastLoginDate] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    console.log('AuthEffects: Triggering background checks for user:', user.email);
    
    // Fire-and-forget reconciliation and subscription check on login
    supabase.functions.invoke('reconcile-orders').catch(console.error);
    supabase.functions.invoke('check-subscription').catch(console.error);
    // Attempt one-time security backfill (edge function enforces admin-only)
    supabase.functions.invoke('backfill-subscribers').catch(() => {});
    
    // Award XP for account creation (first time only)
    const checkAndAwardCreateAccount = async () => {
      if (hasAwardedCreateAccount) return;
      
      const { data: existingXP } = await supabase
        .from('user_xp')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      // If no XP record exists, this is a new account - award create_account XP
      if (!existingXP) {
        await supabase.functions.invoke('award-xp', {
          body: {
            userId: user.id,
            activityKey: 'create_account',
            description: 'Welcome to PromptAndGo!',
          },
        });
        setHasAwardedCreateAccount(true);
      }
    };
    
    // Award XP for daily login
    const checkAndAwardDailyLogin = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      if (lastLoginDate === today) return;
      
      await supabase.functions.invoke('award-xp', {
        body: {
          userId: user.id,
          activityKey: 'daily_login',
          description: 'Daily login',
        },
      });
      
      setLastLoginDate(today);
    };
    
    checkAndAwardCreateAccount();
    checkAndAwardDailyLogin();
  }, [user, hasAwardedCreateAccount, lastLoginDate]);

  return null;
};

export default AuthEffects;
