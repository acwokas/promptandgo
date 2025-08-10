import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Blog = () => (
  <main className="container py-10">
    <SEO title="Resources – Prompt tips, tricks & examples" description="Tips, tricks and examples to get the most out of your prompting." />
    <h1 className="text-3xl font-bold mb-2">Resources</h1>
    <p className="text-muted-foreground">Tips, tricks and examples to get the most of our your prompting.</p>

    <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article>
        <Link to="/blog/welcome-to-promptandgo-ai" className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <Card className="overflow-hidden">
            <img
              src="/lovable-uploads/66b1134b-1d55-416b-b7ea-2719a1a22ec1.png"
              alt="Welcome to PromptAndGo.ai: Your Shortcut to Smarter AI Prompts"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <CardContent className="pt-4">
              <h2 className="text-xl font-semibold leading-snug">Welcome to PromptAndGo.ai: Your Shortcut to Smarter AI Prompts</h2>
              <p className="mt-2 text-muted-foreground">
                Welcome to a platform which has ready-to-use, field-tested prompts for the likes of ChatGPT, Claude, Gemini, Ideogram, Midjourney and others. Get high-quality results immediately.
              </p>
              <span className="mt-3 inline-block font-medium text-primary">Read more →</span>
            </CardContent>
          </Card>
        </Link>
      </article>
    </section>
  </main>
);

export default Blog;
