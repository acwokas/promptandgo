import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight, Zap, TrendingUp, Users, Target,
  BarChart3, Globe, Sparkles, ShoppingBag, Mail,
  Search, Clock, Award, Megaphone, PenTool,
  MessageSquare, Briefcase, CheckCircle2
} from "lucide-react";

const PROMPT_CATEGORIES = [
  {
    icon: Megaphone,
    title: "Marketing & Ads",
    desc: "Facebook ad copy, Google Ads headlines, email campaigns, and content calendars. Tested templates that convert.",
    count: "400+",
    color: "bg-primary",
  },
  {
    icon: TrendingUp,
    title: "Sales & Outreach",
    desc: "Cold email sequences, follow-up scripts, proposal frameworks, and objection handling. Close more deals faster.",
    count: "280+",
    color: "bg-accent",
  },
  {
    icon: PenTool,
    title: "Content Creation",
    desc: "Blog posts, social media captions, newsletters, video scripts, and SEO content. All tailored for your industry.",
    count: "500+",
    color: "bg-amber-500",
  },
  {
    icon: Briefcase,
    title: "Operations & Strategy",
    desc: "Business plans, competitor analysis, hiring templates, SOPs, and financial modelling. Run your business smarter.",
    count: "350+",
    color: "bg-foreground",
  },
  {
    icon: MessageSquare,
    title: "Customer Service",
    desc: "Response templates, FAQ generators, complaint handling scripts, and chatbot prompts. Delight customers at scale.",
    count: "200+",
    color: "bg-primary/80",
  },
  {
    icon: Globe,
    title: "APAC-Specific",
    desc: "Prompts built for Singapore, Malaysia, Indonesia, Vietnam, and Australia. Local context, cultural nuance included.",
    count: "300+",
    color: "bg-accent/80",
  },
];

const PAIN_POINTS = [
  {
    before: "Spending 30 minutes writing one marketing email",
    after: "Professional email draft in 60 seconds flat",
  },
  {
    before: "Generic AI output that doesn't match your brand",
    after: "Brand-aligned content with tone, audience, and CTA baked in",
  },
  {
    before: "Hiring a copywriter for every social media post",
    after: "30 days of social content from a single prompt",
  },
  {
    before: "Blank page syndrome when pitching to clients",
    after: "Structured proposals and pitch decks in minutes",
  },
];

const SmallBusiness = () => {
  return (
    <>
      <SEO
        title="AI Prompts for Small Business | PromptAndGo"
        description="3,000+ battle-tested AI prompts for small business owners across Asia-Pacific. Marketing, sales, content, operations - ready to copy and use. Free optimizer included."
        canonical="https://promptandgo.ai/small-business"
        keywords="AI prompts small business, ChatGPT for SME, AI tools small business, prompt templates business"
      />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden bg-hero">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-30%] right-[-5%] w-[400px] h-[400px] rounded-full bg-accent/15 blur-[100px]" />
        </div>

        <div className="relative z-10 container max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 text-white/90 px-4 py-1.5 rounded-full text-sm mb-6">
            <Briefcase className="h-3.5 w-3.5" />
            Built for small business owners
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Stop wrestling with AI.
            <span className="block text-gradient-brand">Start getting results.</span>
          </h1>

          <p className="text-white/70 mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            3,000+ ready-made AI prompts for marketing, sales, content, and operations. Copy, paste, customise, done. No prompt engineering degree required.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/90 h-12 px-8 text-base">
              <Link to="/library">
                <Search className="h-4 w-4 mr-2" />
                Browse Prompts - Free
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/50 !text-white hover:bg-white/20 h-12 px-8 text-base bg-white/10">
              <Link to="/optimize">
                <Zap className="h-4 w-4 mr-2" />
                Optimize Any Prompt
              </Link>
            </Button>
          </div>

          <p className="text-white/40 text-sm mt-4">No signup needed. No credit card. Just better AI results.</p>
        </div>
      </section>

      {/* ═══════════════ SOCIAL PROOF STRIP ═══════════════ */}
      <section className="border-b border-border bg-muted/30">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "3,000+", label: "Ready-made prompts", icon: Search },
              { num: "12+", label: "AI platforms", icon: Sparkles },
              { num: "< 60s", label: "From prompt to result", icon: Clock },
              { num: "Free", label: "No strings attached", icon: Award },
            ].map((stat) => (
              <div key={stat.label}>
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.num}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PROBLEM / SOLUTION ═══════════════ */}
      <section className="container max-w-5xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            The difference a good prompt makes
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Most small businesses get mediocre AI output because they use mediocre prompts. Here's what changes when you use tested, structured prompts instead.
          </p>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {PAIN_POINTS.map((item, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/50 bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Before</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.before}</p>
              </div>
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-xs font-medium text-accent uppercase tracking-wide">After</span>
                </div>
                <p className="text-sm text-foreground">{item.after}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="h-11">
            <Link to="/optimize">
              Try it with your own prompt <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ═══════════════ PROMPT CATEGORIES ═══════════════ */}
      <section className="bg-muted/30 border-y border-border">
        <div className="container max-w-5xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Prompts for every part of your business
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Whether you're writing emails, running ads, or planning next quarter - there's a tested prompt ready to go.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROMPT_CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center`}>
                    <cat.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {cat.count} prompts
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{cat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="h-11">
              <Link to="/library">
                Browse all categories <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="container max-w-4xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Three steps to better AI output
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Find your prompt",
              desc: "Search by category, tool, or use case. Every prompt is tagged with the AI platform it works best on.",
              icon: Search,
            },
            {
              step: "2",
              title: "Copy and customise",
              desc: "Replace the [bracketed placeholders] with your specifics. Product name, audience, tone - make it yours.",
              icon: PenTool,
            },
            {
              step: "3",
              title: "Paste and run",
              desc: "Drop it into ChatGPT, Claude, Gemini, or any AI tool. Get professional-grade output every time.",
              icon: Sparkles,
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-primary">{item.step}</span>
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ APAC CALLOUT ═══════════════ */}
      <section className="bg-hero text-white">
        <div className="container max-w-4xl mx-auto px-4 py-20 md:py-24">
          <div className="text-center">
            <Globe className="h-8 w-8 text-accent mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Built for Asia-Pacific businesses
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-4 leading-relaxed">
              Over a million professionals across APAC are searching for better AI prompts. PromptAndGo is the only library that understands the business context of Southeast Asia and Australia.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-10 text-white/50 text-sm">
              {["🇸🇬 Singapore", "🇲🇾 Malaysia", "🇮🇩 Indonesia", "🇻🇳 Vietnam", "🇦🇺 Australia"].map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
              {[
                { label: "Local business context", desc: "Prompts reference APAC markets, not just US examples" },
                { label: "Cultural nuance", desc: "Tone and messaging adapted for Southeast Asian audiences" },
                { label: "Multi-platform", desc: "Optimised for ChatGPT, Claude, Gemini, and 9 more tools" },
              ].map((item) => (
                <div key={item.label} className="text-left bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-sm font-medium text-white/90">{item.label}</span>
                  </div>
                  <p className="text-xs text-white/50 ml-6">{item.desc}</p>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/90 h-12 px-8 text-base">
              <Link to="/market-insights">
                See the market data <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════ POWER PACKS UPSELL ═══════════════ */}
      <section className="container max-w-4xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Want a head start? Grab a Power Pack.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Curated bundles of 50-100 prompts for specific business functions. One purchase, lifetime access.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {[
            {
              icon: Megaphone,
              title: "Marketing Pack",
              prompts: "100 prompts",
              desc: "Email campaigns, ad copy, content calendars, SEO, and social media. Everything a small marketing team needs.",
            },
            {
              icon: TrendingUp,
              title: "Sales Pack",
              prompts: "75 prompts",
              desc: "Cold outreach, follow-ups, proposals, negotiation scripts, and CRM automation. Close more, faster.",
            },
            {
              icon: Briefcase,
              title: "Founder Pack",
              prompts: "80 prompts",
              desc: "Business plans, pitch decks, hiring, SOPs, competitor analysis, and investor comms. Built for founders.",
            },
          ].map((pack) => (
            <Link
              key={pack.title}
              to="/packs"
              className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <pack.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{pack.title}</h3>
              <span className="text-xs text-accent font-medium">{pack.prompts}</span>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">{pack.desc}</p>
              <span className="inline-flex items-center text-sm font-medium text-primary mt-4 group-hover:gap-2 transition-all">
                View pack <ArrowRight className="h-4 w-4 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="bg-hero text-white">
        <div className="container max-w-3xl mx-auto px-4 py-20 md:py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Your business deserves better AI output.
          </h2>
          <p className="text-white/60 mb-8 text-lg">
            Join thousands of APAC business owners already using PromptAndGo. Start for free, right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/90 h-12 px-8 text-base">
              <Link to="/library">
                <Search className="h-4 w-4 mr-2" />
                Browse 3,000+ Prompts
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/50 !text-white hover:bg-white/20 h-12 px-8 text-base bg-white/10">
              <Link to="/optimize">
                <Zap className="h-4 w-4 mr-2" />
                Try the Optimizer
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SmallBusiness;
