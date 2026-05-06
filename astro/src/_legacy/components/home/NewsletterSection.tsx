import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MatchedPowerPacks } from "@/components/MatchedPowerPacks";
import { PromptStudioCTA } from "@/components/ui/prompt-studio-cta";

interface NewsletterSectionProps {
  user: any;
  isNewsletterSubscribed: boolean;
}

export function NewsletterSection({ user, isNewsletterSubscribed }: NewsletterSectionProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [existingUserEmail, setExistingUserEmail] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setNewsletterSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: {
          email: newsletterEmail.toLowerCase(),
          user_id: user?.id || null
        }
      });
      
      if (error) throw error;
      
      if (data?.existed && !user) {
        setExistingUserEmail(newsletterEmail);
        setShowLoginPrompt(true);
        toast({
          title: "You're already subscribed",
          description: "Please log in to access your prompts. We've prefilled your email."
        });
        return;
      }
      
      toast({
        title: "Successfully subscribed!",
        description: "Welcome to our weekly prompt tips! Please check your email (and spam folder) for confirmation."
      });
      setNewsletterEmail("");
      setNewsletterSuccess(true);
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error?.message || "Sorry, something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  const handleLogin = () => {
    navigate('/auth', { state: { email: existingUserEmail } });
    toast({
      title: "Please complete your login",
      description: "You already have an account! Please enter your password to log in."
    });
  };

  // If logged in and newsletter subscribed, show matched power packs
  if (user && isNewsletterSubscribed) {
    return (
      <section className="py-12 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <MatchedPowerPacks />
            <div className="mt-6">
              <PromptStudioCTA variant="compact" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto">
          <Card className="border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Get Weekly AI Prompt Tips</h2>
              <p className="text-muted-foreground mb-6">
                Join 5,000+ professionals. Get curated prompts, AI tips, and exclusive content delivered to your inbox every week.
              </p>
              
              {showLoginPrompt ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You already have an account with <strong>{existingUserEmail}</strong>
                  </p>
                  <Button onClick={handleLogin} className="w-full sm:w-auto">
                    Log in to continue
                  </Button>
                </div>
              ) : newsletterSuccess ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Check your email to confirm!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button type="submit" disabled={newsletterSubmitting}>
                    {newsletterSubmitting ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              )}
              
              {!newsletterSuccess && !showLoginPrompt && (
                <p className="text-xs text-muted-foreground mt-4">No spam. Unsubscribe anytime. Free forever.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
