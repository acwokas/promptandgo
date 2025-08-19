import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RelatedPrompts from "@/components/prompt/RelatedPrompts";
import PrevNextNav from "@/components/blog/PrevNextNav";
import AuthorBio from "@/components/blog/AuthorBio";
import { AUTHOR_MAIN } from "./authors";

const AIPromptsForContentWriters = () => {
  const title = "AI Prompts for Content Writers and Copywriters";
  const description =
    "Boost creativity and speed with these AI prompts for content writers and copywriters. From headlines to long-form articles, these examples get results.";
  const heroImage = "/lovable-uploads/3f39df0f-d378-4f05-bd67-2399d5467ca8.png"; // Thumbnail (file 2)
  const midImage1 = "/lovable-uploads/f32d80cf-413a-416b-958e-97f023e82320.png"; // Image 1 (file 1)
  const midImage2 = "/lovable-uploads/cf547dfa-ef34-4643-811a-b6b8c6ef4c19.png"; // Image 2 (file 3)
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = origin ? `${origin}/blog/ai-prompts-for-content-writers` : undefined;
  const category = "Copywriting";
  const tags = [
    "AI prompts",
    "content writing",
    "copywriting",
    "headlines",
    "long-form",
    "conversion copy",
    "editing",
    "ChatGPT",
    "Claude",
    "Gemini",
  ];
  const lastmod = "2025-06-19";

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
            alt="Before-and-after editing concept for copywriting on a futuristic display"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            width="1280" height="720"
          />
          <p className="mt-3 text-muted-foreground">
            Content writers and copywriters are under constant pressure to produce high-quality work at speed. Whether it’s a blog post, an ad campaign, or a sales page, the ability to write well—and write fast—can make a big difference to business success. AI can be a powerful creative partner, providing ideas, outlines, and drafts that you can refine into polished work.
          </p>
          <p className="mt-3 text-muted-foreground">
            This guide shares AI prompts specifically for content writers and copywriters to help you work smarter without losing your unique voice.
          </p>
        </header>

        <section className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">Why AI Complements, Not Replaces, Creative Writing</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Speeds up idea generation and research</li>
            <li>Provides alternative phrasings and perspectives</li>
            <li>Helps overcome writer’s block</li>
            <li>Allows more time for editing and refinement</li>
          </ul>

          <h2 className="text-2xl font-semibold">1. Headline Prompts</h2>
          <p>Catchy headlines pull readers in and set expectations.</p>
          <p><strong>SEO Headline Prompt:</strong><br />
            Write five SEO-optimised blog headlines about [topic] using the keyword “[keyword]” and keeping them under 60 characters.
          </p>
          <p><strong>Curiosity-Driven Prompt:</strong><br />
            Create three curiosity-based headlines for a blog post about [topic] that make readers want to click without being misleading.
          </p>

          <img
            src={midImage1}
            alt="Copywriter brainstorming headlines with colorful cards"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
            decoding="async"
            width="1280" height="720"
          />

          <h2 className="text-2xl font-semibold">2. Long-Form Content Prompts</h2>
          <p>Build articles, guides, or reports faster with structured outputs.</p>
          <p><strong>Blog Outline Prompt:</strong><br />
            Generate a detailed outline for a 1,500-word blog post on [topic], including section headings, sub-points, and recommended visuals.
          </p>
          <p><strong>Case Study Prompt:</strong><br />
            Create a case study structure for [product/service] including background, challenge, solution, and measurable results.
          </p>

          <img
            src={midImage2}
            alt="Laptop with content analytics dashboard in a cafe setting"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
            decoding="async"
            width="1280" height="720"
          />

          <h2 className="text-2xl font-semibold">3. Conversion-Focused Copy Prompts</h2>
          <p>Write copy that drives readers to take action.</p>
          <p><strong>Landing Page Prompt:</strong><br />
            Write persuasive copy for a landing page selling [product/service] to [audience]. Include headline, subheading, three benefit sections, and a strong call to action.
          </p>
          <p><strong>Email Sequence Prompt:</strong><br />
            Develop a three-email sequence for [offer] aimed at converting leads into customers. Focus on urgency and trust-building.
          </p>

          <h2 className="text-2xl font-semibold">4. Editing and Refinement Prompts</h2>
          <p>Improve clarity, flow, and tone without losing personality.</p>
          <p><strong>Tone Adjustment Prompt:</strong><br />
            Rewrite the following copy in a more conversational tone without losing key details.
          </p>
          <p><strong>Clarity Prompt:</strong><br />
            Edit the following paragraph to make it more concise and easier to read, keeping a professional tone.
          </p>

          <h2 className="text-2xl font-semibold">Final Thoughts</h2>
          <p>
            AI will not replace the creativity and insight of a human writer, but it can help you produce more high-quality work in less time. By using these prompts, you can keep your creative edge while meeting deadlines with ease.
          </p>

          <div className="mt-8">
            <Button asChild variant="cta">
              <Link to="/library">Explore the Prompt Library</Link>
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

export default AIPromptsForContentWriters;
