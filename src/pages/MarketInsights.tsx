'use client';

import { useState, useEffect, useRef } from 'react';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Users,
  TrendingUp,
  Globe,
  Target,
  BarChart3,
  ArrowRight,
  Sparkles,
  Brain,
  Briefcase,
  GraduationCap,
  Palette,
  Building2,
  Heart,
  ChevronRight,
  Zap,
  Lock,
  Lightbulb,
  Award,
} from 'lucide-react';

/* ─── SQREEM Intelligence data (APAC) ─── */
const MARKET_SIZE = {
  sg: { people: 50625, label: 'Singapore', slug: '' },
  my: { people: 10969, label: 'Malaysia', slug: '/market-insights/malaysia' },
  id: { people: 537854, label: 'Indonesia', slug: '/market-insights/indonesia' },
  vn: { people: 425343, label: 'Vietnam', slug: '/market-insights/vietnam' },
  au: { people: 104647, label: 'Australia', slug: '/market-insights/australia' },
  total: 1947438,
};

const PERSONAS = [
  {
    name: 'Business Professionals',
    pct: 49,
    icon: Briefcase,
    color: 'from-primary to-orange-500',
    bgColor: 'bg-primary',
    desc: 'Marketers, managers, and consultants using AI to streamline campaigns, reporting, and client work.',
    needs: ['Campaign optimisation prompts', 'Report writing templates', 'Client communication frameworks'],
  },
  {
    name: 'Creative Entrepreneurs',
    pct: 32,
    icon: Palette,
    color: 'from-accent to-cyan-500',
    bgColor: 'bg-accent',
    desc: 'Founders, freelancers, and creators building brands, products, and content with AI assistance.',
    needs: ['Brand strategy prompts', 'Content creation workflows', 'Social media templates'],
  },
  {
    name: 'Students & Learners',
    pct: 14,
    icon: GraduationCap,
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-500',
    desc: 'University students and professionals upskilling in AI, prompt engineering, and digital literacy.',
    needs: ['Research assistant prompts', 'Study aid templates', 'Career development frameworks'],
  },
  {
    name: 'Public Sector',
    pct: 2.5,
    icon: Building2,
    color: 'from-slate-600 to-slate-400',
    bgColor: 'bg-slate-600',
    desc: 'Government and public service professionals exploring AI for policy, communications, and citizen engagement.',
    needs: ['Policy analysis prompts', 'Public comms templates', 'Data interpretation aids'],
  },
  {
    name: 'Retirees & Lifelong Learners',
    pct: 2.2,
    icon: Heart,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500',
    desc: 'Experienced professionals and retirees exploring AI for personal projects, hobbies, and staying current.',
    needs: ['Getting started guides', 'Hobby and creative prompts', 'Simplified workflow templates'],
  },
];

const BRAND_WHITESPACE = [
  {
    title: 'APAC-first prompt library',
    desc: 'No competitor serves prompts with Southeast Asian cultural context and local business use cases baked in.',
    icon: Globe,
  },
  {
    title: 'Prompt optimisation as a service',
    desc: 'Most prompt libraries are static. PromptAndGo actively rewrites and improves prompts for specific platforms in real-time.',
    icon: Zap,
  },
  {
    title: 'Persona-driven curation',
    desc: 'Generic categories fail busy professionals. Persona-matched prompt packs deliver immediate relevance.',
    icon: Target,
  },
  {
    title: 'Certification and gamification',
    desc: 'No competitor offers prompt engineering certification with XP, badges, and skill verification for professionals.',
    icon: Award,
  },
];

const LIVE_SIGNALS = [
  'Someone in Jakarta just searched for "email marketing prompt template"',
  'A user in Manila is exploring "customer research frameworks"',
  'Someone in Bangkok discovered "product launch checklist prompts"',
  'A professional in Sydney searched for "meeting notes AI assistant"',
  'Someone in Ho Chi Minh City is using "brainstorm facilitation prompts"',
  'A user in Kuala Lumpur explored "social media content calendar AI"',
  'Someone in Surabaya searched for "competitive analysis template"',
  'A professional in Hanoi is using "brand positioning prompts"',
  'Someone in Brisbane discovered "quarterly planning framework"',
  'A user in Cebu is exploring "customer feedback analysis prompts"',
];

/* ─── Animated Counter Component ─── */
const AnimatedCounter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress === 1) clearInterval(interval);
          }, 16);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <div ref={ref}>
      {count.toLocaleString()}
    </div>
  );
};

const MarketInsights = () => {
  const [activePersona, setActivePersona] = useState(0);
  const [liveSignalIndex, setLiveSignalIndex] = useState(0);

  // Live signals ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSignalIndex((prev) => (prev + 1) % LIVE_SIGNALS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const countries = [
    { ...MARKET_SIZE.sg, flag: '🇸🇬' },
    { ...MARKET_SIZE.my, flag: '🇲🇾' },
    { ...MARKET_SIZE.id, flag: '🇮🇩' },
    { ...MARKET_SIZE.vn, flag: '🇻🇳' },
    { ...MARKET_SIZE.au, flag: '🇦🇺' },
  ];

  return (
    <>
      <SEO
        title="Market Insights - SQREEM Intelligence | PromptAndGo"
        description="Real data on the 1.9M+ APAC professionals searching for better AI prompts. Powered by SQREEM Intelligence behavioural analysis."
        canonical="https://promptandgo.ai/market-insights"
      />

      <main>
        {/* ═══════════════ HERO WITH ANIMATED COUNTER ═══════════════ */}
        <section className="relative overflow-hidden bg-hero">
          {/* Animated background particles */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-30%] right-[-5%] w-[400px] h-[400px] rounded-full bg-accent/15 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative z-10 container max-w-6xl mx-auto px-4 pt-24 pb-32 md:pt-32 md:pb-40">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 px-5 py-2 rounded-full text-sm font-medium">
                <Brain className="h-4 w-4 text-accent animate-pulse" />
                <span>Powered by SQREEM Intelligence</span>
              </div>
            </div>

            {/* Main headline */}
            <h1 className="text-center text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] max-w-5xl mx-auto mb-8">
              <span className="block mb-3">
                <AnimatedCounter target={MARKET_SIZE.total} duration={3000} />
              </span>
              <span className="text-gradient-brand block">APAC professionals</span>
              <span className="block">are seeking better prompts</span>
            </h1>

            <p className="text-center text-lg md:text-xl text-white/70 mt-8 max-w-3xl mx-auto leading-relaxed">
              Not guesses. Not surveys. Real behavioural data from billions of digital signals across Asia-Pacific, analysed by SQREEM's AI-driven intelligence platform.
            </p>
          </div>
        </section>

        {/* ═══════════════ INTERACTIVE COUNTRY CARDS ═══════════════ */}
        <section className="relative bg-gradient-to-b from-muted/50 to-background py-24 md:py-32">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                <TrendingUp className="h-4 w-4" />
                Market breakdown by country
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Where APAC's demand is concentrated
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Five countries. One unified market. Let's see who's actively seeking prompt solutions.
              </p>
            </div>

            {/* Country Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              {countries.map((country) => {
                const percentage = ((country.people / MARKET_SIZE.total) * 100).toFixed(1);
                const isCurrentPage = country.slug === '';

                const CardContent = (
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <div className="text-4xl mb-4">{country.flag}</div>
                      <h3 className="text-2xl font-bold text-white mb-2">{country.label}</h3>
                      <div className="mb-6">
                        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          <AnimatedCounter target={country.people} duration={2000} />
                        </div>
                        <p className="text-sm text-white/60 mt-2">{percentage}% of APAC</p>
                      </div>

                      {/* Proportional bar */}
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {country.slug && (
                      <div className="text-xs text-accent/80 font-medium inline-flex items-center gap-1">
                        Deep dive <ChevronRight className="h-3 w-3" />
                      </div>
                    )}
                    {isCurrentPage && (
                      <div className="text-xs text-primary/70 font-medium">You are here</div>
                    )}
                  </div>
                );

                return country.slug ? (
                  <Link
                    key={country.label}
                    to={country.slug}
                    className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-sm p-8 text-white overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/5 transition-all duration-300" />
                    <div className="relative z-10">{CardContent}</div>
                  </Link>
                ) : (
                  <div
                    key={country.label}
                    className="relative rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/15 to-primary/5 backdrop-blur-sm p-8 text-white overflow-hidden ring-1 ring-primary/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    <div className="relative z-10">{CardContent}</div>
                  </div>
                );
              })}
            </div>

            {/* Total stat badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 to-accent/20 text-white px-8 py-4 rounded-2xl border border-primary/30 backdrop-blur-sm">
                <Zap className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-semibold">
                  Combined APAC market: <span className="text-gradient-brand">{(MARKET_SIZE.total).toLocaleString()}</span> professionals actively seeking prompt solutions
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ LIVE DEMAND SIGNALS ═══════════════ */}
        <section className="relative bg-hero text-white py-16 md:py-20 overflow-hidden">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-medium text-accent/90">Live demand signals</span>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
                {/* Animated ticker */}
                <div className="relative h-24 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-hero via-transparent to-hero opacity-0 group-hover:opacity-100" />
                  <div className="text-center relative z-10">
                    <div className="text-sm text-white/60 mb-3">Right now in APAC:</div>
                    <div className="text-2xl md:text-3xl font-semibold text-white leading-relaxed min-h-[80px] flex items-center justify-center">
                      {LIVE_SIGNALS[liveSignalIndex]}
                    </div>
                  </div>
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center gap-1.5 mt-6">
                  {LIVE_SIGNALS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setLiveSignalIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === liveSignalIndex ? 'bg-accent w-6' : 'bg-white/20 w-2 hover:bg-white/30'
                      }`}
                      aria-label={`Signal ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ PERSONA VISUALIZATION ═══════════════ */}
        <section className="relative py-24 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 px-4 py-2 rounded-full bg-accent/5 border border-accent/10">
                <Users className="h-4 w-4" />
                Audience segmentation
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Five distinct personas shaping the market
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                SQREEM's AI identified five distinct audience segments, each with unique needs, pain points, and purchase triggers.
              </p>
            </div>

            {/* Stacked Bar Chart Visualization */}
            <div className="mb-16 bg-card rounded-2xl border border-border/50 p-8 md:p-10">
              <div className="mb-8">
                <p className="text-sm font-medium text-muted-foreground mb-4">Audience breakdown</p>
                <div className="flex h-16 rounded-xl overflow-hidden gap-1 bg-muted/20 p-1">
                  {PERSONAS.map((persona, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePersona(idx)}
                      className={`flex-1 rounded-lg transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                        activePersona === idx
                          ? `bg-gradient-to-r ${persona.color} ring-2 ring-offset-1`
                          : 'bg-muted/40 hover:bg-muted/60'
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center h-full text-white font-semibold text-sm">
                        {persona.pct}%
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Persona Details */}
              <div className="relative">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <div className="mb-8">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${PERSONAS[activePersona].color} flex items-center justify-center mb-4`}>
                        {(() => {
                          const Icon = PERSONAS[activePersona].icon;
                          return <Icon className="h-7 w-7 text-white" />;
                        })()}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold mb-3">{PERSONAS[activePersona].name}</h3>
                      <p className="text-xl text-muted-foreground mb-6">{PERSONAS[activePersona].desc}</p>
                      <div className="inline-flex px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                        {PERSONAS[activePersona].pct}% of market
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                      Key prompt needs
                    </h4>
                    <div className="space-y-3">
                      {PERSONAS[activePersona].needs.map((need, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-4 rounded-lg bg-muted/40 border border-border/30 hover:border-primary/30 transition-colors"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <div className="mt-1">
                            <Lightbulb className="h-5 w-5 text-accent flex-shrink-0" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{need}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Personas as Cards */}
            <div className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-wider">All personas</p>
              {PERSONAS.map((persona, idx) => (
                <div
                  key={idx}
                  className={`group relative rounded-xl border transition-all duration-300 cursor-pointer p-6 md:p-8 ${
                    activePersona === idx
                      ? `border-primary/50 bg-card ring-1 ring-primary/20 shadow-lg shadow-primary/10`
                      : 'border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card'
                  }`}
                  onClick={() => setActivePersona(idx)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${persona.color} flex items-center justify-center flex-shrink-0`}>
                          {(() => {
                            const Icon = persona.icon;
                            return <Icon className="h-6 w-6 text-white" />;
                          })()}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{persona.name}</h3>
                          <p className="text-2xl font-bold text-gradient-brand">{persona.pct}%</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">{persona.desc}</p>
                    </div>
                    <ChevronRight className={`h-6 w-6 text-primary/50 transition-transform duration-300 ${activePersona === idx ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ COMPETITIVE MOAT ═══════════════ */}
        <section className="relative bg-muted/40 border-y border-border py-24 md:py-32">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                <Lock className="h-4 w-4" />
                Strategic positioning
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Our competitive moat
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Four areas of clear brand whitespace where no competitor is winning.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {BRAND_WHITESPACE.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="group relative rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 p-8 md:p-10 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  >
                    {/* Connecting line visual */}
                    <div className="absolute -left-4 top-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Number badge */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 font-bold text-white text-lg group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow">
                      {i + 1}
                    </div>

                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>

                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════ KEY INSIGHT ═══════════════ */}
        <section className="relative overflow-hidden bg-hero text-white py-24 md:py-32">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/30 blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-[150px]" />
          </div>

          <div className="relative z-10 container max-w-5xl mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30 mx-auto mb-8">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>

              <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                The insight that changes everything
              </h2>

              <blockquote className="text-2xl md:text-3xl font-light text-white/90 leading-relaxed max-w-4xl mx-auto mb-10 italic">
                "People aren't searching for more prompts. They're searching for confidence. They want to know their AI interactions will deliver professional-grade results, consistently, first time."
              </blockquote>

              <p className="text-white/50 text-sm mb-12 font-medium">
                SQREEM behavioural pattern analysis | APAC market | 2025
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/90 h-13 px-8 font-semibold shadow-lg hover:shadow-xl transition-all">
                  <Link to="/optimize">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Try the Optimizer
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-13 px-8 font-semibold">
                  <Link to="/library">
                    Browse the Library <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ DATA METHODOLOGY ═══════════════ */}
        <section className="relative py-20 md:py-28">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/50 to-muted/20 p-10 md:p-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-3 text-sm text-muted-foreground mb-8 px-4 py-2 rounded-lg bg-muted/40 border border-border/30 w-fit">
                    <Brain className="h-4 w-4" />
                    Data methodology
                  </div>

                  <h2 className="text-4xl font-bold mb-6">
                    Powered by behavioural intelligence
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-8">
                    All market sizing and persona data comes from SQREEM Intelligence, an AI-powered behavioural analytics platform that analyzes billions of digital signals across the APAC region without relying on surveys or self-reported data.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Real behavioural signals</p>
                        <p className="text-sm text-muted-foreground">Not surveys, not guesses - actual search intent and engagement patterns</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">APAC-wide coverage</p>
                        <p className="text-sm text-muted-foreground">Singapore, Malaysia, Indonesia, Vietnam, and Australia unified</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Persona precision</p>
                        <p className="text-sm text-muted-foreground">Five distinct segments identified by AI pattern recognition</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge area */}
                <div className="flex items-center justify-center md:justify-end">
                  <div className="relative w-48 h-48 md:w-56 md:h-56">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
                    <div className="absolute inset-0 rounded-3xl border border-primary/30 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                      <Brain className="h-16 w-16 text-primary" />
                      <div className="text-center">
                        <p className="text-sm font-semibold text-white">SQREEM</p>
                        <p className="text-xs text-white/70">Intelligence</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ FINAL CTA ═══════════════ */}
        <section className="relative bg-muted/50 border-t border-border py-20 md:py-24">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Ready to optimize your prompts?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join {(MARKET_SIZE.total).toLocaleString()} APAC professionals who are already using PromptAndGo to get professional-grade results from their AI interactions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-13 px-8 font-semibold bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-shadow">
                  <Link to="/optimize">
                    Get Started <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-13 px-8 font-semibold">
                  <Link to="/library">
                    Explore Prompts
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default MarketInsights;
