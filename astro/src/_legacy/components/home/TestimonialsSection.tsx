import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, BookOpen, Bot, Globe, Heart } from "lucide-react";

const testimonials = [
  {
    name: "Yuki Tanaka",
    title: "Product Manager",
    company: "TechCorp",
    location: "Tokyo",
    country: "🇯🇵",
    quote: "Platform-specific optimization has been a game-changer. What used to take me 30 minutes of tweaking prompts for Claude vs ChatGPT now takes seconds. The Japanese keigo handling is flawless.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    title: "Content Lead",
    company: "DigiMedia",
    location: "Mumbai",
    country: "🇮🇳",
    quote: "The quality of Hindi and multilingual prompt outputs is unlike anything else I've used. It doesn't just translate — it captures the tone and cultural context that makes content resonate with Indian audiences.",
    rating: 5,
  },
  {
    name: "Wei Chen",
    title: "Head of AI Operations",
    company: "AsiaVentures",
    location: "Singapore",
    country: "🇸🇬",
    quote: "Our team's productivity jumped 40% after adopting PromptAndGo. Having one tool that optimizes for Qwen, DeepSeek, and ChatGPT simultaneously means our APAC teams all get consistent, high-quality outputs.",
    rating: 5,
  },
];

const stats = [
  { num: "10,000+", label: "Prompts optimized", icon: Bot },
  { num: "50+", label: "Languages supported", icon: Globe },
  { num: "12", label: "AI platforms", icon: BookOpen },
  { num: "98%", label: "Satisfaction rate", icon: Heart },
];

export function TestimonialsSection() {
  return (
    <section className="container max-w-6xl mx-auto px-4 py-24 md:py-32 scroll-reveal">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Star className="h-4 w-4" />
          Trusted by Teams Across Asia
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          See how professionals are transforming their AI workflow
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          500+ companies across 12 Asian markets trust PromptAndGo
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-16">
        {testimonials.map((t) => (
          <Card key={t.name} className="bg-card border-border/50 hover:border-primary/30 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              <p className="text-sm text-foreground leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-lg">
                  {t.country}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.title}, {t.company} · {t.location}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl border border-border/50 bg-muted/30">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-black text-foreground mb-1">{s.num}</div>
            <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6 italic">
        * Example testimonials representing typical APAC user profiles
      </p>
    </section>
  );
}
