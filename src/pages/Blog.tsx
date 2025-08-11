import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
const Blog = () => {
  const { user } = useSupabaseAuth();
  return (
  <>
    <PageHero title={<>Prompt Pulse</>} subtitle={<>Tips, tricks and examples to get the most out of your prompting.</>} minHeightClass="min-h-[40vh]" />
    <main className="container py-10">
      <SEO title="Prompt Pulse – Prompt tips, tricks & examples" description="Tips, tricks and examples to get the most out of your prompting." />

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

    <section aria-labelledby="cta-tail" className="relative bg-hero hero-grid mt-16">
      <div className="container p-8 md:p-12 text-center text-primary-foreground">
        <h2 id="cta-tail" className="text-2xl md:text-3xl font-semibold tracking-tight">Whatever you’re working on, someone’s already used PromptAndGo to do it faster.</h2>
        <p className="mt-3 text-primary-foreground/85 text-base md:text-lg">✨ Ready to Start Prompting Smarter? Try your first prompt or explore a pack, no sign-up required.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="hero" className="px-6">
            <Link to="/library">Browse Prompt Library</Link>
          </Button>
          {user ? (
            <Button asChild size="lg" variant="secondary">
              <Link to="/account/favorites">My Prompts</Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="secondary">
              <Link to="/auth">Login</Link>
            </Button>
          )}
          <Button asChild size="lg" variant="inverted">
            <Link to="/packs">Explore Prompt Powerpacks</Link>
          </Button>
        </div>
      </div>
    </section>
  </main>
  </>
  );
};

export default Blog;
