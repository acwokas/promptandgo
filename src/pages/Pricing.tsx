import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import {
  Check, X, Sparkles, Zap, Building2, Crown,
  ChevronDown, Globe
} from "lucide-react";
import { useState } from "react";

const FAQS = [
  { q: "Can I switch plans anytime?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle. No penalties or lock-in periods." },
  { q: "Is there a free trial?", a: "Our Free plan lets you experience core features indefinitely with 10 optimizations per day. When you upgrade to Pro, you get a 7-day money-back guarantee." },
  { q: "Do you offer refunds?", a: "We offer a 7-day money-back guarantee on Pro plans. If you're not satisfied within the first 7 days, contact us for a full refund. After 7 days, we prorate any remaining time." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for Enterprise plans. Payments are processed securely via Stripe." },
  { q: "Do you offer student/nonprofit discounts?", a: "Yes! Students get 50% off Pro plans with a valid .edu email. Nonprofits serving Asian communities can apply for our community program. Contact us for details." },
];

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [annual, setAnnual] = useState(false);

  const proPrice = annual ? "$15" : "$19";
  const proPeriod = annual ? "/month, billed annually" : "/month";
  const proAnnualNote = annual ? "Save 20% — $180/year" : "$190/year (save 20%)";

  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Get started with core optimization across the top 3 global platforms.",
      popular: false,
      cta: "Get Started",
      ctaLink: "/auth?mode=signup",
      icon: Zap,
      ctaStyle: "outline" as const,
      features: [
        { text: "10 prompt optimizations / day", included: true },
        { text: "Access to 50+ free prompts", included: true },
        { text: "Basic platforms (ChatGPT, Claude, Gemini)", included: true },
        { text: "Community support", included: true },
        { text: "1 saved prompt collection", included: true },
        { text: "Asian AI platforms", included: false },
        { text: "Multi-language with cultural context", included: false },
        { text: "Prompt history & analytics", included: false },
      ],
    },
    {
      name: "Pro",
      price: proPrice,
      period: proPeriod,
      description: "Unlock the full Asian AI ecosystem. Every platform, every language, every culture.",
      popular: true,
      cta: "Start Free Trial",
      ctaLink: "/auth?mode=signup",
      icon: Crown,
      ctaStyle: "default" as const,
      annualNote: proAnnualNote,
      features: [
        { text: "Unlimited optimizations", included: true },
        { text: "Access to all 150+ prompts", included: true },
        { text: "All 12 platform optimizations", included: true },
        { text: "Priority email support", included: true },
        { text: "Unlimited saved collections", included: true },
        { text: "Prompt history & analytics", included: true },
        { text: "Advanced tone/formality controls", included: true },
        { text: "Asian language priority", included: true },
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
      ctaStyle: "outline" as const,
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Custom prompt packs", included: true },
        { text: "Team collaboration", included: true },
        { text: "API access", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Custom AI model training", included: true },
        { text: "SLA guarantee", included: true },
        { text: "SSO & advanced security", included: true },
      ],
    },
  ];

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
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-lg text-white/60 max-w-xl mx-auto mb-8">
                Start free, upgrade when you're ready
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
        <section className="relative bg-hero pb-24 md:pb-32">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {tiers.map((tier) => {
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
                        tier.popular ? "bg-gradient-to-br from-primary to-accent" : "bg-white/10"
                      }`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-4xl font-black text-white">{tier.price}</span>
                        {tier.period && (
                          <span className="text-white/50 text-sm">{tier.period}</span>
                        )}
                      </div>
                      {"annualNote" in tier && tier.annualNote && (
                        <p className="text-xs text-accent mb-2">{tier.annualNote}</p>
                      )}
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

        {/* Social proof */}
        <section className="py-12 bg-muted/30 border-y border-border">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground mb-6">Trusted by 500+ companies across Asia</p>
            <div className="flex items-center justify-center gap-8 flex-wrap opacity-40">
              {["Grab", "Shopee", "Tokopedia", "LINE", "Gojek", "Razorpay"].map((name) => (
                <span key={name} className="text-lg font-bold text-foreground">{name}</span>
              ))}
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
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-semibold text-foreground text-sm md:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
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
              Not sure which plan? Talk to our team
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              We'll help you find the right plan for your team and use case.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="h-12 px-8 bg-white text-gray-900 hover:bg-white/90 font-semibold">
                <Link to="/contact">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Contact Us
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
