import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface UrgencyBadgeProps {
  variant: "trending" | "popular" | "new" | "hot" | "limited";
  className?: string;
}

export const UrgencyBadge = ({ variant, className = "" }: UrgencyBadgeProps) => {
  const badges = {
    trending: {
      icon: TrendingUp,
      text: "Trending",
      className: "bg-gradient-to-r from-primary to-destructive text-primary-foreground animate-pulse"
    },
    popular: {
      icon: Users,
      text: "Most Used",
      className: "bg-gradient-to-r from-primary to-accent text-primary-foreground"
    },
    new: {
      icon: Zap,
      text: "New",
      className: "bg-gradient-to-r from-secondary to-accent text-secondary-foreground"
    },
    hot: {
      icon: Zap,
      text: "🔥 Hot",
      className: "bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground animate-pulse"
    },
    limited: {
      icon: Clock,
      text: "Limited Time",
      className: "bg-gradient-to-r from-primary to-accent text-primary-foreground animate-pulse"
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

interface Category {
  id: string;
  name: string;
  slug: string;
}

export const TodaysFeatured = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name");
      
      if (data) {
        setCategories(data);
      }
    };
    
    loadCategories();
  }, []);

  // Get today's featured category based on day of year for more variety
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const featuredCategory = categories.length > 0 ? categories[dayOfYear % categories.length] : null;

  const handleClick = () => {
    if (featuredCategory) {
      navigate(`/library?categoryId=${featuredCategory.id}`);
    }
  };

  if (!featuredCategory) {
    return null;
  }

  return (
    <div 
      className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4 mb-6 max-w-4xl mx-auto cursor-pointer hover:border-primary/30 hover:shadow-md transition-all duration-200"
      onClick={handleClick}
    >
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Today's Featured Category</span>
        </div>
        <UrgencyBadge variant="hot" />
      </div>
      <p className="text-sm text-muted-foreground text-center sm:text-left">
        <span className="font-medium text-foreground hover:text-primary transition-colors">
          {featuredCategory.name}
        </span> prompts are getting 3x more usage today. 
        <span className="font-medium text-foreground"> Click to explore!</span>
      </p>
    </div>
  );
};