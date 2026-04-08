import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { PageSchema } from "@/components/seo/PageSchema";
import { Button } from "@/components/ui/button";
import { Globe, Languages, MapPin, Zap, Users, GraduationCap, Rocket, Code, Heart, Target, Lightbulb, ArrowRight } from "lucide-react";

const platforms = [
  "ChatGPT", "Claude", "Gemini", "DeepSeek", "Qwen", "Ernie Bot", "Copilot", "Perplexity", "MidJourney", "Grok", "Meta AI", "Stable Diffusion"
];

const languages = [
  { flag: "🇬🇧", name: "English" },
  { flag: "🇨🇳", name: "中文" },
  { flag: "🇯🇵", name: "日本語" },
  { flag: "🇰🇷", name: "한국어" },
  { flag: "🇮🇩", name: "Bahasa" },
  { flag: "🇹🇭", name: "ไทย" },
  { flag: "🇻🇳", name: "Tiếng Việt" },
  { flag: "🇮🇳", name: "हिन्दी" },
  { flag: "🇵🇭", name: "Tagalog" },
  { flag: "🇲🇾", name: "Malay" },
  { flag: "🇧🇩", name: "বাংলা" },
  { flag: "🇰🇭", name: "ខ្មែរ" },
  { flag: "🇱🇰", name: "தமிழ்" },
];

const TEAM = [
  { name: "Arjun Mehta", role: "Founder & CEO", location: "Singapore", flag: "🇸🇬", bio: "Former product lead at a Southeast Asian super-app. Saw first-hand how AI tools failed non-English speakers." },
  { name: "Yuki Tanaka", role: "Head of Linguistics", location: "Tokyo", flag: "🇯🇵", bio: "Computational linguist specializing in CJK language processing. Built multilingual NLP systems at scale." },
  { name: "Priya Sharma", role: "Head of Product", location: "Mumbai", flag: "🇮🇳", bio: "Product strategist who shipped AI tools to 50M+ users across India and Southeast Asia." },
  { name: "David Chen", role: "CTO", location: "Taipei", flag: "🇹🇼", bio: "Full-stack engineer and open-source contributor. Previously built real-time translation systems." },
  { name: "Rina Wijaya", role: "Content & Localization Lead", location: "Jakarta", flag: "🇮🇩", bio: "Multilingual content strategist fluent in 4 Asian languages. Ensures every prompt feels native." },
  { name: "Somchai Patel", role: "Growth & Partnerships", location: "Bangkok", flag: "🇹🇭", bio: "Built growth engines for APAC SaaS companies. Connects PromptAndGo with enterprises across the region." },
];

const About = () => {
  return (
    <div className="dark bg-[hsl(240,28%,7%)] text-[hsl(28,76%,97%)] min-h-screen">
      <SEO
        title="About PromptAndGo | Built for Asia, Optimized for Every Platform"
        description="PromptAndGo is the only AI prompt optimization tool built specifically for Asia. Multi-platform, multi-language, culturally aware."
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
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(350,78%,59%,0.15)] via-transparent to-[hsl(174,82%,33%,0.1)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[hsl(350,78%,59%,0.3)] bg-[hsl(350,78%,59%,0.08)] text-sm font-medium text-primary mb-8">
            <MapPin className="w-4 h-4" />
            Asia-First AI Prompt Tool
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Built for Asia.{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Optimized for Every Platform.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[hsl(240,10%,65%)] max-w-2xl mx-auto mb-10 leading-relaxed">
            The world has plenty of prompt tools. None of them understand Asia. We do.
          </p>
          <Button asChild variant="hero" size="lg" className="text-base px-8 py-6 h-auto">
            <Link to="/optimize">Start Optimizing for Free</Link>
          </Button>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-4">Our Origin Story</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
            Born from a frustration shared by billions
          </h2>
          <div className="space-y-6 text-[hsl(240,10%,65%)] text-lg leading-relaxed">
            <p>
              In 2024, our founder Arjun was building AI-powered marketing tools for a Southeast Asian super-app.
              The team used ChatGPT and Claude daily — but every prompt was in English, even when the output
              needed to be in Thai, Bahasa, or Mandarin.
            </p>
            <p>
              The translations felt robotic. The cultural nuances were wrong. A prompt that generated brilliant
              ad copy for an American audience produced awkward, tone-deaf content for a Bangkok audience.
              Formal Japanese prompts came back casual. Indonesian prompts missed local idioms entirely.
            </p>
            <p className="text-[hsl(28,76%,97%)] font-medium text-xl">
              That's when it clicked: the entire prompt engineering ecosystem was built by and for English speakers.
              4.7 billion people in Asia deserved better.
            </p>
            <p>
              PromptAndGo launched as Asia's first prompt optimization platform — purpose-built to understand
              the languages, cultures, and business contexts that make this region unique. Today, we support
              12+ Asian languages across 12 AI platforms, helping professionals across ASEAN, East Asia,
              and South Asia get results that actually resonate with their audiences.
            </p>
          </div>
        </div>
      </section>

      {/* Why Asia Needs PromptAndGo */}
      <section className="py-20 md:py-28 px-4 bg-[hsl(240,25%,10%)]">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Why Asia Needs This</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
            AI tools weren't built for 4.7 billion people
          </h2>
          <div className="space-y-6 text-[hsl(240,10%,65%)] text-lg leading-relaxed">
            <p>
              Most AI prompt tools are built by Western companies, for Western users, in English.
              They assume one language, one cultural context, one way of doing business.
            </p>
            <p>
              But Asia is home to 4.7 billion people speaking dozens of languages, with unique cultural
              contexts, business practices, and communication styles that shape how AI should respond.
            </p>
            <p className="text-[hsl(28,76%,97%)] font-medium text-xl">
              Prompts that work in English often fail in Bahasa, Thai, Japanese, or Hindi.
              Formality that lands in New York falls flat in Tokyo.
              Marketing copy tuned for Amazon misses the mark on Shopee.
            </p>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { stat: "78%", label: "of APAC professionals use AI weekly" },
              { stat: "12+", label: "Asian languages supported" },
              { stat: "12", label: "AI platforms optimized" },
              { stat: "1.9M+", label: "APAC professionals seeking better prompts" },
            ].map((s) => (
              <div key={s.label} className="text-center p-4 rounded-xl border border-[hsl(240,20%,16%)] bg-[hsl(240,28%,7%)]">
                <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">{s.stat}</div>
                <p className="text-xs text-[hsl(240,10%,55%)] leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Our Mission</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 leading-snug">
            Make AI truly accessible across every Asian language and culture
          </h2>
          <p className="text-[hsl(240,10%,65%)] text-lg leading-relaxed">
            We believe that speaking Thai, Vietnamese, Japanese, or Hindi shouldn't mean getting worse AI results.
            Our mission is to ensure that every professional in Asia — regardless of their language — can harness
            AI with the same confidence and quality as English speakers. We're building the bridge between
            the world's most powerful AI tools and the world's most diverse region.
          </p>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="py-20 md:py-28 px-4 bg-[hsl(240,25%,10%)]">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-4 text-center">Our Solution</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">
            Three pillars. Zero compromise.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-[hsl(240,20%,16%)] bg-[hsl(240,28%,7%)] p-8 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Platform Optimization</h3>
              <p className="text-[hsl(240,10%,65%)] mb-6 leading-relaxed">
                One prompt, perfectly optimized for any AI platform. Each model has different
                strengths and prompting styles. We handle the translation.
              </p>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <span key={p} className="text-xs px-3 py-1.5 rounded-full bg-[hsl(240,20%,16%)] text-[hsl(240,10%,65%)] border border-[hsl(240,20%,20%)]">{p}</span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[hsl(240,20%,16%)] bg-[hsl(240,28%,7%)] p-8 hover:border-accent/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Languages className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Any Language, Any Culture</h3>
              <p className="text-[hsl(240,10%,65%)] mb-6 leading-relaxed">
                12+ Asian languages with cultural awareness baked in. Not just translation.
                True localization with proper tone, formality, and context.
              </p>
              <div className="flex flex-wrap gap-2">
                {languages.map((l) => (
                  <span key={l.name} className="text-xs px-3 py-1.5 rounded-full bg-[hsl(240,20%,16%)] text-[hsl(240,10%,65%)] border border-[hsl(240,20%,20%)]">{l.flag} {l.name}</span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[hsl(240,20%,16%)] bg-[hsl(240,28%,7%)] p-8 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Asian Context Awareness</h3>
              <p className="text-[hsl(240,10%,65%)] mb-6 leading-relaxed">
                Understands local business contexts that generic tools miss entirely.
                From Shopee product listings to GrabFood menus to GCash fintech flows.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Shopee", "Lazada", "Grab", "Gojek", "GCash", "Tokopedia", "LINE", "WeChat"].map((b) => (
                  <span key={b} className="text-xs px-3 py-1.5 rounded-full bg-[hsl(240,20%,16%)] text-[hsl(240,10%,65%)] border border-[hsl(240,20%,20%)]">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4 text-center">Our Team</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center">
            A team built across Asia
          </h2>
          <p className="text-[hsl(240,10%,65%)] text-center max-w-2xl mx-auto mb-16">
            We're a diverse, distributed team spanning Singapore, Tokyo, Mumbai, Taipei, Jakarta, and Bangkok.
            We live and work in the markets we serve.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="rounded-xl border border-[hsl(240,20%,16%)] bg-[hsl(240,25%,10%,0.5)] p-6 hover:border-[hsl(240,20%,22%)] transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg font-bold">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-bold">{member.name}</h3>
                    <p className="text-xs text-primary">{member.role}</p>
                  </div>
                </div>
                <p className="text-sm text-[hsl(240,10%,65%)] leading-relaxed mb-3">{member.bio}</p>
                <p className="text-xs text-[hsl(240,10%,50%)]">{member.flag} {member.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 md:py-28 px-4 bg-[hsl(240,25%,10%)]">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4 text-center">Who We Serve</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">
            Built for the people building Asia's AI future
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Users, title: "Marketers Across ASEAN", desc: "Creating campaigns that resonate across Singapore, Indonesia, Thailand, Philippines, and beyond." },
              { icon: Code, title: "Developers Building for Asia", desc: "Shipping AI products that need to work in multiple Asian languages and cultural contexts." },
              { icon: GraduationCap, title: "Educators Adapting AI", desc: "Bringing AI tools into Asian classrooms with culturally relevant prompts and examples." },
              { icon: Rocket, title: "Asia's Entrepreneurs", desc: "Founders and teams in the region's startup ecosystem using AI to move faster and smarter." },
            ].map((item) => (
              <div key={item.title} className="flex gap-5 p-6 rounded-xl border border-[hsl(240,20%,16%)] bg-[hsl(240,28%,7%,0.5)] hover:border-[hsl(240,20%,22%)] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-[hsl(240,10%,65%)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-4 text-center">Our Values</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">
            What drives everything we build
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: "Cultural Intelligence", desc: "We don't just translate. We localize with deep awareness of cultural norms, formality, and context." },
              { icon: Languages, title: "Language First", desc: "Every feature starts with the question: does this work in Japanese, Thai, Hindi, and Bahasa?" },
              { icon: Target, title: "Platform Agnostic", desc: "We optimize for every major AI platform so you're never locked into a single ecosystem." },
              { icon: Users, title: "Community Driven", desc: "Our best prompts come from real professionals across Asia sharing what works." },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-xl border border-[hsl(240,20%,16%)] bg-[hsl(240,25%,10%,0.5)] hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-[hsl(240,10%,65%)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA with email signup */}
      <section className="py-20 md:py-28 px-4 bg-[hsl(240,25%,10%)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Join 10,000+ Asian professionals optimizing their AI prompts
          </h2>
          <p className="text-[hsl(240,10%,65%)] text-lg mb-10 max-w-xl mx-auto">
            Get weekly prompt techniques, platform updates, and cultural insights for AI in Asia.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 rounded-lg border border-[hsl(240,20%,20%)] bg-[hsl(240,28%,7%)] px-4 text-sm text-[hsl(28,76%,97%)] placeholder:text-[hsl(240,10%,45%)] focus:outline-none focus:border-primary transition-colors"
            />
            <Button variant="hero" size="lg" className="h-12 px-8 shrink-0">
              Get Started Free
            </Button>
          </form>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild variant="outline" size="lg" className="text-base px-8 py-6 h-auto border-[hsl(240,20%,22%)] text-[hsl(28,76%,97%)] hover:bg-[hsl(240,20%,16%)]">
              <Link to="/optimize">Try the Optimizer</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 py-6 h-auto border-[hsl(240,20%,22%)] text-[hsl(28,76%,97%)] hover:bg-[hsl(240,20%,16%)]">
              <Link to="/market-insights">
                View Market Intelligence <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
