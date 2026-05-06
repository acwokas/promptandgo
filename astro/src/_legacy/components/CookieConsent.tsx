import { useState } from "react";

const CookieConsent = () => {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem("cookie_consent") !== null;
    } catch {
      return false;
    }
  });

  const handleChoice = (accepted: boolean) => {
    try {
      localStorage.setItem("cookie_consent", accepted ? "accepted" : "declined");
    } catch { /* noop */ }
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-card border-t border-border/50 shadow-lg animate-fade-in" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="container max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          We use cookies to improve your experience. By continuing, you agree to our{" "}
          <a href="/privacy" className="text-primary underline underline-offset-2">Privacy Policy</a>.
        </p>
        <div className="flex items-center gap-2 shrink-0 max-[400px]:flex-col max-[400px]:w-full">
          <button
            onClick={() => handleChoice(false)}
            className="px-4 py-2.5 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors max-[400px]:w-full"
          >
            Decline
          </button>
          <button
            onClick={() => handleChoice(true)}
            className="px-4 py-2.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors max-[400px]:w-full"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
