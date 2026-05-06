import { useEffect, useState, useRef } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const previousSession = useRef<Session | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      // Check if user is logging in (going from no session to having a session)
      const isLoggingIn = !previousSession.current && newSession && event === 'SIGNED_IN';
      
      // Handle logout event - immediately clear state
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        previousSession.current = null;
        setLoading(false);
        return;
      }
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
      
      // Show welcome message when logging in
      if (isLoggingIn && newSession?.user) {
        const userName = newSession.user.user_metadata?.full_name || 
                        newSession.user.user_metadata?.name || 
                        newSession.user.email?.split('@')[0] || 
                        'there';
        
        setTimeout(() => {
          toast({
            title: `👋 Welcome back, ${userName}!`,
            description: "Great to see you again.",
          });
        }, 500);
      }
      
      previousSession.current = newSession;
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      previousSession.current = data.session;
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Remove toast from dependency array as it's not needed

  // Enhanced logout function with immediate state clearing
  const logout = async () => {
    // Immediately clear local state to prevent race conditions
    setSession(null);
    setUser(null);
    previousSession.current = null;
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn("Normal signout failed, forcing local signout:", error.message);
        await supabase.auth.signOut({ scope: 'local' });
      }
    } catch (err: any) {
      console.error("All signout methods failed, clearing local state:", err);
      await supabase.auth.signOut({ scope: 'local' });
    }
  };

  return { user, session, loading, logout };
}
