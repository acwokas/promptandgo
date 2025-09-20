import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Users, Zap } from "lucide-react";

interface UrgencyBadgeProps {
  variant: "trending" | "popular" | "new" | "hot" | "limited";
  className?: string;
}

export const UrgencyBadge = ({ variant, className = "" }: UrgencyBadgeProps) => {
  const badges = {
    trending: {
      icon: TrendingUp,
      text: "Trending",
      className: "bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse"
    },
    popular: {
      icon: Users,
      text: "Most Used",
      className: "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
    },
    new: {
      icon: Zap,
      text: "New",
      className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
    },
    hot: {
      icon: Zap,
      text: "🔥 Hot",
      className: "bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse"
    },
    limited: {
      icon: Clock,
      text: "Limited Time",
      className: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white animate-pulse"
    }
  };

  const badge = badges[variant];
  const Icon = badge.icon;

  return (
    <Badge className={`${badge.className} ${className} flex items-center gap-1 text-xs font-medium`}>
      <Icon className="h-3 w-3" />
      {badge.text}
    </Badge>
  );
};

export const TodaysFeatured = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  // Rotate featured content by day of week
  const featuredTopics = [
    "Marketing Automation",
    "Content Creation", 
    "Business Strategy",
    "Social Media",
    "Email Campaigns",
    "Sales Outreach",
    "Creative Writing"
  ];

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-4 w-4 text-primary" />
        <span className="font-semibold text-sm">Today's Featured Category</span>
        <UrgencyBadge variant="hot" />
      </div>
      <p className="text-sm text-muted-foreground">
        {featuredTopics[dayOfWeek]} prompts are getting 3x more usage today. 
        <span className="font-medium text-foreground"> Don't miss out!</span>
      </p>
    </div>
  );
};