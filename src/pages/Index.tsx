import React from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import NanoBananaAnnouncement from "@/components/NanoBananaAnnouncement";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import PageHero from "@/components/layout/PageHero";
import CountdownTimer from "@/components/conversion/CountdownTimer";
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
  Settings,
  ArrowRight,
  Users
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
import { useLatestArticle } from "@/hooks/useLatestArticle";
import type { Category as CategoryType } from "@/data/prompts";
import { TodaysFeatured, UrgencyBadge } from "@/components/conversion/UrgencyBadges";
import SocialProofStream from "@/components/conversion/SocialProofStream";
import { PromptStudioCTA } from "@/components/ui/prompt-studio-cta";
import ProgressivePricing from "@/components/conversion/ProgressivePricing";
import { TestimonialHighlights, UserStats, SecurityBadges, AsSeenIn } from "@/components/conversion/TrustIndicators";
import ScoutDemo from "@/components/conversion/ScoutDemo";

const Index = () => {
  const { user } = useSupabaseAuth();
  const { isSubscribed } = useSubscriptionStatus();
  const { isNewsletterSubscribed } = useNewsletterStatus();
  const navigate = useNavigate();
  const { latestArticle, loading: articleLoading } = useLatestArticle();
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

  // Daily rotating featured categories
  const featuredCategories = [
    {
      title: "Marketing & Advertising",
      message: "Boost your campaigns today",
      link: "/library?category=Marketing%20%26%20Advertising",
      icon: Briefcase,
      usage: "5x usage today"
    },
    {
      title: "Personal Growth & Mindfulness", 
      message: "Transform your mindset",
      link: "/library?category=Personal%20Growth%20%26%20Mindfulness",
      icon: Heart,
      usage: "3x usage today"
    },
    {
      title: "Creative Writing & Content",
      message: "Unleash your creativity", 
      link: "/library?category=Creative%20Writing%20%26%20Content",
      icon: Edit3,
      usage: "7x usage today"
    },
    {
      title: "Business & Strategy",
      message: "Scale your business",
      link: "/library?category=Business%20%26%20Strategy", 
      icon: BarChart3,
      usage: "4x usage today"
    },
    {
      title: "Learning & Education",
      message: "Accelerate your learning",
      link: "/library?category=Learning%20%26%20Education",
      icon: BookOpen,
      usage: "6x usage today"
    },
    {
      title: "Technology & Development",
      message: "Build smarter solutions",
      link: "/library?category=Technology%20%26%20Development", 
      icon: Settings,
      usage: "8x usage today"
    },
    {
      title: "Visual & Image Creation",
      message: "Create stunning visuals",
      link: "/library?category=Visual%20%26%20Image%20Creation",
      icon: Image,
      usage: "2x usage today"
    }
  ];

  // Get today's featured category (rotates daily)
  const getDailyFeatured = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return featuredCategories[dayOfYear % featuredCategories.length];
  };

  const todaysFeatured = getDailyFeatured();

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
      
      <NanoBananaAnnouncement />

      <main>
        {/* 50% Off Countdown Banner - Only show if enabled in database */}
        <CountdownTimer variant="banner" />

        {/* Hero - Complete Toolkit Overview */}
        <PageHero title={<>
            Your Complete <span className="text-gradient-brand">AI Prompt Toolkit</span> — 100% FREE
          </>} subtitle={<>
            Everything you need to master AI prompting: 5,000+ battle-tested prompts in our Library, curated Power Packs for specific goals, Scout AI for instant optimization, and our AI Prompt Generator for custom creation. No guesswork, no limits.
          </>}>
          <div className="flex justify-center">
            <Button asChild size="lg" variant="hero" className="px-8">
              <Link to="/library"><Search className="h-4 w-4 mr-2" />Get Proven Prompts FREE</Link>
            </Button>
          </div>
        </PageHero>

        {/* Social Proof + Today's Featured */}
        <section className="container py-6">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl border border-primary/20 max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative px-6 py-4">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Left - Featured Category */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                      {React.createElement(todaysFeatured.icon, { className: "h-6 w-6 text-white" })}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-background" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{todaysFeatured.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium">
                        🔥 {todaysFeatured.usage}
                      </span>
                      <Button asChild variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary hover:text-primary">
                        <Link to={todaysFeatured.link}>
                          {todaysFeatured.message} <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </p>
                  </div>
                </div>

                {/* Right - Live Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <Link to="/auth" className="group text-center p-3 bg-background/70 rounded-lg border border-border/50 flex flex-col items-center justify-center min-h-[80px] hover:bg-background/90 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                    <Users className="h-4 w-4 text-foreground mx-auto mb-1 transition-colors duration-300 group-hover:text-primary" />
                    <div className="font-bold text-lg text-foreground transition-colors duration-300 group-hover:text-primary">5,000+</div>
                    <div className="text-xs text-muted-foreground group-hover:text-muted-foreground transition-colors duration-300">Active</div>
                  </Link>
                  
                  <Link to="/library" className="group text-center p-3 bg-background/70 rounded-lg border border-border/50 flex flex-col items-center justify-center min-h-[80px] hover:bg-background/90 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                    <Sparkles className="h-4 w-4 text-foreground mx-auto mb-1 transition-colors duration-300 group-hover:text-primary" />
                    <div className="font-bold text-lg text-foreground transition-colors duration-300 group-hover:text-primary">100K+</div>
                    <div className="text-xs text-muted-foreground group-hover:text-muted-foreground transition-colors duration-300">Prompts</div>
                  </Link>
                  
                  <Link to="/studio" className="group text-center p-3 bg-background/70 rounded-lg border border-border/50 flex flex-col items-center justify-center min-h-[80px] hover:bg-background/90 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                    <Rocket className="h-4 w-4 text-foreground mx-auto mb-1 transition-colors duration-300 group-hover:text-primary" />
                    <div className="font-bold text-lg text-foreground transition-colors duration-300 group-hover:text-primary">650+</div>
                    <div className="text-xs text-muted-foreground group-hover:text-muted-foreground transition-colors duration-300">Assists</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Scout Demo - Interactive Prompt Card */}
        <ScoutDemo />

        <section className="container -mt-8 py-6">
          <div className="text-center">
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">See how Scout optimizes real prompts. Pick one below customize it, push it to your favorite AI platform, and experience the magic instantly.</p>
          </div>
        </section>

        {/* Prompts of the Day / Personalized Prompts */}
        <section className="pb-12">
          <PromptsOfTheDay />
        </section>

        {/* Path 2: Generate from Scratch */}
        <section className="container py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Wand2 className="h-4 w-4" />
              Alternative Path
            </div>
            <h2 className="text-3xl font-bold mb-4">Generate Custom Prompts with Scout's Prompt Studio</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Craft perfect AI prompts with Scout's guided approach. Choose your options from curated dropdowns and let Scout build a professional-quality prompt for you in real-time. Ask Scout to refine it even further and then push it to your favorite AI platform. All for free.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Guided Creation</h4>
              <p className="text-sm text-muted-foreground">Choose from curated dropdowns and options</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Expert Quality</h4>
              <p className="text-sm text-muted-foreground">Professional-quality prompts built in real-time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">No Guesswork</h4>
              <p className="text-sm text-muted-foreground">Scout handles the complexity for you</p>
            </div>
          </div>
          
          {/* Mini Studio Widget */}
          <div className="max-w-4xl mx-auto">
            <MiniPromptStudio />
          </div>
        </section>

        {/* Four Core Products */}
        <section className="container py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Four Powerful Tools, One Complete Solution</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Whether you prefer ready-made prompts or custom creation, we've got you covered. Mix and match these tools based on your workflow — everything works together seamlessly.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {/* Prompt Library */}
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Prompt Library</h3>
                <p className="text-sm text-muted-foreground mb-4">5,000+ battle-tested prompts organized by category. Copy, paste, and get results instantly.</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/library">Browse Library</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Power Packs */}
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Power Packs</h3>
                <p className="text-sm text-muted-foreground mb-4">Curated collections for specific goals like marketing campaigns, job hunting, or creative projects.</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/packs">View Packs</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Scout AI */}
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Scout AI</h3>
                <p className="text-sm text-muted-foreground mb-4">Your AI prompt companion. Optimizes any prompt for ChatGPT, Claude, MidJourney, and more.</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/scout">Chat with Scout</Link>
                </Button>
              </CardContent>
            </Card>

            {/* AI Prompt Generator */}
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">AI Prompt Generator</h3>
                <p className="text-sm text-muted-foreground mb-4">Describe what you want and Scout creates a professional-quality prompt from scratch.</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/ai/generator">Generate Prompts</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* How Everything Works Together */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">How It All Works Together</h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                The magic happens when you combine our tools. Start anywhere, then let Scout enhance and optimize everything for maximum results.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">1. Start with Proven Prompts</h4>
                <p className="text-sm text-muted-foreground">Browse our library or packs for battle-tested starting points</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">2. Let Scout Optimize</h4>
                <p className="text-sm text-muted-foreground">Scout rewrites for your specific AI platform and use case</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">3. Get Perfect Results</h4>
                <p className="text-sm text-muted-foreground">Copy to your favorite AI platform and achieve better outcomes</p>
              </div>
            </div>

            {/* Platform Examples */}
            <div className="mt-8 pt-8 border-t border-border/50">
              <h4 className="text-lg font-semibold text-center mb-6">Optimized for Every Major AI Platform</h4>
              <div className="grid gap-4 grid-cols-3 md:grid-cols-6 max-w-2xl mx-auto">
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
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container py-6">
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
                    <p className="text-sm text-muted-foreground">"I went from spending 3 hours crafting prompts to just copying proven ones. Scout's optimization saved my entire workflow. ROI in the first week!"</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-14">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">SJ</div>
                  <div>
                    <p className="text-sm font-medium">Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground">Marketing Director @ TechCorp</p>
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
                    <p className="text-sm text-muted-foreground">"The platform adaptation is pure genius. Same concept, perfectly optimized for ChatGPT vs Claude vs MidJourney. I'm 10x more productive now."</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-14">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">MR</div>
                  <div>
                    <p className="text-sm font-medium">Michael Rodriguez</p>
                    <p className="text-xs text-muted-foreground">Senior Content Writer</p>
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
                    <p className="text-sm text-muted-foreground">"Started with proven prompts, then Scout customized them for our needs. We've streamlined our entire content workflow and saved $5,000/month."</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-14">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">AL</div>
                  <div>
                    <p className="text-sm font-medium">Alex Liu</p>
                    <p className="text-xs text-muted-foreground">Founder @ GrowthCo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Newsletter Section - Full Width */}
        <section className="py-6 bg-gradient-to-br from-primary/5 to-accent/5">
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
                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                          <input 
                            type="email" 
                            value={newsletterEmail} 
                            onChange={e => setNewsletterEmail(e.target.value)} 
                            placeholder="Enter your email" 
                            className="flex-1 px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:border-2 focus:border-ring transition-colors" 
                            disabled={newsletterSubmitting} 
                          />
                          <Button type="submit" variant="hero" disabled={newsletterSubmitting} className="w-full sm:w-auto">
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
        <section className="container py-12">
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
                    <Link to="/packs">View Power Packs</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main CTA Section */}
        <section aria-labelledby="cta-main" className="relative bg-hero hero-grid py-12" id="cta">
          <div className="container p-6 md:p-8 text-center text-primary-foreground">
            <h2 id="cta-main" className="text-2xl md:text-3xl font-semibold tracking-tight">
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

        {/* Latest Articles Section - Full Width */}
        <section className="py-12 bg-gradient-to-br from-muted/30 to-background">
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
                  // Latest Article for returning users - Dynamic from database
                  latestArticle && !articleLoading ? (
                    <Link to={`/tips/${latestArticle.slug}`} className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <Card className="overflow-hidden">
                        <img 
                          src={latestArticle.thumbnail_url || "/lovable-uploads/62fad3e0-9f93-4964-8448-ab0375c35a17.png"} 
                          alt={latestArticle.title} 
                          loading="lazy" 
                          className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
                        />
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                              Latest Article
                            </div>
                            <time className="text-sm text-muted-foreground">
                              {new Date(latestArticle.published_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </time>
                          </div>
                          <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                            {latestArticle.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {latestArticle.synopsis || latestArticle.meta_description}
                          </p>
                          <span className="inline-flex items-center text-primary font-medium">
                            Read more <Sparkles className="h-4 w-4 ml-1" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  ) : articleLoading ? (
                    <Card className="overflow-hidden">
                      <div className="aspect-[16/9] w-full bg-muted animate-pulse" />
                      <CardContent className="p-6">
                        <div className="bg-muted animate-pulse h-4 w-32 mb-3 rounded" />
                        <div className="bg-muted animate-pulse h-6 w-3/4 mb-3 rounded" />
                        <div className="bg-muted animate-pulse h-4 w-full mb-2 rounded" />
                        <div className="bg-muted animate-pulse h-4 w-2/3 rounded" />
                      </CardContent>
                    </Card>
                  ) : (
                    // Fallback to hardcoded article if no latest article found
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
                  )
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

        {/* Final CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Save 10+ Hours This Week?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 5,000+ professionals who've already transformed their productivity. 
              Start with our free prompts, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button asChild size="lg" className="px-8">
                <Link to="/library">
                  Get Started FREE <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/packs">View Power Packs</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No signup required • 30-day money-back guarantee on premium plans
            </p>
          </div>
        </section>

      </main>
    </>
  );
};

export default Index;