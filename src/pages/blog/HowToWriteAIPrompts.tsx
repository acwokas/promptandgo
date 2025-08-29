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


const HowToWriteAIPrompts = () => {
  const title = "How to Write AI Prompts That Actually Work";
  const description =
    "Learn how to write AI prompts that actually work. Follow these five rules to create prompts that produce accurate, useful, and consistent results every time.";
  const heroImage = "/lovable-uploads/07a07e3c-270d-4267-9143-81615a2c1611.png"; // Image 1
  const secondaryImage = "/lovable-uploads/cc4584af-ecc2-4ea7-9eb7-f6ec463c8ac6.png"; // Image 2
  const thirdImage = "/lovable-uploads/dc900dd9-dbc7-43f2-a4d5-4fef2011cea4.png"; // Image 3
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = origin ? `${origin}/tips/how-to-write-ai-prompts` : undefined;
  const category = "Prompting";
  const tags = [
    "AI prompts",
    "prompt engineering",
    "ChatGPT",
    "Claude",
    "Gemini",
    "copywriting",
    "productivity",
  ];
  const lastmod = "2025-01-03";

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
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <time dateTime={lastmod}>
              {new Date(lastmod).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <span>•</span>
            <span>8 min read</span>
          </div>
          <img
            src={heroImage}
            alt="Happy creator crafting effective AI prompts at a laptop"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            width="1280" height="720"
          />
          <p className="mt-3 text-muted-foreground">
            AI tools are now part of everyday business, but the quality of the results you get depends heavily on the quality of the prompts you give. A vague or poorly written prompt will often return generic, unhelpful answers. A clear, well-structured prompt can produce outputs that feel as if they were crafted by a skilled professional.
          </p>
          <p className="mt-3 text-muted-foreground">
            This guide explains how to write prompts that consistently deliver useful results, no matter which AI tool you are using. These methods work for business, creative projects, and personal productivity.
          </p>
        </header>

        <section className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">Why Prompt Quality Matters</h2>
          <p>
            When an AI tool responds, it is only following the instructions you provide. The better you define your goal, the easier it is for the AI to match your expectations. High-quality prompts:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Save time by reducing the need for multiple revisions</li>
            <li>Provide consistent results, even across different projects</li>
            <li>Allow the AI to work in your specific tone and style</li>
            <li>Increase the chances of getting output that is ready to use</li>
          </ul>

          <h2 className="text-2xl font-semibold">Rule 1: Be Specific About the Goal</h2>
          <p>
            Start by clearly stating what you want the AI to produce and the purpose behind it. If you need a marketing email, specify the audience, the main offer, and the tone. For example:
          </p>
          <p>
            <em>
              Write a 200-word email for small business owners, promoting a new accounting software. Highlight time savings, ease of use, and a limited-time discount.
            </em>
          </p>

          <h2 className="text-2xl font-semibold">Rule 2: Provide Relevant Context</h2>
          <p>
            The AI cannot read your mind. Include the background information it needs, such as industry, audience type, and any constraints. Context makes the output relevant and tailored.
          </p>

          <h2 className="text-2xl font-semibold">Rule 3: Define the Structure of the Output</h2>
          <p>
            If you need bullet points, numbered steps, or specific sections, say so in the prompt. Structure helps the AI organise the information in a way that is immediately useful.
          </p>

          <h2 className="text-2xl font-semibold">Rule 4: Specify the Tone and Style</h2>
          <p>
            Decide whether you want a formal, conversational, technical, or persuasive tone. Include examples if possible. This keeps your brand voice consistent and prevents generic results.
          </p>

          <img
            src={secondaryImage}
            alt="Side-by-side comparison showing a bad prompt vs a good prompt"
            className="mt-3 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
            decoding="async"
            width="1280" height="720"
          />

          <h2 className="text-2xl font-semibold">Rule 5: Test and Refine</h2>
          <p>
            Do not settle for the first output. Test different variations of your prompt, compare results, and adjust until you find the structure that works best. Save your best prompts so you can reuse them.
          </p>

          <img
            src={thirdImage}
            alt="Team collaborating with AI using effective prompts"
            className="mt-3 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
            decoding="async"
            width="1280" height="720"
          />

          <h2 className="text-2xl font-semibold">Common Prompt Mistakes to Avoid</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Being too vague (e.g. “Write an article about marketing” with no details)</li>
            <li>Skipping the audience definition</li>
            <li>Forgetting to include a desired format</li>
            <li>Asking for too many unrelated things in one prompt</li>
          </ul>

          <h2 className="text-2xl font-semibold">Final Thoughts</h2>
          <p>
            Writing effective prompts is a skill that improves with practice. The more detail you provide, the more useful the AI’s output will be. Start applying the five rules in this guide, and you will see immediate improvements in the quality of your AI-generated content.
          </p>
          <p>
            To find ready-to-use, high-performing prompts for your business, visit the PromptAndGo library.
          </p>

          <div className="mt-8">
            <Button asChild variant="cta">
              <Link to="/library">Explore the Prompt Library</Link>
            </Button>
          </div>

          <nav aria-labelledby="see-also" className="mt-6">
            <h3 id="see-also" className="text-lg font-semibold">See also</h3>
            <div className="flex flex-wrap gap-3">
              <Link to="/library?q=marketing" className="underline underline-offset-4">Marketing prompts</Link>
              <Link to="/library?q=productivity" className="underline underline-offset-4">Productivity prompts</Link>
              <Link to="/library?q=sales" className="underline underline-offset-4">Sales prompts</Link>
              <Link to="/packs" className="underline underline-offset-4">⚡️Power Packs</Link>
            </div>
          </nav>

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


export default HowToWriteAIPrompts;
