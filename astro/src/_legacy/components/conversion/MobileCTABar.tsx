import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const MobileCTABar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    // Don't show to logged-in users
    if (user) return;

    // Check if previously dismissed
    const dismissed = localStorage.getItem('mobile-cta-dismissed') === 'true';
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show after 3 seconds of page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Show on scroll past hero section
    const handleScroll = () => {
      const scrolled = window.scrollY > 400;
      if (scrolled && !isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [user, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('mobile-cta-dismissed', 'true');
  };

  if (!isVisible || isDismissed || user) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden max-w-full">
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-2xl border-t max-w-full overflow-hidden">
        <div className="flex items-center justify-between p-4 max-w-full">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 flex-shrink-0 animate-pulse" />
              <span className="font-semibold text-sm">Save 10+ Hours Weekly</span>
            </div>
            <p className="text-xs text-primary-foreground/90">
              Join 5,000+ professionals using proven prompts
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="whitespace-nowrap"
            >
              <Link to="/library">
                Get Started <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-primary-foreground hover:bg-primary-foreground/20 p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCTABar;