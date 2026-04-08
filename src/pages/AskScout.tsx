import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, MessageSquare, Sparkles, Globe, Languages, Zap, ArrowRight, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import PageHero from "@/components/layout/PageHero";

const SAMPLE_QUESTIONS = [
  { q: "How do I write prompts in Thai for Gemini?", tag: "Language" },
  { q: "What's the best way to use honorifics in Japanese prompts?", tag: "Culture" },
  { q: "Which platform is best for Bahasa Indonesia content?", tag: "Platform" },
  { q: "How do I optimize prompts for Qwen in Mandarin?", tag: "Optimization" },
  { q: "What tone should I use for Korean business prompts?", tag: "Tone" },
  { q: "Can I mix English and Hindi in the same prompt?", tag: "Multilingual" },
];

const FEATURES = [
  { icon: Languages, title: "12+ Asian Languages", desc: "Get expert advice on prompting in Mandarin, Japanese, Korean, Thai, Vietnamese, Bahasa, Hindi, and more." },
  { icon: Bot, title: "Platform-Specific Tips", desc: "Scout knows the nuances of ChatGPT, Claude, Gemini, Qwen, DeepSeek, Ernie Bot, and every major platform." },
  { icon: Globe, title: "Cultural Context", desc: "Understand how formality levels, honorifics, and cultural norms affect your AI outputs across Asia." },
  { icon: Zap, title: "Instant Answers", desc: "No searching through docs. Ask Scout anything about prompt engineering and get actionable guidance." },
];

const AskScout = () => {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }
    setJoined(true);
    toast({ title: "You're on the list! 🎉", description: "We'll notify you when Ask Scout launches." });
  };

  return (
    <>
      <SEO
        title="Ask Scout — AI Prompting Assistant | PromptAndGo"
        description="Ask Scout anything about AI prompting in Asian languages. Get expert advice on platforms, cultural context, and multilingual prompt optimization. Coming soon."
        canonical="/scout"
      />

      <PageHero
        title={<>Ask <span className="text-gradient-brand">Scout</span> Anything</>}
        subtitle={<>Your personal AI prompting expert for Asia. Ask questions about platforms, languages, cultural nuances, and prompt optimization — coming soon.</>}
        minHeightClass="min-h-[32svh]"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-sm font-medium text-accent">
          <Sparkles className="w-4 h-4" />
          Coming Soon
        </div>
      </PageHero>

      <main className="container max-w-5xl mx-auto px-4 py-12">
        {/* Mock chat interface */}
        <section className="mb-20">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
            <div className="bg-muted/50 border-b border-border px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Scout</p>
                <p className="text-xs text-muted-foreground">AI Prompting Expert • Asia Specialist</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-muted-foreground">Preview</span>
              </div>
            </div>

            <div className="p-6 space-y-4 min-h-[300px]">
              {/* Scout message */}
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-lg">
                  <p className="text-sm leading-relaxed">
                    Hi! I'm Scout, your AI prompting expert specializing in Asian languages and cultural contexts. Ask me anything about writing better prompts — from Mandarin formality levels to platform-specific tips for Qwen and DeepSeek. What would you like to know?
                  </p>
                </div>
              </div>

              {/* Sample questions as clickable chips */}
              <div className="pl-10">
                <p className="text-xs text-muted-foreground mb-3">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_QUESTIONS.map((sq) => (
                    <button
                      key={sq.q}
                      className="text-xs px-3 py-2 rounded-full border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
                    >
                      <span className="text-primary font-medium mr-1.5">{sq.tag}</span>
                      {sq.q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input bar (disabled preview) */}
            <div className="border-t border-border p-4 bg-muted/30">
              <div className="flex items-center gap-3 opacity-50">
                <Input placeholder="Ask Scout about AI prompting in Asian languages..." disabled className="flex-1" />
                <Button disabled size="icon" variant="ghost">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 text-center">Chat will be available when Ask Scout launches</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">What Scout Can Help With</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Waitlist */}
        <section className="rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-primary/20 p-8 md:p-12 text-center">
          <MessageSquare className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Be First to Ask Scout</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Join the waitlist and get early access when Ask Scout launches. We'll notify you by email.
          </p>

          {joined ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/20 text-accent font-medium">
              <Sparkles className="w-4 h-4" />
              You're on the waitlist!
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="shrink-0">
                Join Waitlist <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          )}
        </section>

        {/* CTA */}
        <section className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">In the meantime, try our prompt optimizer:</p>
          <Button asChild size="lg" variant="hero">
            <Link to="/optimize">
              <Zap className="w-4 h-4 mr-2" />
              Optimize a Prompt Now
            </Link>
          </Button>
        </section>
      </main>
    </>
  );
};

export default AskScout;
