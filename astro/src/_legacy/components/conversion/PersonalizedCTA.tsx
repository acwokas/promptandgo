import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Clock, Gift, Zap } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

interface UserBehavior {
  visitCount: number;
  timeOnSite: number;
  pagesViewed: string[];
  lastVisit: string;
  hasInteractedWithAI: boolean;
  preferredCategory?: string;
}

interface CTAVariant {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  icon: React.ReactNode;
  urgency?: string;
  condition: (behavior: UserBehavior, user: any, isSubscribed: boolean) => boolean;
}

const ctaVariants: CTAVariant[] = [
  {
    id: 'first-time-visitor',
    title: "Welcome! Start with our most popular prompts",
    description: "Join 5,000+ professionals saving 10+ hours weekly with proven AI prompts",
    buttonText: "Browse Free Prompts",
    buttonLink: "/library",
    icon: <Sparkles className="h-5 w-5" />,
    condition: (behavior) => behavior.visitCount <= 1 && behavior.timeOnSite < 60
  },
  {
    id: 'engaged-visitor',
    title: "You seem interested! Get your free starter pack",
    description: "Since you've been exploring, here's 20 premium prompts on us",
    buttonText: "Claim Free Pack",
    buttonLink: "/auth?mode=signup",
    icon: <Gift className="h-5 w-5" />,
    urgency: "Limited time",
    condition: (behavior, user) => !user && behavior.visitCount >= 2 && behavior.timeOnSite > 120
  },
  {
    id: 'returning-visitor',
    title: "Welcome back! Pick up where you left off",
    description: "Continue exploring our AI prompt library and tools",
    buttonText: "Continue Browsing",
    buttonLink: "/library",
    icon: <ArrowRight className="h-5 w-5" />,
    condition: (behavior, user) => !user && behavior.visitCount > 3
  },
  {
    id: 'new-user',
    title: "Complete your profile to get personalised prompts",
    description: "Tell us about your work and we'll recommend the best prompts for you",
    buttonText: "Complete Profile",
    buttonLink: "/account/profile",
    icon: <Sparkles className="h-5 w-5" />,
    condition: (behavior, user, isSubscribed) => !!user && !isSubscribed && behavior.visitCount <= 2
  },
  {
    id: 'active-free-user',
    title: "Ready to unlock your full potential?",
    description: "You've been active! Upgrade to access 500+ premium prompts and Scout AI",
    buttonText: "Upgrade Now",
    buttonLink: "/auth?mode=signup",
    icon: <Zap className="h-5 w-5" />,
    urgency: "Save 50%",
    condition: (behavior, user, isSubscribed) => !!user && !isSubscribed && behavior.visitCount > 5
  },
  {
    id: 'ai-curious',
    title: "Try Scout AI - Your personal prompt assistant",
    description: "Get instant prompt optimization and platform-specific versions",
    buttonText: "Try Scout AI",
    buttonLink: "/ai-assistant",
    icon: <Sparkles className="h-5 w-5" />,
    condition: (behavior) => behavior.pagesViewed.includes('/ai-assistant') || behavior.hasInteractedWithAI
  }
];

interface PersonalizedCTAProps {
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
}

const PersonalizedCTA = ({ variant = 'card', className = '' }: PersonalizedCTAProps) => {
  const { user } = useSupabaseAuth();
  const { isSubscribed } = useSubscriptionStatus();
  const [behavior, setBehavior] = useState<UserBehavior>({
    visitCount: 1,
    timeOnSite: 0,
    pagesViewed: [window.location.pathname],
    lastVisit: new Date().toISOString(),
    hasInteractedWithAI: false
  });
  const [selectedCTA, setSelectedCTA] = useState<CTAVariant | null>(null);

  useEffect(() => {
    // Track user behavior
    const savedBehavior = localStorage.getItem('user-behavior');
    let currentBehavior: UserBehavior;
    
    if (savedBehavior) {
      const parsed = JSON.parse(savedBehavior);
      currentBehavior = {
        ...parsed,
        visitCount: parsed.visitCount + 1,
        timeOnSite: 0, // Reset for new session
        pagesViewed: [...new Set([...parsed.pagesViewed, window.location.pathname])],
        lastVisit: new Date().toISOString()
      };
    } else {
      currentBehavior = behavior;
    }
    
    setBehavior(currentBehavior);
    localStorage.setItem('user-behavior', JSON.stringify(currentBehavior));

    // Track time on site
    const startTime = Date.now();
    const interval = setInterval(() => {
      const timeOnSite = Math.floor((Date.now() - startTime) / 1000);
      setBehavior(prev => ({ ...prev, timeOnSite }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Select the most appropriate CTA based on user behavior
    const matchingCTA = ctaVariants.find(cta => 
      cta.condition(behavior, user, isSubscribed)
    );
    
    setSelectedCTA(matchingCTA || ctaVariants[0]); // Fallback to first CTA
  }, [behavior, user, isSubscribed]);

  if (!selectedCTA) return null;

  const CTAContent = () => (
    <>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
          {selectedCTA.icon}
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground">
              {selectedCTA.title}
            </h3>
            {selectedCTA.urgency && (
              <Badge variant="secondary" className="text-xs">
                {selectedCTA.urgency}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {selectedCTA.description}
          </p>
          <Button asChild className="w-full sm:w-auto">
            <Link to={selectedCTA.buttonLink} className="flex items-center gap-2">
              {selectedCTA.buttonText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-primary/10 to-accent/10 border-y ${className}`}>
        <div className="container py-4">
          <CTAContent />
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`p-4 bg-muted/50 rounded-lg border ${className}`}>
        <CTAContent />
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <CTAContent />
      </CardContent>
    </Card>
  );
};

export default PersonalizedCTA;