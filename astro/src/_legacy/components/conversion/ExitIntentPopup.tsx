import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Sparkles, Gift } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user || hasShown) return; // Don't show to logged in users or if already shown

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving at the top of the page
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem('exitIntentShown', 'true');
      }
    };

    // Check if we've already shown this session
    const alreadyShown = localStorage.getItem('exitIntentShown') === 'true';
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    // Add delay to prevent immediate triggering
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 3000); // 3 second delay

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [user, hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: {
          email: email.trim(),
          source: 'exit_intent_popup'
        }
      });

      if (error) {
        if (error.message?.includes('already subscribed')) {
          toast({
            title: "You're already subscribed!",
            description: "Check your email for our latest prompts.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success! 🎉",
          description: "Check your email for your FREE prompt pack!",
        });
      }

      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-4 rounded-2xl overflow-hidden p-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 text-center relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="h-8 w-8" />
          </div>
          
          <DialogTitle className="text-2xl font-bold mb-2">
            Wait! Don't Leave Empty-Handed
          </DialogTitle>
          <p className="text-primary-foreground/90 text-sm">
            Get our most popular AI prompts absolutely FREE
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="font-semibold text-lg mb-2">
              Join 2,500+ professionals who save 10+ hours weekly
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>50+ battle-tested prompts</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Works with ChatGPT, Claude & more</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Weekly tips & new prompts</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-center"
            />
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Get My FREE Prompts 🚀"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              No spam. Unsubscribe anytime. Trusted by 2,500+ professionals.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;