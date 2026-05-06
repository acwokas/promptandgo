import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, ShoppingCart, Mail, HeadphonesIcon, MessageSquare, Code2, ShoppingBag, Feather, BarChart3, Users } from "lucide-react";
import { Link } from "react-router-dom";

const SHOWCASE_PACKS = [
  {
    id: "apac-business",
    name: "APAC Business Communications",
    icon: Mail,
    gradient: "from-blue-500 to-cyan-500",
    description: "Formal emails, meeting agendas, proposals, and business correspondence optimized for Japan, Korea, Singapore, and India markets.",
    promptCount: 50,
    languages: ["English", "Japanese", "Korean", "Hindi"],
    platforms: ["ChatGPT", "Claude", "Gemini"],
    fakePrice: "$19.99",
    prompts: [
      "Japanese keigo business email template",
      "Korean formal meeting agenda",
      "Singapore board meeting minutes",
      "India partnership proposal format",
      "Cross-cultural negotiation opener",
    ],
  },
  {
    id: "cs-excellence",
    name: "Customer Service Excellence",
    icon: HeadphonesIcon,
    gradient: "from-emerald-500 to-green-500",
    description: "Complaint handling, escalation templates, satisfaction surveys, and empathetic response scripts for Asian customer service teams.",
    promptCount: 30,
    languages: ["English", "Mandarin", "Thai", "Bahasa"],
    platforms: ["ChatGPT", "Claude", "Qwen"],
    fakePrice: "$14.99",
    prompts: [
      "Empathetic complaint response (APAC)",
      "Shopee/Lazada return handling script",
      "LINE customer greeting sequence",
      "WeChat support flow template",
      "CSAT survey in multiple languages",
    ],
  },
  {
    id: "social-media",
    name: "Social Media Marketing",
    icon: MessageSquare,
    gradient: "from-pink-500 to-rose-500",
    description: "Content calendars, platform-specific posts for WeChat, LINE, KakaoTalk, Instagram, TikTok, and Xiaohongshu across Asian markets.",
    promptCount: 40,
    languages: ["English", "Mandarin", "Japanese", "Korean", "Thai"],
    platforms: ["ChatGPT", "Qwen", "Gemini"],
    fakePrice: "$24.99",
    prompts: [
      "Xiaohongshu 种草 product review post",
      "LINE Official Account drip campaign",
      "KakaoTalk channel marketing message",
      "TikTok video script (Thai market)",
      "Instagram Reels for F&B brands",
    ],
  },
  {
    id: "tech-docs",
    name: "Technical Documentation",
    icon: Code2,
    gradient: "from-slate-500 to-zinc-500",
    description: "API docs, code review checklists, bug reports, architecture decision records, and technical writing for engineering teams.",
    promptCount: 25,
    languages: ["English"],
    platforms: ["ChatGPT", "Claude", "Copilot", "DeepSeek"],
    fakePrice: "$12.99",
    prompts: [
      "REST API documentation writer",
      "Code review checklist generator",
      "Bug report template (Jira format)",
      "Architecture Decision Record (ADR)",
      "SQL query optimization analysis",
    ],
  },
  {
    id: "ecommerce-asia",
    name: "E-commerce Operations",
    icon: ShoppingBag,
    gradient: "from-orange-500 to-amber-500",
    description: "Product listings, customer reviews, shipping notifications optimized for Shopee, Lazada, Tokopedia, Taobao, and Rakuten.",
    promptCount: 35,
    languages: ["English", "Mandarin", "Bahasa", "Thai", "Japanese"],
    platforms: ["ChatGPT", "Qwen", "Ernie Bot"],
    fakePrice: "$17.99",
    prompts: [
      "Shopee SEO product title optimizer",
      "Tokopedia flash sale campaign copy",
      "Lazada product description (Vietnamese)",
      "Taobao 爆款标题 optimizer",
      "Rakuten 商品ページ listing",
    ],
  },
  {
    id: "creative-content",
    name: "Creative Content",
    icon: Feather,
    gradient: "from-fuchsia-500 to-purple-500",
    description: "Blog posts, video scripts, podcast outlines, brand stories, and creative copywriting tailored for Asian audiences and cultural context.",
    promptCount: 30,
    languages: ["English", "Mandarin", "Japanese", "Korean"],
    platforms: ["ChatGPT", "Claude"],
    fakePrice: "$14.99",
    prompts: [
      "Brand origin story for Asian market",
      "YouTube video script (bilingual)",
      "Podcast episode outline",
      "Blog post with SEO structure",
      "Press release for APAC media",
    ],
  },
  {
    id: "data-analytics",
    name: "Data & Analytics",
    icon: BarChart3,
    gradient: "from-indigo-500 to-blue-500",
    description: "Dashboard summaries, KPI reports, data visualization descriptions, churn analysis, and executive briefs for data-driven teams.",
    promptCount: 20,
    languages: ["English", "Mandarin"],
    platforms: ["ChatGPT", "Claude", "Gemini"],
    fakePrice: "$12.99",
    prompts: [
      "Executive summary report generator",
      "Sales dashboard insights extractor",
      "Customer churn prediction brief",
      "KPI tracking report template",
      "Data visualization description writer",
    ],
  },
  {
    id: "hr-recruitment",
    name: "HR & Recruitment",
    icon: Users,
    gradient: "from-teal-500 to-emerald-500",
    description: "Job descriptions, interview questions, onboarding guides, and performance review templates for APAC companies hiring across cultures.",
    promptCount: 25,
    languages: ["English", "Japanese", "Korean", "Mandarin"],
    platforms: ["ChatGPT", "Claude"],
    fakePrice: "$12.99",
    prompts: [
      "Inclusive job description writer",
      "30-60-90 day onboarding plan",
      "Behavioral interview question set",
      "新卒採用 recruitment copy (JP)",
      "Performance review feedback template",
    ],
  },
];

const COMPARISON_TABLE = [
  { feature: "Access to free prompts", free: true, power: true, pro: true },
  { feature: "Copy & customize prompts", free: true, power: true, pro: true },
  { feature: "Premium prompt packs", free: false, power: true, pro: true },
  { feature: "Platform-specific optimization", free: false, power: true, pro: true },
  { feature: "Asian language prompts", free: "Limited", power: true, pro: true },
  { feature: "Priority new prompts", free: false, power: false, pro: true },
  { feature: "Custom prompt requests", free: false, power: false, pro: true },
  { feature: "API access", free: false, power: false, pro: true },
];

export const PowerPacksShowcase = () => {
  const [selectedPack, setSelectedPack] = useState<typeof SHOWCASE_PACKS[number] | null>(null);

  return (
    <>
      {/* Pack Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SHOWCASE_PACKS.map((pack) => (
          <Card
            key={pack.id}
            className="group border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => setSelectedPack(pack)}
          >
            <CardContent className="p-5 space-y-3">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pack.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <pack.icon className="h-6 w-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="font-bold text-sm leading-tight">{pack.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{pack.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">{pack.promptCount} prompts</Badge>
                <div className="flex gap-1">
                  {pack.languages.slice(0, 2).map((l) => (
                    <span key={l} className="text-[9px] px-1 py-0.5 rounded bg-muted text-muted-foreground">{l}</span>
                  ))}
                  {pack.languages.length > 2 && (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-muted text-muted-foreground">+{pack.languages.length - 2}</span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-lg font-black text-primary">FREE</span>
                <span className="text-xs text-muted-foreground line-through">{pack.fakePrice}</span>
              </div>

              {/* CTA */}
              <Button size="sm" className="w-full gap-1.5" onClick={(e) => { e.stopPropagation(); setSelectedPack(pack); }}>
                <ShoppingCart className="h-3.5 w-3.5" /> Get Pack
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black tracking-tight">Free vs Power Pack vs Pro</h2>
          <p className="text-sm text-muted-foreground mt-2">Choose the plan that fits your needs</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Feature</th>
                <th className="text-center py-3 px-4 font-semibold">Free</th>
                <th className="text-center py-3 px-4 font-semibold">
                  <span className="text-primary">Power Pack</span>
                </th>
                <th className="text-center py-3 px-4 font-semibold">Pro</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-3 px-4 text-muted-foreground">{row.feature}</td>
                  <td className="py-3 px-4 text-center">
                    {row.free === true ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> :
                     row.free === false ? <span className="text-muted-foreground/40">—</span> :
                     <span className="text-xs text-amber-500">{row.free}</span>}
                  </td>
                  <td className="py-3 px-4 text-center bg-primary/5">
                    {row.power === true ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> :
                     <span className="text-muted-foreground/40">—</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.pro === true ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> :
                     <span className="text-muted-foreground/40">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline" asChild><Link to="/auth?mode=signup">Start Free</Link></Button>
          <Button asChild><Link to="/packs">Get Power Packs</Link></Button>
        </div>
      </div>

      {/* Pack Detail Modal */}
      <Dialog open={!!selectedPack} onOpenChange={() => setSelectedPack(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedPack && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedPack.gradient} flex items-center justify-center`}>
                    <selectedPack.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle>{selectedPack.name}</DialogTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedPack.promptCount} prompts included</p>
                  </div>
                </div>
              </DialogHeader>

              <p className="text-sm text-muted-foreground">{selectedPack.description}</p>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedPack.languages.map((l) => (
                  <Badge key={l} variant="outline" className="text-[10px]">{l}</Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedPack.platforms.map((p) => (
                  <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                ))}
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-semibold">Included Prompts (Preview)</h4>
                {selectedPack.prompts.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border text-sm">
                    <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    {p}
                  </div>
                ))}
                <p className="text-xs text-muted-foreground text-center pt-1">
                  + {selectedPack.promptCount - selectedPack.prompts.length} more prompts included
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                <span className="text-2xl font-black text-primary">FREE</span>
                <span className="text-sm text-muted-foreground line-through">{selectedPack.fakePrice}</span>
                <Button className="ml-auto gap-2" asChild>
                  <Link to="/packs">
                    <ShoppingCart className="h-4 w-4" /> Get This Pack
                  </Link>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
