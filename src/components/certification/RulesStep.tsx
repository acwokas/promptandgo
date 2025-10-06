import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, FileText, Volume2, Users } from "lucide-react";

interface RulesStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function RulesStep({ onNext, onBack }: RulesStepProps) {
  const rules = [
    {
      icon: Target,
      title: "Keep instructions clear and specific",
      color: "#4A90E2",
    },
    {
      icon: FileText,
      title: "Always include tone, format, and audience",
      color: "#F5A623",
    },
    {
      icon: Volume2,
      title: "Avoid filler words — your AI will thank you",
      color: "#6DD5FA",
    },
    {
      icon: Users,
      title: "Treat your AI like a creative partner, not a robot",
      color: "#43B581",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
        The Golden Rules of Prompting
      </h2>

      <p className="text-center text-muted-foreground mb-8">
        Master these four principles to create prompts that actually work
      </p>

      <div className="space-y-4 mb-8">
        {rules.map((rule, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${rule.color}15` }}
              >
                <rule.icon className="h-6 w-6" style={{ color: rule.color }} />
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold text-muted-foreground">
                  Rule {index + 1}
                </span>
                <h3 className="font-semibold text-lg mt-1">{rule.title}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onNext} className="bg-[#4A90E2] hover:bg-[#4A90E2]/90">
          Ready to Practise
        </Button>
      </div>
    </div>
  );
}
