import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "./useSupabaseAuth";

export function useEnsureProfile() {
  const { user } = useSupabaseAuth();
  const [ready, setReady] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!user || hasRun.current) return;
    hasRun.current = true;

    // Defer to avoid doing work inside any auth callback cycles
    setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          // If RLS prevents reading, we still try to insert (upsert-like)
          // but we won't crash the UI.
          console.error("Profile fetch error:", error);
        }

        if (!data) {
          // Get user metadata for context fields
          const metaData = user.user_metadata || {};
          
          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            display_name: metaData.display_name || (user.email?.split("@")[0] ?? ""),
            avatar_url: null,
            industry: metaData.industry || null,
            project_type: metaData.project_type || null,
            preferred_tone: metaData.preferred_tone || null,
            desired_outcome: metaData.desired_outcome || null,
            context_fields_completed: metaData.context_fields_completed || false,
            context_popup_dismissed: false
          });
          if (insertError) {
            console.error("Profile insert error:", insertError);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setReady(true);
      }
    }, 0);
  }, [user]);

  return { ready };
}
