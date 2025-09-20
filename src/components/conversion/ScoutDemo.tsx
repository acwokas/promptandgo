import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import PromptCardDemo from "./PromptCardDemo";

const ScoutDemo = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
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
            
            <div className="pt-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>500+ proven prompts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Instant optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>All platforms</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Demo Card */}
          <div className="flex justify-center">
            <PromptCardDemo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScoutDemo;