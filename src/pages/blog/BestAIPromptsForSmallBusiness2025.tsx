import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BestAIPromptsForSmallBusiness2025 = () => {
  const title = "Best AI Prompts for Small Business Owners in 2025";
  const seoTitle = "Best AI Prompts for Small Business Owners (2025)";
  const description = "Discover the best AI prompts for small business owners in 2025. Use these ready-to-run examples to boost sales, streamline operations, and save hours each week.";
  const heroImage = "/lovable-uploads/f23788ee-b45e-4f84-808a-691c7e3c5e52.png";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = origin ? `${origin}/blog/best-ai-prompts-for-small-business-2025` : undefined;
  const category = "Small Business";
  const tags = [
    "AI prompts", "small business", "marketing", "operations", "sales",
    "productivity", "ChatGPT", "Claude", "Gemini", "2025"
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
      <SEO title={seoTitle} description={description} canonical={canonical} image={origin ? `${origin}${heroImage}` : heroImage} />
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
            alt="Small business owner using AI prompts on a laptop"
            className="mt-4 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
          />
          <p className="mt-3 text-muted-foreground">
            Running a small business in 2025 means wearing multiple hats at once. From marketing to operations, there are never enough hours in the day. AI has become an essential tool for business owners who want to work smarter, not harder. The right prompts can help you generate marketing content, create business strategies, and automate routine tasks in minutes.
          </p>
          <p className="mt-3 text-muted-foreground">
            This guide brings together some of the most effective AI prompts for small business owners, designed to help you save time, improve productivity, and grow your business. All examples are based on real-world use cases, with slight modifications so you can adapt them to your own needs.
          </p>
        </header>

        <section className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">Why AI Prompts Are a Game-Changer for Small Businesses</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Produce professional content without hiring extra staff</li>
            <li>Automate repetitive processes like reporting and scheduling</li>
            <li>Generate fresh ideas for products, services, and marketing campaigns</li>
            <li>Analyse customer data to make better decisions</li>
          </ul>
          <p>By learning how to use targeted prompts, you can get more done in less time while maintaining quality and consistency.</p>

          <h2 className="text-2xl font-semibold">1. Marketing Prompts to Attract More Customers</h2>
          <img
            src="/lovable-uploads/52cbbe6e-ce85-414e-a722-2d313ed8e827.png"
            alt="Team planning marketing content with AI insights"
            className="mt-3 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
          />
          <p>Your marketing strategy is the lifeline of your business. These prompts are designed to help you create engaging, high-quality content quickly.</p>
          <p><strong>Social Media Caption Prompt:</strong><br />
            Write five attention-grabbing Instagram captions for [product/service]. Each caption should highlight a unique benefit, include a call to action, and use an approachable, friendly tone.</p>
          <p><strong>Email Campaign Prompt:</strong><br />
            Create a three-part email sequence for [product/service] targeting [audience type]. The first email should introduce the offer, the second should provide value with tips or a guide, and the third should create urgency with a limited-time deal.</p>
          <p><strong>Blog Post Idea Generator:</strong><br />
            Generate 10 blog post ideas for [industry] that will attract organic search traffic and position my business as an authority.</p>

          <h2 className="text-2xl font-semibold">2. Operations Prompts to Streamline Your Workflow</h2>
          <p>Efficiency is key to running a profitable small business. These prompts help you create processes and tools that make your day-to-day easier.</p>
          <p><strong>Standard Operating Procedure (SOP) Prompt:</strong><br />
            Create a step-by-step standard operating procedure for [task] that includes tools needed, responsible roles, and expected timelines.</p>
          <p><strong>Meeting Summary Prompt:</strong><br />
            Summarise the following meeting notes into key takeaways, decisions made, and next steps. Highlight any deadlines or assigned responsibilities.</p>
          <p><strong>Inventory Management Prompt:</strong><br />
            Develop an inventory tracking template for [type of business], including reorder alerts, supplier contact details, and monthly stock reports.</p>

          <h2 className="text-2xl font-semibold">3. Sales Prompts to Close More Deals</h2>
          <img
            src="/lovable-uploads/d42c2e40-6ba5-4101-b1d5-e6dcec93dd18.png"
            alt="Happy customer with completed sale in a small business"
            className="mt-3 w-full rounded-lg border aspect-[16/9] object-cover"
            loading="lazy"
          />
          <p>Closing sales requires the right words at the right time. These prompts can help you craft persuasive messaging.</p>
          <p><strong>Sales Pitch Script Prompt:</strong><br />
            Write a short but compelling sales pitch for [product/service] that addresses a key customer pain point, explains the benefits, and includes a clear call to action.</p>
          <p><strong>Objection Handling Prompt:</strong><br />
            List the most common objections customers have about [product/service] and provide persuasive, customer-focused responses to overcome them.</p>
          <p><strong>Follow-Up Email Prompt:</strong><br />
            Write a follow-up email to a prospect who showed interest but has not responded. Make it polite, offer additional value, and include a reason to act now.</p>

          <h2 className="text-2xl font-semibold">Tips for Getting the Best Results from AI Prompts</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Be specific:</strong> The more details you provide, the better the output.</li>
            <li><strong>Test and refine:</strong> Run prompts multiple times and tweak them until you get the result you want.</li>
            <li><strong>Keep your brand voice consistent:</strong> Adjust the tone and style to match your business.</li>
            <li><strong>Combine prompts:</strong> Use multiple prompts together to create complete campaigns or workflows.</li>
          </ul>

          <h2 className="text-2xl font-semibold">Final Thoughts</h2>
          <p>
            AI is no longer a futuristic tool reserved for large corporations. In 2025, small business owners can use AI prompts to compete on a larger scale, improve efficiency, and free up time for higher-value work. Start with the prompts in this guide, adapt them to your industry, and watch how quickly they transform your daily operations.
          </p>
          <p>
            For even more ready-to-use prompts, explore the PromptAndGo library and find the perfect tools for your business.
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

export default BestAIPromptsForSmallBusiness2025;
