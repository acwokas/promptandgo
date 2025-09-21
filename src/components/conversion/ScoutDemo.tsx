import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import PromptCardDemo from "./PromptCardDemo";

const ScoutDemo = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
      <div className="container">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left side - Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Browse proven prompts, then let{" "}
                <span className="text-gradient-brand">Scout optimize them</span>{" "}
                instantly
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Start with battle-tested prompts from our curated library. Then Scout 
                customizes them for ChatGPT, Claude, MidJourney, or any AI platform in 
                seconds. No more starting from scratch or endless tweaking. All for free.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base">
                <Link to="/library" className="flex items-center gap-2">
                  Browse Proven Prompts
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link to="/ai/assistant" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Try Scout AI
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Right side - Demo Card (More space) */}
          <div className="lg:col-span-3 flex justify-center">
            <PromptCardDemo className="max-w-none w-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScoutDemo;