import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import RelatedPrompts from "@/components/prompt/RelatedPrompts";
import PrevNextNav from "@/components/blog/PrevNextNav";
import AuthorBio from "@/components/blog/AuthorBio";
import { AUTHOR_MAIN } from "./authors";


const AIPromptsForMarketingCampaigns = () => {
  const title = "AI Prompts for Marketing Campaigns That Convert";
  const description =
    "Discover the best AI prompts for marketing campaigns that convert. From ad copy to social captions, use these examples to boost engagement and sales.";
  const heroImage = "/ai-prompts-marketing-campaigns-hero.png";
  const midImage1 = "/ai-prompts-marketing-adcopy-tablet.png";
  const midImage2 = "/ai-prompts-email-social-icons.png";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = origin ? `${origin}/tips/ai-prompts-for-marketing-campaigns` : undefined;
  const category = "Marketing";
  const tags = [
    "AI prompts",
    "marketing",
    "ads",
    "email marketing",
    "social media",
    "copywriting",
    "conversion",
  ];
  const lastmod = "2025-03-19";

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
            <BreadcrumbPage>AI Prompts for Marketing Campaigns That Convert</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <SEO title={title} description={description} canonical={canonical} image={origin ? `${origin}${heroImage}` : heroImage} ogType="article" publishedTime={lastmod} modifiedTime={lastmod} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        <link rel="canonical" href={canonical} />
        <meta name="keywords" content={tags.join(", ")} />
        <meta property="article:section" content={category} />
        {tags.map((t) => (
          <meta key={t} property="article:tag" content={t} />
        ))}
        <link rel="preload" as="image" href={heroImage} fetchPriority="high" />
      </Helmet>

      <article className="mx-auto max-w-3xl">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
          <img
            src={heroImage}
            alt="AI prompts for high-converting marketing campaigns"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            width="1200" height="675"
          />
          <p className="mt-3 text-muted-foreground">
            A marketing campaign lives or dies by its messaging. AI can be your secret weapon in creating consistent, high-converting copy across ads, emails, and social posts. The right prompts will help you target the right audience, craft persuasive messaging, and keep your brand voice intact.
          </p>
        </header>

        <section className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">Why AI Is Perfect for Campaign Creation</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Produces copy variations in seconds</li>
            <li>Tailors messaging to specific audience segments</li>
            <li>Keeps tone consistent across multiple platforms</li>
            <li>Speeds up brainstorming and creative development</li>
          </ul>

          <h2 className="text-2xl font-semibold">1. Ad Copy Prompts</h2>
          <p><strong>Facebook/Instagram Ads Prompt:</strong><br />
            Write three variations of ad copy for [product/service] targeting [audience]. Include a hook, benefit statement, and call to action.
          </p>
          <p><strong>Google Ads Prompt:</strong><br />
            Create five Google Ads headlines (max 30 characters) and matching descriptions (max 90 characters) for [product/service]. Focus on urgency and value.
          </p>
          <img
            src={midImage1}
            alt="AI marketing prompts examples for ad copy on a tablet with social reactions"
            className="mt-6 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            width="800" height="450"
          />

          <h2 className="text-2xl font-semibold">2. Email Marketing Prompts</h2>
          <p><strong>Launch Campaign Prompt:</strong><br />
            Write a three-email sequence for launching [product/service]. Email 1: Awareness, Email 2: Benefits, Email 3: Urgency.
          </p>
          <p><strong>Newsletter Content Prompt:</strong><br />
            Generate three newsletter topic ideas for [industry] that balance education and subtle promotion.
          </p>
          <img
            src={midImage2}
            alt="AI prompts for email and social marketing showing robot with social platform icons"
            className="mt-6 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            width="800" height="450"
          />

          <h2 className="text-2xl font-semibold">3. Social Media Prompts</h2>
          <p><strong>Content Calendar Prompt:</strong><br />
            Create a 14-day content calendar for [product/service] including post type, caption, and suggested image idea.
          </p>
          <p><strong>Engagement Post Prompt:</strong><br />
            Write five short and conversational social media posts designed to spark comments and shares from [audience].
          </p>

          <h2 className="text-2xl font-semibold">Final Thoughts</h2>
          <p>
            Well-crafted prompts are the backbone of an efficient marketing team. Use these to accelerate your campaign creation without sacrificing quality.
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


export default AIPromptsForMarketingCampaigns;
