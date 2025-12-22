import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone } from 'lucide-react';
import { useUserXP } from '@/hooks/useUserXP';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const VISIT_COUNT_KEY = 'pag_visit_count';
const INSTALL_DISMISSED_KEY = 'pag_install_dismissed';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPostInstall, setShowPostInstall] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const { user } = useSupabaseAuth();
  const { awardXP } = useUserXP();

  // Track visit count on mount
  useEffect(() => {
    const current = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
    const newCount = current + 1;
    localStorage.setItem(VISIT_COUNT_KEY, String(newCount));
    setVisitCount(newCount);
  }, []);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Only show prompt if visit count >= 2 and not dismissed
      const visits = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
      const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY) === 'true';
      
      if (visits >= 2 && !dismissed) {
        setShowPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      setShowPostInstall(true);
      
      // Award XP for installing the app (only for logged-in users)
      if (user) {
        // Check if already awarded (stored in localStorage)
        const alreadyAwarded = localStorage.getItem('pwa_install_xp_awarded');
        if (!alreadyAwarded) {
          awardXP({
            activityKey: 'pwa_install',
            description: 'Installed PromptAndGo as a PWA',
          });
          localStorage.setItem('pwa_install_xp_awarded', 'true');
        }
      }
      
      // Hide post-install message after 10 seconds
      setTimeout(() => setShowPostInstall(false), 10000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [user, awardXP]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = (permanent = false) => {
    setShowPrompt(false);
    if (permanent) {
      // Don't show again permanently
      localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
    } else {
      // Don't show again for this session
      sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    }
  };

  if (isInstalled && showPostInstall) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-in slide-in-from-bottom-4">
        <div className="bg-primary text-primary-foreground rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <Smartphone className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm">PromptAndGo Installed!</p>
              <p className="text-xs opacity-90 mt-1">
                Find the app on your home screen or app drawer. It now works offline and launches instantly.
              </p>
            </div>
            <button 
              onClick={() => setShowPostInstall(false)}
              className="text-primary-foreground/70 hover:text-primary-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground">Install PromptAndGo</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add to your home screen for quick access, offline support, and a native app experience.
            </p>
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                onClick={handleInstall}
                className="flex-1"
              >
                Install
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleDismiss(false)}
              >
                Not now
              </Button>
            </div>
            <button 
              onClick={() => handleDismiss(true)}
              className="text-xs text-muted-foreground hover:text-foreground underline mt-2"
            >
              Don't show again
            </button>
          </div>
          <button 
            onClick={() => handleDismiss(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
