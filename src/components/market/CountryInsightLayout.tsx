import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Sparkles, Brain, Target, BarChart3, ArrowLeft
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Persona {
  name: string;
  pct: string;
  icon: LucideIcon;
  color: string;
  desc: string;
  segments: string[];
}

export interface Whitespace {
  title: string;
  desc: string;
}

export interface CountryData {
  name: string;
  flag: string;
  slug: string;
  audience: string;
  ageRange: string;
  seoTitle: string;
  seoDescription: string;
  headline: string;
  subheadline: string;
  personas: Persona[];
  whitespace: Whitespace[];
  keyInsight: string;
  keyInsightAttribution: string;
}

const CountryInsightLayout = ({ data }: { data: CountryData }) => {
  return (
    <>
      <SEO
        title={data.seoTitle}
        description={data.seoDescription}
        canonical={`https://promptandgo.ai/market-insights/${data.slug}`}
      />

      <main>
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative overflow-hidden bg-hero">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute bottom-[-30%] right-[-5%] w-[400px] h-[400px] rounded-full bg-accent/15 blur-[100px]" />
          </div>

          <div className="relative z-10 container max-w-5xl mx-auto px-4 pt-16 pb-14 md:pt-24 md:pb-20">
            <div className="flex justify-center mb-4">
              <Link
                to="/market-insights"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 text-sm transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                All Markets
              </Link>
            </div>

            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 text-white/90 px-4 py-1.5 rounded-full text-sm">
                <Brain className="h-3.5 w-3.5 text-accent" />
                <span>SQREEM Intelligence {data.flag}</span>
              </div>
            </div>

            <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
              {data.headline}
            </h1>
            <p className="text-center text-lg md:text-xl text-white/70 mt-6 max-w-2xl mx-auto leading-relaxed">
              {data.subheadline}
            </p>

            <div className="flex justify-center mt-8">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-5 py-2.5 rounded-xl text-base font-medium">
                <span className="text-2xl">{data.flag}</span>
                <span>{data.audience} people</span>
                <span className="text-white/40">|</span>
                <span className="text-white/50 text-sm">{data.ageRange}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ PERSONAS ═══════════════ */}
        <section className="container max-w-5xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Who's searching for better prompts?
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              SQREEM's behavioural AI identified distinct audience segments in {data.name} actively seeking prompt optimisation solutions.
            </p>
          </div>

          <div className="space-y-4">
            {data.personas.map((persona) => (
              <div
                key={persona.name}
                className="rounded-xl border border-border bg-card p-6 md:p-8 hover:border-primary/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0 flex md:flex-col items-center md:items-start gap-4 md:gap-3 md:w-48">
                    <div className={`w-12 h-12 rounded-xl ${persona.color} flex items-center justify-center`}>
                      <persona.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">{persona.pct}</div>
                      <p className="text-xs text-muted-foreground">of market</p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{persona.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{persona.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {persona.segments.map((seg) => (
                        <span
                          key={seg}
                          className="inline-flex items-center text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground"
                        >
                          {seg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ WHITESPACE ═══════════════ */}
        <section className="bg-muted/30 border-y border-border">
          <div className="container max-w-5xl mx-auto px-4 py-20 md:py-28">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Market opportunities
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Gaps and whitespace identified through SQREEM's competitive analysis of the {data.name} market.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {data.whitespace.map((item) => (
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

        {/* ═══════════════ KEY INSIGHT ═══════════════ */}
        <section className="bg-hero text-white">
          <div className="container max-w-4xl mx-auto px-4 py-20 md:py-24">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-accent mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Key insight
              </h2>
              <blockquote className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-8">
                "{data.keyInsight}"
              </blockquote>
              <p className="text-white/50 text-sm mb-10">
                {data.keyInsightAttribution}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/90 h-12 px-8">
                  <Link to="/optimize">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Try the Optimizer
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/50 !text-white hover:bg-white/20 h-12 px-8 bg-white/10">
                  <Link to="/market-insights">
                    All Markets <ArrowRight className="h-4 w-4 ml-2" />
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
              All data comes from SQREEM Intelligence, an AI-powered behavioural analytics platform that analyses billions of digital signals to build audience profiles. No surveys, no self-reported data - just actual behavioural signals from people in {data.name} actively seeking prompt optimisation solutions.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default CountryInsightLayout;
