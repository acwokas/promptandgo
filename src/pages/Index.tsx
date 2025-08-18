import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import PageHero from "@/components/layout/PageHero";
import { Sparkles, Zap, ShieldCheck, ListChecks, Wand2, Rocket, Check, Search, Heart, Bot } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PromptCard } from "@/components/prompt/PromptCard";
import { usePersonalizedPrompts } from "@/hooks/usePersonalizedPrompts";
import AIPromptWidget from "@/components/ai/AIPromptWidget";
import PromptsOfTheDay from "@/components/prompt/PromptsOfTheDay";
import type { Category as CategoryType } from "@/data/prompts";

const Index = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { personalizedPrompts, hasPersonalization } = usePersonalizedPrompts();
  const { toast } = useToast();

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
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [catsRes, subsRes] = await Promise.all([
          supabase.from("categories").select("id,name,slug").order("name"),
          supabase.from("subcategories").select("id,name,slug,category_id").order("name"),
        ]);

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

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setNewsletterSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: {
          email: newsletterEmail.toLowerCase(),
          user_id: user?.id || null,
        }
      });

      if (error) throw error;

      toast({
        title: "Successfully subscribed!",
        description: "Welcome to our weekly prompt tips. Check your email for confirmation."
      });
      
      setNewsletterEmail("");
    } catch (error: any) {
      console.error('Newsletter signup error:', error);
      toast({
        title: "Subscription failed",
        description: "Sorry, something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setNewsletterSubmitting(false);
    }
  };

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
          <Button asChild size="default" variant="hero" className="px-6">
            <Link to="/library"><Search className="h-4 w-4 mr-2" />Browse Library</Link>
          </Button>
          <Button asChild size="default" variant="inverted">
            <Link to="/packs">⚡️Power Packs</Link>
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

        {/* Social Proof Section */}
        <section className="container pt-6 pb-2">
          <div className="text-center mb-8">
            <p className="text-muted-foreground mb-2">Trusted by 50,000+ professionals</p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <span>⭐⭐⭐⭐⭐ 4.9/5</span>
              <span>•</span>
              <span>1M+ prompts copied</span>
              <span>•</span>
              <span>500+ hours saved daily</span>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 mb-4">
            <Card className="bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">"These prompts saved me 5 hours per week on content creation. The marketing category alone paid for itself in one campaign."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">SJ</div>
                  <div>
                    <p className="text-sm font-medium">Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground">Marketing Director</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">"As a freelancer, these prompts help me deliver better work faster. The career section helped me land three new clients this month."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">MR</div>
                  <div>
                    <p className="text-sm font-medium">Michael Rodriguez</p>
                    <p className="text-xs text-muted-foreground">Freelance Writer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">"Game changer for our startup. We use the business prompts daily for everything from investor pitches to customer emails."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">AL</div>
                  <div>
                    <p className="text-sm font-medium">Alex Liu</p>
                    <p className="text-xs text-muted-foreground">Startup Founder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* AI Tools Compatibility */}
        <section className="container pt-2 pb-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Works seamlessly with your favourite AI tools</p>
            <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">✓</span>
                </div>
                ChatGPT
              </span>
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">✓</span>
                </div>
                Claude
              </span>
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">✓</span>
                </div>
                Gemini
              </span>
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">✓</span>
                </div>
                Perplexity
              </span>
            </div>
          </div>
        </section>
        <section className="container py-4">
          <h2 className="text-xl font-semibold mb-1">Popular Categories</h2>
          <p className="text-muted-foreground text-sm mb-4">Jump directly to our most popular prompt collections with thousands of ready-to-use examples.</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <article className="group rounded-lg border bg-card p-4 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-lg font-semibold">💼 Business & Marketing</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-3">Email campaigns, ad copy, social media content, and sales outreach that converts.</p>
              <div className="flex gap-2">
                <Button asChild variant="hero" size="sm">
                  <Link to="/library?q=marketing#library-results">Browse Marketing</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-lg border bg-card p-4 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-lg font-semibold">✍️ Content Creation</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-3">Blog posts, articles, creative writing, and storytelling prompts for any audience.</p>
              <div className="flex gap-2">
                <Button asChild variant="hero" size="sm">
                  <Link to="/library?q=content#library-results">Browse Content</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-lg border bg-card p-4 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-lg font-semibold">💬 Communication</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-3">Professional emails, presentations, and customer support responses.</p>
              <div className="flex gap-2">
                <Button asChild variant="hero" size="sm">
                  <Link to="/library?q=email#library-results">Browse Communication</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-lg border bg-card p-4 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-lg font-semibold">🎯 Career Development</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-3">Resume writing, interview prep, LinkedIn optimization, and job search strategies.</p>
              <div className="flex gap-2">
                <Button asChild variant="hero" size="sm">
                  <Link to="/library?q=career#library-results">Browse Career</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-lg border bg-card p-4 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-lg font-semibold">📊 Data & Analysis</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-3">Research, data analysis, reporting, and insights generation for better decisions.</p>
              <div className="flex gap-2">
                <Button asChild variant="hero" size="sm">
                  <Link to="/library?q=analysis#library-results">Browse Analysis</Link>
                </Button>
              </div>
            </article>
            <article className="group rounded-lg border bg-card p-4 ring-1 ring-primary/10 bg-gradient-to-br from-primary/10 to-transparent hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-lg font-semibold">🎓 Education & Learning</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-3">Lesson plans, explanations, tutorials, and educational content creation.</p>
              <div className="flex gap-2">
                <Button asChild variant="hero" size="sm">
                  <Link to="/library?q=education#library-results">Browse Education</Link>
                </Button>
              </div>
            </article>
          </div>
        </section>


        {/* Conditional Content Based on Login Status */}
        {user ? (
          // Logged-in users: Show Personalized Recommendations
          personalizedPrompts.length > 0 ? (
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
              <div className="mt-6 text-center space-x-3">
                <Button asChild variant="outline">
                  <Link to="/library">See All Your Recommendations →</Link>
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="ghost" 
                  size="sm"
                  className="text-xs"
                >
                  🔄 Refresh
                </Button>
              </div>
            </section>
          ) : (
            // Logged-in users without personalization: Show generic recommendations
            <section className="container py-6">
              <h2 className="text-2xl font-semibold mb-2">🎯 Recommended for You</h2>
              <p className="text-muted-foreground max-w-3xl mb-8">Get started by exploring some of our most popular prompts, or set up your preferences for personalized recommendations.</p>
              <div className="text-center space-y-4">
                <Button asChild variant="hero">
                  <Link to="/smart-suggestions">Set Up Personalized Suggestions</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/library">Browse All Prompts</Link>
                </Button>
              </div>
            </section>
          )
        ) : (
          // Non-logged-in users: Show Prompts of the Day
          <PromptsOfTheDay />
        )}

        {/* Newsletter Signup */}
        <section className="container py-6">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-3">🚀 Get Weekly Prompt Tips</h2>
              <p className="text-muted-foreground mb-6">Join 25,000+ professionals getting our best prompts, tips, and AI updates delivered to their inbox every Tuesday.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-2 rounded-md border bg-background"
                  disabled={newsletterSubmitting}
                />
                <Button 
                  type="submit" 
                  variant="hero" 
                  className="px-6"
                  disabled={newsletterSubmitting}
                >
                  {newsletterSubmitting ? "Subscribing..." : "Subscribe Free"}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-3">No spam. Unsubscribe anytime. Free forever.</p>
              
              {/* Social proof for newsletter */}
              <div className="mt-6 pt-4 border-t border-primary/10">
                <p className="text-xs text-muted-foreground mb-2">Recent subscriber feedback:</p>
                <div className="text-xs text-muted-foreground italic">
                  "These weekly tips have made me 3x better at prompting. Best AI newsletter I subscribe to!" — Jenny K.
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* AI Tools Section */}
        <section className="container py-6">
          <h2 className="text-2xl font-semibold mb-2">✨ Try our AI-Powered Tools</h2>
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
                  <Link to="/toolkit">
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
                  <Link to="/toolkit">
                    Try AI Assistant →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick FAQ Section */}
        <section className="container py-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Quick Questions</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Do I need to sign up?</h3>
                <p className="text-sm text-muted-foreground">Nope! Browse and copy prompts for free. Sign up only to save favorites and access power packs.</p>
              </div>
              
              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Works with free AI tools?</h3>
                <p className="text-sm text-muted-foreground">Yes! Most prompts work perfectly with free versions of ChatGPT, Claude, and other AI tools.</p>
              </div>
              
              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">How much does it cost?</h3>
                <p className="text-sm text-muted-foreground">Browsing is free forever. Premium packs start at $9.99 for specialized collections.</p>
              </div>
              
              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Can I use them commercially?</h3>
                <p className="text-sm text-muted-foreground">Yes! Use prompts and their outputs for any personal or commercial project.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Button asChild variant="ghost" size="sm">
              <Link to="/faqs#top">See All FAQs →</Link>
            </Button>
          </div>
        </section>

        {/* Pricing transparency hint */}
        <section className="container py-4">
          <div className="text-center bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">💡 Start Free, Upgrade When Ready</h3>
            <p className="text-sm text-muted-foreground">
              Browse thousands of prompts for free. Get premium collections starting at $9.99 when you need specialized prompts for your industry or project.
            </p>
            <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px]">✓</span>
                </div>
                Free browsing
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px]">✓</span>
                </div>
                No trial limits
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px]">✓</span>
                </div>
                No credit card needed
              </span>
            </div>
            <div className="mt-4">
              <Button asChild variant="hero" size="sm">
                <Link to="/library">Browse Prompt Library</Link>
              </Button>
            </div>
          </div>
        </section>

        <section aria-labelledby="cta-tail" className="relative bg-hero hero-grid mt-8" id="cta">
          <div className="container p-6 md:p-8 text-center text-primary-foreground">
            <h2 id="cta-tail" className="text-2xl md:text-3xl font-semibold tracking-tight">Whatever you're working on, someone's already used PromptAndGo to do it faster.</h2>
            <p className="mt-3 text-primary-foreground/85 text-base md:text-lg">✨ Ready to Start Prompting Smarter? Try your first prompt or explore a Power Pack, no sign-up required.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="hero" className="px-6">
                <Link to="/library"><Search className="h-4 w-4 mr-2" />Browse Library</Link>
              </Button>
              <Button asChild variant="inverted">
                <Link to="/packs">⚡️Power Packs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Index;