import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rachel Tan",
    title: "Marketing Director",
    company: "Ogilvy Singapore",
    country: "🇸🇬",
    quote: "Scout rewrote our campaign prompts for the Indonesian and Malaysian markets in under 30 seconds. The cultural nuance it adds — like Ramadan-aware messaging — is something no other tool does.",
    rating: 5,
  },
  {
    name: "Kenji Yamamoto",
    title: "Startup Founder",
    company: "NeoTech Labs",
    country: "🇯🇵",
    quote: "As a Japanese founder pitching to VCs, I need prompts that respect keigo formality. PromptAndGo understands the difference between casual and business Japanese — that's rare.",
    rating: 5,
  },
  {
    name: "Ploy Sricharoen",
    title: "Content Creator",
    company: "BangkokDigital",
    country: "🇹🇭",
    quote: "I create Thai and English content daily. The multi-language optimizer saves me hours — it doesn't just translate, it adapts tone and slang for each platform.",
    rating: 5,
  },
  {
    name: "Arjun Mehta",
    title: "Business Analyst",
    company: "Infosys",
    country: "🇮🇳",
    quote: "Our team uses PromptAndGo to standardize data analysis prompts across 3 AI platforms. The platform-specific optimization means we get consistent, high-quality outputs every time.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="container max-w-6xl mx-auto px-4 py-24 md:py-32">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Star className="h-4 w-4" />
          Trusted by APAC Professionals
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          What Professionals Say
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Used by marketing teams, founders, and creators across the Asia-Pacific region.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
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
                  <p className="text-xs text-muted-foreground">{t.title}, {t.company}</p>
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
      <p className="text-center text-xs text-muted-foreground mt-6 italic">
        * Example testimonials representing typical APAC user profiles
      </p>
    </section>
  );
}
