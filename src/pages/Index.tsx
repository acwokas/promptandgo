import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Ready-to-use prompts for real-world work"
        description="PromptAndGo.ai gives you ready-to-use prompts designed for real-world work — writing pitches, planning launches, or automating outreach."
      />
      <Header />

      <main>
        {/* Hero */}
        <section className="relative bg-hero hero-grid">
          <div className="container min-h-[62vh] flex flex-col items-center justify-center text-center py-20">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl">
              Ready-to-use prompts for real-world work
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl">
              Whether you're writing a pitch, planning a launch, or automating outreach — we've got a prompt for that.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" variant="hero" className="px-6">
                <Link to="#cta">Get 3 Free Prompts Weekly</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/library">Browse Prompt Library</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="container py-16">
          <h2 className="text-2xl font-semibold mb-3">What is PromptAndGo.ai?</h2>
          <p className="text-muted-foreground max-w-3xl">
            PromptAndGo.ai gives you ready-to-use prompts designed for real-world work. Whether you're writing a pitch, planning a launch, or automating outreach — we've got a prompt for that.
          </p>
        </section>

        {/* Audience Cards */}
        <section className="container py-12">
          <h2 className="text-2xl font-semibold mb-6">Who it's for</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold">Founders & Solopreneurs</h3>
              <p className="text-muted-foreground mt-2">Streamline startup tasks and communications.</p>
            </article>
            <article className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold">Marketers & Copywriters</h3>
              <p className="text-muted-foreground mt-2">Craft compelling copy and strategies.</p>
            </article>
            <article className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold">Productivity Nerds</h3>
              <p className="text-muted-foreground mt-2">Automate and accelerate your workflow.</p>
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

      <Footer />
    </div>
  );
};

export default Index;
