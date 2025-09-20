import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import PageHero from "@/components/layout/PageHero";
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  ListChecks, 
  Wand2, 
  Rocket, 
  Check, 
  Search, 
  Heart, 
  Bot, 
  Star, 
  Briefcase, 
  Image, 
  ShoppingCart, 
  BarChart3, 
  BookOpen, 
  Edit3, 
  Settings 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useNewsletterStatus } from "@/hooks/useNewsletterStatus";
import { MatchedPowerPacks } from "@/components/MatchedPowerPacks";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PromptCard } from "@/components/prompt/PromptCard";
import { usePersonalizedPrompts } from "@/hooks/usePersonalizedPrompts";
import AIPromptWidget from "@/components/ai/AIPromptWidget";
import MiniPromptStudio from "@/components/prompt-studio/MiniPromptStudio";
import PromptsOfTheDay from "@/components/prompt/PromptsOfTheDay";
import { PollCarousel } from "@/components/poll/PollCarousel";
import type { Category as CategoryType } from "@/data/prompts";
import { PromptStudioCTA } from "@/components/ui/prompt-studio-cta";

const Index = () => {
  const { user } = useSupabaseAuth();
  const { isSubscribed } = useSubscriptionStatus();
  const { isNewsletterSubscribed } = useNewsletterStatus();
  const navigate = useNavigate();
  const { personalizedPrompts, hasPersonalization } = usePersonalizedPrompts();
  const { toast } = useToast();
  
  // Check if user is new or returning
  const [isReturningUser, setIsReturningUser] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in or has visited before
    const hasVisitedBefore = localStorage.getItem('promptandgo-visited') === 'true';
    setIsReturningUser(!!user || hasVisitedBefore);
    
    // Mark as visited for future visits
    if (!hasVisitedBefore) {
      localStorage.setItem('promptandgo-visited', 'true');
    }
  }, [user]);

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
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [existingUserEmail, setExistingUserEmail] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [catsRes, subsRes] = await Promise.all([supabase.from("categories").select("id,name,slug").order("name"), supabase.from("subcategories").select("id,name,slug,category_id").order("name")]);

        // Build categories list for PromptCard labels
        if (!catsRes.error && !subsRes.error) {
          const subcatByCategory = new Map<string, {
            id: string;
            name: string;
          }[]>();
          (subsRes.data || []).forEach((s: any) => {
            const list = subcatByCategory.get(s.category_id as string) || [];
            list.push({
              id: s.id as string,
              name: s.name as string
            });
            subcatByCategory.set(s.category_id as string, list);
          });
          const built: CategoryType[] = (catsRes.data || []).map((c: any) => ({
            id: c.id as string,
            name: c.name as string,
            subcategories: subcatByCategory.get(c.id as string) || []
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
    
    let rafId: number;
    let timeoutId: NodeJS.Timeout;
    
    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        rafId = requestAnimationFrame(() => {
          try {
            carouselApi.scrollNext();
            scheduleNext();
          } catch {}
        });
      }, 5000);
    };
    
    scheduleNext();
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
    };
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
      console.log('Newsletter signup starting for:', newsletterEmail);
      const {
        data,
        error
      } = await supabase.functions.invoke('newsletter-subscribe', {
        body: {
          email: newsletterEmail.toLowerCase(),
          user_id: user?.id || null
        }
      });
      console.log('Newsletter signup response:', {
        data,
        error
      });
      if (error) {
        console.error('Newsletter signup error details:', error);
        throw error;
      }
      if (data?.existed && !user) {
        setExistingUserEmail(newsletterEmail);
        setShowLoginPrompt(true);
        toast({
          title: "You're already subscribed",
          description: "Please log in to access your prompts. We've prefilled your email."
        });
        return;
      }
      console.log('Newsletter signup successful');
      toast({
        title: "Successfully subscribed!",
        description: "Welcome to our weekly prompt tips! Please check your email (and spam folder) for confirmation."
      });
      setNewsletterEmail("");
      setNewsletterSuccess(true);
    } catch (error: any) {
      console.error('Newsletter signup catch block:', error);
      toast({
        title: "Subscription failed",
        description: error?.message || "Sorry, something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  const generateEmailHash = async (email: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(email);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleLogin = () => {
    // Redirect to auth page - we'll pass the email in the URL state
    navigate('/auth', {
      state: {
        email: existingUserEmail
      }
    });
    toast({
      title: "Please complete your login",
      description: "You already have an account! Please enter your password to log in."
    });
  };

  // Enhanced structured data for homepage
  const homeStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "promptandgo.ai",
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "50000",
        bestRating: "5",
        worstRating: "1"
      },
      author: {
        "@type": "Organization",
        name: "promptandgo.ai"
      },
      description: "Browse, copy, and run practical AI prompts for ChatGPT, Claude, and more. No jargon — just faster outcomes for marketers, creators, and professionals."
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "promptandgo.ai",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "50000"
      }
    }
  ];

  return (
    <>
      <SEO 
        title="Scout AI - Your Personal Prompt Crafting Assistant | PromptAndGo" 
        description="Meet Scout, your AI prompt crafting partner. Start with curated prompts, customize in real-time with guided wizards, and get platform-specific versions for ChatGPT, Claude, MidJourney & more."
        keywords="Scout AI, AI prompt crafting, prompt customization, AI prompt assistant, ChatGPT prompts, Claude prompts, MidJourney prompts, prompt optimization, AI prompt generator, guided prompt wizards, platform-specific prompts"
        structuredData={homeStructuredData}
      />

      <main>
        {/* Hero - Library-First Approach */}
        <PageHero title={<>
            Browse <span className="text-gradient-brand">proven prompts</span>, then let Scout optimize them instantly
          </>} subtitle={<>
            Start with battle-tested prompts from our curated library. Then Scout customizes them for ChatGPT, Claude, MidJourney, or any AI platform in seconds. No more starting from scratch or endless tweaking. All for free.
          </>}>
          <div className="flex justify-center">
            <Button asChild size="lg" variant="hero" className="px-8">
              <Link to="/library"><Search className="h-4 w-4 mr-2" />Browse Proven Prompts</Link>
            </Button>
          </div>
        </PageHero>

        {/* Immediate Social Proof */}
        <section className="container py-8">
          <div className="text-center mb-8">
            <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 text-sm text-muted-foreground max-w-4xl mx-auto mb-6">
              <span className="font-medium">5,000+ professionals</span>
              <span className="hidden sm:inline">•</span>
              <span className="font-medium">100K+ prompts optimized</span>
              <span className="hidden sm:inline">•</span>
              <span className="font-medium">50+ hours saved daily</span>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-sm text-muted-foreground">"I love starting with proven prompts from the library. Then Scout adapts them perfectly for my specific needs and AI platform. It's like having a prompt expert on my team."</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-14">
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
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-sm text-muted-foreground">"The platform adaptation is genius. Same prompt idea, but Scout optimizes it for ChatGPT vs Claude vs MidJourney. Works perfectly every time."</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-14">
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
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Rocket className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-sm text-muted-foreground">"Starting with curated prompts then letting Scout customize them saves hours. We've streamlined our entire content workflow with this approach."</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-14">
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

        {/* Extended Blue Section - Including Most Popular Path and Scout Features */}
        <section className="bg-gradient-to-br from-accent/20 via-primary/15 to-accent/10 py-8">
          <div className="container">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-accent/30 shadow-2xl p-8">
              {/* Path 1: Library-based - MAIN PATH */}
              <div className="mb-16">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <BookOpen className="h-4 w-4" />
                    Most Popular Path
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Start with Battle-Tested Prompts</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Browse thousands of proven prompts, then let Scout customize them instantly for any AI platform</p>
                </div>
                <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">1. Browse Library</h4>
                    <p className="text-sm text-muted-foreground">Choose from thousands of human-curated prompts</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Settings className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">2. Scout Optimizes</h4>
                    <p className="text-sm text-muted-foreground">Select your AI platform from dropdown</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Edit3 className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">3. Customize (Optional)</h4>
                    <p className="text-sm text-muted-foreground">Fine-tune with Scout Assistant</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">4. One-Click Deploy</h4>
                    <p className="text-sm text-muted-foreground">Copy to your favorite AI tool</p>
                  </div>
                </div>
              </div>

              {/* Scout Tailoring Section */}
              <div className="text-center mb-8">
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-6">In any prompt card, pick your preferred AI platform from the dropdown and we'll instantly refine the prompt for you in line with that platform's best practices.</p>
                {/* Scout Tailoring Highlight - Clean Design */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/60 rounded-3xl p-4 md:p-8 max-w-4xl mx-auto shadow-lg">
                  {/* Clean Dropdown Design */}
                  <div className="flex justify-center mb-4 md:mb-6">
                    <div className="space-y-3 w-full max-w-full md:max-w-[500px]">
                      {/* Main Dropdown Trigger */}
                       <div className="bg-white/90 backdrop-blur-sm border-2 border-blue-200/80 rounded-2xl px-4 py-4 md:px-8 md:py-6 shadow-sm">
                         <div className="flex items-center justify-center gap-2 md:gap-4">
                           <div className="bg-blue-500 text-white px-4 py-2 md:px-6 rounded-full font-semibold shadow-sm flex items-center gap-2">
                             <span className="text-base md:text-lg">🤖</span>
                             <span className="text-sm md:text-base">ChatGPT</span>
                           </div>
                           <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                           </svg>
                         </div>
                       </div>
                      
                      {/* Clean Dropdown Menu - Static */}
                      <div className="bg-white/95 backdrop-blur-sm border-2 border-blue-200/80 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                          {/* ChatGPT - Selected */}
                          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 md:p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xl md:text-2xl">🤖</span>
                              </div>
                              <div>
                                <div className="font-bold text-base md:text-lg text-gray-900">ChatGPT</div>
                                <div className="text-sm text-gray-500">OpenAI - Most Popular</div>
                              </div>
                            </div>
                            <div className="bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold">
                              SELECTED
                            </div>
                          </div>
                          
                          {/* Claude */}
                          <div className="hover:bg-gray-50 rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 cursor-pointer transition-all border-2 border-transparent hover:border-gray-200">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-100 rounded-full flex items-center justify-center">
                              <span className="text-xl md:text-2xl">🧠</span>
                            </div>
                            <div>
                              <div className="font-bold text-base md:text-lg text-gray-900">Claude</div>
                              <div className="text-sm text-gray-500">Anthropic - Great for Analysis</div>
                            </div>
                          </div>
                          
                          {/* MidJourney */}
                          <div className="hover:bg-gray-50 rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 cursor-pointer transition-all border-2 border-transparent hover:border-gray-200">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xl md:text-2xl">🎨</span>
                            </div>
                            <div>
                              <div className="font-bold text-base md:text-lg text-gray-900">MidJourney</div>
                              <div className="text-sm text-gray-500">Image Generation</div>
                            </div>
                          </div>
                          
                          {/* Gemini */}
                          <div className="hover:bg-gray-50 rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 cursor-pointer transition-all border-2 border-transparent hover:border-gray-200">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-xl md:text-2xl">💎</span>
                            </div>
                            <div>
                              <div className="font-bold text-base md:text-lg text-gray-900">Gemini</div>
                              <div className="text-sm text-gray-500">Google - Multimodal</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-12">
          <div className="text-center">
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">See how Scout optimizes real prompts. Pick one below customize it, push it to your favorite AI platform, and experience the magic instantly.</p>
          </div>
        </section>

        {/* Prompts of the Day / Personalized Prompts */}
        <section className="container">
          <PromptsOfTheDay />
        </section>

        {/* Key Differentiators */}
        <section className="container py-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Scout Beats DIY Prompting</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stop guessing and start with proven foundations that actually work
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Human-Curated Foundation</h3>
              <p className="text-muted-foreground">
                Battle-tested starting points across every industry. No more starting from scratch or wondering if your prompt will work.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Customization</h3>
              <p className="text-muted-foreground">
                Guided wizards adapt prompts to your goals. No guesswork, just results that match your specific needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Universal Platform Optimization</h3>
              <p className="text-muted-foreground">
                One prompt, automatically optimized for ChatGPT, Claude, MidJourney, Gemini, and more. Works perfectly everywhere.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ListChecks className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Massive Library</h3>
              <p className="text-muted-foreground">
                Thousands of prompts for every use case. Marketing, education, creative work, business strategy, and more.
              </p>
            </div>
          </div>

          {/* Platform Examples */}
          <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-center mb-6">Optimized for Every Major AI Platform</h3>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">GPT</span>
                </div>
                <p className="text-xs text-muted-foreground">ChatGPT</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <p className="text-xs text-muted-foreground">Claude</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <p className="text-xs text-muted-foreground">Gemini</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">MJ</span>
                </div>
                <p className="text-xs text-muted-foreground">MidJourney</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <p className="text-xs text-muted-foreground">Perplexity</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">+</span>
                </div>
                <p className="text-xs text-muted-foreground">& More</p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section - Full Width */}
        <section className="py-8 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto">
            {/* Newsletter Signup - Only show if user is not logged in or not subscribed to newsletter */}
            {/* If logged in and newsletter subscribed, show matched power packs instead */}
            {user && isNewsletterSubscribed ? (
              <div className="max-w-4xl mx-auto">
                <MatchedPowerPacks />
                <div className="mt-6">
                  <PromptStudioCTA variant="compact" />
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-semibold mb-3">🚀 Get Weekly Prompt Tips</h3>
                    <p className="text-muted-foreground mb-6">Join 25,000+ professionals getting our best prompts, tips, and AI updates every Tuesday.</p>
                    
                    {showLoginPrompt ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-center text-blue-600 mb-2">
                          <Bot className="h-4 w-4 mr-2" />
                          <span className="font-medium text-sm">Welcome back!</span>
                        </div>
                        <p className="text-blue-600 text-xs mb-3">
                          You already have an account with us! Please log in to access your prompts.
                        </p>
                        <div className="space-y-2 max-w-sm mx-auto">
                          <Button onClick={handleLogin} variant="hero" size="sm" className="w-full">
                            Log In to Access My Prompts
                          </Button>
                          <Button onClick={() => setShowLoginPrompt(false)} variant="ghost" size="sm" className="w-full">
                            Back to Newsletter
                          </Button>
                        </div>
                      </div>
                    ) : !newsletterSuccess ? (
                      <div className="max-w-md mx-auto">
                        <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                          <input 
                            type="email" 
                            value={newsletterEmail} 
                            onChange={e => setNewsletterEmail(e.target.value)} 
                            placeholder="Enter your email" 
                            className="flex-1 px-4 py-2 rounded-md border bg-background" 
                            disabled={newsletterSubmitting} 
                          />
                          <Button type="submit" variant="hero" disabled={newsletterSubmitting}>
                            {newsletterSubmitting ? "..." : "Subscribe"}
                          </Button>
                        </form>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                        <div className="flex items-center justify-center text-green-600 mb-1">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium text-sm">Successfully subscribed!</span>
                        </div>
                        <p className="text-green-600 text-xs">Welcome to our weekly prompt tips. Check your email for confirmation.</p>
                      </div>
                    )}
                    
                    {!showLoginPrompt && (
                      <p className="text-xs text-muted-foreground mt-4">No spam. Unsubscribe anytime. Free forever.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Bottom Section - FAQ, Pricing, and CTA combined */}
        <section className="container py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* FAQ Column */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Quick Questions</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h3 className="font-semibold mb-1">What are battle-tested prompts?</h3>
                      <p className="text-sm text-muted-foreground">Our prompts are proven in real-world scenarios by professionals. No guesswork - just results that actually work.</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h3 className="font-semibold mb-1">What is Scout Studio?</h3>
                      <p className="text-sm text-muted-foreground">Our AI-powered prompt builder that creates custom prompts tailored to your specific needs using guided wizards.</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h3 className="font-semibold mb-1">Do I need to sign up?</h3>
                      <p className="text-sm text-muted-foreground">Nope! Browse and copy prompts for free. Sign up only to save favorites and access power packs.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h3 className="font-semibold mb-1">How does AI optimization work?</h3>
                      <p className="text-sm text-muted-foreground">Scout automatically tailors each prompt for ChatGPT, Claude, Gemini, and other AI platforms for best results.</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h3 className="font-semibold mb-1">Works with free AI tools?</h3>
                      <p className="text-sm text-muted-foreground">Yes! Most prompts work perfectly with free versions of ChatGPT, Claude, and other AI tools.</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h3 className="font-semibold mb-1">Can I use them commercially?</h3>
                      <p className="text-sm text-muted-foreground">Yes! Use prompts and their outputs for any personal or commercial project.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/faqs#top">See All FAQs →</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Pricing/CTA */}
            <div className="lg:col-span-1 space-y-6">
              {/* Pricing/CTA Section */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 h-fit sticky top-6">
                <h3 className="font-semibold mb-3 text-center">🤖 Everything You Need, Free Forever</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Browse battle-tested prompts, use Scout AI optimization, and get platform-specific versions. Upgrade only for specialized collections.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>Scout AI optimization for all platforms</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>Unlimited battle-tested prompt access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>No signup required to browse & copy</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button asChild variant="hero" size="sm" className="w-full">
                    <Link to="/library">Browse Prompt Library</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/packs">View Premium Packs</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Articles Section - Full Width */}
        <section className="py-8 bg-gradient-to-br from-muted/30 to-background">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                {isReturningUser ? 'Latest Article' : 'Welcome to promptandgo.ai'}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {isReturningUser ? 'Stay updated with our latest prompt strategies and AI tips' : 'Learn how to get the most out of AI with battle-tested prompts'}
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <article>
                {isReturningUser ? (
                  // Latest Article for returning users
                  <Link to="/tips/beginners-guide-midjourney-prompts" className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <Card className="overflow-hidden">
                      <img 
                        src="/lovable-uploads/62fad3e0-9f93-4964-8448-ab0375c35a17.png" 
                        alt="Beginner's Guide to MidJourney Prompts" 
                        loading="lazy" 
                        className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
                      />
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold leading-snug mb-3">Beginner's Guide to MidJourney Prompts That Actually Work</h3>
                        <p className="text-muted-foreground mb-4">
                          Learn how to build detailed prompts that give you more control, unlock stylistic variety, and save hours of trial and error in MidJourney.
                        </p>
                        <span className="inline-flex items-center text-primary font-medium">
                          Read more <Sparkles className="h-4 w-4 ml-1" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ) : (
                  // Welcome content for new users
                  <Link to="/tips/welcome-to-promptandgo-ai" className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <Card className="overflow-hidden">
                      <img 
                        src="/lovable-uploads/66b1134b-1d55-416b-b7ea-2719a1a22ec1.png" 
                        alt="Welcome to promptandgo.ai: Your Shortcut to Smarter AI Prompts" 
                        loading="lazy" 
                        decoding="async"
                        width="837" 
                        height="469"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                        className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
                      />
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold leading-snug mb-3">Welcome to promptandgo.ai: Your Shortcut to Smarter AI Prompts</h3>
                        <p className="text-muted-foreground mb-4">
                          We give you ready-to-use, field-tested prompts designed for real work. No vague ideas, no guesswork, just clear instructions you can drop straight into ChatGPT, Claude, or Gemini.
                        </p>
                        <span className="inline-flex items-center text-primary font-medium">
                          Read more <Sparkles className="h-4 w-4 ml-1" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </article>
            </div>
            
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link to="/tips">Read All Articles →</Link>
              </Button>
            </div>
          </div>
        </section>

        <section aria-labelledby="cta-tail" className="relative bg-hero hero-grid mt-8" id="cta">
          <div className="container p-6 md:p-8 text-center text-primary-foreground">
            <h2 id="cta-tail" className="text-2xl md:text-3xl font-semibold tracking-tight">
              Stop guessing what to prompt. Start with <strong>battle-tested</strong> foundations that actually work.
            </h2>
            <p className="mt-3 text-primary-foreground/85 text-base md:text-lg">
              ✨ Browse thousands of proven prompts or let Scout build custom ones for your specific needs.
            </p>
            <div className="mt-6 flex justify-center">
              <Button asChild variant="hero" className="px-6">
                <Link to="/library"><Search className="h-4 w-4 mr-2" />Browse Battle-Tested Prompts</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Index;