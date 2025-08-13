import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ShareRedirect = () => {
  const { shortCode } = useParams<{ shortCode: string }>();

  useEffect(() => {
    if (shortCode) {
      // Directly redirect using the edge function URL
      window.location.href = `https://mncxspmtqvqgvtrxbxzb.supabase.co/functions/v1/share-redirect/${shortCode}`;
    } else {
      // Fallback to homepage if no shortCode
      window.location.href = '/';
    }
  }, [shortCode]);

  return (
    <div className="container py-20 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-muted-foreground">Redirecting...</p>
    </div>
  );
};

export default ShareRedirect;