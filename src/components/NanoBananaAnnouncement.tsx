import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sparkles, X } from 'lucide-react';

const NanoBananaAnnouncement = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed this session
    const dismissed = sessionStorage.getItem('nanoBananaAnnouncementDismissed');
    if (!dismissed) {
      // Small delay to ensure smooth page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('nanoBananaAnnouncementDismissed', 'true');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md mx-auto bg-gradient-to-br from-background via-background/95 to-primary/5 border-primary/20">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
            <span className="text-3xl">🍌</span>
          </div>
          <DialogTitle className="text-xl font-bold text-center">
            Introducing Nano Banana!
          </DialogTitle>
          <DialogDescription className="text-center space-y-3">
            <p className="text-base">
              We've just added <span className="font-semibold text-foreground">Nano Banana 🍌</span> to Scout AI and our prompt cards!
            </p>
            <p className="text-sm text-muted-foreground">
              Transform any image prompt into adorable miniature collectible style - perfect for creating tiny, whimsical scenes with amazing detail.
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button 
            onClick={handleDismiss}
            className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Try Nano Banana Now
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDismiss}
            className="sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Maybe Later
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          This won't show again this session
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default NanoBananaAnnouncement;