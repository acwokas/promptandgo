import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import {
  Check, X, Sparkles, Zap, Building2, Crown,
  ChevronDown, Globe
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const FAQS = [
  { q: "Can I switch plans anytime?", a: "Yes — upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle with no penalties." },
  { q: "Which Asian languages are included?", a: "Pro covers all 12 languages: Japanese, Mandarin, Cantonese, Korean, Hindi, Thai, Vietnamese, Bahasa Indonesia, Bahasa Malay, Tamil, Tagalog, and Khmer. Free includes Japanese, Mandarin, and Korean." },
  { q: "Is there a free trial for Pro?", a: "The Free plan lets you try core features indefinitely. When you upgrade to Pro you get a 14-day money-back guarantee — no questions asked." },
  { q: "Do you offer refunds?", a: "We offer a 14-day money-back guarantee on Pro. Enterprise contracts include custom cancellation terms agreed during onboarding." },
  { q: "Can I add team members?", a: "Team collaboration is available on Enterprise plans. Contact our sales team for volume pricing and shared prompt libraries." },
  { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, Amex, PayPal, Alipay, WeChat Pay, GrabPay, and bank transfer for Enterprise. All payments processed securely via Stripe." },
];

const COMPANIES = [
  "Tokyo Tech Co", "Seoul AI Labs", "Singapore Prompt Studio",
  "Bangkok Digital", "Jakarta Innovation Hub", "Taipei AI Works",
];

const COMPARISON_ROWS: { feature: string; free: string; pro: string; enterprise: string }[] = [
  { feature: "Prompts per day", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Asian languages", free: "3 (JP, ZH, KO)", pro: "All 12", enterprise: "All 12 + custom" },
  { feature: "AI platforms", free: "ChatGPT, Claude, Gemini", pro: "All 10+", enterprise: "All + private models" },
  { feature: "Prompt history", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "Export to PDF", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "Cultural context engine", free: "Basic", pro: "Advanced", enterprise: "Custom-tuned" },
  { feature: "API access", free: "—", pro: "—", enterprise: "✓" },
  { feature: "Team collaboration", free: "—", pro: "—", enterprise: "✓" },
  { feature: "Custom prompt libraries", free: "—", pro: "—", enterprise: "✓" },
  { feature: "Dedicated account manager", free: "—", pro: "—", enterprise: "✓" },
  { feature: "SLA guarantee", free: "—", pro: "—", enterprise: "✓" },
  { feature: "Support", free: "Community", pro: "Priority email", enterprise: "24/7 dedicated" },
];

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [annual, setAnnual] = useState(false);

  const proUSD = annual ? "$7.99" : "$9.99";
  const proJPY = annual ? "¥780" : "¥980";
  const proPeriod = annual ? "/mo billed annually" : "/month";
  const saveBadge = annual ? "Save 20%" : "Save 20% annually";

  const tiers = [
    {
      name: "Free",
      priceMain: "$0",
      priceAlt: "",
      period: "forever",
      description: "Get started with core optimization for 3 Asian languages.",
      popular: false,
      cta: "Get Started Free",
      ctaLink: "/auth?mode=signup",
      icon: Zap,
      features: [
        { text: "5 prompt optimizations / day", ok: true },
        { text: "3 languages (JP, ZH, KO)", ok: true },
        { text: "Basic platforms (ChatGPT, Claude, Gemini)", ok: true },
        { text: "Community support", ok: true },
        { text: "1 saved collection", ok: true },
        { text: "Full Asian language suite", ok: false },
        { text: "Prompt history & export", ok: false },
        { text: "Priority support", ok: false },
      ],
    },
    {
      name: "Pro",
      priceMain: proUSD,
      priceAlt: proJPY + "/月",
      period: proPeriod,
      description: "Unlock every Asian language, every platform, with cultural context intelligence.",
      popular: true,
      cta: "Start 14-Day Free Trial",
      ctaLink: "/auth?mode=signup",
      icon: Crown,
      features: [
        { text: "Unlimited prompt optimizations", ok: true },
        { text: "All 12 Asian languages", ok: true },
        { text: "All 10+ AI platforms", ok: true },
        { text: "Priority email support", ok: true },
        { text: "Unlimited saved collections", ok: true },
        { text: "Prompt history & analytics", ok: true },
        { text: "Export to PDF", ok: true },
        { text: "Advanced tone & formality", ok: true },
      ],
    },
    {
      name: "Enterprise",
      priceMain: "Custom",
      priceAlt: "お問い合わせ",
      period: "",
      description: "For teams scaling AI across Asian markets with SLA and dedicated support.",
      popular: false,
      cta: "Contact Sales",
      ctaLink: "/contact",
      icon: Building2,
      features: [
        { text: "Everything in Pro", ok: true },
        { text: "API access", ok: true },
        { text: "Team collaboration", ok: true },
        { text: "Custom prompt libraries", ok: true },
        { text: "Dedicated account manager", ok: true },
        { text: "Custom AI model training", ok: true },
        { text: "SLA guarantee", ok: true },
        { text: "SSO & advanced security", ok: true },
      ],
    },
  ];

  return (
    <>
      <SEO
        title="Pricing — PromptAndGo | AI Prompt Plans for Asia"
        description="Simple, transparent pricing for the only AI prompt optimizer built for Asian languages. Free to start, Pro for the full 12-language ecosystem."
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
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-4">
                Choose Your PromptAndGo Plan
              </h1>
              <p className="text-lg text-white/60 max-w-xl mx-auto mb-8">
                AI prompt optimization crafted for Asian languages — start free, upgrade when you're ready
              </p>

              {/* Billing toggle */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-1.5 py-1.5">
                <button
                  onClick={() => setAnnual(false)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!annual ? "bg-white text-gray-900" : "text-white/70 hover:text-white"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${annual ? "bg-white text-gray-900" : "text-white/70 hover:text-white"}`}
                >
                  Annual
                  <span className="ml-1.5 text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">-20%</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="relative bg-hero pb-16 md:pb-24">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {tiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div
                    key={tier.name}
                    className={`relative rounded-2xl border p-8 flex flex-col transition-transform hover:scale-[1.02] ${
                      tier.popular
                        ? "border-primary bg-white/10 backdrop-blur-md ring-2 ring-primary/50 shadow-2xl shadow-primary/20"
                        : "border-white/10 bg-white/5 backdrop-blur-sm"
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Recommended
                      </div>
                    )}

                    <div className="mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        tier.popular ? "bg-gradient-to-br from-primary to-accent" : "bg-white/10"
                      }`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                      <div className="flex items-baseline gap-1 mb-0.5">
                        <span className="text-4xl font-black text-white">{tier.priceMain}</span>
                        {tier.period && <span className="text-white/50 text-sm">{tier.period}</span>}
                      </div>
                      {tier.priceAlt && (
                        <p className="text-xs text-accent">{tier.priceAlt}</p>
                      )}
                      {tier.popular && annual && (
                        <span className="inline-block mt-1 text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">{saveBadge}</span>
                      )}
                      <p className="text-sm text-white/60 leading-relaxed mt-2">{tier.description}</p>
                    </div>

                    <div className="flex-1 space-y-3 mb-8">
                      {tier.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-3">
                          {f.ok ? (
                            <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-4 w-4 text-white/20 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={`text-sm ${f.ok ? "text-white/80" : "text-white/30"}`}>{f.text}</span>
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

            {/* Callout */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-6 py-4">
                <Globe className="h-5 w-5 text-accent" />
                <p className="text-sm text-white/70">
                  <span className="text-white font-semibold">Pro unlocks the full Asian AI ecosystem.</span>{" "}
                  DeepSeek, Qwen, Ernie, and 12 languages with cultural context awareness.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10">
              Feature Comparison
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-semibold text-foreground">Feature</th>
                    <th className="p-4 font-semibold text-foreground text-center">Free</th>
                    <th className="p-4 font-semibold text-primary text-center">Pro</th>
                    <th className="p-4 font-semibold text-foreground text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-4 text-foreground font-medium">{row.feature}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.free}</td>
                      <td className="p-4 text-center text-foreground font-medium">{row.pro}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Trusted by */}
        <section className="py-12 bg-muted/30 border-y border-border">
          <div className="container max-w-5xl mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground mb-6">Trusted by teams across Asia</p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {COMPANIES.map((name) => (
                <span
                  key={name}
                  className="px-4 py-2 rounded-full border border-border bg-card text-sm font-semibold text-muted-foreground"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-10 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-semibold text-foreground text-sm md:text-base">{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
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
              Not sure which plan? Talk to our team
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              We'll help you find the right plan for your team and use case across Asian markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="h-12 px-8 bg-white text-gray-900 hover:bg-white/90 font-semibold">
                <Link to="/contact">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Contact Us
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 border-white/50 !text-white hover:bg-white/20 font-semibold bg-white/10">
                <Link to="/optimize">Try the Optimizer Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Pricing;
