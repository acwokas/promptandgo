import { Card, CardContent } from "@/components/ui/card";
import { Bot, Sparkles, Rocket, Star } from "lucide-react";

const testimonials = [
  {
    icon: Bot,
    quote: "I went from spending 3 hours crafting prompts to just copying proven ones. Scout's optimization saved my entire workflow. ROI in the first week!",
    initials: "SJ",
    name: "Sarah Johnson",
    role: "Marketing Director @ TechCorp"
  },
  {
    icon: Sparkles,
    quote: "The platform adaptation is pure genius. Same concept, perfectly optimized for ChatGPT vs Claude vs MidJourney. I'm 10x more productive now.",
    initials: "MR",
    name: "Michael Rodriguez",
    role: "Senior Content Writer"
  },
  {
    icon: Rocket,
    quote: "Started with proven prompts, then Scout customized them for our needs. We've streamlined our entire content workflow and saved $5,000/month.",
    initials: "AL",
    name: "Alex Liu",
    role: "Founder @ GrowthCo"
  }
];

export function TestimonialsSection() {
  return (
    <section className="container pt-6 pb-12">
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <testimonial.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">"{testimonial.quote}"</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-14">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
