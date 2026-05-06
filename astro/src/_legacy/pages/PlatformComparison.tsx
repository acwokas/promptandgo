import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Star, Check, X as XIcon, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PLATFORMS = ["ChatGPT", "Claude", "Gemini", "Copilot", "Perplexity", "DeepSeek", "Qwen", "Meta AI", "Ernie Bot", "Grok"] as const;

type Platform = typeof PLATFORMS[number];

const LANGUAGES = ["Japanese", "Mandarin", "Korean", "Hindi", "Thai", "Vietnamese", "Indonesian", "Malay"] as const;

type LangSupport = Record<Platform, boolean>;

const langData: Record<string, LangSupport> = {
  Japanese:   { ChatGPT: true, Claude: true, Gemini: true, Copilot: true, Perplexity: true, DeepSeek: true, Qwen: true, "Meta AI": true, "Ernie Bot": false, Grok: true },
  Mandarin:   { ChatGPT: true, Claude: true, Gemini: true, Copilot: true, Perplexity: true, DeepSeek: true, Qwen: true, "Meta AI": true, "Ernie Bot": true, Grok: true },
  Korean:     { ChatGPT: true, Claude: true, Gemini: true, Copilot: true, Perplexity: true, DeepSeek: true, Qwen: true, "Meta AI": true, "Ernie Bot": false, Grok: true },
  Hindi:      { ChatGPT: true, Claude: true, Gemini: true, Copilot: true, Perplexity: true, DeepSeek: false, Qwen: false, "Meta AI": true, "Ernie Bot": false, Grok: false },
  Thai:       { ChatGPT: true, Claude: true, Gemini: true, Copilot: false, Perplexity: true, DeepSeek: false, Qwen: false, "Meta AI": true, "Ernie Bot": false, Grok: false },
  Vietnamese: { ChatGPT: true, Claude: true, Gemini: true, Copilot: true, Perplexity: true, DeepSeek: true, Qwen: true, "Meta AI": true, "Ernie Bot": false, Grok: false },
  Indonesian: { ChatGPT: true, Claude: true, Gemini: true, Copilot: true, Perplexity: true, DeepSeek: true, Qwen: true, "Meta AI": true, "Ernie Bot": false, Grok: false },
  Malay:      { ChatGPT: true, Claude: true, Gemini: true, Copilot: false, Perplexity: true, DeepSeek: false, Qwen: false, "Meta AI": true, "Ernie Bot": false, Grok: false },
};

const contextWindows: Record<Platform, string> = {
  ChatGPT: "128K", Claude: "200K", Gemini: "1M", Copilot: "128K", Perplexity: "128K",
  DeepSeek: "128K", Qwen: "128K", "Meta AI": "128K", "Ernie Bot": "32K", Grok: "128K",
};

const pricing: Record<Platform, string> = {
  ChatGPT: "Free / $20", Claude: "Free / $20", Gemini: "Free / $20", Copilot: "Free / $20", Perplexity: "Free / $20",
  DeepSeek: "Free / $10", Qwen: "Free", "Meta AI": "Free", "Ernie Bot": "Free / ¥59", Grok: "Free / $8",
};

const apiAvail: Record<Platform, string> = {
  ChatGPT: "Yes", Claude: "Yes", Gemini: "Yes", Copilot: "Limited", Perplexity: "Yes",
  DeepSeek: "Yes", Qwen: "Yes", "Meta AI": "No", "Ernie Bot": "Yes", Grok: "Yes",
};

const templateCount: Record<Platform, number> = {
  ChatGPT: 450, Claude: 380, Gemini: 320, Copilot: 200, Perplexity: 150,
  DeepSeek: 180, Qwen: 250, "Meta AI": 120, "Ernie Bot": 100, Grok: 90,
};

const qualityRating: Record<Platform, number> = {
  ChatGPT: 5, Claude: 5, Gemini: 4, Copilot: 4, Perplexity: 4,
  DeepSeek: 4, Qwen: 4, "Meta AI": 3, "Ernie Bot": 3, Grok: 3,
};

const specialFeatures: Record<Platform, string> = {
  ChatGPT: "GPTs, Vision, DALL-E",
  Claude: "200K context, Artifacts",
  Gemini: "1M context, Multimodal",
  Copilot: "Office integration",
  Perplexity: "Real-time search",
  DeepSeek: "Open source, Code",
  Qwen: "Chinese-first, Alibaba",
  "Meta AI": "Social integration",
  "Ernie Bot": "Baidu ecosystem",
  Grok: "X/Twitter integration",
};

const bestValues: Record<string, Platform> = {
  "Context Window": "Gemini",
  "Templates Available": "ChatGPT",
  "Response Quality": "ChatGPT",
};

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-3.5 w-3.5 ${i < count ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
    ))}
  </div>
);

const recommendations = [
  { title: "Best for Japanese Business", platform: "Claude", reason: "200K context window handles long keigo-aware business documents. Excellent nuance with formal Japanese registers.", color: "border-blue-500" },
  { title: "Best for Mandarin Content", platform: "Qwen", reason: "Chinese-first training data, native understanding of simplified/traditional characters, integrated with Alibaba ecosystem.", color: "border-green-500" },
  { title: "Best for Multi-language", platform: "ChatGPT", reason: "Broadest Asian language support with consistent quality across Japanese, Korean, Hindi, Thai, Vietnamese and more.", color: "border-primary" },
];

const PlatformComparison = () => {
  const [visiblePlatforms, setVisiblePlatforms] = useState<Set<Platform>>(new Set(PLATFORMS));

  const togglePlatform = (p: Platform) => {
    setVisiblePlatforms(prev => {
      const next = new Set(prev);
      if (next.has(p)) { if (next.size > 1) next.delete(p); } else next.add(p);
      return next;
    });
  };

  const shown = useMemo(() => PLATFORMS.filter(p => visiblePlatforms.has(p)), [visiblePlatforms]);

  return (
    <>
      <Helmet>
        <title>Compare AI Platforms for Asian Languages | PromptAndGo</title>
        <meta name="description" content="Side-by-side comparison of ChatGPT, Claude, Gemini, Qwen and more for Asian language support, pricing, and features." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-b from-card to-background border-b border-border/50 py-14 md:py-20">
          <div className="container max-w-5xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Compare AI Platforms for Asian Languages</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">Find the best AI platform for your language, use case, and budget</p>
            <p className="text-xs text-muted-foreground">Last updated: April 2026</p>
          </div>
        </section>

        <div className="container max-w-7xl mx-auto px-4 py-10">
          {/* Platform toggles */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-muted-foreground self-center mr-2">Show:</span>
            {PLATFORMS.map(p => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  visiblePlatforms.has(p)
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
                aria-pressed={visiblePlatforms.has(p)}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-card">
                  <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left text-xs font-semibold text-muted-foreground border-r border-border min-w-[160px]">Feature</th>
                  {shown.map(p => (
                    <th key={p} className="px-4 py-3 text-center text-xs font-semibold text-foreground min-w-[110px]">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {/* Language rows */}
                {LANGUAGES.map(lang => (
                  <tr key={lang} className="hover:bg-muted/30 transition-colors">
                    <td className="sticky left-0 z-10 bg-background px-4 py-2.5 text-foreground font-medium border-r border-border">{lang}</td>
                    {shown.map(p => (
                      <td key={p} className="px-4 py-2.5 text-center">
                        {langData[lang][p]
                          ? <Check className="h-4 w-4 text-green-500 mx-auto" />
                          : <XIcon className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                        }
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Context Window */}
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="sticky left-0 z-10 bg-background px-4 py-2.5 text-foreground font-medium border-r border-border">Context Window</td>
                  {shown.map(p => (
                    <td key={p} className={`px-4 py-2.5 text-center text-foreground ${bestValues["Context Window"] === p ? "bg-primary/10 font-semibold" : ""}`}>
                      {contextWindows[p]}
                    </td>
                  ))}
                </tr>
                {/* Pricing */}
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="sticky left-0 z-10 bg-background px-4 py-2.5 text-foreground font-medium border-r border-border">Pricing Tier</td>
                  {shown.map(p => (
                    <td key={p} className="px-4 py-2.5 text-center text-muted-foreground text-xs">{pricing[p]}</td>
                  ))}
                </tr>
                {/* API */}
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="sticky left-0 z-10 bg-background px-4 py-2.5 text-foreground font-medium border-r border-border">API Available</td>
                  {shown.map(p => (
                    <td key={p} className="px-4 py-2.5 text-center text-muted-foreground">{apiAvail[p]}</td>
                  ))}
                </tr>
                {/* Templates */}
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="sticky left-0 z-10 bg-background px-4 py-2.5 text-foreground font-medium border-r border-border">Templates Available</td>
                  {shown.map(p => (
                    <td key={p} className={`px-4 py-2.5 text-center text-foreground ${bestValues["Templates Available"] === p ? "bg-primary/10 font-semibold" : ""}`}>
                      {templateCount[p]}
                    </td>
                  ))}
                </tr>
                {/* Quality */}
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="sticky left-0 z-10 bg-background px-4 py-2.5 text-foreground font-medium border-r border-border">Response Quality</td>
                  {shown.map(p => (
                    <td key={p} className={`px-4 py-2.5 ${bestValues["Response Quality"] === p ? "bg-primary/10" : ""}`}>
                      <div className="flex justify-center"><Stars count={qualityRating[p]} /></div>
                    </td>
                  ))}
                </tr>
                {/* Special Features */}
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="sticky left-0 z-10 bg-background px-4 py-2.5 text-foreground font-medium border-r border-border">Special Features</td>
                  {shown.map(p => (
                    <td key={p} className="px-4 py-2.5 text-center text-xs text-muted-foreground">{specialFeatures[p]}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Recommendations */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Our Recommendations</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {recommendations.map((rec, i) => (
                <div key={i} className={`p-6 rounded-xl border-2 ${rec.color} bg-card`}>
                  <Badge className="mb-3">{rec.title}</Badge>
                  <h3 className="text-xl font-bold text-foreground mb-2">{rec.platform}</h3>
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link to="/library" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Browse Optimized Prompts
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlatformComparison;
