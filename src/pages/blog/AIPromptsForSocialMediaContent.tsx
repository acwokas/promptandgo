import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import RelatedPrompts from "@/components/prompt/RelatedPrompts";
import PrevNextNav from "@/components/blog/PrevNextNav";
import AuthorBio from "@/components/blog/AuthorBio";
import { AUTHOR_MAIN } from "./authors";

const AIPromptsForSocialMediaContent = () => {
  const title = "AI Prompts for Social Media Content That Stands Out";
  const description =
    "Create social media content that gets noticed. These AI prompts help you generate posts, captions, and engagement ideas for any platform in minutes.";
  const heroImage = "/lovable-uploads/a619c09b-001e-470b-beff-59e90dcd0a60.png"; // User image #3 (thumbnail/hero)
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = origin ? `${origin}/tips/ai-prompts-for-social-media-content` : undefined;
  const category = "Social Media";
  const tags = [
    "AI prompts",
    "social media",
    "captions",
    "content ideas",
    "engagement",
    "Instagram",
    "TikTok",
    "LinkedIn",
  ];
  const lastmod = "2025-05-19";

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
            <BreadcrumbPage>AI Prompts for Social Media Content That Stands Out</BreadcrumbPage>
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
            alt="AI prompts for social media content that stands out with emojis and mobile UI"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            width="1280" height="720"
          />
          <p className="mt-3 text-muted-foreground">
            Social media feeds are crowded, and getting noticed requires more than just showing up. To grab attention, your content needs to be relevant, creative, and tailored to your audience. AI can help you produce that content faster and with more variety. With the right prompts, you can generate fresh ideas, engaging captions, and interactive posts that keep followers coming back for more.
          </p>
          <p className="mt-3 text-muted-foreground">
            This guide shares AI prompts specifically designed to make your social media content stand out, no matter your platform or industry.
          </p>
        </header>

        <section className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">Why AI is Perfect for Social Media Ideation</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Produces ideas in seconds, reducing creative blocks</li>
            <li>Adapts content for different platforms and audiences</li>
            <li>Helps maintain a consistent posting schedule</li>
            <li>Generates variations so you can test what works best</li>
          </ul>

          <h2 className="text-2xl font-semibold">1. Post Idea Prompts</h2>
          <p><strong>Trending Topic Prompt:</strong><br />
            Generate five social media post ideas related to [industry] that tie into current trending topics or hashtags. Include a suggested image concept for each.
          </p>
          <p><strong>Seasonal Content Prompt:</strong><br />
            Create three Instagram post ideas for [holiday/season] that balance entertainment with subtle promotion of [product/service].
          </p>
          <p><strong>Behind-the-Scenes Prompt:</strong><br />
            List five ideas for behind-the-scenes posts that would humanise a [type of business] brand.
          </p>

          <h2 className="text-2xl font-semibold">2. Caption Prompts</h2>
          <p><strong>Hook and Story Prompt:</strong><br />
            Write an Instagram caption that starts with a compelling hook about [topic], followed by a short story, and ends with a call to action.
          </p>
          <p><strong>Quick Engagement Prompt:</strong><br />
            Create three short and witty captions for a [product/service] photo carousel designed to make people comment.
          </p>

          <h2 className="text-2xl font-semibold">3. Engagement Prompts</h2>
          <p><strong>Poll Question Prompt:</strong><br />
            Write five poll or question ideas for Instagram Stories to learn more about [audience preference].
          </p>
          <p><strong>Challenge Prompt:</strong><br />
            Create an engaging social media challenge idea for [industry] that encourages user-generated content.
          </p>

          <h2 className="text-2xl font-semibold">Tips for Using AI for Social Media Content</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Always adapt AI-generated content to fit your brand voice</li>
            <li>Combine AI-generated ideas with your own creative flair</li>
            <li>Review outputs for accuracy and cultural sensitivity</li>
            <li>Keep testing different post types to see what resonates</li>
          </ul>

          <h2 className="text-2xl font-semibold">Final Thoughts</h2>
          <p>
            With the right prompts, AI can help you maintain a strong, engaging social media presence without spending hours brainstorming. Try these prompts, customise them for your brand, and start building a content strategy that stands out in any feed.
          </p>

          <div className="mt-8">
            <Button asChild variant="cta">
              <Link to="/library?q=social">Explore Social Media Prompts</Link>
            </Button>
          </div>

          <RelatedPrompts />
          <AuthorBio author={AUTHOR_MAIN} />
          <PrevNextNav />
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

export default AIPromptsForSocialMediaContent;
