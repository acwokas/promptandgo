import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Wand2, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptStudioCTAProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
}

export const PromptStudioCTA = ({ variant = "default", className }: PromptStudioCTAProps) => {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20", className)}>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Wand2 className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Create Custom Prompts</h3>
          <p className="text-xs text-muted-foreground">Use Scout's Prompt Studio to craft personalised prompts</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/ai/studio">
            Try Studio
          </Link>
        </Button>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Card className={cn("bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Scout's Prompt Studio</h3>
              <p className="text-xs text-muted-foreground">Create custom AI prompts instantly</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="w-full">
            <Link to="/ai/studio">
              <Wand2 className="h-4 w-4 mr-2" />
              Launch Studio
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-primary/20", className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Scout's Prompt Studio</h3>
            <p className="text-sm text-muted-foreground">Create custom prompts with AI assistance</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Let Scout help you craft the perfect prompt for your specific needs. Choose your topic, customise parameters, and get a tailored prompt in seconds.
        </p>
        <Button asChild className="w-full" variant="default">
          <Link to="/ai/studio">
            <Sparkles className="h-4 w-4 mr-2" />
            Try Prompt Studio
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PromptStudioCTA;