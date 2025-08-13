import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Clock, Zap, Crown, TrendingUp } from "lucide-react";

interface AICreditsExhaustedProps {
  usageType?: string;
  currentUsage?: number;
  dailyLimit?: number;
  remaining?: number;
}

const AICreditsExhausted = ({ 
  usageType = 'generator', 
  currentUsage = 5, 
  dailyLimit = 5, 
  remaining = 0 
}: AICreditsExhaustedProps) => {
  const getUsageTypeLabel = (type: string) => {
    switch (type) {
      case 'generator': return 'AI Prompt Generator';
      case 'suggestions': return 'Smart Suggestions';
      case 'assistant': return 'AI Assistant';
      default: return 'AI Tools';
    }
  };

  const progressPercentage = (currentUsage / dailyLimit) * 100;

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Daily AI Limit Reached"
        description="You've reached your daily AI usage limit. Upgrade to unlock more queries or wait until tomorrow."
      />
      
      <PageHero
        title="Daily Limit Reached"
        subtitle="You've used all your free AI queries for today"
        variant="default"
        minHeightClass="min-h-[40vh]"
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Usage Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              {getUsageTypeLabel(usageType)} Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Daily Usage</span>
              <Badge variant="secondary">
                {currentUsage} / {dailyLimit} queries
              </Badge>
            </div>
            
            <Progress value={progressPercentage} className="h-3" />
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Resets daily at midnight UTC
            </div>
          </CardContent>
        </Card>

        {/* What You Can Do */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Wait for Reset */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Wait for Daily Reset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Your free queries will refresh tomorrow at midnight UTC.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Next reset:</span>
                  <span className="font-medium">
                    {new Date(Date.now() + (24 * 60 * 60 * 1000)).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Explore Other Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Explore Other Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Continue using our free prompt library while you wait.
              </p>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/library">
                    Browse Prompt Library
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/packs">
                    Explore Power Packs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Options */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Upgrade for Unlimited Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Free Plan (Current)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 5 AI Prompt Generator queries/day</li>
                  <li>• 3 Smart Suggestions queries/day</li>
                  <li>• 10 AI Assistant messages/day</li>
                  <li>• Access to free prompt library</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Premium Plan</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>50</strong> AI Prompt Generator queries/day</li>
                  <li>• <strong>25</strong> Smart Suggestions queries/day</li>
                  <li>• <strong>100</strong> AI Assistant messages/day</li>
                  <li>• Access to premium prompts & packs</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="flex-1"
                disabled
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium - Coming Soon
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/account">
                  View Account
                </Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              Premium plans coming soon! We're working on pricing that works for everyone.
            </p>
          </CardContent>
        </Card>

        {/* Additional Actions */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-muted-foreground">
            Need help or have questions about usage limits?
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline">
              <Link to="/contact">Contact Support</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/faqs">View FAQs</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICreditsExhausted;