import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageHero from "@/components/layout/PageHero";
import { Sparkles, Zap, ShieldCheck, ListChecks, Wand2, Rocket, Check } from "lucide-react";

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
        <section className="container pt-8 pb-4">
          <div className="rounded-2xl border bg-card p-6 md:p-8 animate-fade-in">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-2xl font-semibold mb-3">What is PromptAndGo.ai?</h2>
                <p className="text-muted-foreground max-w-prose">
                  Ready-to-use prompts designed for real-world work. Whether you're writing a pitch, planning a launch, creating some social media assets or creating an image, we've got a prompt for that.
                </p>
                <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Human-curated</li>
                  <li className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary" /> Practical results</li>
                  <li className="flex items-center gap-2"><Wand2 className="h-5 w-5 text-primary" /> Copy-and-go</li>
                  <li className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> Works everywhere</li>
                </ul>
              </div>
              <div className="grid grid-cols-3 gap-4 justify-items-center">
                <div className="rounded-xl border bg-card p-6 text-center hover-scale">
                  <Sparkles className="h-8 w-8 text-primary mx-auto" />
                  <p className="mt-2 text-sm text-muted-foreground">Ideas</p>
                </div>
                <div className="rounded-xl border bg-card p-6 text-center hover-scale">
                  <Rocket className="h-8 w-8 text-primary mx-auto" />
                  <p className="mt-2 text-sm text-muted-foreground">Launches</p>
                </div>
                <div className="rounded-xl border bg-card p-6 text-center hover-scale">
                  <ShieldCheck className="h-8 w-8 text-primary mx-auto" />
                  <p className="mt-2 text-sm text-muted-foreground">Reliable</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Strip */}
        <section className="container pt-4 pb-6">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border p-6 bg-card/50 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Curated by humans</h3>
                  <p className="text-sm text-muted-foreground flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /><span>Every prompt is reviewed for clarity and usefulness.</span></p>
                </div>
              </div>
            </article>
            <article className="rounded-xl border p-6 bg-card/50 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Works everywhere</h3>
                  <p className="text-sm text-muted-foreground flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /><span>Use with ChatGPT, Claude, Gemini, or your AI of choice.</span></p>
                </div>
              </div>
            </article>
            <article className="rounded-xl border p-6 bg-card/50 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="flex items-start gap-3">
                <ListChecks className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">No fluff, just results</h3>
                  <p className="text-sm text-muted-foreground flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /><span>Practical outputs you can ship, not buzzwords.</span></p>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Audience Cards */}
        <section className="container py-6">
          <h2 className="text-2xl font-semibold mb-2">Who it's for</h2>
          <p className="text-muted-foreground max-w-3xl mb-8">Explore tailor-made prompts for every subject and find the perfect starting point with curated AI prompts designed to help you learn, create, and do more, faster.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <article className="group rounded-xl border bg-card p-6 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-xl font-semibold">💼 Career &amp; Job Prompts</h3>
              <p className="text-muted-foreground mt-2">Write better resumes, prep smarter for interviews, and land your next role with AI prompts designed for real-world results.</p>
              <div className="mt-4">
                <Button asChild variant="hero" size="sm">
                  <Link to="/library">Learn More</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-xl border bg-card p-6 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-xl font-semibold">🧠 Self &amp; Growth</h3>
              <p className="text-muted-foreground mt-2">Build better habits, sharpen your focus, and reflect more deeply with prompts designed to unlock your best self.</p>
              <div className="mt-4">
                <Button asChild variant="hero" size="sm">
                  <Link to="/library">Learn More</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-xl border bg-card p-6 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-xl font-semibold">💬 Comms &amp; Messaging</h3>
              <p className="text-muted-foreground mt-2">Write clearer emails, sharper responses, and better internal docs — with AI prompts that get the tone right.</p>
              <div className="mt-4">
                <Button asChild variant="hero" size="sm">
                  <Link to="/library">Learn More</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-xl border bg-card p-6 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-xl font-semibold">🎨 Creativity &amp; Writing</h3>
              <p className="text-muted-foreground mt-2">From idea to finished story — overcome writer’s block and generate concepts, hooks, and poetry with ease.</p>
              <div className="mt-4">
                <Button asChild variant="hero" size="sm">
                  <Link to="/library">Learn More</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-xl border bg-card p-6 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-xl font-semibold">🎯 Sales &amp; Marketing</h3>
              <p className="text-muted-foreground mt-2">Craft high-converting ads, persuasive emails, compelling landing pages, and effective sales messages — designed to move people to act, not just skim.</p>
              <div className="mt-4">
                <Button asChild variant="hero" size="sm">
                  <Link to="/library">Learn More</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-xl border bg-card p-6 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-xl font-semibold">🎓 Education &amp; Teachers</h3>
              <p className="text-muted-foreground mt-2">Generate lesson plans, explain complex concepts, and create classroom-ready activities — all with teacher-friendly, ethical AI prompts.</p>
              <div className="mt-4">
                <Button asChild variant="hero" size="sm">
                  <Link to="/library">Learn More</Link>
                </Button>
              </div>
            </article>
          </div>
        </section>

        {/* Why Our Prompts Work */}
        <section className="container py-6">
          <h2 className="text-2xl font-semibold mb-6">Why Our Prompts Work</h2>
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <li className="rounded-lg border bg-card p-5">Built from real marketing and startup tasks</li>
            <li className="rounded-lg border bg-card p-5">Tested with ChatGPT, Claude, and Gemini</li>
            <li className="rounded-lg border bg-card p-5">Easy to adapt for your own brand or client</li>
            <li className="rounded-lg border bg-card p-5">No “prompt engineering” required</li>
          </ul>
        </section>
        <section aria-labelledby="cta-tail" className="max-w-5xl mx-auto mt-8">
          <div className="rounded-2xl border bg-gradient-to-br from-primary/10 to-transparent p-6 md:p-8 text-center">
            <h2 id="cta-tail" className="text-2xl md:text-3xl font-semibold tracking-tight">Whatever you’re working on, someone’s already used PromptAndGo to do it faster.</h2>
            <p className="mt-3 text-muted-foreground text-base md:text-lg">✨ Ready to Start Prompting Smarter? Try your first prompt or explore a pack, no sign-up required.</p>
            <div className="mt-6 flex justify-center">
              <Button asChild variant="hero">
                <Link to="/library">Browse Prompt Library</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Index;
