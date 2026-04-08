import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { PageSchema } from "@/components/seo/PageSchema";
import { Button } from "@/components/ui/button";
import { Globe, Heart, Shield, Users, ArrowRight, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MILESTONES = [
  { date: "Jan 2024", jp: "2024年1月", title: "Founded in Singapore", desc: "PromptAndGo launched to bridge AI and Asian languages." },
  { date: "Apr 2024", jp: "2024年4月", title: "Japanese Support Launched", desc: "Full keigo and casual Japanese prompt templates released." },
  { date: "Jul 2024", jp: "2024年7月", title: "Korean Templates Added", desc: "Jondaetmal and banmal prompt systems for Korean users." },
  { date: "Oct 2024", jp: "2024年10月", title: "Southeast Asia Expansion", desc: "Thai, Vietnamese, and Indonesian prompt packs launched." },
  { date: "Jan 2025", jp: "2025年1月", title: "12 Languages Supported", desc: "Hindi, Tagalog, Bengali, Khmer, Tamil, and Malay added." },
  { date: "Jun 2025", jp: "2025年6月", title: "AI Studio & Scout Launch", desc: "Interactive prompt builder and AI assistant Scout released." },
  { date: "Oct 2025", jp: "2025年10月", title: "Enterprise Tier Launch", desc: "Custom solutions for Asian enterprises and government agencies." },
  { date: "Mar 2026", jp: "2026年3月", title: "1 Million Prompts Generated", desc: "Community milestone — 1M+ prompts created across 15 countries." },
];

const TEAM = [
  { name: "Arjun Mehta", native: "अर्जुन मेहता", title: "Founder & CEO", city: "Singapore", flag: "🇸🇬", bio: "Former product lead at a Southeast Asian super-app. Expert in multilingual AI deployment." },
  { name: "Yuki Tanaka", native: "田中 ゆき", title: "Head of Linguistics", city: "Tokyo", flag: "🇯🇵", bio: "Computational linguist specializing in CJK processing and keigo nuance detection." },
  { name: "Kim Soo-jin", native: "김수진", title: "Korean Language Lead", city: "Seoul", flag: "🇰🇷", bio: "Korean NLP researcher with expertise in honorific systems and formal register." },
  { name: "Somchai Rattana", native: "สมชาย รัตนา", title: "Growth & Partnerships", city: "Bangkok", flag: "🇹🇭", bio: "Built growth engines for APAC SaaS companies across 8 Asian markets." },
  { name: "Nguyen Minh Trang", native: "Nguyễn Minh Trang", title: "Content Director", city: "Ho Chi Minh City", flag: "🇻🇳", bio: "Multilingual content strategist fluent in Vietnamese, English, and Mandarin." },
  { name: "Rina Wijaya", native: "Rina Wijaya", title: "Engineering Lead", city: "Jakarta", flag: "🇮🇩", bio: "Full-stack engineer specializing in real-time translation and IME integration." },
];

const VALUES = [
  { icon: Globe, title: "Language First", desc: "Every feature starts with language. We build for CJK, Thai script, Devanagari, and beyond — never as an afterthought." },
  { icon: Heart, title: "Cultural Sensitivity", desc: "We respect honorifics, formality levels, and regional nuances that make each Asian language unique." },
  { icon: Shield, title: "AI Ethics", desc: "Responsible AI usage with transparent data handling, especially for sensitive cultural and linguistic content." },
  { icon: Users, title: "Community Driven", desc: "Our roadmap is shaped by users across 15 Asian countries, ensuring every voice is heard." },
];

const STATS = [
  { label: "Languages", value: 12 },
  { label: "Users", value: 50000, suffix: "+" },
  { label: "Prompts Generated", value: 1000000, suffix: "+" },
  { label: "Asian Countries", value: 15 },
];

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const formatted = count >= 1000000
    ? `${(count / 1000000).toFixed(count >= target ? 0 : 1)}M`
    : count >= 1000
    ? `${(count / 1000).toFixed(count >= target ? 0 : 1)}K`
    : count.toLocaleString();

  return <span ref={ref}>{formatted}{suffix}</span>;
}

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="About PromptAndGo | AI Prompts Built for Asia"
        description="PromptAndGo bridges AI and Asian languages. Learn our mission, meet our team across Tokyo, Seoul, Singapore, Bangkok, and more."
        canonical="/about"
      />
      <PageSchema
        type="AboutPage"
        name="About PromptAndGo"
        description="The only AI prompt optimization tool built specifically for Asia."
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
      />

      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About PromptAndGo</h1>
          <p className="text-muted-foreground text-lg mb-2">
            私たちについて | 회사 소개 | 关于我们 | เกี่ยวกับเรา
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
              Bridging AI and Asian Languages
            </span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Most AI tools are built for English speakers. PromptAndGo is the only prompt optimization platform designed from the ground up for Asia's diverse languages, scripts, and cultural contexts — from Japanese keigo to Thai tonal nuance.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />
            {MILESTONES.map((m, i) => (
              <div key={i} className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className={`hidden md:block flex-1 ${i % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                  <span className="text-xs text-muted-foreground">{m.date} · {m.jp}</span>
                  <h3 className="text-lg font-semibold mt-1">{m.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                </div>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background z-10 mt-1.5" />
                <div className="md:hidden flex-1 pl-10">
                  <span className="text-xs text-muted-foreground">{m.date} · {m.jp}</span>
                  <h3 className="text-lg font-semibold mt-1">{m.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                </div>
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Our Team</h2>
          <p className="text-center text-muted-foreground mb-12">Experts across Asia building the future of multilingual AI</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-4">
                  {member.flag}
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.native}</p>
                <p className="text-sm text-primary font-medium mt-1">{member.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {member.city}
                </p>
                <p className="text-sm text-muted-foreground mt-3">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6 text-center hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center p-6 rounded-xl border border-border bg-card">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  <CountUp target={s.value} suffix={s.suffix} />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Join Our Team</h2>
          <p className="text-muted-foreground mb-6">
            We're looking for passionate people who believe AI should work for every language.
          </p>
          <Link to="/contact">
            <Button size="lg" className="gap-2">
              Get in Touch <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
