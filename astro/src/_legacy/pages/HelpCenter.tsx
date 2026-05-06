import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Rocket, Monitor, Globe, HelpCircle, MessageSquare, Zap, BookOpen, ArrowRight,
} from "lucide-react";

const PLATFORM_TIPS = [
  { name: "ChatGPT", tip: "Use numbered steps, define output format, specify a role (e.g. 'Act as a marketing strategist'). ChatGPT excels with structured instructions." },
  { name: "Claude", tip: "Provide generous context and ask it to think step-by-step. Claude handles nuance well — use natural language over rigid templates." },
  { name: "Gemini", tip: "Be explicit about desired format. Leverage its multimodal capabilities and Google ecosystem knowledge." },
  { name: "MidJourney", tip: "Use comma-separated descriptive tags, specify style/medium/lighting, include aspect ratio (--ar 16:9), and style version (--v 6)." },
  { name: "DeepSeek", tip: "Strong at technical tasks. Use chain-of-thought prompting and be specific about analytical frameworks." },
  { name: "Qwen", tip: "Alibaba's model excels at Chinese and SE Asian languages. Great for cross-border e-commerce and Asian market content." },
  { name: "Perplexity", tip: "Research-focused. Ask specific questions, request sources, and use it for fact-checking." },
  { name: "Grok", tip: "Direct, witty style. Good for current events and unfiltered analysis." },
];

const LANGUAGE_TIPS = [
  { lang: "Japanese 🇯🇵", tip: "Use keigo (敬語) for business contexts. Specify formality level: casual (タメ口), polite (丁寧語), or honorific (尊敬語/謙譲語)." },
  { lang: "Mandarin 🇨🇳", tip: "Specify platform context (小红书 vs WeChat vs 淘宝). Tone varies significantly across platforms in Chinese social media." },
  { lang: "Bahasa 🇮🇩", tip: "Indonesian Bahasa is more casual than Malay. Specify whether formal (baku) or informal (gaul) language is needed." },
  { lang: "Korean 🇰🇷", tip: "Korean has 7 speech levels. Specify context — 존댓말 (formal) vs 반말 (casual) makes a big difference." },
  { lang: "Thai 🇹🇭", tip: "Thai uses different pronouns by gender and social status. Include audience context for appropriate language register." },
  { lang: "Vietnamese 🇻🇳", tip: "Northern and Southern Vietnamese differ in vocabulary. Specify region if targeting a specific market." },
  { lang: "Hindi 🇮🇳", tip: "Hinglish (Hindi-English mix) is common in business. Specify whether pure Hindi or Hinglish is preferred." },
];

const FAQS = [
  { q: "Is Scout optimizer free?", a: "Yes! The Scout prompt optimizer is completely free to use. No signup required. You can optimize prompts for any of our 12 supported AI platforms in any of 12+ Asian languages." },
  { q: "How does Asian cultural context work?", a: "When you enable the 'Asian Context' toggle, Scout adds culturally appropriate elements — like formality levels, honorifics, local business conventions, and regional market understanding — to your optimized prompt." },
  { q: "Can I use prompts from the library commercially?", a: "Yes. All free prompts in our library can be used for personal and commercial purposes. Premium Power Pack prompts are licensed for the purchaser's use." },
  { q: "What AI platforms are supported?", a: "We support ChatGPT, Claude, Gemini, Copilot, Perplexity, MidJourney, DeepSeek, Qwen, Meta AI, Ernie Bot, Grok, and local models like Llama." },
  { q: "How do I save my favorite prompts?", a: "Create a free account, then click the heart icon on any prompt to save it to your favorites. Access them anytime from Account → Favorites." },
  { q: "Is my data stored?", a: "No. Prompts submitted to Scout optimizer are processed in real-time and never stored on our servers. Your data remains private." },
];

export default function HelpCenter() {
  return (
    <>
      <SEO
        title="Help Center | Getting Started with PromptAndGo"
        description="Learn how to use Scout optimizer, get platform-specific prompting tips, language guides for Asian markets, and answers to frequently asked questions."
        canonical="https://promptandgo.ai/help"
      />

      {/* Hero */}
      <section className="bg-hero text-white py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <HelpCircle className="h-12 w-12 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Help Center
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Everything you need to get the most out of PromptAndGo — from your first optimization to advanced multilingual prompting.
          </p>
        </div>
      </section>

      <main className="container max-w-4xl mx-auto px-4 py-12 space-y-16">
        {/* Getting Started */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Getting Started</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Paste your prompt", desc: "Go to the Scout Optimizer and paste any prompt you want to improve." },
              { step: "2", title: "Choose platform & language", desc: "Select which AI platform you're using and your preferred output language." },
              { step: "3", title: "Copy & use", desc: "Copy the optimized prompt and paste it into your AI tool. See the difference instantly." },
            ].map((s) => (
              <Card key={s.step} className="border-border/50">
                <CardContent className="p-5">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mb-3">{s.step}</div>
                  <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <Button asChild>
              <Link to="/optimize" className="gap-2"><Zap className="h-4 w-4" /> Try the Optimizer</Link>
            </Button>
          </div>
        </section>

        {/* Platform Guide */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
              <Monitor className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Platform Guide</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {PLATFORM_TIPS.map((p) => (
              <Card key={p.name} className="border-border/50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2">{p.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.tip}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Language Guide */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <Globe className="h-5 w-5 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold">Language Guide</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Tips for getting the best results when prompting in Asian languages:</p>
          <div className="space-y-3">
            {LANGUAGE_TIPS.map((l) => (
              <Card key={l.lang} className="border-border/50">
                <CardContent className="p-4 flex gap-4">
                  <span className="font-semibold text-sm min-w-[120px]">{l.lang}</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{l.tip}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-violet-500" />
            </div>
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          </div>
          <Accordion type="multiple">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm font-semibold">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Contact */}
        <section className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Still need help?</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">We're here for you. Reach out anytime.</p>
          <Button asChild>
            <Link to="/contact" className="gap-2">
              <MessageSquare className="h-4 w-4" /> Contact Us
            </Link>
          </Button>
        </section>
      </main>
    </>
  );
}
