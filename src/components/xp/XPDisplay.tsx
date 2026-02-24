import { Award, Sparkles } from "lucide-react";
import { useUserXP } from "@/hooks/useUserXP";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
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
          <Link to="/account/xp">
            <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent cursor-pointer group overflow-hidden shadow-md hover:shadow-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-300">
              {/* Content */}
              <div className="relative flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-white drop-shadow-sm" />
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white drop-shadow-sm">
                    {userXP.available_xp.toLocaleString()}
                  </span>
                  <span className="text-xs text-white/90 drop-shadow-sm">XP</span>
                  <span className="text-xs text-white/70">•</span>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3 text-white/90 drop-shadow-sm" />
                    <span className="text-xs font-medium text-white/95 drop-shadow-sm">Lvl {userXP.level}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
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
