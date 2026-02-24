import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Sparkles, Zap, Target } from "lucide-react";

interface WelcomeStepProps {
  onNext: (name: string) => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const [name, setName] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNext(name.trim());
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Logo */}
      <div className="mb-8 animate-float-in">
        <img
          src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png"
          alt="PromptAndGo Logo"
          className="h-28 w-auto mx-auto mb-8 drop-shadow-lg"
        />
      </div>

      {/* Feature Icons with Brand Colors */}
      <div className="flex justify-center gap-6 mb-12 animate-float-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-col items-center gap-2 group">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <span className="text-xs font-semibold text-foreground">Master Mind</span>
        </div>
        <div className="flex flex-col items-center gap-2 group">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Zap className="h-8 w-8 text-accent" />
          </div>
          <span className="text-xs font-semibold text-foreground">Skill Boost</span>
        </div>
        <div className="flex flex-col items-center gap-2 group">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Target className="h-8 w-8 text-gradient-brand" />
          </div>
          <span className="text-xs font-semibold text-foreground">Get Certified</span>
        </div>
      </div>

      {/* Main Heading */}
      <div className="mb-8 animate-float-in" style={{ animationDelay: "0.2s" }}>
        <h1 className="text-5xl md:text-6xl font-black mb-4">
          <span className="text-gradient-brand">Prompt Like a Pro</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Master the art of AI prompt engineering and join the elite community of PromptAndGo Certified Professionals.
        </p>
      </div>

      {/* What You'll Get */}
      <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto mb-12 text-center animate-float-in" style={{ animationDelay: "0.3s" }}>
        <div className="p-3 md:p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-all">
          <div className="text-2xl md:text-3xl font-bold text-gradient-brand mb-1">✓</div>
          <p className="text-xs md:text-sm font-medium text-foreground">Master<br />prompt engineering</p>
        </div>
        <div className="p-3 md:p-4 rounded-lg bg-card border border-border hover:border-accent/30 transition-all">
          <div className="text-2xl md:text-3xl font-bold text-accent mb-1">🏆</div>
          <p className="text-xs md:text-sm font-medium text-foreground">Earn your<br />credential</p>
        </div>
        <div className="p-3 md:p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-all">
          <div className="text-2xl md:text-3xl font-bold text-gradient-brand mb-1">📲</div>
          <p className="text-xs md:text-sm font-medium text-foreground">Share on<br />LinkedIn</p>
        </div>
      </div>

      {/* Name Input Form */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6 animate-float-in" style={{ animationDelay: "0.4s" }}>
        <div className="space-y-3">
          <div className={`relative transition-all duration-300 ${focused ? "scale-105" : ""}`}>
            <Label
              htmlFor="name"
              className={`absolute left-4 top-4 text-sm font-semibold transition-all duration-300 pointer-events-none ${
                focused || name.trim()
                  ? "-top-2.5 left-3 text-xs bg-background px-1 text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Your Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              required
              className="text-base md:text-lg h-14 px-4 pt-6 border-2 border-border hover:border-primary/30 focus:border-primary transition-colors"
            />
          </div>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3 text-accent" />
            This will appear on your certificate and LinkedIn profile
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
          disabled={!name.trim()}
        >
          {name.trim() ? "Let's Get Started →" : "Enter your name to begin"}
        </Button>
      </form>

      {/* Trust Badge */}
      <div className="mt-8 pt-8 border-t border-border/50 animate-float-in" style={{ animationDelay: "0.5s" }}>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">
          Join our community
        </p>
        <div className="flex justify-center items-center gap-6">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">10K+</div>
            <div className="text-xs text-muted-foreground">Certified</div>
          </div>
          <div className="w-px h-6 bg-border/30"></div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent">4.9★</div>
            <div className="text-xs text-muted-foreground">Rated</div>
          </div>
        </div>
      </div>
    </div>
  );
}
