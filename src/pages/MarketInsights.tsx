import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users, TrendingUp, Globe, Target, BarChart3,
  ArrowRight, Sparkles, Brain, Briefcase, GraduationCap,
  Palette, Building2, Heart, ChevronRight
} from "lucide-react";

/* ─── SQREEM Intelligence data (APAC) ─── */
const MARKET_SIZE = {
  sg: { people: "50,625", label: "Singapore", slug: "" },
  my: { people: "10,969", label: "Malaysia", slug: "/market-insights/malaysia" },
  id: { people: "537,854", label: "Indonesia", slug: "/market-insights/indonesia" },
  vn: { people: "425,343", label: "Vietnam", slug: "/market-insights/vietnam" },
  au: { people: "104,647", label: "Australia", slug: "/market-insights/australia" },
  total: "1.1M+",
};

const PERSONAS = [
  {
    name: "Business Professionals",
    pct: "49%",
    icon: Briefcase,
    color: "bg-primary",
    desc: "Marketers, managers, and consultants using AI to streamline campaigns, reporting, and client work.",
    needs: ["Campaign optimisation prompts", "Report writing templates", "Client communication frameworks"],
  },
  {
    name: "Creative Entrepreneurs",
    pct: "32%",
    icon: Palette,
    color: "bg-accent",
    desc: "Founders, freelancers, and creators building brands, products, and content with AI assistance.",
    needs: ["Brand strategy prompts", "Content creation workflows", "Social media templates"],
  },
  {
    name: "Students & Learners",
    pct: "14%",
    icon: GraduationCap,
    color: "bg-amber-500",
    desc: "University students and professionals upskilling in AI, prompt engineering, and digital literacy.",
    needs: ["Research assistant prompts", "Study aid templates", "Career development frameworks"],
  },
  {
    name: "Public Sector",
    pct: "2.5%",
    icon: Building2,
    color: "bg-foreground",
    desc: "Government and public service professionals exploring AI for policy, communications, and citizen engagement.",
    needs: ["Policy analysis prompts", "Public comms templates", "Data interpretation aids"],
  },
  {
    name: "Retirees & Lifelong Learners",
    pct: "2.2%",
    icon: Heart,
    color: "bg-primary/60",
    desc: "Experienced professionals and retirees exploring AI for personal projects, hobbies, and staying current.",
    needs: ["Getting started guides", "Hobby and creative prompts", "Simplified workflow templates"],
  },
];

const BRAND_WHITESPACE = [
  {
    title: "APAC-first prompt library",
    desc: "No competitor serves prompts with Southeast Asian cultural context and local business use cases baked in.",
  },
  {
    title: "Prompt optimisation as a service",
    desc: "Most prompt libraries are static. Scout AI actively rewrites and improves prompts for specific platforms in real-time.",
  },
  {
    title: "Persona-driven curation",
    desc: "Generic categories fail busy professionals. Persona-matched prompt packs deliver immediate relevance.",
  },
  {
    title: "Certification and gamification",
    desc: "No competitor offers prompt engineering certification with XP, badges, and skill verification for professionals.",
  },
];

const MarketInsights = () => {
  return (
    <>
      <SEO
        title="Market Insights - SQREEM Intelligence | PromptAndGo"
        description="Real data on the 1.9M+ APAC professionals searching for better AI prompts. Powered by SQREEM Intelligence behavioural analysis."
        canonical="https://promptandgo.ai/market-insights"
      />

      <main>
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative overflow-hidden bg-hero">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute bottom-[-30%] right-[-5%] w-[400px] h-[400px] rounded-full bg-accent/15 blur-[100px]" />
          </div>

          <div className="relative z-10 container max-w-5xl mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-24">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 text-white/90 px-4 py-1.5 rounded-full text-sm">
                <Brain className="h-3.5 w-3.5 text-accent" />
                <span>Powered by SQREEM Intelligence</span>
              </div>
            </div>

            <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
              {MARKET_SIZE.total} professionals
              <span className="block text-gradient-brand"> want better prompts.</span>
            </h1>
            <p className="text-center text-lg md:text-xl text-white/70 mt-6 max-w-2xl mx-auto leading-relaxed">
              Real behavioural data from across Asia-Pacific. Not guesses, not surveys - actual demand signals from SQREEM's AI-driven audience intelligence.
            </p>
          </div>
        </section>

        {/* ═══════════════ MARKET SIZE ═══════════════ */}
        <section className="border-b border-border bg-muted/30">
          <div className="container max-w-5xl mx-auto px-4 py-16 md:py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                The APAC prompt market, quantified
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                People actively looking to optimise their AI prompts or find better prompts to use, by country.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { ...MARKET_SIZE.sg, flag: "🇸🇬" },
                { ...MARKET_SIZE.my, flag: "🇲🇾" },
                { ...MARKET_SIZE.id, flag: "🇮🇩" },
                { ...MARKET_SIZE.vn, flag: "🇻🇳" },
                { ...MARKET_SIZE.au, flag: "🇦🇺" },
              ].map((country) => {
                const content = (
                  <>
                    <span className="text-2xl mb-2 block">{country.flag}</span>
                    <div className="text-2xl md:text-3xl font-bold text-foreground">{country.people}</div>
                    <p className="text-sm text-muted-foreground mt-1">{country.label}</p>
                    {country.slug && (
                      <span className="inline-flex items-center text-xs text-primary mt-2 gap-0.5">
                        Deep dive <ChevronRight className="h-3 w-3" />
                      </span>
                    )}
                  </>
                );
                return country.slug ? (
                  <Link
                    key={country.label}
                    to={country.slug}
                    className="rounded-xl border border-border bg-card p-5 text-center hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={country.label}
                    className="rounded-xl border border-primary/30 bg-card p-5 text-center ring-1 ring-primary/10"
                  >
                    {content}
                    <span className="inline-flex items-center text-xs text-primary/60 mt-2">Current page</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                Combined APAC market: {MARKET_SIZE.total} people actively seeking prompt solutions
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ SINGAPORE DEEP DIVE ═══════════════ */}
        <section className="container max-w-5xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Globe className="h-4 w-4" />
              Singapore deep-dive
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              50,625 people. Five distinct personas.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              SQREEM's behavioural AI identified five audience segments in Singapore actively seeking better AI prompts. Each has different needs, different pain points, and different buying triggers.
            </p>
          </div>

          <div className="space-y-4">
            {PERSONAS.map((persona) => (
              <div
                key={persona.name}
                className="rounded-xl border border-border bg-card p-6 md:p-8 hover:border-primary/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: icon + stats */}
                  <div className="flex-shrink-0 flex md:flex-col items-center md:items-start gap-4 md:gap-3 md:w-48">
                    <div className={`w-12 h-12 rounded-xl ${persona.color} flex items-center justify-center`}>
                      <persona.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">{persona.pct}</div>
                      <p className="text-xs text-muted-foreground">of SG market</p>
                    </div>
                  </div>

                  {/* Right: content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{persona.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{persona.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {persona.needs.map((need) => (
                        <span
                          key={need}
                          className="inline-flex items-center text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground"
                        >
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ BRAND WHITESPACE ═══════════════ */}
        <section className="bg-muted/30 border-y border-border">
          <div className="container max-w-5xl mx-auto px-4 py-20 md:py-28">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Where PromptAndGo wins
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                SQREEM's competitive analysis identified four areas of clear brand whitespace - gaps no competitor is filling.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {BRAND_WHITESPACE.map((item, i) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ KEY INSIGHT CALLOUT ═══════════════ */}
        <section className="bg-hero text-white">
          <div className="container max-w-4xl mx-auto px-4 py-20 md:py-24">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-accent mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                The insight that matters most
              </h2>
              <blockquote className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-8">
                "People aren't just searching for prompts - they're searching for confidence. They want to know their AI interactions will deliver professional-grade results, first time."
              </blockquote>
              <p className="text-white/50 text-sm mb-10">
                - SQREEM behavioural pattern analysis, Singapore market, 2025
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/90 h-12 px-8">
                  <Link to="/optimize">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Try the Optimizer
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 px-8">
                  <Link to="/library">
                    Browse Prompts <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ METHODOLOGY ═══════════════ */}
        <section className="container max-w-4xl mx-auto px-4 py-16 md:py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-4">About this data</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-sm">
              All market sizing and persona data comes from SQREEM Intelligence, an AI-powered behavioural analytics platform. SQREEM analyses billions of digital signals to build audience profiles without relying on surveys or self-reported data. The Singapore analysis covers 50,625 individuals exhibiting active prompt-seeking behaviour. APAC figures span Singapore, Malaysia, Indonesia, Vietnam, and Australia.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default MarketInsights;
