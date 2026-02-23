import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight, Zap, TrendingUp, Users, Target,
  FileText, BarChart3, Globe, Rocket, Sparkles,
  MessageSquare, PresentationIcon,
} from "lucide-react";

const SingaporeStartups = () => {
  return (
    <>
      <SEO
        title="AI Prompts for Singapore Startups | PromptAndGo"
        description="Ready-to-use AI prompts built for Singapore founders. Pitch decks, GTM strategy, competitor analysis, social media, and more. Free prompt optimiser included."
        canonical="https://promptandgo.ai/singapore-startups"
        keywords="Singapore startups AI, prompt engineering Singapore, AI tools startups, ChatGPT prompts business"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] right-[10%] w-[500px] h-[500px] rounded-full bg-red-500/15 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[10%] w-[400px] h-[400px] rounded-full bg-primary/20 blur-[100px]" />
        </div>
        <div className="relative z-10 container max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-300 px-4 py-1.5 rounded-full text-sm mb-6">
            🇸🇬 Built for Singapore
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            AI prompts built for
            <span className="text-gradient-brand block">Singapore startups.</span>
          </h1>
          <p className="text-white/60 mt-5 text-lg max-w-xl mx-auto">
            Stop guessing. Use tested prompts for pitching, marketing, hiring, and growing your startup. Optimised for the Southeast Asian market.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/90 h-12 px-8">
              <Link to="/optimize">
                <Zap className="h-4 w-4 mr-2" />
                Try the Optimiser Free
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 px-8">
              <Link to="/library">
                Browse Startup Prompts
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Market data */}
      <section className="border-b border-border bg-muted/30">
        <div className="container max-w-5xl mx-auto px-4 py-12">
          <p className="text-center text-xs text-muted-foreground mb-6 uppercase tracking-widest">Singapore market data</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "50,625", label: "AI-active professionals", icon: Users },
              { num: "24.9%", label: "Startup whitespace", icon: Target },
              { num: "62.7%", label: "Automation demand", icon: TrendingUp },
              { num: "42.5%", label: "Seeking certification", icon: Sparkles },
            ].map((stat) => (
              <div key={stat.label}>
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold">{stat.num}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">Source: SQREEM market intelligence, 2025</p>
        </div>
      </section>

      {/* Use cases */}
      <section className="container max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Prompts for every stage of your startup
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            From first pitch to Series A. Each prompt is tested and ready to copy into ChatGPT, Claude, or any AI tool.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: PresentationIcon,
              title: "Investor Pitch",
              desc: "Craft compelling pitch decks, executive summaries, and one-pagers that Singapore VCs actually want to read.",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: Rocket,
              title: "Go-to-Market",
              desc: "Build GTM strategies for SEA markets. Localised messaging, channel selection, and launch timelines.",
              gradient: "from-violet-500 to-purple-500",
            },
            {
              icon: BarChart3,
              title: "Competitor Analysis",
              desc: "Map your competitive landscape. SWOT frameworks, positioning matrices, and differentiation strategies.",
              gradient: "from-amber-500 to-orange-500",
            },
            {
              icon: MessageSquare,
              title: "Social Media",
              desc: "LinkedIn thought leadership, Instagram content, and TikTok hooks designed for the SEA audience.",
              gradient: "from-pink-500 to-rose-500",
            },
            {
              icon: Users,
              title: "Customer Discovery",
              desc: "Interview scripts, survey designs, and persona builders. Understand your customers before you build.",
              gradient: "from-emerald-500 to-green-500",
            },
            {
              icon: FileText,
              title: "Financial Models",
              desc: "Revenue projections, unit economics, and burn rate calculations. Impress investors with the numbers.",
              gradient: "from-cyan-500 to-blue-500",
            },
          ].map((item) => (
            <Link
              key={item.title}
              to="/library"
              className="group rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4`}>
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              <span className="inline-flex items-center text-xs font-medium text-primary mt-4 group-hover:gap-1.5 transition-all">
                Browse prompts <ArrowRight className="h-3 w-3 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 border-y border-border">
        <div className="container max-w-4xl mx-auto px-4 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Pick a prompt", desc: "Browse by category or search for what you need. Every prompt is free to copy." },
              { step: "2", title: "Customise it", desc: "Fill in the brackets with your startup details. Or paste it into the optimiser for Scout to improve." },
              { step: "3", title: "Get results", desc: "Copy into ChatGPT, Claude, or your preferred AI tool. Get professional-quality output in seconds." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multilingual */}
      <section className="container max-w-4xl mx-auto px-4 py-16 md:py-20">
        <div className="flex gap-4 p-6 rounded-xl border border-border bg-card">
          <Globe className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2">Works in any language</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Write your prompts in English, Mandarin, Bahasa, Malay, or any language. Scout optimises in your original language, making it perfect for Singapore's multilingual business environment.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-hero text-white">
        <div className="container max-w-3xl mx-auto px-4 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Ready to move faster with AI?
          </h2>
          <p className="text-white/60 mb-8">
            Free to use. No signup needed. Built for founders who ship.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/90 h-12 px-8">
              <Link to="/optimize">
                <Zap className="h-4 w-4 mr-2" />
                Start Optimising
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 px-8">
              <Link to="/library">
                Browse All Prompts
              </Link>
            </Button>
          </div>
          <p className="text-white/30 text-xs mt-6">
            Built by Adrian Watkins, founder of AIinAsia.com
          </p>
        </div>
      </section>
    </>
  );
};

export default SingaporeStartups;
