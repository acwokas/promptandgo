import { useState, useMemo } from "react";
import { Search, Tag, Calendar, Sparkles } from "lucide-react";

interface ChangelogEntry {
  version: string;
  date: string;
  dateAsian: string;
  title: string;
  description: string;
  category: "Feature" | "Improvement" | "Fix" | "Language";
}

const ENTRIES: ChangelogEntry[] = [
  { version: "v2.5", date: "Apr 2026", dateAsian: "2026年4月", title: "Burmese & Khmer Script Rendering Engine", description: "Full support for complex Burmese (Myanmar) and Khmer script rendering in prompt previews, with proper stacking and reordering of diacritical marks.", category: "Feature" },
  { version: "v2.4", date: "Mar 2026", dateAsian: "2026年3月", title: "Hindi Devanagari Script Optimization", description: "Optimized Devanagari conjunct rendering and added specialized prompt templates for Hindi formal and informal registers.", category: "Language" },
  { version: "v2.3", date: "Feb 2026", dateAsian: "2026年2月", title: "Tagalog Polite Form Templates", description: "New template library for Filipino/Tagalog polite forms (po/opo), covering business correspondence and customer service scenarios.", category: "Feature" },
  { version: "v2.2", date: "Jan 2026", dateAsian: "2026年1月", title: "Performance & Accessibility Overhaul", description: "Route-level code splitting with React.lazy, WCAG 2.1 AA compliance across all pages, and 40% reduction in initial bundle size.", category: "Improvement" },
  { version: "v2.1", date: "Dec 2025", dateAsian: "2025年12月", title: "Bahasa Indonesia Formal/Informal Toggle", description: "One-click toggle between formal Bahasa Indonesia and casual bahasa gaul in all prompt templates, with context-aware suggestions.", category: "Feature" },
  { version: "v2.0", date: "Nov 2025", dateAsian: "2025年11月", title: "Vietnamese Diacritical Auto-Correct", description: "Intelligent auto-correction for Vietnamese tone marks and diacriticals, reducing prompt errors by 67% for Vietnamese language users.", category: "Fix" },
  { version: "v1.9", date: "Oct 2025", dateAsian: "2025年10月", title: "Thai Tone-Mark-Aware Prompts", description: "Prompts now understand Thai tonal markers and adjust output to preserve tonal accuracy in translations and creative writing.", category: "Language" },
  { version: "v1.8", date: "Sep 2025", dateAsian: "2025年9月", title: "Multi-Platform Prompt Optimizer", description: "Optimize prompts simultaneously for ChatGPT, Claude, Gemini, Qwen, and Ernie Bot with platform-specific formatting.", category: "Feature" },
  { version: "v1.7", date: "Aug 2025", dateAsian: "2025年8月", title: "New Korean Honorific Templates", description: "Expanded Korean honorific system support with 존댓말 (jondaenmal) and 반말 (banmal) templates for all professional contexts.", category: "Language" },
  { version: "v1.6", date: "Jul 2025", dateAsian: "2025年7月", title: "Prompt History & Version Control", description: "Full prompt history with diff view, version rollback, and branching for iterative prompt refinement workflows.", category: "Feature" },
  { version: "v1.5", date: "Jun 2025", dateAsian: "2025年6月", title: "Added GPT-5 Keigo Support", description: "Full integration with GPT-5's enhanced Japanese keigo (敬語) capabilities, including sonkeigo, kenjōgo, and teineigo detection.", category: "Language" },
  { version: "v1.4", date: "May 2025", dateAsian: "2025年5月", title: "Classical Chinese Poetry Mode", description: "New prompt mode for generating and analyzing classical Chinese poetry (古诗) with proper tonal patterns and literary devices.", category: "Feature" },
  { version: "v1.3", date: "Mar 2025", dateAsian: "2025年3月", title: "Fixed CJK Character Count Bug", description: "Resolved an issue where CJK characters were being double-counted in token estimates, causing inaccurate prompt length warnings.", category: "Fix" },
  { version: "v1.2", date: "Feb 2025", dateAsian: "2025年2月", title: "XP Rewards & Certification Program", description: "Earn XP for prompt creation, language exploration, and community contributions. Complete the certification to become a verified prompt engineer.", category: "Feature" },
  { version: "v1.0", date: "Jan 2025", dateAsian: "2025年1月", title: "PromptAndGo Official Launch 🚀", description: "The first AI prompt library built specifically for Asian languages. Launched with support for 6 languages, 500+ curated prompts, and Power Packs.", category: "Feature" },
];

const CATEGORIES = ["All", "Feature", "Improvement", "Fix", "Language"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Feature: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Improvement: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Fix: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Language: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const DOT_COLORS: Record<string, string> = {
  Feature: "bg-blue-400",
  Improvement: "bg-emerald-400",
  Fix: "bg-orange-400",
  Language: "bg-purple-400",
};

const Changelog = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filtered = useMemo(() => {
    return ENTRIES.filter((e) => {
      const matchCat = activeCategory === "All" || e.category === activeCategory;
      const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribeEmail.includes("@")) {
      setSubscribed(true);
      setSubscribeEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Product Updates</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What's New at PromptAndGo
          </h1>
          <p className="text-lg text-primary/80 font-medium mb-2">
            最新アップデート | 최신 업데이트 | 最新更新
          </p>
          <p className="text-muted-foreground">
            Track every feature, fix, and language improvement we ship.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-3xl mx-auto px-4 mb-12">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search updates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border hidden md:block" />
          <div className="space-y-8">
            {filtered.map((entry, i) => (
              <div key={i} className="relative flex gap-6 group">
                <div className="hidden md:flex flex-col items-center pt-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-background ${DOT_COLORS[entry.category]} ring-2 ring-background z-10`} />
                </div>
                <div className="flex-1 bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {entry.version}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[entry.category]}`}>
                      {entry.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                      <Calendar className="h-3 w-3" />
                      {entry.date} · {entry.dateAsian}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{entry.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No updates match your search.</p>
          )}
        </div>
      </div>

      {/* Subscribe */}
      <section className="border-t border-border py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <Tag className="h-8 w-8 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Subscribe to Updates</h2>
          <p className="text-sm text-muted-foreground mb-6">Get notified when we ship new features and language support.</p>
          {subscribed ? (
            <p className="text-sm text-primary font-medium">✓ You're subscribed! ありがとうございます</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                className="flex-1 h-10 px-4 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <button type="submit" className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Changelog;
