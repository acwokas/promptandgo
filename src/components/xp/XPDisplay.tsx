import { Award, Sparkles } from "lucide-react";
import { useUserXP } from "@/hooks/useUserXP";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

export const XPDisplay = () => {
  const { userXP, isLoadingXP } = useUserXP();

  if (isLoadingXP) {
    return <Skeleton className="h-10 w-32" />;
  }

  if (!userXP) {
    return null;
  }

  const xpToNextLevel = (userXP.level * 100) - userXP.total_xp;
  const progressToNextLevel = ((userXP.total_xp % 100) / 100) * 100;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient-x cursor-pointer group overflow-hidden shadow-lg hover:shadow-primary/50 transition-all duration-300">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            
            {/* Content */}
            <div className="relative flex items-center gap-2">
              {/* Sparkle icon with animation */}
              <Sparkles className="h-5 w-5 text-primary-foreground animate-pulse" />
              
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-primary-foreground drop-shadow-md">
                    {userXP.available_xp.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-primary-foreground/90">XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-3 w-3 text-primary-foreground/80" />
                  <span className="text-xs font-medium text-primary-foreground/90">Level {userXP.level}</span>
                </div>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="w-64">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Level {userXP.level}</span>
              <span className="text-xs text-muted-foreground">
                {xpToNextLevel} XP to Level {userXP.level + 1}
              </span>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Total: {userXP.total_xp.toLocaleString()} XP</span>
              <span>Available: {userXP.available_xp.toLocaleString()} XP</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
