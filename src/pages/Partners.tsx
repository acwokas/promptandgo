import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const TECH_PARTNERS = [
  { name: "SakuraAI", country: "Japan", flag: "🇯🇵", desc: "Leading Japanese NLP engine powering keigo-aware prompt generation." },
  { name: "HangulTech", country: "South Korea", flag: "🇰🇷", desc: "Korean language AI specializing in honorific detection and formal register." },
  { name: "DragonNLP", country: "China", flag: "🇨🇳", desc: "Advanced Chinese NLP for simplified and traditional character processing." },
  { name: "SiamPrompt", country: "Thailand", flag: "🇹🇭", desc: "Thai tone-mark-aware AI for culturally accurate prompt optimization." },
];

const LANG_PARTNERS = [
  { name: "Tokyo Linguistics Institute", country: "Japan", flag: "🇯🇵", desc: "Academic partnership for Japanese language research and keigo accuracy validation." },
  { name: "Seoul Language Lab", country: "South Korea", flag: "🇰🇷", desc: "Korean linguistics research center providing jondaetmal and banmal expertise." },
  { name: "Beijing NLP Center", country: "China", flag: "🇨🇳", desc: "Mandarin computational linguistics lab focused on cross-dialect prompt optimization." },
  { name: "Bangkok Translation Hub", country: "Thailand", flag: "🇹🇭", desc: "Thai language services center specializing in tonal accuracy and script rendering." },
];

const INTEGRATION_PARTNERS = [
  { name: "AsiaCloud", country: "Singapore", flag: "🇸🇬", desc: "Cloud infrastructure provider optimized for low-latency AI across APAC regions." },
  { name: "PacificAPI", country: "Australia", flag: "🇦🇺", desc: "API gateway service with edge nodes across 12 Asian countries." },
  { name: "OrientDev", country: "Vietnam", flag: "🇻🇳", desc: "Developer tools platform supporting Asian language IDEs and code editors." },
  { name: "MekongData", country: "Cambodia", flag: "🇰🇭", desc: "Data processing infrastructure for Southeast Asian language datasets." },
];

const TIERS = [
  { name: "Bronze", color: "text-amber-600", features: ["Logo on partners page", "Newsletter mention", "Community access"] },
  { name: "Silver", color: "text-gray-400", features: ["All Bronze benefits", "Co-branded content", "API integration support", "Quarterly review"] },
  { name: "Gold", color: "text-yellow-400", features: ["All Silver benefits", "Featured case study", "Priority API access", "Joint go-to-market", "Dedicated support"] },
];

const TESTIMONIALS = [
  { quote: "PromptAndGo's API transformed how we handle Japanese NLP — keigo accuracy improved by 40%.", author: "Takeshi Yamamoto", company: "SakuraAI", flag: "🇯🇵" },
  { quote: "The Korean honorific templates are the most accurate we've seen in any AI platform.", author: "Park Min-ji", company: "Seoul Language Lab", flag: "🇰🇷" },
  { quote: "Integrating with PromptAndGo reduced our localization costs across 8 APAC markets.", author: "Li Wei", company: "AsiaCloud", flag: "🇸🇬" },
];

function PartnerCard({ name, country, flag, desc }: { name: string; country: string; flag: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-2xl mb-4">{flag}</div>
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-xs text-muted-foreground mb-2">{flag} {country}</p>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <button className="text-sm text-primary mt-3 hover:underline inline-flex items-center gap-1">Learn More <ArrowRight className="h-3 w-3" /></button>
    </div>
  );
}

const Partners = () => {
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const t = TESTIMONIALS[testimonialIdx];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Partners | PromptAndGo" description="Explore PromptAndGo's technology, language, and integration partners across Asia." canonical="/partners" />

      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Partners</h1>
          <p className="text-muted-foreground text-lg">パートナー | 파트너 | 合作伙伴 | พันธมิตร | Đối tác</p>
        </div>
      </section>

      {/* Technology Partners */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Technology Partners</h2>
          <p className="text-muted-foreground mb-8">AI and NLP technology companies powering our platform</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TECH_PARTNERS.map((p) => <PartnerCard key={p.name} {...p} />)}
          </div>
        </div>
      </section>

      {/* Language Partners */}
      <section className="py-12 px-4 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Language Partners</h2>
          <p className="text-muted-foreground mb-8">Academic and research institutions ensuring linguistic accuracy</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LANG_PARTNERS.map((p) => <PartnerCard key={p.name} {...p} />)}
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Integration Partners</h2>
          <p className="text-muted-foreground mb-8">Infrastructure and developer tools supporting our ecosystem</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INTEGRATION_PARTNERS.map((p) => <PartnerCard key={p.name} {...p} />)}
          </div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="h-8 w-8 text-primary mx-auto mb-4 opacity-50" />
          <blockquote className="text-lg italic mb-4 min-h-[60px] transition-opacity">"{t.quote}"</blockquote>
          <p className="font-semibold">{t.flag} {t.author}</p>
          <p className="text-sm text-muted-foreground">{t.company}</p>
          <div className="flex justify-center gap-2 mt-4">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTestimonialIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === testimonialIdx ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Become a Partner</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {TIERS.map((tier) => (
              <div key={tier.name} className="rounded-xl border border-border bg-card p-6 text-center">
                <h3 className={`text-xl font-bold mb-4 ${tier.color}`}>{tier.name}</h3>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  {tier.features.map((f) => <li key={f}>✓ {f}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/contact">
              <Button size="lg" className="gap-2">Apply to Partner <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
