import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    articleSection: category,
    keywords: tags,
    image: origin ? `${origin}${imagePath}` : imagePath,
    author: {
      "@type": "Organization",
      name: "PromptAndGo.ai",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical || "",
    },
  };

  return (
    <main className="container py-10">
      <SEO title={seoTitle} description={description} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
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
            src={imagePath}
            alt="PromptAndGo.ai – ready-to-use prompts for better AI results"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
          />
          <p className="mt-3 text-muted-foreground">
            When you open a blank AI chat window, it’s like standing in front of a rocket with the keys in your hand. The potential is huge, but only if you know what to type.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{category}</Badge>
            {tags.map((t) => (
              <Badge key={t} variant="outline">{t}</Badge>
            ))}
          </div>
        </header>

        <section className="mt-8 space-y-6">
          <p>
            That’s where PromptAndGo.ai comes in. We give you ready-to-use, field-tested prompts designed for real work. No vague ideas, no guesswork, just clear instructions you can drop straight into ChatGPT, Claude, Gemini, or your favourite AI tool and get high-quality results immediately.
          </p>

          <h2 className="text-2xl font-semibold">Why We Built PromptAndGo.ai</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>People waste time writing and rewriting prompts from scratch</li>
            <li>Most “prompt lists” online are either too generic or too gimmicky</li>
            <li>There’s rarely context, tone guidance, or applied examples to make a prompt truly effective</li>
          </ul>
          <p>
            So we built a library where every prompt has a purpose, tested in real scenarios, with structure and context baked in.
          </p>

          <h2 className="text-2xl font-semibold">How the Prompt Library Works</h2>
          <img
            src="/lovable-uploads/f78e24df-2952-481d-8924-76e902ee2000.png"
            alt="How the PromptAndGo.ai prompt library works – AI prompts overview"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
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

          <h2 className="text-2xl font-semibold">Why Our Prompts Work</h2>
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
        </section>
      </article>
    </main>
  );
};

export default WelcomeToPromptAndGo;
