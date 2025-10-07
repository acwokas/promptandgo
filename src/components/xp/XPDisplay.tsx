import { Award, TrendingUp } from "lucide-react";
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
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 cursor-pointer hover:border-primary/40 transition-colors">
            <Award className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-foreground">
                  {userXP.available_xp.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">XP</span>
              </div>
              <span className="text-xs text-muted-foreground">Lvl {userXP.level}</span>
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
