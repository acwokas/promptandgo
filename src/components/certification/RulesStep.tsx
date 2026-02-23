import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, FileText, Volume2, Users, CheckCircle2, XCircle } from "lucide-react";

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
      description: "Vague prompts lead to vague results. Be precise about what you want the AI to do, include specific details, and define the outcome you're looking for.",
      goodExample: "Write a 300-word blog intro about remote work benefits, focusing on work-life balance and productivity. Target audience: mid-career professionals considering remote positions.",
      badExample: "Write something about remote work.",
    },
    {
      icon: FileText,
      title: "Always include tone, format, and audience",
      color: "#F5A623",
      description: "Context is everything. Specify the tone (professional, casual, persuasive), the format (blog post, email, social media), and who you're writing for.",
      goodExample: "Create a friendly, conversational Instagram caption (150 characters max) for a coffee shop targeting millennials, promoting a new seasonal latte.",
      badExample: "Write a post about our new latte.",
    },
    {
      icon: Volume2,
      title: "Avoid filler words - your AI will thank you",
      color: "#6DD5FA",
      description: "Every word should add value. Skip phrases like 'please', 'I want you to', 'can you', and get straight to the instruction. Concise prompts = better results.",
      goodExample: "Generate 5 subject lines for a product launch email. Make them urgent and benefit-focused. Under 50 characters each.",
      badExample: "Can you please help me come up with some good subject lines for an email I'm sending about a product launch? I'd really like them to be catchy.",
    },
    {
      icon: Users,
      title: "Treat your AI like a creative partner, not a robot",
      color: "#43B581",
      description: "The best results come from collaboration. Give your AI a role or persona, provide examples of what you like, and iterate on outputs rather than expecting perfection on the first try.",
      goodExample: "Act as a seasoned copywriter with 10 years in tech marketing. Review this product description and suggest 3 improvements to increase conversion. Use persuasive but honest language.",
      badExample: "Make this better.",
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

      <div className="space-y-6 mb-8">
        {rules.map((rule, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-all"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-4 mb-4">
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
                <p className="text-muted-foreground text-sm mt-2">{rule.description}</p>
              </div>
            </div>

            <div className="space-y-3 mt-4 ml-16">
              <div className="border-l-2 border-green-500 pl-4 py-2 bg-green-50/50 dark:bg-green-950/20 rounded-r">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">Good Example:</p>
                    <p className="text-sm text-foreground/90">{rule.goodExample}</p>
                  </div>
                </div>
              </div>

              <div className="border-l-2 border-red-500 pl-4 py-2 bg-red-50/50 dark:bg-red-950/20 rounded-r">
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">Bad Example:</p>
                    <p className="text-sm text-foreground/90">{rule.badExample}</p>
                  </div>
                </div>
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
