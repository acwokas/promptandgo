import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Clock, ArrowRight, Star } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useBehaviorData } from "./BehaviorTracker";

interface Recommendation {
  id: string;
  type: 'prompt' | 'feature' | 'upgrade' | 'content';
  title: string;
  description: string;
  link: string;
  priority: number;
  badge?: string;
  icon?: React.ReactNode;
  condition?: (user: any, isSubscribed: boolean, behaviorScore: number, isHighIntent: boolean) => boolean;
}

const recommendations: Recommendation[] = [
  {
    id: 'ai-assistant',
    type: 'feature',
    title: "Try Scout AI Assistant",
    description: "Get personalised prompt suggestions based on your needs",
    link: "/ai-assistant",
    priority: 1,
    badge: "Popular",
    icon: <Sparkles className="h-4 w-4" />,
    condition: (user, isSubscribed, behaviorScore) => behaviorScore > 5
  },
  {
    id: 'prompt-studio',
    type: 'feature', 
    title: "Create Custom Prompts",
    description: "Use our guided wizard to craft perfect prompts for any task",
    link: "/prompt-studio",
    priority: 2,
    badge: "Pro Tool",
    icon: <TrendingUp className="h-4 w-4" />,
    condition: (user, isSubscribed, behaviorScore) => behaviorScore > 3
  },
  {
    id: 'upgrade-premium',
    type: 'upgrade',
    title: "Unlock 500+ Premium Prompts",
    description: "Access our full library and advanced AI features",
    link: "/auth?mode=signup",
    priority: 3,
    badge: "50% OFF",
    icon: <Star className="h-4 w-4" />,
    condition: (user, isSubscribed, behaviorScore, isHighIntent) => !isSubscribed && (isHighIntent || behaviorScore > 8)
  },
  {
    id: 'popular-prompts',
    type: 'content',
    title: "Most Popular This Week",
    description: "Check out the prompts everyone's talking about",
    link: "/library?sort=popular",
    priority: 4,
    badge: "Trending",
    icon: <TrendingUp className="h-4 w-4" />,
    condition: () => true
  },
  {
    id: 'time-savers',
    type: 'content',
    title: "Ultimate Time-Savers Pack",
    description: "Prompts that save 10+ hours weekly for busy professionals",
    link: "/packs/time-savers",
    priority: 5,
    badge: "Hot",
    icon: <Clock className="h-4 w-4" />,
    condition: (user, isSubscribed, behaviorScore) => behaviorScore > 2
  },
  {
    id: 'getting-started',
    type: 'content',
    title: "AI Prompts Beginner Guide",
    description: "Learn how to write effective prompts that get results",
    link: "/blog/how-to-write-ai-prompts",
    priority: 6,
    icon: <Sparkles className="h-4 w-4" />,
    condition: (user, isSubscribed, behaviorScore) => behaviorScore < 3
  }
];

interface SmartRecommendationsProps {
  maxItems?: number;
  variant?: 'default' | 'compact' | 'sidebar';
  className?: string;
}

const SmartRecommendations = ({ 
  maxItems = 3, 
  variant = 'default',
  className = '' 
}: SmartRecommendationsProps) => {
  const { user } = useSupabaseAuth();
  const { isSubscribed } = useSubscriptionStatus();
  const { getEngagementScore, isHighIntent } = useBehaviorData();
  const [personalizedRecs, setPersonalizedRecs] = useState<Recommendation[]>([]);

  useEffect(() => {
    const behaviorScore = getEngagementScore();
    const highIntent = isHighIntent();

    // Filter and sort recommendations based on user context
    const filtered = recommendations
      .filter(rec => !rec.condition || rec.condition(user, isSubscribed, behaviorScore, highIntent))
      .sort((a, b) => {
        // Prioritize high-intent users for upgrade recommendations
        if (highIntent && a.type === 'upgrade') return -1;
        if (highIntent && b.type === 'upgrade') return 1;
        
        // Otherwise sort by priority
        return a.priority - b.priority;
      })
      .slice(0, maxItems);

    setPersonalizedRecs(filtered);
  }, [user, isSubscribed, maxItems]);

  if (personalizedRecs.length === 0) return null;

  const CompactView = () => (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        Recommended for you
      </h3>
      {personalizedRecs.map((rec) => (
        <div key={rec.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 flex-1">
            {rec.icon}
            <div>
              <p className="font-medium text-sm">{rec.title}</p>
              <p className="text-xs text-muted-foreground">{rec.description}</p>
            </div>
          </div>
          {rec.badge && (
            <Badge variant="secondary" className="text-xs mr-2">
              {rec.badge}
            </Badge>
          )}
          <Button asChild size="sm" variant="ghost">
            <Link to={rec.link}>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );

  const SidebarView = () => (
    <Card className={`sticky top-4 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          For You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {personalizedRecs.map((rec) => (
          <div key={rec.id} className="group">
            <Button asChild variant="ghost" className="w-full justify-start h-auto p-3 text-left">
              <Link to={rec.link}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-1">
                    {rec.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{rec.title}</p>
                      {rec.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {rec.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {rec.description}
                    </p>
                  </div>
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  if (variant === 'compact') {
    return <CompactView />;
  }

  if (variant === 'sidebar') {
    return <SidebarView />;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {personalizedRecs.map((rec) => (
          <div key={rec.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
            <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
              {rec.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">{rec.title}</h4>
                {rec.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {rec.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {rec.description}
              </p>
              <Button asChild size="sm">
                <Link to={rec.link} className="flex items-center gap-2">
                  Learn More
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
