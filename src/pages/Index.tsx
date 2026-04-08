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
  Zap as ZapIcon, Volume2, Activity
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
    example: "Buatkan copywriting iklan Instagram untuk peluncuran produk skincare lokal yang ramah lingkungan"
  },
  {
    lang: "Vietnamese",
    flag: "🇻🇳",
    code: "vi",
    example: "Soạn email chuyên nghiệp gửi đối tác về đề xuất hợp tác kinh doanh xuất nhập khẩu"
  },
  {
    lang: "Mandarin",
    flag: "🇨🇳",
    code: "zh",
    example: "帮我写一条小红书种草文案，推荐一款适合亚洲肌肤的防晒霜"
  },
  {
    lang: "Malay",
    flag: "🇲🇾",
    code: "ms",
    example: "Sediakan agenda mesyuarat bulanan pasukan jualan termasuk KPI dan sasaran suku tahunan"
  },
  {
    lang: "Thai",
    flag: "🇹🇭",
    code: "th",
    example: "เขียนข้อความตอบลูกค้าที่ไม่พอใจสินค้า โดยใช้ภาษาสุภาพและเสนอทางแก้ไข"
  },
  {
    lang: "Japanese",
    flag: "🇯🇵",
    code: "ja",
    example: "取引先への敬語を使った納期延長のお詫びメールを作成してください"
  },
  {
    lang: "Korean",
    flag: "🇰🇷",
    code: "ko",
    example: "신제품 블루투스 이어폰에 대한 상세한 쿠팡 리뷰를 작성해주세요"
  },
  {
    lang: "Hindi",
    flag: "🇮🇳",
    code: "hi",
    example: "डिजिटल मार्केटिंग पर एक विस्तृत ब्लॉग की रूपरेखा तैयार करें जो छोटे व्यवसायों के लिए हो"
  },
  {
    lang: "Tamil",
    flag: "🇱🇰",
    code: "ta",
    example: "ஒரு மென்பொருள் நிறுவனத்திற்கான வேலை விளம்பரம் எழுதுங்கள்"
  },
  {
    lang: "Tagalog",
    flag: "🇵🇭",
    code: "tl",
    example: "Gumawa ng product description para sa online shop ng handmade na bag"
  },
  {
    lang: "Bengali",
    flag: "🇧🇩",
    code: "bn",
    example: "আমাদের ই-কমার্স সাইটের জন্য একটি গ্রাহক সেবা প্রতিক্রিয়া টেমপ্লেট তৈরি করুন"
  },
  {
    lang: "Khmer",
    flag: "🇰🇭",
    code: "km",
    example: "សរសេរការពិពណ៌នាផលិតផលសម្រាប់ហាងអនឡាញលក់សម្លៀកបំពាក់"
  },
];


const LIVE_ACTIVITIES = [
  { name: "Sarah", location: "Singapore", action: "optimized a marketing prompt", time: 2 },
  { name: "Nguyen", location: "Ho Chi Minh", action: "copied a ChatGPT prompt", time: 5 },
  { name: "Budi", location: "Jakarta", action: "shared a business template", time: 8 },
  { name: "Aisha", location: "Kuala Lumpur", action: "earned certification badge", time: 12 },
  { name: "James", location: "Sydney", action: "started a prompt pack", time: 15 },
];



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
        title="PromptAndGo.ai | AI Prompt Optimizer for 12+ Asian Languages | ChatGPT, Claude, Gemini & More"
        description="3,000+ battle-tested AI prompts + free Scout optimizer for ChatGPT, Claude, Gemini, Qwen & 12 platforms. Optimized for Japanese, Mandarin, Bahasa, Vietnamese & more."
        canonical="https://promptandgo.ai"
        image="https://promptandgo.ai/og-default.png"
        ogType="website"
        keywords="AI prompts, ChatGPT prompts, Claude prompts, Gemini prompts, Asian AI prompts, multilingual prompts, prompt optimizer, Qwen, DeepSeek, Japanese prompts, Mandarin prompts"
        structuredData={homeStructuredData}
      />
      <AIOptimizedStructuredData pageType="HomePage" title="3,000+ Curated AI Prompts" description="Browse, copy, and run tested AI prompts." />

      <main>
        {/* ═══════════════════════ HERO ═══════════════════════ */}
        <section className="relative overflow-hidden bg-hero">
          {/* Ambient background effects */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/25 blur-[120px] animate-pulse" style={{ animationDuration: "6s" }} />
            <div className="absolute bottom-[-30%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent/20 blur-[100px] animate-pulse" style={{ animationDuration: "8s" }} />
            <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-primary/15 blur-[80px] animate-pulse" style={{ animationDuration: "7s" }} />
          </div>

          <div className="relative z-10 container max-w-6xl mx-auto px-4 pt-24 pb-20 md:pt-32 md:pb-28">
            {/* Twin differentiator badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-amber-400/40 text-amber-300 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                <span className="text-base">🌏</span>
                Built for Asia
              </div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-primary/40 text-primary px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                <Zap className="h-4 w-4" />
                Any Platform · Any Language
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-5xl mx-auto animate-fade-in">
              The only AI prompt tool
              <span className="block text-gradient-brand"> built for Asia.</span>
            </h1>

            <p className="text-center text-lg md:text-xl text-white/80 mt-8 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Prompts that understand Japanese business formality, Southeast Asian market dynamics, Mandarin tone, and Indian enterprise context — then optimize them for <strong className="text-white font-semibold">any AI platform</strong> in <strong className="text-white font-semibold">any language</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" className="px-10 text-base bg-white text-gray-900 hover:bg-white/95 h-14 font-semibold shadow-xl shadow-white/20 group">
                <Link to="/optimize" className="flex items-center gap-2">
                  <ZapIcon className="h-5 w-5 group-hover:animate-spin" />
                  Optimize for Any Platform — Free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-10 text-base border-white/50 !text-white hover:bg-white/15 h-14 font-semibold backdrop-blur-sm bg-white/10">
                <Link to="/library" className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Explore Asian AI Prompts
                </Link>
              </Button>
            </div>

            {/* Platform logos strip inline */}
            <div className="flex flex-wrap justify-center gap-3 mt-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {[
                { name: "ChatGPT", color: "text-emerald-400", slug: "chatgpt" },
                { name: "Claude", color: "text-orange-300", slug: "claude" },
                { name: "Gemini", color: "text-blue-300", slug: "gemini" },
                { name: "Copilot", color: "text-cyan-300", slug: "copilot" },
                { name: "Perplexity", color: "text-violet-300", slug: "perplexity" },
                { name: "MidJourney", color: "text-pink-300", slug: "midjourney" },
                { name: "DeepSeek", color: "text-teal-300", slug: "deepseek" },
                { name: "Qwen", color: "text-indigo-300", slug: "qwen" },
                { name: "Meta AI", color: "text-sky-300", slug: "meta" },
                { name: "Ernie Bot", color: "text-red-300", slug: "ernie" },
                { name: "Grok", color: "text-slate-300", slug: "grok" },
                { name: "Local Models", color: "text-white/60", slug: "local" },
              ].map((p) => (
                <Link key={p.name} to={`/optimize?platform=${p.slug}`} className={`text-xs font-bold ${p.color} bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/15 hover:border-white/30 transition-all`}>
                  {p.name}
                </Link>
              ))}
            </div>

            {/* Live Demo Card */}
            <div className="mt-16 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
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
                    <div className="ml-auto flex items-center gap-1.5 text-xs text-white/30 font-mono">
                      <Globe className="h-3 w-3" /> Multi-platform · Multi-language
                    </div>
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
                          <p className="text-emerald-400/90 text-xs mb-2 font-mono font-semibold uppercase tracking-widest">OPTIMIZED FOR CHATGPT</p>
                          <p className="text-white/85 text-sm font-mono leading-relaxed break-words">
                            {OPTIMIZED_RESULTS[promptIndex]}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ THREE DIFFERENTIATOR CARDS ═══════════════════════ */}
        <section className="container max-w-6xl mx-auto px-4 py-24 md:py-32 overflow-visible">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Star className="h-4 w-4" />
              What Makes Us Different
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              No Other Prompt Tool Does This
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Generic prompt libraries are everywhere. Ours is the only one built for Asian markets with true multi-platform optimization.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative pt-6 overflow-visible">
            {/* Card 1 — Platform Optimizer */}
            <Link
              to="/optimize"
              className="group relative rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 ring-2 ring-primary/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-visible"
            >
              <div className="absolute -top-3 right-6 z-10 bg-primary text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                KILLER FEATURE
              </div>
              <div className="p-8 pt-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Optimize for Any Platform</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Paste any prompt and get it rewritten specifically for ChatGPT, Claude, Gemini, Copilot, Perplexity, MidJourney, DeepSeek, Qwen, Meta AI, Ernie Bot, Grok, or local models. Each platform has different strengths — Scout knows them all.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {["ChatGPT", "Claude", "Gemini", "Copilot", "Perplexity", "MidJourney", "DeepSeek", "Qwen", "Meta AI", "Ernie Bot", "Grok", "+More"].map((p) => (
                    <span key={p} className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>
                <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  Try the optimizer <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </Link>

            {/* Card 2 — Any Language, Any Culture */}
            <Link
              to="/library"
              className="group relative rounded-2xl border border-border/50 bg-card hover:border-border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-visible"
            >
              <div className="p-8 pt-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Any Language, Any Culture</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Generate and optimize prompts in 12+ Asian languages including Bahasa, Vietnamese, Mandarin, Japanese, Korean, Thai, Hindi, Tamil, and more. Scout adapts tone, formality, and cultural context automatically.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {MULTILINGUAL_EXAMPLES.map((item) => (
                    <span key={item.code} className="text-sm">{item.flag}</span>
                  ))}
                  <span className="text-sm">🇬🇧</span>
                </div>
                <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  Explore prompts <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </Link>

            {/* Card 3 — Built for Asia */}
            <Link
              to="/market-insights"
              className="group relative rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-visible"
            >
              <div className="absolute -top-3 right-6 z-10 bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                ASIA-FIRST
              </div>
              <div className="p-8 pt-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🌏</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Built for Asia</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Not a Western tool with a translation layer. Our prompts are designed from the ground up for Japanese business formality, SEA startup culture, Indian enterprise workflows, and APAC market dynamics.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {["Singapore", "Indonesia", "Vietnam", "Malaysia", "Japan", "India", "Australia"].map((c) => (
                    <span key={c} className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
                <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  Explore APAC insights <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* ═══════════════════════ MULTILINGUAL SECTION ═══════════════════════ */}
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
                62.7% of APAC professionals search in non-English languages. Scout optimizes prompts in 12+ Asian languages — from CJK to Southeast Asian and South Asian scripts — with full cultural context.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-12">
              {MULTILINGUAL_EXAMPLES.map((item, idx) => (
                <button
                  key={item.code}
                  onClick={() => setActiveLanguage(idx)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 group ${
                    activeLanguage === idx
                      ? "border-primary bg-primary/10"
                      : "border-border/50 bg-card hover:border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{item.flag}</div>
                  <p className="font-semibold text-xs group-hover:text-primary transition-colors">{item.lang}</p>
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
                  desc: "Scout rewrites prompts specifically for ChatGPT, Claude, Gemini, MidJourney, Perplexity, DeepSeek, Qwen, Meta AI, Ernie Bot, Grok, and more.",
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

            {/* Mandarin Before/After Example */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12 mt-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/10 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-sm p-8 group-hover:border-red-500/40 transition-colors">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-sm font-bold text-red-400/80 uppercase tracking-wide">Before · 🇨🇳 Mandarin</span>
                  </div>
                  <p className="text-white/90 font-mono text-sm mb-4">
                    "帮我写营销文案"
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/40 leading-relaxed">Too vague. No platform, audience, or format. AI will produce generic, culturally flat output.</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 blur-xl rounded-2xl" />
                <div className="relative rounded-2xl border border-emerald-400/40 bg-white/5 backdrop-blur-sm p-8 ring-2 ring-emerald-400/20">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-bold text-emerald-400 uppercase tracking-wide">After Scout · 🇨🇳 for Qwen</span>
                  </div>
                  <p className="text-white/95 font-mono text-sm mb-4 leading-relaxed">
                    "为我的护肤品牌撰写一条小红书种草文案。目标受众：25-35岁都市女性。要求：1) 使用口语化、亲切的语气，2) 包含使用体验和肤感描述，3) 添加3-5个热门话题标签，4) 字数控制在300字以内。避免过度营销用语。"
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-emerald-400/70 leading-relaxed">Platform-specific (小红书), culturally aware, structured with clear constraints. Qwen delivers authentic Chinese content.</p>
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
              <Button asChild variant="outline" size="lg" className="border-white/50 !text-white hover:bg-white/20 h-16 px-12 text-lg font-bold backdrop-blur-sm bg-white/10">
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
