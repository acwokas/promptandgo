import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowDown, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import PromptCardDemo from "./PromptCardDemo";

const ScoutDemo = () => {
  return (
    <section className="pt-16 pb-16 bg-gradient-to-br from-muted/30 to-background">
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
            
            <div className="flex items-center justify-end gap-2 text-lg font-medium text-muted-foreground">
              Try the template 
              <ArrowDown className="h-5 w-5 lg:hidden" />
              <ArrowRight className="h-5 w-5 hidden lg:block" />
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