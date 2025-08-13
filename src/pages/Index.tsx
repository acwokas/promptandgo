import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import PageHero from "@/components/layout/PageHero";
import { Sparkles, Zap, ShieldCheck, ListChecks, Wand2, Rocket, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { PromptCard } from "@/components/prompt/PromptCard";
import { usePersonalizedPrompts } from "@/hooks/usePersonalizedPrompts";
import AIPromptWidget from "@/components/ai/AIPromptWidget";
import type { Category as CategoryType } from "@/data/prompts";

const Index = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { personalizedPrompts, hasPersonalization } = usePersonalizedPrompts();

  type HP = {
    id: string;
    categoryId?: string | null;
    subcategoryId?: string | null;
    title: string;
    whatFor?: string | null;
    prompt: string;
    excerpt?: string | null;
    tags: string[];
    isPro?: boolean;
  };

  const [slides, setSlides] = useState<HP[]>([]);
  const [homeCategories, setHomeCategories] = useState<CategoryType[]>([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [promptsRes, catsRes, subsRes] = await Promise.all([
          supabase
            .from("prompts")
            .select("id, category_id, subcategory_id, title, what_for, prompt, excerpt, is_pro")
            .order("created_at", { ascending: false })
            .limit(200),
          supabase.from("categories").select("id,name,slug").order("name"),
          supabase.from("subcategories").select("id,name,slug,category_id").order("name"),
        ]);
        if (promptsRes.error) throw promptsRes.error;
        const rows = promptsRes.data || [];
        if (rows.length === 0) { setSlides([]); }

        // Build categories list for PromptCard labels
        if (!catsRes.error && !subsRes.error) {
          const subcatByCategory = new Map<string, { id: string; name: string }[]>();
          (subsRes.data || []).forEach((s: any) => {
            const list = subcatByCategory.get(s.category_id as string) || [];
            list.push({ id: s.id as string, name: s.name as string });
            subcatByCategory.set(s.category_id as string, list);
          });
          const built: CategoryType[] = (catsRes.data || []).map((c: any) => ({
            id: c.id as string,
            name: c.name as string,
            subcategories: subcatByCategory.get(c.id as string) || [],
          }));
          setHomeCategories(built);
        }

        if (rows.length > 0) {
          const byCat = new Map<string, any[]>();
          rows.forEach((r: any) => {
            const cid = r.category_id || "misc";
            const arr = byCat.get(cid) || [];
            arr.push(r);
            byCat.set(cid, arr);
          });
          const sortedCats = Array.from(byCat.entries()).sort((a, b) => b[1].length - a[1].length);
          const take = Math.min(6, sortedCats.length);
          const picks: HP[] = [];
          for (let i = 0; i < take; i++) {
            const list = sortedCats[i][1];
            const pick = list[Math.floor(Math.random() * list.length)];
            picks.push({
              id: pick.id,
              categoryId: pick.category_id,
              subcategoryId: pick.subcategory_id,
              title: pick.title,
              whatFor: pick.what_for,
              prompt: pick.prompt,
              excerpt: pick.excerpt,
              tags: [],
              isPro: !!pick.is_pro,
            });
          }
          setSlides(picks);
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    const id = window.setInterval(() => {
      try { carouselApi.scrollNext(); } catch {}
    }, 5000);
    return () => window.clearInterval(id);
  }, [carouselApi]);

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
          subtitle={<>Browse thousands of human-curated prompts to help you write better, work smarter, and think bigger.</>}
        >
          <Button asChild size="lg" variant="hero" className="px-6">
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
            <Link to="/packs">Explore ⚡️Power Packs</Link>
          </Button>
        </PageHero>

        {/* Top Widget Section */}
        <section className="container pt-6 pb-2">
          <div className="grid gap-6 md:grid-cols-2">
            {/* What is PromptAndGo.ai? */}
            <div className="rounded-2xl border bg-card p-6 md:p-8 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-3">What is PromptAndGo.ai?</h2>
              <p className="text-muted-foreground max-w-prose mb-6">
                Ready-to-use prompts designed for real-world work. Whether you're writing a pitch, planning a launch, creating some social media assets or creating an image, we've got a prompt for that.
              </p>
              <ul className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Human-curated</li>
                <li className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary" /> Practical results</li>
                <li className="flex items-center gap-2"><Wand2 className="h-5 w-5 text-primary" /> Copy-and-go</li>
                <li className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> Works everywhere</li>
              </ul>
            </div>
            
            {/* AI Prompt Generator Widget */}
            <div className="w-full">
              <AIPromptWidget />
            </div>
          </div>
        </section>

        {/* Personalized Recommendations for Homepage */}
        {hasPersonalization && personalizedPrompts.length > 0 && (
          <section className="container py-6">
            <h2 className="text-2xl font-semibold mb-2">🎯 Recommended for You</h2>
            <p className="text-muted-foreground max-w-3xl mb-8">Based on your preferences, here are some prompts we think you'll love.</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {personalizedPrompts.slice(0, 3).map((p) => (
                <div key={p.id} className="relative group">
                  <PromptCard
                    prompt={p as any}
                    categories={homeCategories}
                    onCategoryClick={(cid) => navigate(`/library?categoryId=${cid}`)}
                    onSubcategoryClick={(sid, cid) => navigate(`/library?categoryId=${cid}&subcategoryId=${sid}`)}
                    onCopyClick={() => navigate(`/library?categoryId=${p.categoryId || ""}${p.subcategoryId ? `&subcategoryId=${p.subcategoryId}` : ""}`)}
                  />
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full border-2 border-background shadow-sm">
                    {Math.round(p.relevanceScore)}% match
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button asChild variant="outline">
                <Link to="/library">See All Your Recommendations →</Link>
              </Button>
            </div>
          </section>
        )}

        {/* AI Tools Section */}
        <section className="container py-6">
          <h2 className="text-2xl font-semibold mb-2">✨ AI-Powered Tools</h2>
          <p className="text-muted-foreground max-w-3xl mb-6">Enhance your prompting with our intelligent tools and personalized recommendations.</p>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-accent" />
                  🎯 Smart Suggestions
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Get personalized prompt recommendations based on your preferences
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-muted-foreground py-4 text-sm">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <p>Discover prompts tailored just for you</p>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/smart-suggestions">
                    Get Smart Suggestions →
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wand2 className="h-5 w-5 text-secondary" />
                  🤖 AI Assistant
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Chat with our AI to refine and improve your prompts
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-muted-foreground py-4 text-sm">
                  <Wand2 className="h-8 w-8 mx-auto mb-2 text-secondary" />
                  <p>Get expert help crafting better prompts</p>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/ai-assistant">
                    Try AI Assistant →
                  </Link>
                </Button>
              </CardContent>
            </Card>
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
              <p className="text-muted-foreground mt-2">From idea to finished story — overcome writer's block and generate concepts, hooks, and poetry with ease.</p>
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



        {/* Featured Prompts Carousel */}
        <section className="container py-6" aria-labelledby="featured-prompts">
          <h2 id="featured-prompts" className="text-2xl font-semibold mb-4">Prompts of the Day</h2>
          <Carousel setApi={setCarouselApi} opts={{ loop: true, align: "start" }}>
            <CarouselContent>
              {slides.map((p) => (
                <CarouselItem key={p.id} className="md:basis-1/2 lg:basis-1/3">
                  <PromptCard
                    prompt={p as any}
                    categories={homeCategories}
                    onCategoryClick={(cid) => navigate(`/library?categoryId=${cid}`)}
                    onSubcategoryClick={(sid, cid) => navigate(`/library?categoryId=${cid}&subcategoryId=${sid}`)}
                    onCopyClick={() => navigate(`/library?categoryId=${p.categoryId || ""}${p.subcategoryId ? `&subcategoryId=${p.subcategoryId}` : ""}`)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-6 md:-left-10" />
            <CarouselNext className="-right-6 md:-right-10" />
          </Carousel>
        </section>

        {/* Feature Strip (moved below carousel) */}
        <section className="container pt-2 pb-6" aria-labelledby="why-prompts-work">
          <h2 id="why-prompts-work" className="text-2xl font-semibold mb-4">Why Our Prompts Work</h2>
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

        <section aria-labelledby="cta-tail" className="relative bg-hero hero-grid mt-8" id="cta">
          <div className="container p-6 md:p-8 text-center text-primary-foreground">
            <h2 id="cta-tail" className="text-2xl md:text-3xl font-semibold tracking-tight">Whatever you're working on, someone's already used PromptAndGo to do it faster.</h2>
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
                <Link to="/packs">Explore ⚡️Power Packs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Index;