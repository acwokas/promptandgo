import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const sections: FAQSection[] = [
  {
    title: "About PromptAndGo",
    items: [
      {
        question: "Who created PromptAndGo?",
        answer:
          "PromptAndGo was created by a team of AI enthusiasts, marketers, and content specialists who test every prompt before publishing. We focus on practical, real-world results rather than theory.",
      },
      {
        question: "Why use PromptAndGo instead of free prompts online?",
        answer:
          "We curate and test every prompt for clarity, accuracy, and usefulness. This means you will not waste time sifting through outdated or unproven ideas. Everything here is designed to help you get better results, faster.",
      },
      {
        question: "Is my data safe?",
        answer:
          "Yes. We do not store your AI conversations and all account and payment information is handled securely by trusted third-party providers.",
      },
    ],
  },
  {
    title: "Getting Started",
    items: [
      {
        question: "How do I start if I am new to prompting?",
        answer:
          "Pick any category that matches your goal, copy the prompt, and paste it into your preferred AI tool. Follow the included instructions, then tweak as needed. If you are unsure where to begin, start with our \"Beginner-Friendly\" section.",
      },
      {
        question: "What makes a good prompt?",
        answer:
          "A good prompt is clear, specific, and written with purpose. The best prompts guide the AI by focusing on your intent without adding unnecessary complexity. Every prompt on PromptAndGo is designed to help you get strong results without needing to be an expert.",
      },
      {
        question: "Will these prompts work with free AI tools?",
        answer:
          "Yes. All prompts are designed to work with free versions of tools like ChatGPT. You do not need a subscription or special setup, just copy and paste into your preferred AI tool.",
      },
    ],
  },
  {
    title: "Using Prompts",
    items: [
      {
        question: "Can I change or combine prompts?",
        answer:
          "Yes. Prompts are starting points and you can adjust them to match your tone, combine them for more complex results, or use them to spark new ideas.",
      },
      {
        question: "How do I save my favourite prompts?",
        answer:
          "Click the save icon on any prompt to add it to your favourites list. This feature is free and lets you find saved prompts quickly any time.",
      },
      {
        question: "Do prompts work with AI tools other than ChatGPT?",
        answer:
          "Yes. Most prompts will work in tools like Claude, Gemini, and Microsoft Copilot. You may need to make small formatting adjustments for each platform.",
      },
    ],
  },
  {
    title: "Payments and Access",
    items: [
      {
        question: "Do I need to pay to use PromptAndGo?",
        answer:
          "Many prompts are free to browse and use. You only pay if you choose to unlock one of our PRO prompt packs for advanced tasks such as job applications or productivity systems.",
      },
      {
        question: "Is my payment information safe?",
        answer:
          "Yes. All payments are processed securely through Stripe or PayPal. We never store your full payment details.",
      },
      {
        question: "Do you offer refunds if I do not like a PRO pack?",
        answer:
          "As our products are digital, sales are final unless required by law. If there is a technical issue or the file is not as described, email help@promptandgo.ai within 7 days so we can assist you.",
      },
    ],
  },
  {
    title: "Ownership and Licensing",
    items: [
      {
        question: "Can I use these prompts for commercial projects?",
        answer:
          "Yes. Unless otherwise stated, you can use prompts for both personal and commercial purposes. You are responsible for ensuring the AI output is accurate and appropriate for your needs.",
      },
      {
        question: "Who owns the AI-generated content from these prompts?",
        answer:
          "You own the output once you run a prompt, subject to the terms of the AI tool you used.",
      },
    ],
  },
  {
    title: "Troubleshooting and Support",
    items: [
      {
        question: "What if a prompt does not give me the result I expected?",
        answer:
          "AI outputs can vary. Try rewording the prompt, adding more detail, or combining it with another prompt. All prompts are designed to be flexible so you can adapt them to your style.",
      },
      {
        question: "What if a prompt does not paste correctly into my AI tool?",
        answer:
          "Some platforms add extra formatting when you copy text. Try pasting without formatting using Ctrl+Shift+V or Command+Shift+V, or paste into a plain text editor first.",
      },
      {
        question: "How can I contact support?",
        answer: "Email us at support@promptandgo.ai. We aim to respond within 2 business days.",
      },
      {
        question: "How often do you add new prompts?",
        answer:
          "We add fresh prompts regularly, usually every week. To get updates, join our mailing list or follow us on social media.",
      },
    ],
  },
];

const allQA = sections.flatMap((s) => s.items);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allQA.map((qa) => ({
    "@type": "Question",
    name: qa.question,
    acceptedAnswer: { "@type": "Answer", text: qa.answer },
  })),
};

const FAQs = () => {
  const { user } = useSupabaseAuth();
  return (
    <>
      <SEO
        title="FAQs – PromptAndGo"
        description="Find quick answers about PromptAndGo: getting started, using prompts, payments, licensing, and support."
      />

      <PageHero
        minHeightClass="min-h-[48vh]"
        title={<>Got Questions? We’ve Got You</>}
        subtitle={
          <>New to prompting? Not sure where to start? Don’t worry, you’re in the right place. Here are quick answers to the things people ask us all the time (and a few they don’t, but probably should).</>
        }
      >
        <Button asChild size="lg" variant="hero" className="px-6">
          <Link to="/library">Browse Prompts</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to="/contact">Contact Support</Link>
        </Button>
      </PageHero>

      <main className="container py-10 max-w-4xl">
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {sections.map((section, idx) => (
          <section key={section.title} className={idx === 0 ? "mb-6" : "mt-6 mb-6"} aria-labelledby={`heading-${idx}`}>
            <h2 id={`heading-${idx}`} className="text-xl md:text-2xl font-semibold tracking-tight mb-3">
              {section.title}
            </h2>
            <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden animate-fade-in">
              <Accordion type="single" collapsible className="divide-y">
                {section.items.map((qa, i) => (
                  <AccordionItem key={qa.question} value={`item-${idx}-${i}`} className="px-3 md:px-5">
                    <AccordionTrigger className="text-[15px] md:text-base text-foreground">
                      {qa.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm md:text-base text-muted-foreground max-w-prose">
                      {qa.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        ))}

        <section aria-labelledby="cta-tail" className="relative bg-hero hero-grid mt-12">
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
                <Link to="/packs">Explore Prompt Powerpacks</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default FAQs;
