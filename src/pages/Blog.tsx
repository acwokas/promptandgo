import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
const Blog = () => {
  const { user } = useSupabaseAuth();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = origin ? `${origin}/blog` : undefined;
  return (
  <>
    <PageHero title={<>Tips</>} subtitle={<>Tips, tricks and examples to get the most out of your prompting.</>} minHeightClass="min-h-[28vh]">
      <Button asChild size="lg" variant="hero" className="px-6">
        <Link to="/library#library-filters">Browse Prompt Library</Link>
      </Button>
      {user ? (
        <Button asChild size="lg" variant="secondary">
          <Link to="/my-prompts">My Prompts</Link>
        </Button>
      ) : (
        <Button asChild size="lg" variant="secondary">
          <Link to="/auth">Login</Link>
        </Button>
      )}
      <Button asChild size="lg" variant="inverted">
        <Link to="/packs">Explore ⚡️Power Packs</Link>
      </Button>
    </PageHero>
    <main className="container py-10">
      <SEO title="Tips – Prompt tips, tricks & examples" description="Tips, tricks and examples to get the most out of your prompting." canonical={canonical} />

    <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article>
        <Link to="/blog/welcome-to-promptandgo-ai" className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <Card className="overflow-hidden">
            <img
              src="/lovable-uploads/66b1134b-1d55-416b-b7ea-2719a1a22ec1.png"
              alt="Welcome to promptandgo: Your Shortcut to Smarter AI Prompts"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <CardContent className="pt-4">
              <h2 className="text-xl font-semibold leading-snug">Welcome to <strong>prompt</strong>andgo: Your Shortcut to Smarter AI Prompts</h2>
              <p className="mt-2 text-muted-foreground">
                Welcome to a platform which has ready-to-use, field-tested prompts for the likes of ChatGPT, Claude, Gemini, Ideogram, Midjourney and others. Get high-quality results immediately.
              </p>
              <span className="mt-3 inline-block font-medium text-primary">Read more →</span>
            </CardContent>
          </Card>
        </Link>
      </article>
      <article>
        <Link to="/blog/best-ai-prompts-for-small-business-2025" className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <Card className="overflow-hidden">
            <img
              src="/lovable-uploads/f23788ee-b45e-4f84-808a-691c7e3c5e52.png"
              alt="Best AI Prompts for Small Business Owners in 2025"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <CardContent className="pt-4">
              <h2 className="text-xl font-semibold leading-snug">Best AI Prompts for Small Business Owners in 2025</h2>
              <p className="mt-2 text-muted-foreground">
                Discover ready-to-run prompts to boost sales, streamline operations, and save hours each week.
              </p>
              <span className="mt-3 inline-block font-medium text-primary">Read more →</span>
            </CardContent>
          </Card>
        </Link>
      </article>
      <article>
        <Link to="/blog/how-to-write-ai-prompts" className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <Card className="overflow-hidden">
            <img
              src="/lovable-uploads/cc4584af-ecc2-4ea7-9eb7-f6ec463c8ac6.png"
              alt="Good prompt vs bad prompt illustration"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <CardContent className="pt-4">
              <h2 className="text-xl font-semibold leading-snug">How to Write AI Prompts That Actually Work</h2>
              <p className="mt-2 text-muted-foreground">
                Follow five proven rules to craft prompts that deliver accurate, useful and consistent results.
              </p>
              <span className="mt-3 inline-block font-medium text-primary">Read more →</span>
            </CardContent>
          </Card>
        </Link>
      </article>
      <article>
        <Link to="/blog/ai-prompts-that-save-you-hours" className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <Card className="overflow-hidden">
            <img
              src="/lovable-uploads/94ca5534-1070-4bf0-a579-0445f417c302.png"
              alt="AI Prompts That Save You Hours Every Week"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <CardContent className="pt-4">
              <h2 className="text-xl font-semibold leading-snug">AI Prompts That Save You Hours Every Week</h2>
              <p className="mt-2 text-muted-foreground">
                Automate routine tasks and boost productivity with proven prompts for busy teams.
              </p>
              <span className="mt-3 inline-block font-medium text-primary">Read more →</span>
            </CardContent>
          </Card>
        </Link>
      </article>
      <article>
        <Link to="/blog/ai-prompts-for-marketing-campaigns" className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <Card className="overflow-hidden">
            <img
              src="/ai-prompts-email-social-icons.png"
              alt="AI Prompts for Marketing Campaigns That Convert"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <CardContent className="pt-4">
              <h2 className="text-xl font-semibold leading-snug">AI Prompts for Marketing Campaigns That Convert</h2>
              <p className="mt-2 text-muted-foreground">
                From ad copy to social captions, use these prompts to boost engagement and sales.
              </p>
              <span className="mt-3 inline-block font-medium text-primary">Read more →</span>
            </CardContent>
          </Card>
        </Link>
      </article>
      <article>
        <Link to="/blog/ai-prompts-for-customer-support" className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <Card className="overflow-hidden">
            <img
              src="/lovable-uploads/b9bbcee0-042a-4751-9c30-dfc61fe9a846.png"
              alt="AI Prompts for Customer Support Teams"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <CardContent className="pt-4">
              <h2 className="text-xl font-semibold leading-snug">AI Prompts for Customer Support Teams</h2>
              <p className="mt-2 text-muted-foreground">
                Automate responses, generate FAQs, and handle complex queries faster.
              </p>
              <span className="mt-3 inline-block font-medium text-primary">Read more →</span>
            </CardContent>
          </Card>
        </Link>
      </article>
      <article>
        <Link to="/blog/ai-prompts-for-social-media-content" className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <Card className="overflow-hidden">
            <img
              src="/lovable-uploads/a619c09b-001e-470b-beff-59e90dcd0a60.png"
              alt="AI Prompts for Social Media Content That Stands Out"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <CardContent className="pt-4">
              <h2 className="text-xl font-semibold leading-snug">AI Prompts for Social Media Content That Stands Out</h2>
              <p className="mt-2 text-muted-foreground">
                Create social media content that gets noticed. Prompts for posts, captions, and engagement ideas in minutes.
              </p>
              <span className="mt-3 inline-block font-medium text-primary">Read more →</span>
            </CardContent>
          </Card>
        </Link>
      </article>
      <article>
        <Link to="/blog/ai-prompts-for-content-writers" className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <Card className="overflow-hidden">
            <img
              src="/lovable-uploads/d350e5ca-08b4-4c34-adae-de4287b5aedb.png"
              alt="AI Prompts for Content Writers and Copywriters"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <CardContent className="pt-4">
              <h2 className="text-xl font-semibold leading-snug">AI Prompts for Content Writers and Copywriters</h2>
              <p className="mt-2 text-muted-foreground">
                Boost creativity and speed with these AI prompts for content writers and copywriters. From headlines to long-form articles, these examples get results.
              </p>
              <span className="mt-3 inline-block font-medium text-primary">Read more →</span>
            </CardContent>
          </Card>
        </Link>
      </article>
      <article>
        <Link to="/blog/ai-prompts-for-business-strategy" className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <Card className="overflow-hidden">
            <img
              src="/lovable-uploads/f0a62b1b-6fae-4b41-8211-30a3c0ed8ee7.png"
              alt="AI Prompts for Business Strategy and Planning"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <CardContent className="pt-4">
              <h2 className="text-xl font-semibold leading-snug">AI Prompts for Business Strategy and Planning</h2>
              <p className="mt-2 text-muted-foreground">
                Plan smarter with AI prompts for strategy: SWOTs, growth roadmaps, market insights, and more.
              </p>
              <span className="mt-3 inline-block font-medium text-primary">Read more →</span>
            </CardContent>
          </Card>
        </Link>
      </article>
    </section>

    <section aria-labelledby="cta-tail" className="relative bg-hero hero-grid mt-16">
      <div className="container p-8 md:p-12 text-center text-primary-foreground">
        <h2 id="cta-tail" className="text-2xl md:text-3xl font-semibold tracking-tight">Whatever you’re working on, someone’s already used <strong>prompt</strong>andgo to do it faster.</h2>
        <p className="mt-3 text-primary-foreground/85 text-base md:text-lg">✨ Ready to Start Prompting Smarter? Try your first prompt or explore a Power Pack, no sign-up required.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="hero" className="px-6">
            <Link to="/library">Browse Prompt Library</Link>
          </Button>
          {user ? (
            <Button asChild size="lg" variant="secondary">
              <Link to="/my-prompts">My Prompts</Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="secondary">
              <Link to="/auth">Login</Link>
            </Button>
          )}
          <Button asChild size="lg" variant="inverted">
            <Link to="/packs">Explore ⚡️Power Packs</Link>
          </Button>
        </div>
      </div>
    </section>
  </main>
  </>
  );
};

export default Blog;
