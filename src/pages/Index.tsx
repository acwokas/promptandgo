import { useState, useEffect, useRef } from "react";
import SEO from "@/components/SEO";
import { AIOptimizedStructuredData } from "@/components/seo/AIOptimizedStructuredData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight, Sparkles, Zap, Globe, Bot,
  Search, Copy, Check, ChevronRight, Star,
  BookOpen, Wand2, ShoppingBag, Award,
  MessageSquare, TrendingUp, Users, Flame,
  BarChart3, Zap as ZapIcon, Volume2, Activity
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useNewsletterStatus } from "@/hooks/useNewsletterStatus";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { FAQSection } from "@/components/home/FAQSection";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

const TYPED_PROMPTS = [
  "Write me a marketing email",
  "Analyze this sales data",
  "Create a social media strategy",
  "Help me pitch to investors",
  "Generate ad copy for my product",
];

const OPTIMIZED_RESULTS = [
  "Write a 150-word marketing email for [product] targeting [audience]. Use a professional but friendly tone. Include: 1) attention-grabbing subject line, 2) one clear benefit statement, 3) social proof element, 4) specific call-to-action with deadline. Avoid: hype words, jargon, multiple CTAs.",
  "Analyze this sales data and provide: 1) Top 3 performing products by revenue with % growth, 2) Seasonal patterns across Q1-Q4, 3) Anomalies or unexpected changes flagged with severity, 4) Three actionable recommendations. Format: executive summary table + bullet insights.",
  "Create a 30-day social media strategy for a [industry] startup in Southeast Asia. Include: platform selection (prioritize LinkedIn + Instagram), content pillars (3-4 themes), posting frequency, one viral hook per week, local cultural references for SG/MY/ID markets. Output: calendar view.",
  "Write a 3-minute investor pitch script for a [stage] startup. Structure: Hook (10 sec) → Problem (30 sec) → Solution demo (45 sec) → Market size with TAM/SAM/SOM (30 sec) → Traction metrics (20 sec) → Ask (15 sec). Tone: confident, data-driven, founder-authentic.",
  "Generate 5 ad copy variations for [product] targeting [demographic] on Meta Ads. Each variation: headline (max 40 chars), primary text (125 chars), description (30 chars). Include one urgency hook, one social proof hook, one benefit-led hook, one question hook, one FOMO hook.",
];

const MULTILINGUAL_EXAMPLES = [
  {
    lang: "Bahasa",
    flag: "🇮🇩",
    code: "id",
    example: "Tuliskan email pemasaran profesional untuk startup fintech"
  },
  {
    lang: "Vietnamese",
    flag: "🇻🇳",
    code: "vi",
    example: "Viết email quảng cáo cho sản phẩm công nghệ của tôi"
  },
  {
    lang: "Mandarin",
    flag: "🇨🇳",
    code: "zh",
    example: "为我的产品编写营销文案"
  },
  {
    lang: "Malay",
    flag: "🇲🇾",
    code: "ms",
    example: "Tulis strategi media sosial untuk permulaan kami"
  },
  {
    lang: "Thai",
    flag: "🇹🇭",
    code: "th",
    example: "เขียนข้อความการตลาดสำหรับผลิตภัณฑ์ของฉัน"
  },
];

const MARKET_DATA = [
  { country: "Indonesia", count: 537854, abbr: "ID", gradient: "from-orange-500 to-red-500" },
  { country: "Vietnam", count: 425343, abbr: "VN", gradient: "from-yellow-500 to-amber-500" },
  { country: "Australia", count: 104647, abbr: "AU", gradient: "from-blue-500 to-cyan-500" },
  { country: "Singapore", count: 50625, abbr: "SG", gradient: "from-red-500 to-pink-500" },
  { country: "Malaysia", count: 10969, abbr: "MY", gradient: "from-emerald-500 to-teal-500" },
];

const PERSONAS = [
  { label: "Business Professionals", pct: 49, color: "bg-primary" },
  { label: "Creative Entrepreneurs", pct: 32, color: "bg-accent" },
  { label: "Students", pct: 14, color: "bg-amber-500" },
  { label: "Public Sector", pct: 2.5, color: "bg-violet-500" },
  { label: "Retirees", pct: 2.2, color: "bg-emerald-500" },
];

const LIVE_ACTIVITIES = [
  { name: "Sarah", location: "Singapore", action: "optimized a marketing prompt", time: 2 },
  { name: "Nguyen", location: "Ho Chi Minh", action: "copied a ChatGPT prompt", time: 5 },
  { name: "Budi", location: "Jakarta", action: "shared a business template", time: 8 },
  { name: "Aisha", location: "Kuala Lumpur", action: "earned certification badge", time: 12 },
  { name: "James", location: "Sydney", action: "started a prompt pack", time: 15 },
];


// Animated counter component
const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const Index = () => {
  const { user } = useSupabaseAuth();
  const { isNewsletterSubscribed } = useNewsletterStatus();
  const [typedText, setTypedText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showOptimized, setShowOptimized] = useState(false);
  const [copiedHero, setCopiedHero] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(0);
  const [liveActivityIndex, setLiveActivityIndex] = useState(0);
  const charIndex = useRef(0);

  // Typing animation
  useEffect(() => {
    if (!isTyping) return;
    const currentPrompt = TYPED_PROMPTS[promptIndex];
    if (charIndex.current < currentPrompt.length) {
      const timeout = setTimeout(() => {
        setTypedText(currentPrompt.slice(0, charIndex.current + 1));
        charIndex.current++;
      }, 40 + Math.random() * 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setShowOptimized(true);
        setIsTyping(false);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [typedText, isTyping, promptIndex]);

  // Cycle to next prompt
  useEffect(() => {
    if (!showOptimized) return;
    const timeout = setTimeout(() => {
      setShowOptimized(false);
      setIsTyping(true);
      charIndex.current = 0;
      setTypedText("");
      setPromptIndex((i) => (i + 1) % TYPED_PROMPTS.length);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [showOptimized]);

  // Cycle through languages
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLanguage((prev) => (prev + 1) % MULTILINGUAL_EXAMPLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Cycle through live activities
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivityIndex((prev) => (prev + 1) % LIVE_ACTIVITIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const homeStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "PromptAndGo",
      url: "https://promptandgo.ai",
      description: "AI prompt library and optimizer for Asia-Pacific professionals. 3,000+ prompts for ChatGPT, Claude, Gemini, MidJourney and more.",
      sameAs: ["https://twitter.com/PromptandGo"]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PromptAndGo",
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    }
  ];

  return (
    <>
      <SEO
        title="PromptAndGo - AI Prompts That Actually Work | Free for ChatGPT, Claude & More"
        description="3,000+ battle-tested AI prompts + a free optimizer that makes any prompt better. Built for professionals across Singapore, Indonesia, Vietnam, Malaysia and Australia."
        canonical="https://promptandgo.ai"
        image="https://promptandgo.ai/og-default.png"
        ogType="website"
        structuredData={homeStructuredData}
      />
      <AIOptimizedStructuredData pageType="HomePage" title="3,000+ Curated AI Prompts" description="Browse, copy, and run tested AI prompts." />

      <main>
        {/* ═══════════════════════ HERO - PREMIUM & IMPACTFUL ═══════════════════════ */}
        <section className="relative overflow-hidden bg-hero">
          {/* Ambient background effects */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/25 blur-[120px] animate-pulse" style={{ animationDuration: "6s" }} />
            <div className="absolute bottom-[-30%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent/20 blur-[100px] animate-pulse" style={{ animationDuration: "8s" }} />
            <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-primary/15 blur-[80px] animate-pulse" style={{ animationDuration: "7s" }} />
          </div>

          <div className="relative z-10 container max-w-6xl mx-auto px-4 pt-24 pb-20 md:pt-32 md:pb-28">
            {/* Premium Badge */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-primary/30 text-white/95 px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-primary/20">
                <Flame className="h-4 w-4 text-primary animate-bounce" style={{ animationDuration: "2s" }} />
                <span>Trusted by 1.9M+ APAC professionals</span>
              </div>
            </div>

            {/* Headline - Bold & Premium */}
            <h1 className="text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] max-w-5xl mx-auto animate-fade-in">
              Prompts that
              <span className="block text-gradient-brand"> absolutely dominate.</span>
            </h1>

            <p className="text-center text-lg md:text-2xl text-white/80 mt-8 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Transform vague ideas into laser-focused, production-ready prompts. 3,000+ battle-tested templates. Instant AI optimization. Zero setup.
            </p>

            {/* Animated Counter - Live Professional Count */}
            <div className="flex justify-center mt-12 mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="inline-flex flex-col items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-4">
                <span className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  <AnimatedCounter value={1947438} />
                </span>
                <span className="text-sm text-white/60 font-medium">APAC professionals optimizing prompts</span>
              </div>
            </div>

            {/* CTAs - Premium Styling */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button asChild size="lg" className="px-10 text-base bg-white text-gray-900 hover:bg-white/95 h-14 font-semibold shadow-xl shadow-white/20 group">
                <Link to="/optimize" className="flex items-center gap-2">
                  <ZapIcon className="h-5 w-5 group-hover:animate-spin" />
                  Optimize Your Prompt - Free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-10 text-base border-white/50 !text-white hover:bg-white/15 h-14 font-semibold backdrop-blur-sm bg-white/10">
                <Link to="/library" className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Explore 3,000+ Prompts
                </Link>
              </Button>
            </div>

            {/* Live Demo Card - Premium */}
            <div className="mt-20 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="relative bg-white/[0.08] backdrop-blur-xl border border-white/15 rounded-3xl p-1 shadow-2xl shadow-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
                <div className="bg-gray-950/90 rounded-2xl overflow-hidden">
                  {/* Terminal header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-gray-900/50">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-white/50 text-xs ml-3 font-mono font-semibold">promptandgo-scout</span>
                  </div>

                  {/* Input area */}
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/30 flex items-center justify-center mt-0.5">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white/50 text-xs mb-2 font-mono font-semibold uppercase tracking-widest">YOUR PROMPT</p>
                        <p className="text-white/95 text-sm font-mono leading-relaxed">
                          {typedText}
                          {isTyping && <span className="inline-block w-1 h-5 bg-primary ml-1 animate-pulse align-middle" />}
                        </p>
                      </div>
                    </div>

                    {/* Optimized result */}
                    {showOptimized && (
                      <div className="flex items-start gap-4 mt-6 pt-6 border-t border-white/10 animate-in fade-in duration-300">
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-500/30 flex items-center justify-center mt-0.5">
                          <Sparkles className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-emerald-400/90 text-xs mb-2 font-mono font-semibold uppercase tracking-widest">OPTIMIZED PROMPT</p>
                          <p className="text-white/85 text-sm font-mono leading-relaxed break-words">
                            {OPTIMIZED_RESULTS[promptIndex]}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-center text-white/40 text-xs mt-4 font-medium">Powered by Scout AI • Works with ChatGPT, Claude, Gemini, MidJourney, and 8+ more platforms</p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ PLATFORM STRIP ═══════════════════════ */}
        <section className="border-b border-border/50 bg-muted/20 backdrop-blur-sm">
          <div className="container max-w-5xl mx-auto px-4 py-8">
            <p className="text-center text-xs text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Optimized for every AI platform</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {[
                { name: "ChatGPT", color: "text-emerald-500" },
                { name: "Claude", color: "text-primary" },
                { name: "Gemini", color: "text-accent" },
                { name: "MidJourney", color: "text-violet-500" },
                { name: "Perplexity", color: "text-blue-500" },
                { name: "DeepSeek", color: "text-cyan-500" },
              ].map((p) => (
                <span key={p.name} className={`text-sm font-bold ${p.color} opacity-85 hover:opacity-100 transition-opacity`}>
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════ MULTILINGUAL SECTION - DIFFERENTIATOR ═══════════════════════ */}
        <section className="relative py-24 md:py-32 bg-gradient-to-b from-muted/30 via-background to-background">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Globe className="h-4 w-4" />
                Regional Powerhouse
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Prompt in Your Language
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                62.7% of APAC professionals search in non-English languages. Scout optimizes prompts in Bahasa, Vietnamese, Mandarin, Malay, Thai, and English with full cultural context.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4 mb-12">
              {MULTILINGUAL_EXAMPLES.map((item, idx) => (
                <button
                  key={item.code}
                  onClick={() => setActiveLanguage(idx)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 group ${
                    activeLanguage === idx
                      ? "border-primary bg-primary/10"
                      : "border-border/50 bg-card hover:border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="text-2xl mb-2">{item.flag}</div>
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">{item.lang}</p>
                  <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground/70 transition-colors">28.6% YoY growth</p>
                </button>
              ))}
            </div>

            <div className="relative bg-card border border-border/50 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50" />
              <div className="p-8 md:p-12">
                <div className="flex items-start gap-4 mb-6">
                  <Volume2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      {MULTILINGUAL_EXAMPLES[activeLanguage].lang}
                    </h3>
                    <p className="text-primary font-mono text-sm md:text-base leading-relaxed">
                      {MULTILINGUAL_EXAMPLES[activeLanguage].example}
                    </p>
                  </div>
                </div>
                <div className="pt-6 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    Scout automatically translates, optimizes, and adapts for cultural context
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ MARKET INTELLIGENCE - DYNAMIC & ANIMATED ═══════════════════════ */}
        <section className="relative py-24 md:py-32 bg-hero text-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-primary/40 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
                <BarChart3 className="h-4 w-4" />
                SQREEM Intelligence
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Market Intelligence
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Real-time insights into APAC prompt-seeking behavior. 1.9M+ professionals. 28.6% YoY growth.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {MARKET_DATA.map((item, idx) => (
                <div
                  key={item.country}
                  className="group relative bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20"
                >
                  <div className={`absolute -top-2 -right-2 w-16 h-16 rounded-full bg-gradient-to-br ${item.gradient} opacity-20 group-hover:opacity-40 transition-opacity`} />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-2xl font-black text-white mb-1">{item.abbr}</p>
                        <p className="text-sm text-white/70 font-semibold">{item.country}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-lg bg-gradient-to-br ${item.gradient} text-white text-xs font-bold`}>
                        +28.6%
                      </div>
                    </div>

                    <div className="mb-4 pt-4 border-t border-white/10">
                      <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                        <AnimatedCounter value={item.count} duration={2500} />
                      </div>
                      <p className="text-xs text-white/50 mt-2 font-medium">professionals seeking better prompts</p>
                    </div>

                    <div className="space-y-2">
                      {PERSONAS.slice(0, 3).map((persona) => (
                        <div key={persona.label} className="flex items-center gap-2">
                          <div className={`h-2 rounded-full ${persona.color} opacity-70`} style={{ width: `${(persona.pct / 50) * 100}%` }} />
                          <span className="text-xs text-white/60">{persona.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Persona Breakdown (All Markets)</h3>
              <div className="space-y-4">
                {PERSONAS.map((persona) => (
                  <div key={persona.label} className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-white/80 min-w-[160px]">{persona.label}</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${persona.color} transition-all duration-1000`}
                        style={{ width: `${persona.pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white min-w-[50px] text-right">{persona.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ LIVE ACTIVITY TICKER ═══════════════════════ */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Activity className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">LIVE RIGHT NOW</span>
            </div>

            <div className="relative bg-card border border-border/50 rounded-2xl p-8 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-accent to-transparent" />

              <div className="relative z-10 min-h-24 flex flex-col justify-center">
                <div key={LIVE_ACTIVITIES[liveActivityIndex].name} className="animate-in fade-in duration-500">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                      {LIVE_ACTIVITIES[liveActivityIndex].name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {LIVE_ACTIVITIES[liveActivityIndex].name}
                        <span className="text-muted-foreground font-normal"> from {LIVE_ACTIVITIES[liveActivityIndex].location}</span>
                      </p>
                      <p className="text-muted-foreground text-sm mt-1">
                        {LIVE_ACTIVITIES[liveActivityIndex].action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {LIVE_ACTIVITIES[liveActivityIndex].time}s ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ HOW IT WORKS - INTERACTIVE ═══════════════════════ */}
        <section className="container max-w-5xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Zap className="h-4 w-4" />
              Three Ways
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Perfect Prompts, Your Way
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you need ready-made templates, instant optimization, or custom creation - we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative pt-6">
            {/* Connecting lines */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

            {[
              {
                num: "1",
                icon: Search,
                title: "Browse the Library",
                desc: "3,000+ prompts across marketing, coding, creative, business, and more. Tested, tagged, and ready to copy.",
                link: "/library",
                cta: "Explore prompts",
                gradient: "from-primary to-red-500",
              },
              {
                num: "2",
                icon: Zap,
                title: "Optimize Any Prompt",
                desc: "Paste your rough prompt. Scout rewrites it with precision - tailored to ChatGPT, Claude, MidJourney, or any AI tool.",
                link: "/optimize",
                cta: "Try the optimizer",
                gradient: "from-accent to-cyan-500",
                featured: true,
              },
              {
                num: "3",
                icon: Wand2,
                title: "Generate from Scratch",
                desc: "Describe what you need in plain English. Scout builds a professional-grade prompt using guided templates.",
                link: "/ai/studio",
                cta: "Create a prompt",
                gradient: "from-amber-500 to-yellow-500",
              },
            ].map((item) => (
              <Link
                key={item.title}
                to={item.link}
                className={`group relative rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-visible ${
                  item.featured
                    ? "border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 ring-2 ring-primary/20"
                    : "border-border/50 bg-card hover:border-border"
                }`}
              >
                {/* Step number */}
                <div className={`absolute -top-5 left-6 z-10 w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center font-black text-lg shadow-lg`}>
                  {item.num}
                </div>

                {item.featured && (
                  <div className="absolute -top-3 right-6 z-10 bg-accent text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8 pt-10">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{item.desc}</p>
                  <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    {item.cta} <ArrowRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>


        {/* ═══════════════════════ SOCIAL PROOF - STATS ═══════════════════════ */}
        <section className="container max-w-5xl mx-auto px-4 py-24 md:py-32">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { num: "3,000+", label: "Curated prompts", icon: BookOpen },
              { num: "12+", label: "AI platforms supported", icon: Bot },
              { num: "1.9M", label: "APAC professionals", icon: Globe },
              { num: "28.6%", label: "YoY growth", icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <stat.icon className="h-7 w-7 text-primary mx-auto mb-4 group-hover:scale-125 transition-transform" />
                <div className="text-4xl md:text-5xl font-black text-foreground mb-2">{stat.num}</div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════ WHY PROMPTANDGO ═══════════════════════ */}
        <section className="bg-muted/30 py-24 md:py-32">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Why PromptAndGo Wins
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Built by APAC for APAC. Everything else is just generic.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Globe,
                  title: "Built for Asia-Pacific",
                  desc: "Cultural nuance matters. Our prompts and optimizer understand the business context of Singapore, Indonesia, Malaysia, Vietnam, and Australia.",
                },
                {
                  icon: Zap,
                  title: "Instant, not hours",
                  desc: "Stop spending 20 minutes crafting prompts. Paste, optimise, copy. Done in seconds.",
                },
                {
                  icon: Award,
                  title: "Prompt certification",
                  desc: "Level up with our 'Prompt Like a Pro' certification. Earn XP, unlock rewards, and prove your prompt engineering skills.",
                },
                {
                  icon: TrendingUp,
                  title: "Actually tested",
                  desc: "Every prompt in our library has been tested across multiple AI platforms. No theoretical nonsense - just results.",
                },
                {
                  icon: Bot,
                  title: "12+ AI platforms",
                  desc: "Scout rewrites prompts specifically for ChatGPT, Claude, Gemini, MidJourney, Perplexity, DeepSeek, and more.",
                },
                {
                  icon: Users,
                  title: "Community-driven",
                  desc: "Submit your own prompts, share favorites, and build on what works. The library grows with you.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group relative flex gap-4 p-6 rounded-xl border border-border/50 bg-card hover:border-primary/40 hover:bg-card hover:shadow-lg transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════ BEFORE/AFTER - VISUAL PUNCH ═══════════════════════ */}
        <section className="relative py-24 md:py-32 bg-hero text-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
          </div>

          <div className="relative z-10 container max-w-5xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                The Transformation is Instant
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Same intent. Dramatically different results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {/* Before */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/10 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-sm p-8 group-hover:border-red-500/40 transition-colors">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-sm font-bold text-red-400/80 uppercase tracking-wide">Before</span>
                  </div>
                  <p className="text-white/90 font-mono text-sm mb-4">
                    "Write me a marketing email"
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/40 leading-relaxed">Vague. No context. No structure. The AI will guess - and usually get it wrong.</p>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 blur-xl rounded-2xl" />
                <div className="relative rounded-2xl border border-emerald-400/40 bg-white/5 backdrop-blur-sm p-8 ring-2 ring-emerald-400/20">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-bold text-emerald-400 uppercase tracking-wide">After Scout</span>
                  </div>
                  <p className="text-white/95 font-mono text-sm mb-4 leading-relaxed">
                    "Write a 150-word marketing email for [product] targeting [audience]. Professional but friendly tone. Include: subject line, one benefit, social proof, specific CTA with deadline. Avoid: hype, jargon, multiple CTAs."
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-emerald-400/70 leading-relaxed">Specific. Structured. Optimized. The AI delivers exactly what you need.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/95 h-14 px-10 font-semibold shadow-xl shadow-white/20">
                <Link to="/optimize" className="flex items-center gap-2">
                  <ZapIcon className="h-5 w-5" />
                  Try It With Your Own Prompt
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ EXPLORE TOOLS ═══════════════════════ */}
        <section className="container max-w-5xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              The Complete Toolkit
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to dominate AI, all in one platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Search, title: "Prompt Library", desc: "3,000+ templates", link: "/library", color: "bg-primary" },
              { icon: ShoppingBag, title: "Power Packs", desc: "Themed collections", link: "/packs", color: "bg-accent" },
              { icon: Bot, title: "Scout AI", desc: "Your AI coach", link: "/scout", color: "bg-amber-500" },
              { icon: Award, title: "Certification", desc: "Prove your skills", link: "/certification", color: "bg-violet-500" },
            ].map((tool) => (
              <Link
                key={tool.title}
                to={tool.link}
                className="group relative p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <tool.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary mt-3 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════════════ APAC CTA ═══════════════════════ */}
        <section className="bg-muted/30 border-y border-border/50 py-20 md:py-28">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <Globe className="h-10 w-10 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Asia-Pacific's Prompt Advantage
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              1.9 million professionals across Singapore, Indonesia, Vietnam, Malaysia, and Australia are searching for better AI prompts. PromptAndGo is the only platform built specifically for APAC markets - with cultural context, local business use cases, and regional language understanding baked in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-10 font-semibold">
                <Link to="/market-insights" className="flex items-center gap-2">
                  Explore the Data <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-10 font-semibold">
                <Link to="/singapore-startups">
                  For Startups
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ NEWSLETTER & FAQ ═══════════════════════ */}
        <NewsletterSection user={user} isNewsletterSubscribed={isNewsletterSubscribed} />
        <FAQSection />

        {/* ═══════════════════════ FINAL CTA - URGENT & EXCITING ═══════════════════════ */}
        <section className="relative py-28 md:py-32 bg-hero text-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s" }} />
          </div>

          <div className="relative z-10 container max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-primary/40 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
              <Flame className="h-4 w-4 text-primary animate-bounce" />
              Get Started in Seconds
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
              Start Writing <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-accent">Phenomenal Prompts</span> Today
            </h2>

            <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto font-light">
              Zero friction. Zero cost. Just better AI results. Join 1.9M+ professionals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/95 h-16 px-12 text-lg font-bold shadow-2xl shadow-white/30">
                <Link to="/optimize" className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6" />
                  Optimize Your Prompt - Free
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/20 h-16 px-12 text-lg font-bold backdrop-blur-sm">
                <Link to="/library" className="flex items-center gap-3">
                  <Search className="h-6 w-6" />
                  Browse 3,000+ Prompts
                </Link>
              </Button>
            </div>

            <p className="text-white/50 text-xs mt-10 font-medium">
              No signup required • No credit card • No BS • Pure results
            </p>
          </div>
        </section>
      </main>
      <OnboardingModal />
    </>
  );
};

export default Index;
