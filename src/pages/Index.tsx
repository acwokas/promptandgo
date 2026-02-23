import React from "react";
import SEO from "@/components/SEO";
import { AIOptimizedStructuredData } from "@/components/seo/AIOptimizedStructuredData";
import { Button } from "@/components/ui/button";
import { useFeaturedCategories } from "@/hooks/useFeaturedCategories";
import { Link } from "react-router-dom";
import PageHero from "@/components/layout/PageHero";
import { Sparkles, Wand2, Rocket, Search, Bot, Users, ArrowRight } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useNewsletterStatus } from "@/hooks/useNewsletterStatus";
import { useEffect, useState } from "react";
import MiniPromptStudio from "@/components/prompt-studio/MiniPromptStudio";
import PromptsOfTheDay from "@/components/prompt/PromptsOfTheDay";
import { useLatestArticle } from "@/hooks/useLatestArticle";
import ScoutDemo from "@/components/conversion/ScoutDemo";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

// Extracted components
import { CoreProductsSection } from "@/components/home/CoreProductsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { FAQSection } from "@/components/home/FAQSection";
import { MainCTASection, FinalCTASection } from "@/components/home/FinalCTASection";
import { LatestArticleSection } from "@/components/home/LatestArticleSection";

const Index = () => {
  const { user } = useSupabaseAuth();
  const { isSubscribed } = useSubscriptionStatus();
  const { isNewsletterSubscribed } = useNewsletterStatus();
  const { latestArticle, loading: articleLoading } = useLatestArticle();
  const { categories: featuredCategories, FinanceInvestmentSection } = useFeaturedCategories();
  
  const [isReturningUser, setIsReturningUser] = useState(false);
  
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('promptandgo-visited') === 'true';
    setIsReturningUser(!!user || hasVisitedBefore);
    if (!hasVisitedBefore) {
      localStorage.setItem('promptandgo-visited', 'true');
    }
  }, [user]);

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      'Sparkles': Sparkles, 'Users': Users, 'Wand2': Wand2, 'Rocket': Rocket,
    };
    return iconMap[iconName] || Sparkles;
  };

  const getDailyFeatured = () => {
    if (!featuredCategories.length) return null;
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return featuredCategories[dayOfYear % featuredCategories.length];
  };

  const todaysFeatured = getDailyFeatured();

  const homeStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "PromptAndGo",
      url: "https://promptandgo.ai",
      description: "Browse 3,000+ curated AI prompts optimized for professionals across Singapore, Indonesia, Vietnam, Malaysia and Australia.",
      sameAs: [
        "https://twitter.com/PromptandGo"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PromptAndGo",
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web",
      description: "AI prompt library and optimizer for professionals across Asia-Pacific",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "1800", bestRating: "5", worstRating: "1" }
    }
  ];

  return (
    <>
      <SEO
        title="AI Prompts for Asia-Pacific | ChatGPT, Claude & More | PromptAndGo"
        description="Browse 3,000+ curated AI prompts optimized for professionals across Singapore, Indonesia, Vietnam, Malaysia and Australia. Free prompt optimizer powered by Scout AI."
        canonical="https://promptandgo.ai"
        image="https://promptandgo.ai/og-default.png"
        ogType="website"
        structuredData={homeStructuredData}
      />
      <AIOptimizedStructuredData pageType="HomePage" title="3,000+ Curated AI Prompts" description="Browse, copy, and run tested AI prompts." />
      
      <main>
        <PageHero title={<>AI Prompts That Actually Work. Optimized for Asia-Pacific.</>} subtitle={<>Browse 3,000+ battle-tested prompts or let Scout optimize yours for ChatGPT, Claude, MidJourney &amp; more. Built for professionals across Singapore, Jakarta, KL, and beyond.</>}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button asChild size="lg" variant="hero" className="px-8">
              <Link to="/optimize">Try the Prompt Optimizer <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="px-8">
              <Link to="/library"><Search className="h-4 w-4 mr-2" />Browse Prompt Library</Link>
            </Button>
          </div>
        </PageHero>

        <ScoutDemo />

        <section className="container -mt-8 py-6">
          <div className="text-center">
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">See how Scout optimizes real prompts. Pick one below, customize it, push it to your favorite AI platform.</p>
          </div>
        </section>

        <section className="pb-12"><PromptsOfTheDay /></section>

        {/* Prompt Studio section - commented out */}
        {/* <section className="container py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Wand2 className="h-4 w-4" />Alternative Path
            </div>
            <h2 className="text-3xl font-bold mb-4">Generate Custom Prompts with Scout's Prompt Studio</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Craft perfect AI prompts with Scout's guided approach.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            {[{ icon: Wand2, title: "Guided Creation", desc: "Choose from curated dropdowns" }, { icon: Bot, title: "Expert Quality", desc: "Professional-quality prompts" }, { icon: Rocket, title: "No Guesswork", desc: "Scout handles complexity" }].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><item.icon className="h-8 w-8 text-primary" /></div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="max-w-4xl mx-auto"><MiniPromptStudio /></div>
        </section> */}

        {/* Social Proof with Featured Category - commented out */}
        {/* <section className="container py-6">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl border border-primary/20 max-w-5xl mx-auto">
            <div className="relative px-6 py-4">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {todaysFeatured && (todaysFeatured.isCustomFinanceSection ? <FinanceInvestmentSection /> : (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                        {React.createElement(getIconComponent(todaysFeatured.icon), { className: "h-6 w-6 text-white" })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{todaysFeatured.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium">🔥 {todaysFeatured.usage_text}</span>
                        <Button asChild variant="ghost" size="sm" className="h-6 px-2 text-xs"><Link to={todaysFeatured.link}>{todaysFeatured.message} <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
                      </p>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-3">
                  {[{ to: user ? "/account" : "/auth", icon: Users, num: "5,000+", label: "Active" }, { to: "/library", icon: Sparkles, num: "3K+", label: "Prompts" }, { to: "/scout", icon: Rocket, num: "650+", label: "Assists" }].map((stat) => (
                    <Link key={stat.label} to={stat.to} className="group text-center p-3 bg-background/70 rounded-lg border border-border/50 flex flex-col items-center justify-center min-h-[80px] hover:bg-background/90 hover:border-primary/30 transition-all">
                      <stat.icon className="h-4 w-4 text-foreground mx-auto mb-1 group-hover:text-primary" />
                      <div className="font-bold text-lg group-hover:text-primary">{stat.num}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section> */}

        <CoreProductsSection />
        <TestimonialsSection />
        <NewsletterSection user={user} isNewsletterSubscribed={isNewsletterSubscribed} />
        <FAQSection />
        {/* <MainCTASection /> */}
        <LatestArticleSection isReturningUser={isReturningUser} latestArticle={latestArticle} articleLoading={articleLoading} />
        {/* <FinalCTASection /> */}
      </main>
      <OnboardingModal />
    </>
  );
};

export default Index;
