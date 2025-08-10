import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageHero from "@/components/layout/PageHero";

const Index = () => {
  return (
    <>
      <SEO
        title="Ready-to-use prompts for real-world work"
        description="PromptAndGo.ai gives you ready-to-use prompts designed for real-world work — writing pitches, planning launches, or automating outreach."
      />

      <main>
        {/* Hero */}
        <PageHero
          title={<>
            Find your perfect <span className="text-gradient-brand">AI</span> <span className="text-gradient-brand">prompt</span>, fast.
          </>}
          subtitle={<>Browse hundreds of human-curated prompts to help you write better, work smarter, and think bigger.</>}
        >
          <Button asChild size="lg" variant="hero" className="px-6">
            <Link to="/library">Browse by Category</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/packs">Explore Prompt Packs</Link>
          </Button>
        </PageHero>


        {/* Intro */}
        <section className="container py-16">
          <h2 className="text-2xl font-semibold mb-3">What is PromptAndGo.ai?</h2>
          <p className="text-muted-foreground max-w-3xl">
            PromptAndGo.ai gives you ready-to-use prompts designed for real-world work. Whether you're writing a pitch, planning a launch, or automating outreach — we've got a prompt for that.
          </p>
        </section>

        {/* Audience Cards */}
        <section className="container py-12">
          <h2 className="text-2xl font-semibold mb-2">Who it's for</h2>
          <p className="text-muted-foreground max-w-3xl">Explore Tailor-made prompts for Every Subject</p>
          <p className="text-muted-foreground max-w-3xl mb-8">Find the perfect starting point with curated AI prompts designed to help you learn, create, and do more — faster.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <article className="group rounded-xl border bg-card p-6 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-xl font-semibold">💼 Career &amp; Job Prompts</h3>
              <p className="text-muted-foreground mt-2">Write better resumes, prep smarter for interviews, and land your next role with AI prompts designed for real-world results.</p>
              <div className="mt-4">
                <Button asChild variant="secondary" size="sm">
                  <Link to="/library">Learn More</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-xl border bg-card p-6 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-xl font-semibold">🧠 Self &amp; Growth</h3>
              <p className="text-muted-foreground mt-2">Build better habits, sharpen your focus, and reflect more deeply with prompts designed to unlock your best self.</p>
              <div className="mt-4">
                <Button asChild variant="secondary" size="sm">
                  <Link to="/library">Learn More</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-xl border bg-card p-6 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-xl font-semibold">💬 Comms &amp; Messaging</h3>
              <p className="text-muted-foreground mt-2">Write clearer emails, sharper responses, and better internal docs — with AI prompts that get the tone right.</p>
              <div className="mt-4">
                <Button asChild variant="secondary" size="sm">
                  <Link to="/library">Learn More</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-xl border bg-card p-6 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-xl font-semibold">🎨 Creativity &amp; Writing</h3>
              <p className="text-muted-foreground mt-2">From idea to finished story — overcome writer’s block and generate concepts, hooks, and poetry with ease.</p>
              <div className="mt-4">
                <Button asChild variant="secondary" size="sm">
                  <Link to="/library">Learn More</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-xl border bg-card p-6 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-xl font-semibold">🎯 Sales &amp; Marketing</h3>
              <p className="text-muted-foreground mt-2">Craft high-converting ads, persuasive emails, compelling landing pages, and effective sales messages — designed to move people to act, not just skim.</p>
              <div className="mt-4">
                <Button asChild variant="secondary" size="sm">
                  <Link to="/library">Learn More</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-xl border bg-card p-6 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-xl font-semibold">🎓 Education &amp; Teachers</h3>
              <p className="text-muted-foreground mt-2">Generate lesson plans, explain complex concepts, and create classroom-ready activities — all with teacher-friendly, ethical AI prompts.</p>
              <div className="mt-4">
                <Button asChild variant="secondary" size="sm">
                  <Link to="/library">Learn More</Link>
                </Button>
              </div>
            </article>
          </div>
        </section>

        {/* Why Our Prompts Work */}
        <section className="container py-12">
          <h2 className="text-2xl font-semibold mb-6">Why Our Prompts Work</h2>
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <li className="rounded-lg border bg-card p-5">Built from real marketing and startup tasks</li>
            <li className="rounded-lg border bg-card p-5">Tested with ChatGPT, Claude, and Gemini</li>
            <li className="rounded-lg border bg-card p-5">Easy to adapt for your own brand or client</li>
            <li className="rounded-lg border bg-card p-5">No “prompt engineering” required</li>
          </ul>
        </section>
      </main>
    </>
  );
};

export default Index;
