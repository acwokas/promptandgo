import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, RefreshCw, Crown, Infinity } from "lucide-react";
import { useAIUsage } from "@/hooks/useAIUsage";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useState, useEffect } from "react";

interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: string | null;
}

interface UsageDisplayProps {
  usageType?: 'generator' | 'assistant' | 'sends' | 'all';
  compact?: boolean;
}

const UsageDisplay = ({ usageType = 'all', compact = false }: UsageDisplayProps) => {
  const { user } = useSupabaseAuth();
  const { usage, refreshUsage } = useAIUsage();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);

  // Fetch subscription info
  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (!user) {
        setSubscriptionInfo(null);
        return;
      }

      try {
        // SECURITY FIX: Use secure RPC instead of direct table access
        const { data, error } = await supabase
          .rpc('get_user_subscription_status')
          .maybeSingle();

        if (error) throw error;
        setSubscriptionInfo(data);
      } catch (error) {
        console.error('Error fetching subscription info:', error);
        setSubscriptionInfo(null);
      }
    };

    fetchSubscriptionInfo();
  }, [user]);

  const getSubscriptionMultiplier = () => {
    if (!subscriptionInfo?.subscribed) return 1;
    const tier = subscriptionInfo.subscription_tier?.toLowerCase();
    if (tier === 'basic' || tier === 'monthly') return "3x"; // 30,30,40 vs 10,10,20 is roughly 3x
    if (tier === 'premium' || tier === 'lifetime') return "6x"; // 60,60,60 vs 10,10,20 is roughly 6x
    return "Premium";
  };

  const getSubscriptionBadge = () => {
    if (!subscriptionInfo?.subscribed) return null;
    const tier = subscriptionInfo.subscription_tier?.toLowerCase();
    if (tier === 'basic' || tier === 'monthly') {
      return <Badge variant="secondary" className="text-xs"><Crown className="h-3 w-3 mr-1" />Monthly 3x</Badge>;
    }
    if (tier === 'premium' || tier === 'lifetime') {
      return <Badge variant="secondary" className="text-xs"><Infinity className="h-3 w-3 mr-1" />Lifetime 6x</Badge>;
    }
    return <Badge variant="secondary" className="text-xs"><Crown className="h-3 w-3 mr-1" />Premium</Badge>;
  };

  const getUsageTypeLabel = (type: string) => {
    switch (type) {
      case 'generator': return 'Scout Prompt Generator';
      case 'assistant': return 'Scout Assistant';
      case 'sends': return 'Scout\'s Push to AI Platform';
      default: return 'AI Tools';
    }
  };

  const getUsageColor = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (usage.loading) {
    return (
      <Card className={compact ? 'p-3' : ''}>
        <CardContent className={compact ? 'p-0' : 'pt-6'}>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading usage...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (usage.error) {
    return (
      <Card className={compact ? 'p-3' : ''}>
        <CardContent className={compact ? 'p-0' : 'pt-6'}>
          <div className="text-sm text-muted-foreground">
            Failed to load usage data
          </div>
        </CardContent>
      </Card>
    );
  }

  const usageData = usageType === 'all' 
    ? [
        { type: 'generator', data: usage.generator, label: 'Scout Prompt Generator' },
        { type: 'assistant', data: usage.assistant, label: 'Scout Assistant' },
        { type: 'sends', data: usage.sends, label: 'Scout\'s Push to AI Platform' }
      ]
    : [{ type: usageType, data: usage[usageType], label: getUsageTypeLabel(usageType) }];

  if (compact) {
    const singleUsage = usageData[0];
    if (!singleUsage.data) return null;

    const progressPercentage = ((singleUsage.data.current_usage / singleUsage.data.daily_limit) * 100);
    
    return (
      <Card className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{singleUsage.label}</span>
              {getSubscriptionBadge()}
            </div>
            <Badge variant={singleUsage.data.remaining > 0 ? "secondary" : "destructive"}>
              {singleUsage.data.remaining} left
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>{singleUsage.data.current_usage} / {singleUsage.data.daily_limit} queries used</span>
            {subscriptionInfo?.subscribed && (
              <span>{getSubscriptionMultiplier()}x limits</span>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <video 
                src="/scout-animation-v2.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
              />
            </div>
            <span>Scout AI Usage Today</span>
            {getSubscriptionBadge()}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshUsage}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {usageData.map(({ type, data, label }) => {
          if (!data) return null;

          const progressPercentage = (data.current_usage / data.daily_limit) * 100;
          
          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{label}</span>
                <Badge 
                  variant={data.remaining > 0 ? "secondary" : "destructive"}
                  className={getUsageColor(data.remaining, data.daily_limit)}
                >
                  {data.remaining} / {data.daily_limit} remaining
                </Badge>
              </div>
              
              <Progress value={progressPercentage} className="h-3" />
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{data.current_usage} queries used</span>
                <span>Resets daily at midnight SGT</span>
              </div>
            </div>
          );
        })}

        {usageData.some(({ data }) => data && data.remaining === 0) && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <Crown className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium">Need more queries?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {!subscriptionInfo?.subscribed ? (
                    <>Upgrade to get <strong>30 generator + 40 assistant + 20 AI sends/day</strong> with monthly membership or <strong>60 queries/day each + 40 AI sends</strong> with lifetime access.</>
                  ) : (
                    <>You've reached your enhanced daily limits. Your queries will reset at midnight SGT.</>
                  )}
                </p>
                {!subscriptionInfo?.subscribed && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">
                      <Crown className="h-4 w-4 mr-1" />
                      Monthly (30+40+20/day) - $12.99/mo
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Infinity className="h-4 w-4 mr-1" />
                      Lifetime (60+60+40/day) - $99.50
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {subscriptionInfo?.subscribed && (
          <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
            <div className="flex items-start gap-3">
              {subscriptionInfo.subscription_tier?.toLowerCase() === 'lifetime' || subscriptionInfo.subscription_tier?.toLowerCase() === 'premium' ? (
                <Infinity className="h-5 w-5 text-primary mt-0.5" />
              ) : (
                <Crown className="h-5 w-5 text-primary mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-medium flex items-center gap-2">
                  Premium Member Benefits
                  {getSubscriptionBadge()}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  You're enjoying {getSubscriptionMultiplier()}x the standard AI query limits. 
                  {subscriptionInfo.subscription_tier?.toLowerCase() === 'lifetime' || subscriptionInfo.subscription_tier?.toLowerCase() === 'premium' 
                    ? ' Thank you for your lifetime support!' 
                    : ' Your subscription provides enhanced daily limits.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageDisplay;