import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Pen, MessageSquare } from "lucide-react";

interface WelcomeStepProps {
  onNext: (name: string) => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNext(name.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-6 animate-fade-in">
        <img 
          src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png" 
          alt="PromptAndGo Logo" 
          className="h-24 w-auto mx-auto mb-6"
        />
      </div>

      <div className="flex justify-center gap-8 mb-8 animate-fade-in">
        <Brain className="h-16 w-16 text-[#4A90E2] animate-pulse" />
        <Pen className="h-16 w-16 text-[#F5A623] animate-pulse delay-100" />
        <MessageSquare className="h-16 w-16 text-[#6DD5FA] animate-pulse delay-200" />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#4A90E2] to-[#6DD5FA] bg-clip-text text-transparent">
        Welcome to PromptAndGo
      </h1>

      <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
        Your new creative engine. In the next few minutes, you'll learn how to use prompts like a pro, test your skills, and earn your first PromptAndGo badge.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-left block">Your Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="text-center"
          />
          <p className="text-sm text-muted-foreground">
            This will appear on your certificate
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-[#4A90E2] hover:bg-[#4A90E2]/90"
          disabled={!name.trim()}
        >
          Let's Start Prompting
        </Button>
      </form>
    </div>
  );
}
