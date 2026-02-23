import { Card, CardContent } from "@/components/ui/card";
import { Globe, TrendingUp, Target } from "lucide-react";

const proofPoints = [
  {
    icon: Globe,
    stat: "1.9M+",
    label: "professionals across Asia-Pacific actively seeking better AI prompts",
    source: "Market research across Singapore, Indonesia, Vietnam, Malaysia & Australia"
  },
  {
    icon: TrendingUp,
    stat: "28.6%",
    label: "of the creative content market is wide open — no major AI brand serves it yet",
    source: "Brand whitespace analysis, Singapore 2026"
  },
  {
    icon: Target,
    stat: "62.7%",
    label: "of business professionals want to automate document management with AI",
    source: "Singapore sector analysis, Q1 2026"
  }
];

export function TestimonialsSection() {
  return (
    <section className="container pt-6 pb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Market Opportunity</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Why PromptandGo is positioned to lead AI prompt optimization in Asia-Pacific</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {proofPoints.map((point, index) => (
          <Card key={index} className="bg-gradient-to-br from-primary/5 to-transparent flex flex-col">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <point.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-4xl font-bold text-primary mb-2">{point.stat}</p>
                  <p className="text-sm font-medium text-foreground leading-snug">{point.label}</p>
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-xs text-muted-foreground italic border-t border-border/30 pt-4">{point.source}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
