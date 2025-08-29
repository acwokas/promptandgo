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
import ShareButton from "@/components/ShareButton";
import { AUTHOR_MAIN } from "./authors";

const WelcomeToPromptAndGo = () => {
  const title = "Welcome to PromptAndGo.ai: Your Shortcut to Smarter AI Prompts";
  const seoTitle = "Welcome to PromptAndGo.ai – Smarter AI Prompts Fast";
  const description = "Ready-to-use, field-tested prompts for ChatGPT, Claude, and Gemini to get high-quality results instantly.";
  const imagePath = "/lovable-uploads/0d60754a-943c-420b-9b4c-ee1718135377.png";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = typeof window !== "undefined" ? window.location.href : undefined;
  const category = "PromtpAndGo";
  const tags = [
    "AI productivity", "AI tools", "ChatGPT", "Claude", "Gemini",
    "prompt library", "AI workflow", "AI tips", "AI writing",
    "startup tools", "marketing AI", "productivity tools", "welcome"
];
const lastmod = "2024-11-22";

const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    articleSection: category,
    keywords: tags,
    image: origin ? `${origin}${imagePath}` : imagePath,
    datePublished: lastmod,
    dateModified: lastmod,
    author: {
      "@type": "Person",
      name: AUTHOR_MAIN.name,
      sameAs: AUTHOR_MAIN.sameAs,
    },
    publisher: {
      "@type": "Organization",
      name: "PromptAndGo.ai",
      logo: {
        "@type": "ImageObject",
        url: origin ? `${origin}/og-default.png` : "/og-default.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical || "",
    },
  };

  return (
    <main className="container mx-auto px-6 py-6 max-w-4xl">
      <SEO title={seoTitle} description={description} canonical={canonical} image={origin ? `${origin}${imagePath}` : imagePath} ogType="article" publishedTime={lastmod} modifiedTime={lastmod} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        <meta name="keywords" content={tags.join(", ")} />
        <meta property="article:section" content={category} />
        {tags.map((t) => (
          <meta key={t} property="article:tag" content={t} />
        ))}
        <link rel="preload" as="image" href={imagePath} fetchPriority="high" />
      </Helmet>

      {/* Breadcrumb */}
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
              <Link to="/tips">Tips</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Welcome to PromptAndGo.ai</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button */}
      <Link 
        to="/tips" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tips
      </Link>

      <article className="mx-auto max-w-3xl">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <time dateTime={lastmod}>
              {new Date(lastmod).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <span>•</span>
            <span>6 min read</span>
          </div>
          <img
            src={imagePath}
            alt="PromptAndGo.ai – ready-to-use prompts for better AI results"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            width="1280" height="720"
          />
          <p className="mt-3 text-muted-foreground">
            When you open a blank AI chat window, it’s like standing in front of a rocket with the keys in your hand. The potential is huge, but only if you know what to type.
          </p>
        </header>

        <div className="mb-4 flex justify-end">
          <ShareButton
            url={canonical || `${origin}/tips/welcome-to-promptandgo-ai`}
            contentType="blog"
            contentId="welcome-to-promptandgo-ai"
            title={title}
            variant="outline"
            size="sm"
            showText={true}
          />
        </div>

        <section className="mt-8 space-y-6">
          <p>
            That’s where PromptAndGo.ai comes in. We give you ready-to-use, field-tested prompts designed for real work. No vague ideas, no guesswork, just clear instructions you can drop straight into ChatGPT, Claude, Gemini, or your favourite AI tool and get high-quality results immediately.
          </p>

          <h2 className="text-2xl font-bold mb-4">Why We Built PromptAndGo.ai</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>People waste time writing and rewriting prompts from scratch</li>
            <li>Most “prompt lists” online are either too generic or too gimmicky</li>
            <li>There’s rarely context, tone guidance, or applied examples to make a prompt truly effective</li>
          </ul>
          <p>
            So we built a library where every prompt has a purpose, tested in real scenarios, with structure and context baked in.
          </p>

          <h2 className="text-2xl font-bold mb-4">How the Prompt Library Works</h2>
          <img
            src="/lovable-uploads/f78e24df-2952-481d-8924-76e902ee2000.png"
            alt="How the PromptAndGo.ai prompt library works – AI prompts overview"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
            decoding="async"
            width="1280" height="720"
          />
          <p>
            At the heart of PromptAndGo.ai is our query loop, a database of categorised prompts you can search and filter in different ways.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Categories and Subcategories:</strong> Drill down into exactly what you need.</li>
            <li><strong>Uniform Prompt Format:</strong> Category, tags, what it’s for, the prompt itself, and copy to clipboard for easy usage.</li>
            <li><strong>Multiple Search Paths:</strong> Browse by category, keyword, or cross-tags to discover related prompts.</li>
          </ul>
          <p>Once you load a prompt, you’ll see everything in one place, ready to copy and paste.</p>

          <h2 className="text-2xl font-semibold">Who It’s For</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Founders & Solopreneurs:</strong> Streamline startup tasks, pitch decks, and client comms.</li>
            <li><strong>Marketers & Copywriters:</strong> Craft strategies, campaigns, and content faster.</li>
            <li><strong>Productivity Nerds:</strong> Automate research, writing, and admin work.</li>
          </ul>
          <p>If you’ve ever thought, “There must be a faster way to do this,” there’s a good chance we’ve already written the prompt.</p>

          <h2 className="text-2xl font-bold mb-4">Why Our Prompts Work</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Real-world tested:</strong> Built from live client work and startup challenges.</li>
            <li><strong>Platform-ready:</strong> Works in ChatGPT, Claude, Gemini, and more without rewrites.</li>
            <li><strong>Adaptable:</strong> Clear tone and format guidance so you can customise for your brand or project.</li>
          </ul>

          <h2 className="text-2xl font-semibold">What’s Next for the Blog</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Share new prompt drops and feature updates</li>
            <li>Give prompting tips to make your AI results sharper</li>
            <li>Showcase case studies from real users</li>
          </ul>
          <p>Think of it as your AI productivity magazine, always focused on practical wins over hype.</p>

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

export default WelcomeToPromptAndGo;

