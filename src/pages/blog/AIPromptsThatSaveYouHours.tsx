import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AIPromptsThatSaveYouHours = () => {
  const title = "AI Prompts That Save You Hours Every Week";
  const description =
    "Discover AI prompts that save you hours every week. Automate routine tasks, speed up decision-making, and boost productivity with these proven examples.";
  const heroImage = "/lovable-uploads/07189309-a3ae-4520-988b-ea83220f5935.png";
  const secondaryImage = "/lovable-uploads/94ca5534-1070-4bf0-a579-0445f417c302.png";
  const thirdImage = "/lovable-uploads/c85bfc5c-8d77-4e8d-af37-6c58b9647269.png";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = origin ? `${origin}/blog/ai-prompts-that-save-you-hours` : undefined;
  const category = "Productivity";
  const tags = [
    "AI prompts",
    "productivity",
    "automation",
    "time saving",
    "ChatGPT",
    "Claude",
    "Gemini",
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
      <SEO title={title} description={description} />
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
            alt="AI prompts that save time and boost productivity"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
          />
          <p className="mt-3 text-muted-foreground">
            Time is one of the most valuable resources in business. Every minute spent on repetitive tasks is a minute that could be used for growth and innovation. AI can take on a surprising range of everyday tasks, from scheduling and research to content creation and customer communication. The right prompts turn these tools into powerful time-savers, freeing you to focus on high-value work.
          </p>
          <p className="mt-3 text-muted-foreground">
            This guide highlights AI prompts that consistently save hours each week for business owners, marketers, and busy professionals.
          </p>
        </header>

        <section className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">Why AI Prompts Boost Productivity</h2>
          <p>AI prompts act like shortcuts to complex tasks. Instead of spending hours on manual work, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Generate professional content in seconds</li>
            <li>Summarise and analyse large amounts of data instantly</li>
            <li>Automate routine communication without losing the personal touch</li>
            <li>Streamline decision-making with fast, structured insights</li>
          </ul>

          <img
            src={secondaryImage}
            alt="Analyst using AI dashboards to accelerate research and analysis"
            className="mt-6 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
          />

          <h2 className="text-2xl font-semibold">1. Admin and Communication Prompts</h2>
          <p>Reduce time spent on day-to-day communications and scheduling.</p>
          <p><strong>Meeting Summary Prompt:</strong><br />
          Summarise the following meeting transcript into key decisions, assigned tasks, and deadlines. Present the output in a clear table format.</p>
          <p><strong>Follow-Up Email Prompt:</strong><br />
          Draft a polite follow-up email to a potential client who has not responded in two weeks. Offer value by including a relevant tip or resource.</p>
          <p><strong>Task Prioritisation Prompt:</strong><br />
          Based on the following to-do list, categorise each task into high, medium, and low priority, and suggest the optimal order for completion.</p>

          <h2 className="text-2xl font-semibold">2. Research and Analysis Prompts</h2>
          <p>Speed up data gathering and interpretation.</p>
          <p><strong>Competitor Snapshot Prompt:</strong><br />
          Analyse the following competitor website and summarise their main offers, target audience, and unique selling points in bullet points.</p>
          <p><strong>Market Trends Prompt:</strong><br />
          Identify five emerging trends in [industry] based on current news articles, blog posts, and reports. Explain why each trend matters for small businesses.</p>
          <p><strong>Customer Feedback Analysis Prompt:</strong><br />
          Review these customer reviews and summarise recurring complaints and positive feedback. Suggest three actionable improvements.</p>

          <h2 className="text-2xl font-semibold">3. Content Creation Prompts</h2>
          <p>Eliminate the blank page problem and produce content fast.</p>
          <p><strong>Social Post Batch Prompt:</strong><br />
          Create 10 social media post ideas for [product/service] that are designed to engage [specific audience]. Include a short caption and a suggested visual for each.</p>
          <p><strong>Blog Outline Prompt:</strong><br />
          Generate a detailed outline for a 1,500-word blog post on [topic], including section headings, bullet points for each section, and key points to cover.</p>
          <p><strong>Video Script Prompt:</strong><br />
          Write a one-minute video script promoting [product/service], including an opening hook, core message, and call to action.</p>

          <img
            src={thirdImage}
            alt="Dashboard visual showing time saved with AI prompts"
            className="mt-6 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
          />

          <h2 className="text-2xl font-semibold">Tips for Maximising Time Savings with AI</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Keep a library of your best-performing prompts for reuse</li>
            <li>Combine prompts to create complete workflows</li>
            <li>Provide the AI with as much relevant context as possible</li>
            <li>Review and refine AI outputs to maintain quality and accuracy</li>
          </ul>

          <h2 className="text-2xl font-semibold">Final Thoughts</h2>
          <p>
            AI prompts are more than a convenience—they are a way to scale your productivity without adding more hours to your day. By using the prompts in this guide, you can reclaim time for the work that truly moves your business forward.
          </p>
          <p>
            For more ready-to-use prompts across marketing, operations, and strategy, visit the PromptAndGo library.
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

export default AIPromptsThatSaveYouHours;
