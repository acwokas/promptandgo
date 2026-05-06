import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const ConversionBar = () => {
  const { user } = useSupabaseAuth();

  if (user) return null; // Only show to non-authenticated users

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 px-4 text-center relative">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 text-sm">
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span className="font-medium">
          5,000+ professionals using our prompts to work faster
        </span>
        <Button 
          asChild 
          variant="secondary" 
          size="sm" 
          className="bg-white/20 hover:bg-white/30 text-primary-foreground border-white/30"
        >
          <Link to="/auth?mode=signup" className="flex items-center gap-1">
            Get FREE Pack <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ConversionBar;