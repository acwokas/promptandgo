import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ShieldCheck, Zap, Clock, BadgeCheck, Globe, Scale, Search, Heart, Bot, Copy, Check } from "lucide-react";

const HowItWorks = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  // Example prompt data
  const examplePrompt = {
    id: "demo-prompt-123",
    title: "Email Marketing Prompt",
    prompt: "Write a compelling email subject line and 150-word email body for [PRODUCT/SERVICE] that [MAIN BENEFIT]. Target audience: [AUDIENCE]. Tone: [professional/casual/urgent]. Include a clear call-to-action."
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(examplePrompt.prompt);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "Prompt copied successfully. Paste it into your AI tool.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please try selecting and copying manually.",
        variant: "destructive",
      });
    }
  };

  const handleAddToFavorites = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save prompts to your favorites.",
      });
      return;
    }

    setIsLoadingFavorite(true);
    try {
      // This is a demo, so we'll just simulate the action
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited ? "Demo prompt removed from your collection." : "Demo prompt saved to your favorites!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFavorite(false);
    }
  };
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://promptandgo.ai';
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How Prompting Works",
    description: "Pick a prompt, paste it into your AI tool, and tweak to go.",
    step: [
      { "@type": "HowToStep", name: "Browse Prompts", text: "Explore by category or prompt pack — from career writing to creativity, productivity, and more." },
      { "@type": "HowToStep", name: "Paste into ChatGPT", text: "Copy the prompt and paste it into ChatGPT, GPT-4, Claude, Gemini, or your AI of choice." },
      { "@type": "HowToStep", name: "Tweak & Go", text: "Edit, regenerate, or stack prompts as needed. Get better results without starting from scratch." },
    ],
    mainEntityOfPage: { "@type": "WebPage", "@id": `${origin}/how-it-works` },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is PromptAndGo?", acceptedAnswer: { "@type": "Answer", text: "A curated library of practical AI prompts tested for real tasks." } },
      { "@type": "Question", name: "How do I use it?", acceptedAnswer: { "@type": "Answer", text: "Browse a prompt, paste into your AI tool, then tweak or stack prompts as needed." } },
      { "@type": "Question", name: "Which AI tools are supported?", acceptedAnswer: { "@type": "Answer", text: "Works with ChatGPT, GPT-4, Claude, Gemini, and more." } },
    ],
  };
  return (<>
    <SEO title="How Prompting Works" description="Browse, paste into ChatGPT or Claude, then tweak and go — fast, no jargon." structuredData={[howToSchema, faqSchema]} />
    <PageHero
      title={<>How <span className="text-gradient-brand">Prompting</span> Works</>}
      subtitle={
        <>
          Using AI shouldn’t feel like a guessing game. At PromptAndGo, we make it easy to get great results, fast. Just pick a prompt, paste it into your favourite AI tool (like ChatGPT or Claude), and go. No engineering jargon. No wasted time. Just results.
        </>
      }
      minHeightClass="min-h-[35vh]"
    >
      <Button asChild size="lg" variant="hero" className="px-6">
        <Link to="/library"><Search className="h-4 w-4 mr-2" />Browse Library</Link>
      </Button>
      <Button asChild size="lg" variant="inverted">
        <Link to="/packs">⚡️Power Packs</Link>
      </Button>
    </PageHero>

    <main className="container py-12">
      <section aria-labelledby="how-it-works-diagram" className="max-w-5xl mx-auto">
        <h2 id="how-it-works-diagram" className="text-2xl font-semibold tracking-tight mb-8">How it Works</h2>
        <div className="relative">
          {/* connector line for larger screens */}
          <div aria-hidden className="hidden md:block absolute left-0 right-0 top-6 h-px bg-border" />
          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <article className="relative">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">1</div>
                <div>
                  <h3 className="text-lg font-semibold">Browse Prompts</h3>
                  <p className="mt-1 text-muted-foreground">Explore by category or prompt pack — from career writing to creativity, productivity, and more.</p>
                </div>
              </div>
            </article>
            {/* Step 2 */}
            <article className="relative">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">2</div>
                <div>
                  <h3 className="text-lg font-semibold">Paste into ChatGPT</h3>
                  <p className="mt-1 text-muted-foreground">Copy the prompt and paste it into ChatGPT, GPT-4, Claude, Gemini, or your AI of choice.</p>
                </div>
              </div>
            </article>
            {/* Step 3 */}
            <article className="relative">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">3</div>
                <div>
                  <h3 className="text-lg font-semibold">Tweak &amp; Go</h3>
                  <p className="mt-1 text-muted-foreground">Edit, regenerate, or stack prompts as needed. Get better results without starting from scratch.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Visual Example Section */}
      <section className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">See It In Action</h2>
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  Copy a prompt from our library
                </h3>
                <div className="bg-background rounded-lg border p-4 text-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground">{examplePrompt.title}</span>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleCopyPrompt}
                        className="h-6 px-2 text-xs"
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleAddToFavorites}
                        disabled={isLoadingFavorite}
                        className="h-6 px-2 text-xs"
                      >
                        <Heart className={`h-3 w-3 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                      </Button>
                    </div>
                  </div>
                  <p className="font-mono text-xs leading-relaxed mb-3">
                    "{examplePrompt.prompt}"
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={handleCopyPrompt}
                      variant="outline"
                      className="h-7 px-3 text-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Prompt
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleAddToFavorites}
                      disabled={isLoadingFavorite}
                      variant="outline"
                      className="h-7 px-3 text-xs"
                    >
                      <Heart className={`h-3 w-3 mr-1 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                      {isLoadingFavorite ? 'Saving...' : isFavorited ? 'Saved' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  Paste into ChatGPT & get results
                </h3>
                <div className="bg-background rounded-lg border p-4 text-sm">
                  <div className="text-xs text-muted-foreground mb-2">ChatGPT Output:</div>
                  <div className="space-y-2">
                    <p className="font-semibold text-primary">Subject: "Save 3+ hours daily with AI automation"</p>
                    <p className="text-xs leading-relaxed">Hi [Name], Imagine finishing your daily tasks 3 hours early. Our AI automation platform handles repetitive work so you can focus on strategy. Join 10,000+ professionals already saving time...</p>
                    <div className="text-xs text-muted-foreground">⚡ Ready in 30 seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* User Success Stories */}
      <section className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-semibold mb-8 text-center">Users Love How Simple It Is</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-green-50 to-transparent border-green-200 dark:from-green-950 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">"I went from struggling with prompts to getting perfect results in minutes. The copy-paste approach is genius."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-sm font-semibold">TR</div>
                <div>
                  <p className="text-sm font-medium">Taylor R.</p>
                  <p className="text-xs text-muted-foreground">Content Creator</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-transparent border-blue-200 dark:from-blue-950 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">"No learning curve at all. I found a prompt, pasted it into Claude, and got exactly what I needed for my business pitch."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-sm font-semibold">KC</div>
                <div>
                  <p className="text-sm font-medium">Kevin C.</p>
                  <p className="text-xs text-muted-foreground">Startup Founder</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-transparent border-purple-200 dark:from-purple-950 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">"Finally, prompts that actually work! No guesswork, no trial and error. Just paste and go."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center text-sm font-semibold">MJ</div>
                <div>
                  <p className="text-sm font-medium">Maria J.</p>
                  <p className="text-xs text-muted-foreground">Marketing Manager</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick FAQ */}
      <section className="max-w-3xl mx-auto mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Still Have Questions?</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border-l-4 border-primary pl-4 py-2">
            <h3 className="font-semibold mb-1">Is it really that simple?</h3>
            <p className="text-sm text-muted-foreground">Yes! No technical knowledge required. If you can copy and paste, you can use our prompts.</p>
          </div>
          
          <div className="border-l-4 border-primary pl-4 py-2">
            <h3 className="font-semibold mb-1">Do I need to pay?</h3>
            <p className="text-sm text-muted-foreground">Start completely free. Upgrade to power packs only when you want specialized prompts.</p>
          </div>
          
          <div className="border-l-4 border-primary pl-4 py-2">
            <h3 className="font-semibold mb-1">Which AI tools work?</h3>
            <p className="text-sm text-muted-foreground">ChatGPT, Claude, Gemini, Perplexity, and basically any text-based AI tool.</p>
          </div>
          
          <div className="border-l-4 border-primary pl-4 py-2">
            <h3 className="font-semibold mb-1">How fast will I see results?</h3>
            <p className="text-sm text-muted-foreground">Instantly! Browse, copy, paste, and get your first great output in under 2 minutes.</p>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-2xl mx-auto mt-12">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-3">🎯 Get Weekly Prompting Tips</h2>
            <p className="text-muted-foreground mb-6">Join 25,000+ users getting our best prompts and AI productivity tips every Tuesday.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-2 rounded-md border bg-background"
              />
              <Button variant="hero" className="px-6">
                Subscribe Free
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">No spam. Unsubscribe anytime. Free forever.</p>
          </CardContent>
        </Card>
      </section>

      {/* Additional About content from promptandgo.ai/about */}
      <section className="max-w-4xl mx-auto mt-12">
        <article className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold">Built for Real Tasks. Used by Real People.</h3>
            <p className="mt-2 text-muted-foreground">PromptAndGo exists to remove the friction of working with AI. We believe the power of generative tools shouldn’t be locked behind hype or hidden behind complexity. We focus on what matters: clear, practical prompts that make writing, planning, and thinking easier, one click at a time.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-xl border p-5 bg-card/50 bg-gradient-to-br from-primary/10 to-transparent ring-1 ring-primary/10 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <ShieldCheck className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
              <h4 className="font-semibold">Human Curated Prompts</h4>
              <p className="mt-1 text-muted-foreground">Each prompt is crafted for real use cases — not generic fluff.</p>
            </div>
            <div className="group rounded-xl border p-5 bg-card/50 bg-gradient-to-br from-primary/10 to-transparent ring-1 ring-primary/10 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <Zap className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
              <h4 className="font-semibold">Instant Use, No Learning Curve</h4>
              <p className="mt-1 text-muted-foreground">Copy into your AI tool and run instantly — no setup required.</p>
            </div>
            <div className="group rounded-xl border p-5 bg-card/50 bg-gradient-to-br from-primary/10 to-transparent ring-1 ring-primary/10 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <Clock className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
              <h4 className="font-semibold">Built for Busy People</h4>
              <p className="mt-1 text-muted-foreground">Made for educators, creators, jobseekers, and more.</p>
            </div>
            <div className="group rounded-xl border p-5 bg-card/50 bg-gradient-to-br from-primary/10 to-transparent ring-1 ring-primary/10 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <BadgeCheck className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
              <h4 className="font-semibold">Free + Pro Options</h4>
              <p className="mt-1 text-muted-foreground">Choose what you need. Upgrade only when it’s worth it.</p>
            </div>
            <div className="group rounded-xl border p-5 bg-card/50 bg-gradient-to-br from-primary/10 to-transparent ring-1 ring-primary/10 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <Globe className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
              <h4 className="font-semibold">Works with All AI Platforms</h4>
              <p className="mt-1 text-muted-foreground">Use with ChatGPT, GPT-4, Claude, Gemini, and more.</p>
            </div>
            <div className="group rounded-xl border p-5 bg-card/50 bg-gradient-to-br from-primary/10 to-transparent ring-1 ring-primary/10 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <Scale className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
              <h4 className="font-semibold">Ethically Created</h4>
              <p className="mt-1 text-muted-foreground">No fake personas. No scraped content. Always clear, honest use.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mt-2">
            <div className="rounded-xl border p-6 text-center bg-card/50 bg-gradient-to-br from-primary/10 to-transparent ring-1 ring-primary/10 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-3xl font-bold tracking-tight">12+</div>
              <div className="text-muted-foreground">Prompt Categories</div>
            </div>
            <div className="rounded-xl border p-6 text-center bg-card/50 bg-gradient-to-br from-primary/10 to-transparent ring-1 ring-primary/10 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-3xl font-bold tracking-tight">1600+</div>
              <div className="text-muted-foreground">Prompts</div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-xl font-semibold">Trusted by Thousands, from Startups to Enterprises</h3>
            <p className="mt-2 text-muted-foreground">Most people don’t want to become prompt engineers — they just want better results. We built a simple way to skip the struggle and get to the output.</p>
          </div>
        </article>
      </section>
      <section aria-labelledby="cta-tail" className="relative bg-hero hero-grid mt-16">
        <div className="container p-8 md:p-12 text-center text-primary-foreground">
          <h2 id="cta-tail" className="text-2xl md:text-3xl font-semibold tracking-tight">Whatever you’re working on, someone’s already used PromptAndGo to do it faster.</h2>
          <p className="mt-3 text-primary-foreground/85 text-base md:text-lg">✨ Ready to Start Prompting Smarter? Try your first prompt or explore a Power Pack, no sign-up required.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="hero" className="px-6">
              <Link to="/library"><Search className="h-4 w-4 mr-2" />Browse Library</Link>
            </Button>
            <Button asChild size="lg" variant="inverted">
              <Link to="/packs">⚡️Power Packs</Link>
            </Button>
          </div>
        </div>
      </section>

    </main>
  </>
  );
};

export default HowItWorks;
