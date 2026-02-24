import { useState, useEffect, useRef } from "react";
import SEO from "@/components/SEO";
import { AIOptimizedStructuredData } from "@/components/seo/AIOptimizedStructuredData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight, Sparkles, Zap, Globe, Bot,
  Search, Copy, Check, ChevronRight, Star,
  BookOpen, Wand2, ShoppingBag, Award,
  MessageSquare, TrendingUp, Users
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

const Index = () => {
  const { user } = useSupabaseAuth();
  const { isNewsletterSubscribed } = useNewsletterStatus();
  const [typedText, setTypedText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showOptimized, setShowOptimized] = useState(false);
  const [copiedHero, setCopiedHero] = useState(false);
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
      // Done typing, show optimized after a beat
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
        {/* ═══════════════════════ HERO ═══════════════════════ */}
        <section className="relative overflow-hidden bg-hero">
          {/* Ambient background effects */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute bottom-[-30%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent/15 blur-[100px]" />
            <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px]" />
          </div>

          <div className="relative z-10 container max-w-6xl mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-24">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 text-white/90 px-4 py-1.5 rounded-full text-sm">
                <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                <span>Free for everyone. No signup required.</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
              Stop writing
              <span className="block text-gradient-brand"> mediocre prompts.</span>
            </h1>
            <p className="text-center text-lg md:text-xl text-white/70 mt-6 max-w-2xl mx-auto leading-relaxed">
              3,000+ battle-tested prompts and an AI optimizer that turns vague instructions into precision-engineered results. Built for Asia-Pacific professionals.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <Button asChild size="lg" className="px-8 text-base bg-white text-gray-900 hover:bg-white/90 h-12">
                <Link to="/optimize">
                  <Zap className="h-4 w-4 mr-2" />
                  Optimize a Prompt - Free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8 text-base border-white/20 text-white hover:bg-white/10 h-12">
                <Link to="/library">
                  <Search className="h-4 w-4 mr-2" />
                  Browse 3,000+ Prompts
                </Link>
              </Button>
            </div>

            {/* Live Demo Card */}
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-2xl p-1">
                <div className="bg-gray-950/80 rounded-xl overflow-hidden">
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-white/40 text-xs ml-2 font-mono">scout-optimizer</span>
                  </div>

                  {/* Input area */}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded bg-primary/20 flex items-center justify-center mt-0.5">
                        <MessageSquare className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs mb-1 font-mono">YOUR PROMPT</p>
                        <p className="text-white/90 text-sm font-mono">
                          {typedText}
                          {isTyping && <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" />}
                        </p>
                      </div>
                    </div>

                    {/* Optimized result */}
                    {showOptimized && (
                      <div className="flex items-start gap-3 mt-5 pt-5 border-t border-white/5 animate-float-in">
                        <div className="flex-shrink-0 w-6 h-6 rounded bg-green-500/20 flex items-center justify-center mt-0.5">
                          <Sparkles className="h-3.5 w-3.5 text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-green-400/80 text-xs mb-1 font-mono">SCOUT OPTIMIZED</p>
                          <p className="text-white/80 text-sm font-mono leading-relaxed break-words">
                            {OPTIMIZED_RESULTS[promptIndex]}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-center text-white/30 text-xs mt-3">Scout analyses and optimises prompts for 12+ AI platforms in real-time</p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ PLATFORM STRIP ═══════════════════════ */}
        <section className="border-b border-border bg-muted/30">
          <div className="container max-w-5xl mx-auto px-4 py-6">
            <p className="text-center text-xs text-muted-foreground mb-4 uppercase tracking-widest">Optimized for</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {[
                { name: "ChatGPT", color: "text-emerald-600" },
                { name: "Claude", color: "text-primary" },
                { name: "Gemini", color: "text-accent" },
                { name: "MidJourney", color: "text-foreground/70" },
                { name: "Perplexity", color: "text-primary/80" },
                { name: "DeepSeek", color: "text-accent/80" },
              ].map((p) => (
                <span key={p.name} className={`text-sm font-semibold ${p.color} opacity-70`}>
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
        <section className="container max-w-5xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Three ways to get perfect prompts
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Whether you want ready-made, custom-built, or optimised - we've got it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Browse the Library",
                desc: "3,000+ prompts across marketing, coding, creative, business, and more. Tested, tagged, and ready to copy.",
                link: "/library",
                cta: "Browse prompts",
                gradient: "from-primary to-primary/80",
              },
              {
                icon: Zap,
                title: "Optimize Any Prompt",
                desc: "Paste your rough prompt. Scout rewrites it with precision - tailored to ChatGPT, Claude, MidJourney, or any AI tool.",
                link: "/optimize",
                cta: "Try the optimizer",
                gradient: "from-accent to-teal-600",
                featured: true,
              },
              {
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
                className={`group relative rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  item.featured ? "border-primary/30 ring-1 ring-primary/10" : "border-border"
                }`}
              >
                {item.featured && (
                  <div className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most popular
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{item.desc}</p>
                <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  {item.cta} <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════════════ SOCIAL PROOF ═══════════════════════ */}
        <section className="bg-muted/30 border-y border-border">
          <div className="container max-w-5xl mx-auto px-4 py-16 md:py-20">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { num: "3,000+", label: "Curated prompts", icon: BookOpen },
                { num: "12+", label: "AI platforms supported", icon: Bot },
                { num: "1.9M", label: "APAC professionals in market", icon: Globe },
                { num: "16", label: "Prompt categories", icon: Star },
              ].map((stat) => (
                <div key={stat.label}>
                  <stat.icon className="h-5 w-5 text-primary mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.num}</div>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════ WHY PROMPTANDGO ═══════════════════════ */}
        <section className="container max-w-5xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Why professionals choose PromptAndGo
            </h2>
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
              <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-border/50 bg-card hover:border-border transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════ BEFORE/AFTER ═══════════════════════ */}
        <section className="bg-hero text-white">
          <div className="container max-w-5xl mx-auto px-4 py-20 md:py-28">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                See the difference Scout makes
              </h2>
              <p className="text-white/60 mt-4 max-w-xl mx-auto">
                The same intent, dramatically better results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Before */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-sm font-medium text-white/50 uppercase tracking-wide">Before</span>
                </div>
                <p className="text-white/70 font-mono text-sm">
                  "Write me a marketing email"
                </p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/30">Vague. No context. No structure. The AI will guess - and usually guess wrong.</p>
                </div>
              </div>

              {/* After */}
              <div className="rounded-xl border border-green-400/30 bg-green-400/5 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-sm font-medium text-green-400/80 uppercase tracking-wide">After Scout</span>
                </div>
                <p className="text-white/90 font-mono text-sm leading-relaxed">
                  "Write a 150-word marketing email for [product] targeting [audience]. Professional but friendly tone. Include: subject line, one benefit, social proof, specific CTA with deadline. Avoid: hype, jargon, multiple CTAs."
                </p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-green-400/60">Specific. Structured. Constrained. The AI delivers exactly what you need.</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/90 h-12 px-8">
                <Link to="/optimize">
                  Try it with your own prompt <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ EXPLORE TOOLS ═══════════════════════ */}
        <section className="container max-w-5xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              The complete prompt toolkit
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Everything you need to get better results from AI, all in one place.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Search, title: "Prompt Library", desc: "3,000+ ready to use", link: "/library", color: "bg-primary" },
              { icon: ShoppingBag, title: "Power Packs", desc: "Themed collections", link: "/packs", color: "bg-accent" },
              { icon: Bot, title: "Scout AI", desc: "Chat with your AI coach", link: "/scout", color: "bg-amber-500" },
              { icon: Award, title: "Certification", desc: "Prove your skills", link: "/certification", color: "bg-foreground" },
            ].map((tool) => (
              <Link
                key={tool.title}
                to={tool.link}
                className="group p-5 rounded-xl border border-border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={`w-9 h-9 rounded-lg ${tool.color} flex items-center justify-center mb-3`}>
                  <tool.icon className="h-4.5 w-4.5 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{tool.title}</h3>
                <p className="text-xs text-muted-foreground">{tool.desc}</p>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary mt-2 transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════════════ APAC CTA ═══════════════════════ */}
        <section className="bg-muted/30 border-y border-border">
          <div className="container max-w-4xl mx-auto px-4 py-16 md:py-20 text-center">
            <Globe className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              The Asia-Pacific prompt advantage
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              1.9 million professionals across Singapore, Indonesia, Vietnam, Malaysia, and Australia are searching for better AI prompts. PromptAndGo is the only prompt library built specifically for APAC markets - with cultural context, local business use cases, and regional language understanding baked in.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="h-11">
                <Link to="/market-insights">
                  See the Data <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11">
                <Link to="/singapore-startups">
                  Singapore Startups
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ NEWSLETTER & FAQ ═══════════════════════ */}
        <NewsletterSection user={user} isNewsletterSubscribed={isNewsletterSubscribed} />
        <FAQSection />

        {/* ═══════════════════════ FINAL CTA ═══════════════════════ */}
        <section className="bg-hero text-white">
          <div className="container max-w-3xl mx-auto px-4 py-20 md:py-24 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to write prompts that actually work?
            </h2>
            <p className="text-white/60 mb-8 text-lg">
              No signup required. No credit card. Just better AI results.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/90 h-12 px-8 text-base">
                <Link to="/optimize">
                  <Zap className="h-4 w-4 mr-2" />
                  Start Optimizing - Free
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <OnboardingModal />
    </>
  );
};

export default Index;
