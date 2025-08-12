import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AIPromptsForCustomerSupport = () => {
  const title = "AI Prompts for Customer Support Teams";
  const description =
    "Improve customer service with these AI prompts for support teams. Automate responses, generate FAQs, and handle complex queries faster.";
  const heroImage = "/lovable-uploads/e141a9a1-b98c-4ba8-9401-2469670c9cca.png"; // hero
  const imageTwo = "/lovable-uploads/e645ef3a-9d9a-40e8-9f29-bc98b810fe80.png"; // in-article image
  const imageThree = "/lovable-uploads/b9bbcee0-042a-4751-9c30-dfc61fe9a846.png"; // also used as blog index thumbnail
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = origin ? `${origin}/blog/ai-prompts-for-customer-support` : undefined;
  const category = "Customer Support";
  const tags = [
    "AI prompts",
    "customer support",
    "helpdesk",
    "automation",
    "FAQ",
    "CSAT",
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    articleSection: category,
    keywords: tags,
    image: origin ? `${origin}${heroImage}` : heroImage,
    author: { "@type": "Organization", name: "PromptAndGo.ai" },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical || "" },
  };

  return (
    <main className="container py-10">
      <SEO title={title} description={description} canonical={canonical} image={origin ? `${origin}${heroImage}` : heroImage} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        <link rel="canonical" href={canonical} />
        <meta name="keywords" content={tags.join(", ")} />
        <meta property="article:section" content={category} />
        {tags.map((t) => (
          <meta key={t} property="article:tag" content={t} />
        ))}
      </Helmet>

      <article className="mx-auto max-w-3xl">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
          <img
            src={heroImage}
            alt="AI-powered customer support assistance"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
          />
          <p className="mt-3 text-muted-foreground">
            Fast, consistent, and helpful responses can make or break a customer’s experience. AI prompts give support teams the tools to respond quickly, personalise communication, and maintain a friendly tone while reducing workload.
          </p>
        </header>

        <section className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">1. Response Automation Prompts</h2>
          <p><strong>FAQ Generator Prompt:</strong><br />
            Based on the following customer queries, create a clear FAQ list with concise answers in plain language.
          </p>
          <p><strong>Template Response Prompt:</strong><br />
            Write a polite and empathetic response to a customer who experienced [issue]. Include an apology, explanation, and resolution.
          </p>

          <img
            src={imageTwo}
            alt="Support agent reviewing AI-suggested responses and FAQs"
            className="mt-2 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
          />

          <h2 className="text-2xl font-semibold">2. Escalation and Resolution Prompts</h2>
          <p><strong>Priority Tagging Prompt:</strong><br />
            Review the following customer tickets and categorise them into high, medium, and low priority with reasons for each.
          </p>
          <p><strong>Escalation Summary Prompt:</strong><br />
            Summarise the following customer case for handover to a senior manager. Include background, issue, attempted resolutions, and next steps.
          </p>

          <h2 className="text-2xl font-semibold">3. Customer Experience Enhancement Prompts</h2>
          <p><strong>Follow-Up Prompt:</strong><br />
            Write a friendly follow-up message to check if a customer is satisfied with their recent support experience.
          </p>
          <p><strong>Retention Offer Prompt:</strong><br />
            Draft a personalised message offering a discount or bonus to a customer considering cancelling their subscription.
          </p>

          <img
            src={imageThree}
            alt="Customer support dashboard improved by AI insights"
            className="mt-2 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
          />

          <h2 className="text-2xl font-semibold">Final Thoughts</h2>
          <p>
            AI prompts allow support teams to balance speed with empathy, ensuring customers feel heard and valued.
          </p>

          <div className="mt-8">
            <Button asChild variant="cta">
              <Link to="/library">Explore the Prompt Library</Link>
            </Button>
          </div>
        </section>

        <footer className="mt-10 border-t pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{category}</Badge>
            {tags.map((t) => (
              <Badge key={t} variant="outline">{t}</Badge>
            ))}
          </div>
        </footer>
      </article>
    </main>
  );
};

export default AIPromptsForCustomerSupport;
