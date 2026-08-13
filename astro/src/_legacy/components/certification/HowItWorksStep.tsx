import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Edit3, Copy, Lightbulb } from "lucide-react";

interface HowItWorksStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function HowItWorksStep({ onNext, onBack }: HowItWorksStepProps) {
  const steps = [
    {
      icon: Search,
      title: "Browse",
      description: "Browse prompts by category or keyword",
    },
    {
      icon: Edit3,
      title: "Adapt",
      description: "Adapt any prompt to your needs with Scout AI",
    },
    {
      icon: Copy,
      title: "Use",
      description: "Each prompt includes tone, context, and format guidance for the relevant AI platform",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
        How PromptAndGo Works
      </h2>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {steps.map((step, index) => (
          <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-[#4A90E2]/10 flex items-center justify-center">
                <step.icon className="h-8 w-8 text-[#4A90E2]" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm">{step.description}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 mb-8 bg-[#6DD5FA]/5 border-[#6DD5FA]/20">
        <div className="flex gap-3">
          <Lightbulb className="h-6 w-6 text-[#F5A623] flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium mb-2">Pro tip:</p>
            <p className="text-muted-foreground">
              Great prompts are half instruction, half imagination.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onNext} className="bg-[#4A90E2] hover:bg-[#4A90E2]/90">
          Next: The Rules of Prompting
        </Button>
      </div>
    </div>
  );
}
