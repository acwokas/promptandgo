import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { ShieldCheck, Zap, Clock, BadgeCheck, Globe, Scale } from "lucide-react";

const HowItWorks = () => {
  const { user } = useSupabaseAuth();
  return (<>
    <SEO title="How Prompting Works" description="Browse, paste into ChatGPT or Claude, then tweak and go — fast, no jargon." />
    <PageHero
      title={<>How Prompting Works</>}
      subtitle={
        <>
          Using AI shouldn’t feel like a guessing game. At PromptAndGo, we make it easy to get great results, fast. Just pick a prompt, paste it into your favourite AI tool (like ChatGPT or Claude), and go. No engineering jargon. No wasted time. Just results.
        </>
      }
      minHeightClass="min-h-[56vh]"
    />

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
          <p className="mt-3 text-primary-foreground/85 text-base md:text-lg">✨ Ready to Start Prompting Smarter? Try your first prompt or explore a pack, no sign-up required.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="hero" className="px-6">
              <Link to="/library">Browse Prompt Library</Link>
            </Button>
            {user ? (
              <Button asChild size="lg" variant="secondary">
                <Link to="/account/favorites">My Prompts</Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="secondary">
                <Link to="/auth">Login</Link>
              </Button>
            )}
            <Button asChild size="lg" variant="inverted">
              <Link to="/packs">Explore Premium Packs</Link>
            </Button>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How Prompting Works",
              description:
                "Pick a prompt, paste it into your AI tool, and tweak to go.",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Browse Prompts",
                  text:
                    "Explore by category or prompt pack — from career writing to creativity, productivity, and more.",
                },
                {
                  "@type": "HowToStep",
                  name: "Paste into ChatGPT",
                  text:
                    "Copy the prompt and paste it into ChatGPT, GPT-4, Claude, Gemini, or your AI of choice.",
                },
                {
                  "@type": "HowToStep",
                  name: "Tweak & Go",
                  text:
                    "Edit, regenerate, or stack prompts as needed. Get better results without starting from scratch.",
                },
              ],
            },
            null,
            2
          ),
        }}
      />
    </main>
  </>
  );
};

export default HowItWorks;
