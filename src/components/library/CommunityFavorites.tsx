import { useState } from "react";
import { Star, Copy, Sparkles, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const COMMUNITY_FAVORITES = [
  {
    id: "fav-1",
    title: "Shopee Product Listing Optimizer",
    prompt: "Write a Shopee product listing for [product]. Include: SEO-optimized title (max 120 chars), 5 bullet-point highlights, detailed description mentioning materials, dimensions, and use cases, and 5 relevant search tags. Target market: [country].",
    category: "E-commerce",
    categoryIcon: "🛒",
    platforms: ["ChatGPT", "Qwen", "Gemini"],
    difficulty: "Beginner",
    usageCount: "3.2K",
    testimonial: {
      quote: "This prompt doubled my Shopee listing conversions in Singapore. The SEO keywords it suggests are spot-on for the local market.",
      author: "Wei Lin",
      role: "E-commerce Manager",
      location: "Singapore",
    },
  },
  {
    id: "fav-2",
    title: "敬語ビジネスメール作成",
    prompt: "あなたは日本のビジネスマナーの専門家です。[シーン]のビジネスメールを作成してください。適切な敬語を使用し、季節の挨拶を含め、結びの挨拶を含めてください。",
    category: "Business",
    categoryIcon: "💼",
    platforms: ["ChatGPT", "Claude"],
    difficulty: "Intermediate",
    usageCount: "2.8K",
    testimonial: {
      quote: "Finally, AI-generated emails with proper keigo. My Japanese clients noticed the improvement immediately.",
      author: "Takeshi Yamamoto",
      role: "Account Director",
      location: "Tokyo",
    },
  },
  {
    id: "fav-3",
    title: "WeChat Marketing Campaign Planner",
    prompt: "Create a WeChat marketing campaign for [brand] targeting [demographic] in China. Include: Official Account post series, Mini Program integration ideas, KOL collaboration brief, and Red Packet engagement strategy.",
    category: "Marketing",
    categoryIcon: "📣",
    platforms: ["Qwen", "Ernie Bot", "ChatGPT"],
    difficulty: "Advanced",
    usageCount: "1.9K",
    testimonial: {
      quote: "The WeChat-specific strategies this generates are better than what most agencies offer. Saved us months of research.",
      author: "Michelle Chen",
      role: "Digital Marketing Lead",
      location: "Shanghai",
    },
  },
  {
    id: "fav-4",
    title: "Customer Complaint Response (APAC)",
    prompt: "Write a customer service response to a complaint about [issue]. Use empathetic tone appropriate for Asian CS standards. Include: acknowledgement, ownership, resolution with timeline, and goodwill gesture.",
    category: "Customer Service",
    categoryIcon: "🎧",
    platforms: ["ChatGPT", "Claude", "Gemini"],
    difficulty: "Beginner",
    usageCount: "4.1K",
    testimonial: {
      quote: "Our CSAT scores jumped 23% after we started using these templates across our Southeast Asian support centers.",
      author: "Priya Sharma",
      role: "CS Operations Manager",
      location: "Mumbai",
    },
  },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "bg-emerald-500",
  Intermediate: "bg-amber-500",
  Advanced: "bg-rose-500",
};

export const CommunityFavorites = () => {
  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({ title: "Copied!", description: "Prompt copied to clipboard" });
  };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
          <h2 className="text-xl font-bold">Community Favorites</h2>
        </div>
        <Badge variant="secondary" className="text-[10px]">Staff Picks</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Handpicked by our team — the prompts that APAC professionals love most.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {COMMUNITY_FAVORITES.map((fav) => (
          <Card key={fav.id} className="group border-border hover:border-primary/30 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-5 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{fav.categoryIcon}</span>
                  <Badge variant="outline" className="text-[10px]">{fav.category}</Badge>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${DIFFICULTY_COLORS[fav.difficulty]}`} />
                    <span className="text-[10px] text-muted-foreground">{fav.difficulty}</span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">Used {fav.usageCount} times</span>
              </div>

              {/* Title & Prompt */}
              <h3 className="font-semibold text-sm leading-tight">{fav.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{fav.prompt}</p>

              {/* Platforms */}
              <div className="flex items-center gap-1.5">
                {fav.platforms.map((p) => (
                  <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">{p}</span>
                ))}
              </div>

              {/* Testimonial */}
              <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
                <div className="flex gap-1.5">
                  <Quote className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground italic leading-relaxed">"{fav.testimonial.quote}"</p>
                </div>
                <p className="text-[10px] text-muted-foreground/70 pl-4.5">
                  — <span className="font-medium text-foreground">{fav.testimonial.author}</span>, {fav.testimonial.role}, {fav.testimonial.location}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => copyPrompt(fav.prompt)}>
                  <Copy className="h-3 w-3" /> Copy
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" asChild>
                  <Link to={`/optimize?platform=chatgpt`}>
                    <Sparkles className="h-3 w-3" /> Optimize
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
