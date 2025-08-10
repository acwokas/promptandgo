import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";

const HowItWorks = () => (
  <>
    <SEO title="How Prompting Works" description="Browse, paste into ChatGPT or Claude, then tweak and go — fast, no jargon." />
    <PageHero
      title={<>How Prompting Works</>}
      subtitle={
        <>
          Using AI shouldn’t feel like a guessing game. At PromptAndGo, we make it easy to get great results — fast. Just pick a prompt, paste it into your favourite AI tool (like ChatGPT or Claude), and go. No engineering jargon. No wasted time.
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
