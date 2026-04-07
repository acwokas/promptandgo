import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { PageSchema } from "@/components/seo/PageSchema";
import { Button } from "@/components/ui/button";
import { Globe, Languages, MapPin, Zap, Users, GraduationCap, Rocket, Code } from "lucide-react";

const platforms = [
  "ChatGPT", "Claude", "Gemini", "DeepSeek", "Copilot", "Perplexity", "MidJourney", "Stable Diffusion"
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
];

const About = () => {
  return (
    <div className="dark bg-[hsl(240,28%,7%)] text-[hsl(28,76%,97%)] min-h-screen">
      <SEO
        title="About PromptAndGo | Built for Asia, Optimized for Every Platform"
        description="PromptAndGo is the only AI prompt optimization tool built specifically for Asia. Multi-platform, multi-language, culturally aware."
        canonicalPath="/about"
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

      {/* The Problem */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">The Problem</p>
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
        </div>
      </section>

      {/* Our Solution - 3 Pillars */}
      <section className="py-20 md:py-28 px-4 bg-[hsl(240,25%,10%)]">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-4 text-center">Our Solution</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">
            Three pillars. Zero compromise.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
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
                  <span
                    key={p}
                    className="text-xs px-3 py-1.5 rounded-full bg-[hsl(240,20%,16%)] text-[hsl(240,10%,65%)] border border-[hsl(240,20%,20%)]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-[hsl(240,20%,16%)] bg-[hsl(240,28%,7%)] p-8 hover:border-accent/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Languages className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Any Language, Any Culture</h3>
              <p className="text-[hsl(240,10%,65%)] mb-6 leading-relaxed">
                10+ Asian languages with cultural awareness baked in. Not just translation.
                True localization with proper tone, formality, and context.
              </p>
              <div className="flex flex-wrap gap-2">
                {languages.map((l) => (
                  <span
                    key={l.name}
                    className="text-xs px-3 py-1.5 rounded-full bg-[hsl(240,20%,16%)] text-[hsl(240,10%,65%)] border border-[hsl(240,20%,20%)]"
                  >
                    {l.flag} {l.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Pillar 3 */}
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
                  <span
                    key={b}
                    className="text-xs px-3 py-1.5 rounded-full bg-[hsl(240,20%,16%)] text-[hsl(240,10%,65%)] border border-[hsl(240,20%,20%)]"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4 text-center">Who We Serve</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">
            Built for the people building Asia's AI future
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: Users,
                title: "Marketers Across ASEAN",
                desc: "Creating campaigns that resonate across Singapore, Indonesia, Thailand, Philippines, and beyond.",
              },
              {
                icon: Code,
                title: "Developers Building for Asia",
                desc: "Shipping AI products that need to work in multiple Asian languages and cultural contexts.",
              },
              {
                icon: GraduationCap,
                title: "Educators Adapting AI",
                desc: "Bringing AI tools into Asian classrooms with culturally relevant prompts and examples.",
              },
              {
                icon: Rocket,
                title: "Asia's Entrepreneurs",
                desc: "Founders and teams in the region's startup ecosystem using AI to move faster and smarter.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-5 p-6 rounded-xl border border-[hsl(240,20%,16%)] bg-[hsl(240,25%,10%,0.5)] hover:border-[hsl(240,20%,22%)] transition-colors"
              >
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

      {/* Final CTA */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Ready to optimize your prompts for Asia?
          </h2>
          <p className="text-[hsl(240,10%,65%)] text-lg mb-10 max-w-xl mx-auto">
            Join thousands of marketers, developers, and creators across Asia who use PromptAndGo
            to get better results from every AI platform.
          </p>
          <Button asChild variant="hero" size="lg" className="text-base px-10 py-6 h-auto">
            <Link to="/optimize">Start Optimizing for Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
