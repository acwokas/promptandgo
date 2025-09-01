import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSupabaseAuth } from "./useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";

export function usePageVisitTracker() {
  const { user } = useSupabaseAuth();
  const location = useLocation();
  const [visitCount, setVisitCount] = useState(0);
  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const [profile, setProfile] = useState<{
    context_fields_completed: boolean;
    context_popup_dismissed: boolean;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    // Load user profile to check if context fields are completed
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("context_fields_completed, context_popup_dismissed")
        .eq("id", user.id)
        .maybeSingle();
      
      if (data) {
        setProfile(data);
      }
    };

    loadProfile();
  }, [user]);

  useEffect(() => {
    if (!user || !profile) return;

    // Don't track if fields are completed or popup is dismissed
    if (profile.context_fields_completed || profile.context_popup_dismissed) {
      setShouldShowPopup(false);
      return;
    }

    // Only track on pathname changes, with a small delay to prevent rapid firing
    const timer = setTimeout(() => {
      // Get current visit count from sessionStorage
      const currentCount = parseInt(sessionStorage.getItem('pageVisitCount') || '0');
      const newCount = currentCount + 1;
      
      setVisitCount(newCount);
      sessionStorage.setItem('pageVisitCount', newCount.toString());

      // Show popup after 3 page visits
      if (newCount >= 3) {
        setShouldShowPopup(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, user?.id, profile?.context_fields_completed, profile?.context_popup_dismissed]);

  const dismissPopup = async (permanently = false) => {
    setShouldShowPopup(false);
    sessionStorage.removeItem('pageVisitCount');

    if (permanently && user) {
      await supabase
        .from("profiles")
        .update({ context_popup_dismissed: true })
        .eq("id", user.id);
      
      setProfile(prev => prev ? { ...prev, context_popup_dismissed: true } : null);
    }
  };

  const markContextFieldsCompleted = async () => {
    if (!user) return;
    
    await supabase
      .from("profiles")
      .update({ context_fields_completed: true })
      .eq("id", user.id);
    
    setProfile(prev => prev ? { ...prev, context_fields_completed: true } : null);
    setShouldShowPopup(false);
    sessionStorage.removeItem('pageVisitCount');
  };

  return {
    shouldShowPopup,
    dismissPopup,
    markContextFieldsCompleted,
    visitCount
  };
}