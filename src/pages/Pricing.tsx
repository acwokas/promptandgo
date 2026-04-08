import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import {
  Check, X, Sparkles, Zap, Building2, Crown,
  ChevronDown, Globe, Bot, Shield
} from "lucide-react";
import { useState } from "react";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with core optimization across the top 3 global platforms.",
    popular: false,
    cta: "Start Free",
    ctaLink: "/auth?mode=signup",
    icon: Zap,
    features: [
      { text: "5 prompt optimizations per day", included: true },
      { text: "3 platforms (ChatGPT, Claude, Gemini)", included: true },
      { text: "English language only", included: true },
      { text: "Basic optimization engine", included: true },
      { text: "Community prompts library", included: true },
      { text: "Asian AI platforms (DeepSeek, Qwen, Ernie)", included: false },
      { text: "Multi-language with cultural context", included: false },
      { text: "Advanced optimization with Asian context", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "Unlock the full Asian AI ecosystem. Every platform, every language, every culture.",
    popular: true,
    cta: "Go Pro",
    ctaLink: "/auth?mode=signup",
    icon: Crown,
    features: [
      { text: "Unlimited prompt optimizations", included: true },
      { text: "All global platforms (ChatGPT, Claude, Gemini, Copilot, MidJourney, Stable Diffusion)", included: true },
      { text: "Asian AI platforms (DeepSeek, Qwen, Ernie, Baidu)", included: true },
      { text: "10+ languages including CJK, Bahasa, Thai, Vietnamese, Hindi", included: true },
      { text: "Advanced optimization with cultural context awareness", included: true },
      { text: "Formality levels, honorifics, and regional business context", included: true },
      { text: "Full Power Packs library", included: true },
      { text: "Scout AI assistant", included: true },
      { text: "Priority email support", included: true },
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams scaling AI across Asian markets with dedicated support and SLA.",
    popular: false,
    cta: "Contact Sales",
    ctaLink: "/contact",
    icon: Building2,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "API access for workflow integration", included: true },
      { text: "Team management and user roles", included: true },
      { text: "Custom platform integrations", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "99.9% uptime SLA", included: true },
      { text: "Custom prompt templates and training", included: true },
      { text: "SSO and enterprise security", included: true },
      { text: "Invoice billing", included: true },
    ],
  },
];

const FAQS = [
  {
    q: "What makes PromptAndGo different from other prompt tools?",
    a: "We are the only prompt optimization platform built specifically for Asia. While other tools focus on English and Western contexts, we support 10+ Asian languages with deep cultural awareness, optimize for Asian AI platforms like DeepSeek, Qwen, and Ernie, and understand regional business contexts from Shopee to GrabFood to GCash.",
  },
  {
    q: "Which AI platforms do you support?",
    a: "Free users get access to ChatGPT, Claude, and Gemini. Pro users unlock the full ecosystem including DeepSeek, Qwen, Ernie, Baidu, Copilot, MidJourney, Stable Diffusion, and Perplexity. Each platform has unique optimization rules and we tailor prompts accordingly.",
  },
  {
    q: "How does cultural context optimization work?",
    a: "When you enable Asian Context mode, our optimizer adds cultural awareness to your prompts. This includes appropriate formality levels for Japanese business communication, honorifics for Korean contexts, regional business terminology for Southeast Asian markets, and tone adjustments for Mandarin. The result is prompts that feel native, not translated.",
  },
  {
    q: "Can I use PromptAndGo in my language?",
    a: "Yes. Pro users can optimize prompts in English, Mandarin, Japanese, Korean, Bahasa Indonesia, Bahasa Malay, Thai, Vietnamese, Hindi, and Tagalog. We do not just translate prompts. We reconstruct them with cultural nuance so they perform naturally in each language.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "You can start with our Free plan which gives you 5 optimizations per day on three major platforms. This lets you experience the core product before upgrading. When you are ready for the full Asian AI ecosystem, Pro is just $9/month with no long-term commitment.",
  },
];

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SEO
        title="Pricing | PromptAndGo"
        description="Simple pricing for the only AI prompt optimizer built for Asia. Free to start, Pro for full Asian AI ecosystem access."
        canonical="https://promptandgo.ai/pricing"
      />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-hero">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute bottom-[-30%] right-[-5%] w-[400px] h-[400px] rounded-full bg-accent/15 blur-[100px]" />
          </div>

          <div className="relative z-10 container max-w-5xl mx-auto px-4 pt-20 pb-8 md:pt-28 md:pb-12">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 px-4 py-1.5 rounded-full text-sm mb-6">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Simple, transparent pricing
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                One tool. Every platform.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Built for Asia.
                </span>
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Start free. Upgrade when you need the full Asian AI ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="relative bg-hero pb-24 md:pb-32">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {TIERS.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div
                    key={tier.name}
                    className={`relative rounded-2xl border p-8 flex flex-col ${
                      tier.popular
                        ? "border-primary bg-white/10 backdrop-blur-md ring-2 ring-primary/50 shadow-2xl shadow-primary/20"
                        : "border-white/10 bg-white/5 backdrop-blur-sm"
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1.5 rounded-full">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        tier.popular
                          ? "bg-gradient-to-br from-primary to-accent"
                          : "bg-white/10"
                      }`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-4xl font-black text-white">{tier.price}</span>
                        {tier.period && (
                          <span className="text-white/50 text-sm">{tier.period}</span>
                        )}
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">{tier.description}</p>
                    </div>

                    <div className="flex-1 space-y-3 mb-8">
                      {tier.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-3">
                          {f.included ? (
                            <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-4 w-4 text-white/20 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={`text-sm ${f.included ? "text-white/80" : "text-white/30"}`}>
                            {f.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      asChild
                      size="lg"
                      className={`w-full h-12 font-semibold ${
                        tier.popular
                          ? "bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30"
                          : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      }`}
                    >
                      <Link to={tier.ctaLink}>{tier.cta}</Link>
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Pro callout */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-6 py-4">
                <Globe className="h-5 w-5 text-accent" />
                <p className="text-sm text-white/70">
                  <span className="text-white font-semibold">Pro unlocks Asian AI.</span>{" "}
                  DeepSeek, Qwen, Ernie, and 10+ languages with cultural context awareness.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container max-w-3xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Frequently asked questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about PromptAndGo.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-semibold text-foreground text-sm md:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-hero py-16 md:py-20">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to optimize for Asia?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Join thousands of APAC professionals getting better results from every AI platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="h-12 px-8 bg-white text-gray-900 hover:bg-white/90 font-semibold">
                <Link to="/auth?mode=signup">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 border-white/50 !text-white hover:bg-white/20 font-semibold bg-white/10">
                <Link to="/optimize">Try the Optimizer</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Pricing;
