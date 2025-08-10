import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";

const HowItWorks = () => (
  <>
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
      <section aria-labelledby="how-to-steps" className="max-w-3xl mx-auto">
        <h2 id="how-to-steps" className="sr-only">Steps</h2>
        <ol className="list-decimal pl-6 text-muted-foreground space-y-4">
          <li>
            <h3 className="text-foreground font-semibold">1. Browse Prompts</h3>
            <p>Explore by category or prompt pack — from career writing to creativity, productivity, and more.</p>
          </li>
          <li>
            <h3 className="text-foreground font-semibold">2. Paste into ChatGPT</h3>
            <p>Copy the prompt and paste it into ChatGPT, GPT-4, Claude, Gemini, or your AI of choice.</p>
          </li>
          <li>
            <h3 className="text-foreground font-semibold">3. Tweak &amp; Go</h3>
            <p>Edit, regenerate, or stack prompts as needed. Get better results without starting from scratch.</p>
          </li>
        </ol>
      </section>

      {/* Additional About content from promptandgo.ai/about */}
      <section aria-labelledby="about-intro" className="max-w-4xl mx-auto mt-12">
        <header className="mb-6">
          <h2 id="about-intro" className="text-2xl font-semibold tracking-tight">Welcome to PromptAndGo.ai</h2>
          <p className="mt-2 text-muted-foreground">We help real people do more with AI, without the fluff and without needing to be technical, trendy, or trained.</p>
        </header>
        <article className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold">Built for Real Tasks. Used by Real People.</h3>
            <p className="mt-2 text-muted-foreground">PromptAndGo exists to remove the friction of working with AI. We believe the power of generative tools shouldn’t be locked behind hype or hidden behind complexity. We focus on what matters: clear, practical prompts that make writing, planning, and thinking easier — one click at a time.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-5 bg-card/50">
              <h4 className="font-semibold">Human Curated Prompts</h4>
              <p className="mt-1 text-muted-foreground">Each prompt is crafted for real use cases — not generic fluff.</p>
            </div>
            <div className="rounded-lg border p-5 bg-card/50">
              <h4 className="font-semibold">Instant Use, No Learning Curve</h4>
              <p className="mt-1 text-muted-foreground">Copy into your AI tool and run instantly — no setup required.</p>
            </div>
            <div className="rounded-lg border p-5 bg-card/50">
              <h4 className="font-semibold">Built for Busy People</h4>
              <p className="mt-1 text-muted-foreground">Made for educators, creators, jobseekers, and more.</p>
            </div>
            <div className="rounded-lg border p-5 bg-card/50">
              <h4 className="font-semibold">Free + Pro Options</h4>
              <p className="mt-1 text-muted-foreground">Choose what you need. Upgrade only when it’s worth it.</p>
            </div>
            <div className="rounded-lg border p-5 bg-card/50">
              <h4 className="font-semibold">Works with All AI Platforms</h4>
              <p className="mt-1 text-muted-foreground">Use with ChatGPT, GPT-4, Claude, Gemini, and more.</p>
            </div>
            <div className="rounded-lg border p-5 bg-card/50">
              <h4 className="font-semibold">Ethically Created</h4>
              <p className="mt-1 text-muted-foreground">No fake personas. No scraped content. Always clear, honest use.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mt-2">
            <div className="rounded-lg border p-6 text-center bg-card/50">
              <div className="text-3xl font-bold tracking-tight">12+</div>
              <div className="text-muted-foreground">Prompt Categories</div>
            </div>
            <div className="rounded-lg border p-6 text-center bg-card/50">
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

export default HowItWorks;
