import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Star, Quote, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  country: string;
  flag: string;
  lang: string;
  quote: string;
  rating: number;
  initials: string;
  color: string;
}

const ALL: Testimonial[] = [
  { name: "Yuki Tanaka", role: "Marketing Lead", company: "Nikkei Digital", country: "Japan", flag: "🇯🇵", lang: "Japanese", quote: "PromptAndGo's keigo engine transformed our B2B outreach. Every email now carries the exact level of formality our clients expect — no awkward phrasing.", rating: 5, initials: "YT", color: "bg-rose-600" },
  { name: "Haruto Sato", role: "Content Strategist", company: "Tokyo Creative", country: "Japan", flag: "🇯🇵", lang: "Japanese", quote: "We cut our Japanese content production time by 60%. The cultural context awareness means we never accidentally send something tone-deaf.", rating: 5, initials: "HS", color: "bg-pink-600" },
  { name: "Jihye Park", role: "Brand Manager", company: "Seoul Brands", country: "Korea", flag: "🇰🇷", lang: "Korean", quote: "Korean honorifics are notoriously tricky for AI. PromptAndGo nails the 존댓말/반말 distinction every time — our social media engagement jumped 40%.", rating: 5, initials: "JP", color: "bg-blue-600" },
  { name: "Minjun Lee", role: "Screenwriter", company: "K-Story Studio", country: "Korea", flag: "🇰🇷", lang: "Korean", quote: "I use it to generate K-drama dialogue drafts. The emotional nuance in Korean is incredible — my producers thought I'd hired a native dialogue coach.", rating: 4, initials: "ML", color: "bg-indigo-600" },
  { name: "Wei Chen", role: "Technical Writer", company: "Shenzhen Tech", country: "China", flag: "🇨🇳", lang: "Mandarin", quote: "The Mandarin technical documentation prompts are outstanding. Accurate 简体/繁体 switching and proper industry terminology every time.", rating: 5, initials: "WC", color: "bg-red-600" },
  { name: "Mei Lin", role: "Poetry Editor", company: "Beijing Literary", country: "China", flag: "🇨🇳", lang: "Mandarin", quote: "I tested it with classical Chinese poetry structures. The AI understood 平仄 tonal patterns and produced genuinely beautiful verses.", rating: 5, initials: "ML", color: "bg-amber-600" },
  { name: "Somchai Prasert", role: "Digital Marketing", company: "BKK Digital", country: "Thailand", flag: "🇹🇭", lang: "Thai", quote: "Thai tonal accuracy is everything — one wrong tone changes the entire meaning. PromptAndGo gets it right consistently, even with ราชาศัพท์.", rating: 4, initials: "SP", color: "bg-orange-600" },
  { name: "Anong Wattana", role: "Food Blogger", company: "Thai Taste Media", country: "Thailand", flag: "🇹🇭", lang: "Thai", quote: "My Thai cooking content used to take hours to localize. Now I generate culturally authentic recipe descriptions in minutes.", rating: 5, initials: "AW", color: "bg-yellow-600" },
  { name: "Minh Tran", role: "Sales Director", company: "HCMC Commerce", country: "Vietnam", flag: "🇻🇳", lang: "Vietnamese", quote: "Vietnamese business communication requires very specific formality levels. PromptAndGo handles anh/chị/em distinctions perfectly for our B2B emails.", rating: 5, initials: "MT", color: "bg-emerald-600" },
  { name: "Linh Nguyen", role: "Literary Translator", company: "Saigon Books", country: "Vietnam", flag: "🇻🇳", lang: "Vietnamese", quote: "The literary Vietnamese output stunned me. It captures the poetic rhythm of tiếng Việt that most AI tools completely miss.", rating: 4, initials: "LN", color: "bg-teal-600" },
  { name: "Budi Santoso", role: "Corp Communications", company: "Jakarta Media Group", country: "Indonesia", flag: "🇮🇩", lang: "Indonesian", quote: "Formal Bahasa Indonesia for government communications is challenging. PromptAndGo produces perfectly formal documents that pass compliance review.", rating: 5, initials: "BS", color: "bg-cyan-600" },
  { name: "Putri Dewi", role: "Cultural Consultant", company: "Nusantara Creative", country: "Indonesia", flag: "🇮🇩", lang: "Indonesian", quote: "I was blown away when it correctly handled Javanese cultural references in prompts. The cultural awareness goes beyond just language translation.", rating: 5, initials: "PD", color: "bg-violet-600" },
];

const COUNTRIES = ["All", "Japan", "Korea", "China", "Thailand", "Vietnam", "Indonesia"];

const STATS = [
  { label: "Prompts Generated", value: 50000 },
  { label: "Asian Languages", value: 12 },
  { label: "Average Rating", value: 4.8 },
  { label: "User Satisfaction", value: 98 },
];

function useCountUp(target: number, active: boolean): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame: number;
    const dur = 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setVal(Math.round(target * p));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);
  return val;
}

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < count ? "text-primary fill-primary" : "text-white/20"}`} />
    ))}
  </div>
);

const Testimonials = () => {
  const [filter, setFilter] = useState("All");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const filtered = filter === "All" ? ALL : ALL.filter((t) => t.country === filter);
  const featured = ALL[0];

  const s0 = useCountUp(STATS[0].value, statsVisible);
  const s1 = useCountUp(STATS[1].value, statsVisible);
  const s2 = useCountUp(STATS[2].value * 10, statsVisible);
  const s3 = useCountUp(STATS[3].value, statsVisible);
  const statVals = [s0.toLocaleString() + "+", String(s1), (s2 / 10).toFixed(1), s3 + "%"];

  return (
    <>
      <SEO
        title="Testimonials — PromptAndGo | Asian Language Users"
        description="See what 50,000+ users across Asia say about PromptAndGo's AI prompt optimizer for Japanese, Mandarin, Korean, Thai, Vietnamese, and Indonesian."
        canonical="https://promptandgo.ai/testimonials"
      />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-hero">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
          </div>
          <div className="relative z-10 container max-w-4xl mx-auto px-4 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
            <Quote className="h-10 w-10 text-primary mx-auto mb-4 animate-fade-in" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-4">
              What Asian Language Users Say
            </h1>
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              Real stories from prompt engineers across Japan, Korea, China, Thailand, Vietnam &amp; Indonesia
            </p>
          </div>
        </section>

        {/* Featured */}
        <section className="bg-hero pb-12">
          <div className="container max-w-3xl mx-auto px-4">
            <div className="rounded-2xl border border-primary/30 bg-white/5 backdrop-blur-md p-8 md:p-10">
              <Stars count={featured.rating} />
              <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mt-4 mb-6">
                "{featured.quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${featured.color} flex items-center justify-center text-white font-bold`}>
                  {featured.initials}
                </div>
                <div>
                  <p className="text-white font-semibold">{featured.name} <span className="ml-1">{featured.flag}</span></p>
                  <p className="text-white/50 text-sm">{featured.role}, {featured.company}</p>
                </div>
                <span className="ml-auto text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">Verified User</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section ref={statsRef} className="py-12 bg-muted/30 border-y border-border">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {STATS.map((s, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-4xl font-black text-primary">{statVals[i]}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter + Grid */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 flex-wrap mb-10">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {COUNTRIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    filter === c
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((t, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors">
                  <Stars count={t.rating} />
                  <p className="text-foreground text-sm leading-relaxed mt-3 mb-5 line-clamp-4">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {t.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{t.name} {t.flag}</p>
                      <p className="text-xs text-muted-foreground truncate">{t.role}, {t.company}</p>
                    </div>
                    <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full whitespace-nowrap">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Share CTA */}
        <section className="bg-hero py-16 md:py-20">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Share Your Story</h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              Love using PromptAndGo for your Asian language projects? We'd love to hear from you.
            </p>
            <Button asChild size="lg" className="h-12 px-8 bg-white text-gray-900 hover:bg-white/90 font-semibold">
              <Link to="/contact">Submit Your Testimonial</Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Testimonials;
