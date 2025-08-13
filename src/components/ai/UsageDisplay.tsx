import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, RefreshCw, Crown } from "lucide-react";
import { useAIUsage } from "@/hooks/useAIUsage";

interface UsageDisplayProps {
  usageType?: 'generator' | 'suggestions' | 'assistant' | 'all';
  compact?: boolean;
}

const UsageDisplay = ({ usageType = 'all', compact = false }: UsageDisplayProps) => {
  const { usage, refreshUsage } = useAIUsage();

  const getUsageTypeLabel = (type: string) => {
    switch (type) {
      case 'generator': return 'AI Prompt Generator';
      case 'suggestions': return 'Smart Suggestions';
      case 'assistant': return 'AI Assistant';
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
        { type: 'generator', data: usage.generator, label: 'Generator' },
        { type: 'suggestions', data: usage.suggestions, label: 'Suggestions' },
        { type: 'assistant', data: usage.assistant, label: 'Assistant' }
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
            <span className="text-sm font-medium">{singleUsage.label}</span>
            <Badge variant={singleUsage.data.remaining > 0 ? "secondary" : "destructive"}>
              {singleUsage.data.remaining} left
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {singleUsage.data.current_usage} / {singleUsage.data.daily_limit} queries used
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            AI Usage Today
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
                <span>Resets daily at midnight UTC</span>
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
                  Upgrade to premium for higher daily limits and unlimited access to all AI features.
                </p>
                <Button size="sm" className="mt-2" disabled>
                  <Crown className="h-4 w-4 mr-1" />
                  Upgrade - Coming Soon
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageDisplay;