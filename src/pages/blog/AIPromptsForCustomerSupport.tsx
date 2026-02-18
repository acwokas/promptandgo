import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import RelatedPrompts from "@/components/prompt/RelatedPrompts";
import PrevNextNav from "@/components/blog/PrevNextNav";
import AuthorBio from "@/components/blog/AuthorBio";
import { AUTHOR_MAIN } from "./authors";


const AIPromptsForCustomerSupport = () => {
  const title = "AI Prompts for Customer Support Teams";
  const description =
    "Improve customer service with these AI prompts for support teams. Automate responses, generate FAQs, and handle complex queries faster.";
  const heroImage = "/lovable-uploads/e141a9a1-b98c-4ba8-9401-2469670c9cca.png"; // hero
  const imageTwo = "/lovable-uploads/e645ef3a-9d9a-40e8-9f29-bc98b810fe80.png"; // in-article image
  const imageThree = "/lovable-uploads/b9bbcee0-042a-4751-9c30-dfc61fe9a846.png"; // also used as blog index thumbnail
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = origin ? `${origin}/tips/ai-prompts-for-customer-support` : undefined;
  const category = "Customer Support";
  const tags = [
    "AI prompts",
    "customer support",
    "helpdesk",
    "automation",
    "FAQ",
    "CSAT",
  ];
  const lastmod = "2025-04-19";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    articleSection: category,
    keywords: tags,
    image: origin ? `${origin}${heroImage}` : heroImage,
    datePublished: lastmod,
    dateModified: lastmod,
    author: { "@type": "Person", name: AUTHOR_MAIN.name, sameAs: AUTHOR_MAIN.sameAs },
    publisher: {
      "@type": "Organization",
      name: "PromptAndGo.ai",
      logo: { "@type": "ImageObject", url: origin ? `${origin}/og-default.png` : "/og-default.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical || "" },
  };

  return (
    <main className="container py-10">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/tips">Tips & Resources</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>AI Prompts for Customer Support Teams</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <SEO title={title} description={description} canonical={canonical} image={origin ? `${origin}${heroImage}` : heroImage} ogType="article" publishedTime={lastmod} modifiedTime={lastmod} keywords={tags.join(", ")} structuredData={schema} />

      <article className="mx-auto max-w-3xl">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
          <img
            src={heroImage}
            alt="AI-powered customer support assistance"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            width="1280" height="720"
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
            Draft a personalised message offering a discount or bonus to a customer considering cancelling their membership.
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

           <RelatedPrompts />
        </section>

        <AuthorBio author={AUTHOR_MAIN} />
        <PrevNextNav />

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
