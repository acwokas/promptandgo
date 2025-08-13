import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RelatedPrompts from "@/components/prompt/RelatedPrompts";
import PrevNextNav from "@/components/blog/PrevNextNav";
import AuthorBio from "@/components/blog/AuthorBio";
import { AUTHOR_MAIN } from "./authors";

const AIPromptsForBusinessStrategy = () => {
  const title = "AI Prompts for Business Strategy and Planning";
  const description =
    "Plan smarter with these AI prompts for business strategy. Create SWOT analyses, growth roadmaps, and market insights in minutes.";
  // Images provided by user for this article
  const heroImage = "/lovable-uploads/1f2e3d4c-5b6a-4c3d-8e7f-9a0b1c2d3e4f.png"; // Image 1
  const midImage1 = "/lovable-uploads/5a4b3c2d-1e0f-9a8b-7c6d-5e4f3a2b1c0d.png"; // Image 2
  const midImage2 = "/lovable-uploads/a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d.png"; // Image 3 (used as blog index thumbnail)
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = origin ? `${origin}/blog/ai-prompts-for-business-strategy` : undefined;
  const category = "Strategy";
  const tags = [
    "business strategy",
    "planning",
    "SWOT",
    "growth roadmap",
    "financial projections",
    "market research",
    "AI prompts",
  ];
  const lastmod = "2025-08-13";

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
      <SEO
        title={title}
        description={description}
        canonical={canonical}
        image={origin ? `${origin}${heroImage}` : heroImage}
        ogType="article"
        publishedTime={lastmod}
        modifiedTime={lastmod}
      />
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
            alt="AI prompts for business strategy and planning – dashboard with charts"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            width="1280" height="720"
          />
          <p className="mt-3 text-muted-foreground">
            Business strategy is about making the right decisions at the right time. Whether you are launching a startup, entering a new market, or scaling operations, the ability to analyse data, identify opportunities, and map a clear path forward is essential. AI can dramatically speed up this process by providing structured insights and strategic recommendations—if you use the right prompts.
          </p>
          <p className="mt-3 text-muted-foreground">
            This guide covers AI prompts designed to help you plan more effectively, from analysing competition to creating growth roadmaps.
          </p>
        </header>

        <section className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">Why AI is Now Part of Modern Strategic Planning</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Processes large amounts of information quickly</li>
            <li>Identifies trends and patterns you might overlook</li>
            <li>Helps you visualise complex strategies in simple formats</li>
            <li>Provides multiple scenarios for better decision-making</li>
          </ul>

          <h2 className="text-2xl font-semibold">1. SWOT Analysis Prompts</h2>
          <p><strong>Competitor SWOT Prompt:</strong><br />
            Perform a SWOT analysis for [competitor] in the [industry] sector, focusing on publicly available information from the past 12 months.
          </p>
          <p><strong>Self-Assessment Prompt:</strong><br />
            Create a SWOT analysis for my company [name] based on the following description: [description]. Include recommendations for addressing weaknesses and threats.
          </p>
          <img
            src={midImage1}
            alt="SWOT analysis and competitive insights generated by AI"
            className="mt-6 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
          />

          <h2 className="text-2xl font-semibold">2. Growth Strategy Prompts</h2>
          <p><strong>Short-Term Growth Prompt:</strong><br />
            Suggest three short-term growth strategies for a [type of business] looking to increase revenue by 20% within 12 months.
          </p>
          <p><strong>Long-Term Vision Prompt:</strong><br />
            Develop a five-year strategic plan for expanding into [market/region], including market entry tactics, partnerships, and product localisation.
          </p>
          <img
            src={midImage2}
            alt="Growth roadmap visualisation created with AI prompts"
            className="mt-6 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
          />

          <h2 className="text-2xl font-semibold">3. Financial Projection Prompts</h2>
          <p><strong>Sales Forecast Prompt:</strong><br />
            Create a 12-month sales forecast for [product/service] based on the following data: [data]. Include best-case, expected, and worst-case scenarios.
          </p>
          <p><strong>Budget Allocation Prompt:</strong><br />
            Suggest an annual budget allocation for a [type of business] with $500,000 in projected revenue, prioritising marketing, operations, and R&amp;D.
          </p>

          <h2 className="text-2xl font-semibold">4. Market Research Prompts</h2>
          <p><strong>Trend Identification Prompt:</strong><br />
            Identify five emerging trends in [industry] and explain their potential impact on small to medium-sized businesses.
          </p>
          <p><strong>Customer Profiling Prompt:</strong><br />
            Create three detailed customer personas for [product/service], including demographics, pain points, and buying motivations.
          </p>

          <h2 className="text-2xl font-semibold">Final Thoughts</h2>
          <p>
            Strategic planning is no longer limited to quarterly board meetings. With AI-powered prompts, you can generate actionable strategies on demand, adapt to market shifts quickly, and make better-informed decisions. The key is to feed the AI with clear, specific prompts that guide it toward outputs you can implement immediately.
          </p>
          <p>
            For more high-value, ready-to-use prompts, visit the PromptAndGo library and explore strategies tailored to your industry.
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

export default AIPromptsForBusinessStrategy;
