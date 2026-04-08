import React, { Fragment, useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { PromptFilters } from "@/components/prompt/PromptFilters";
import { PromptCard } from "@/components/prompt/PromptCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageHero from "@/components/layout/PageHero";
import CountdownTimer from "@/components/conversion/CountdownTimer";
import { Link } from "react-router-dom";
import { Search, Heart, Globe, Sparkles, Flame, Monitor } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PromptStudioCTA } from "@/components/ui/prompt-studio-cta";
import { SearchUpsellPacks } from "@/components/library/SearchUpsellPacks";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { usePromptLibrary, sortByComplexity } from "@/hooks/usePromptLibrary";
import { PopularCategories } from "@/components/library/PopularCategories";
import { QuickDiscoverySection } from "@/components/library/QuickDiscoverySection";

const PLATFORMS = [
  { id: "all", name: "All Platforms" },
  { id: "chatgpt", name: "ChatGPT", badge: "G", color: "bg-[hsl(160,82%,35%)]" },
  { id: "claude", name: "Claude", badge: "C", color: "bg-[hsl(348,76%,59%)]" },
  { id: "gemini", name: "Gemini", badge: "G", color: "bg-[hsl(174,82%,33%)]" },
  { id: "deepseek", name: "DeepSeek", badge: "D", color: "bg-[hsl(220,60%,50%)]" },
  { id: "qwen", name: "Qwen", badge: "Q", color: "bg-[hsl(260,50%,55%)]" },
  { id: "ernie", name: "Ernie", badge: "E", color: "bg-[hsl(210,80%,45%)]" },
  { id: "baidu", name: "Baidu", badge: "B", color: "bg-[hsl(210,90%,50%)]" },
  { id: "midjourney", name: "MidJourney", badge: "M", color: "bg-[hsl(240,20%,20%)]" },
  { id: "perplexity", name: "Perplexity", badge: "P", color: "bg-[hsl(200,60%,45%)]" },
];

const LANGUAGES = [
  { id: "all", name: "All Languages", flag: "🌐" },
  { id: "en", name: "English", flag: "🇬🇧" },
  { id: "zh", name: "Chinese", flag: "🇨🇳" },
  { id: "ja", name: "Japanese", flag: "🇯🇵" },
  { id: "ko", name: "Korean", flag: "🇰🇷" },
  { id: "th", name: "Thai", flag: "🇹🇭" },
  { id: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { id: "id", name: "Indonesian", flag: "🇮🇩" },
  { id: "ms", name: "Malay", flag: "🇲🇾" },
  { id: "hi", name: "Hindi", flag: "🇮🇳" },
];

const ASIA_CATEGORIES = [
  { label: "E-commerce", query: "ecommerce", icon: "🛒" },
  { label: "Social Media", query: "social media", icon: "📱" },
  { label: "Education", query: "education", icon: "🎓" },
  { label: "Business", query: "business", icon: "💼" },
  { label: "Creative", query: "creative", icon: "🎨" },
  { label: "Marketing", query: "marketing", icon: "📣" },
];

const PromptLibrary = () => {
  const isMobile = useIsMobile();
  const [platform, setPlatform] = useState("all");
  const [language, setLanguage] = useState("all");
  const [asianContext, setAsianContext] = useState(false);

  const {
    user,
    categories,
    categoryId, setCategoryId,
    subcategoryId, setSubcategoryId,
    query, setQuery,
    selectedTag, setSelectedTag,
    searchParams, setSearchParams,
    location,
    includePro, setIncludePro,
    proOnly, setProOnly,
    ribbon, setRibbon,
    userExplicitlySelectedAll, setUserExplicitlySelectedAll,
    defaultAIProvider,
    page, setPage,
    items,
    hasMore,
    loading,
    listRef,
    personalizedPrompts,
    hasPersonalization,
    personalizationLoading,
    clearRandom,
    refresh,
    loadMore,
  } = usePromptLibrary();

  useEffect(() => {
    if (location.hash) {
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          const header = document.querySelector('header');
          const headerHeight = header ? (header as HTMLElement).getBoundingClientRect().height : 0;
          const y = element.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.hash]);

  const handleCategoryClick = (searchQuery: string) => {
    clearRandom();
    setQuery(searchQuery);
    setCategoryId(undefined);
    setSubcategoryId(undefined);
    setRibbon(undefined);
  };

  const handleFilterChange = (n: any) => {
    clearRandom();
    const newSearchParams = new URLSearchParams(searchParams);
    
    if ('categoryId' in n) {
      setCategoryId(n.categoryId || undefined);
      if (n.categoryId) newSearchParams.set('categoryId', n.categoryId);
      else newSearchParams.delete('categoryId');
      setSubcategoryId(undefined);
      newSearchParams.delete('subcategoryId');
      setRibbon(undefined);
      setUserExplicitlySelectedAll(false);
      newSearchParams.delete('ribbon');
    }
    
    if ('subcategoryId' in n) {
      setSubcategoryId(n.subcategoryId || undefined);
      if (n.subcategoryId) newSearchParams.set('subcategoryId', n.subcategoryId);
      else newSearchParams.delete('subcategoryId');
    }
    
    if (n.query !== undefined) {
      setQuery(n.query);
      setSelectedTag(undefined);
      if (n.query) newSearchParams.set('q', n.query);
      else newSearchParams.delete('q');
      setRibbon(undefined);
      setUserExplicitlySelectedAll(false);
      newSearchParams.delete('ribbon');
    }
    
    if (n.includePro !== undefined) setIncludePro(!!n.includePro);
    
    if ('ribbon' in n) {
      setRibbon(n.ribbon || undefined);
      if (!n.ribbon) setUserExplicitlySelectedAll(true);
      else setUserExplicitlySelectedAll(false);
      if (n.ribbon) newSearchParams.set('ribbon', n.ribbon);
      else newSearchParams.delete('ribbon');
    }
    
    setSearchParams(newSearchParams, { replace: true });
  };

  const handleClear = () => {
    clearRandom();
    setCategoryId(undefined);
    setSubcategoryId(undefined);
    setQuery("");
    setSelectedTag(undefined);
    setProOnly(false);
    setIncludePro(true);
    setPage(1);
    setUserExplicitlySelectedAll(true);
    setRibbon(undefined);
    setPlatform("all");
    setLanguage("all");
    setAsianContext(false);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const getTitleAndDescription = () => {
    switch (ribbon) {
      case "RECOMMENDED": return { title: "🎯 Recommended for You", description: "Based on your preferences and goals" };
      case "MOST_POPULAR": return { title: "🔥 Most Popular", description: "Top prompts loved by our community" };
      case "NEW_PROMPTS": return { title: "✨ New Prompts", description: "Fresh additions to our library" };
      case "TRENDING": return { title: "📈 Trending", description: "Gaining popularity right now" };
      case "HIGHEST_RATED": return { title: "⭐ Highest Rated", description: "Top-rated prompts by users" };
      case "MOST_COPIED": return { title: "📋 Most Copied", description: "Frequently used prompts" };
      default: return hasPersonalization && personalizedPrompts.length > 0 
        ? { title: "All Prompts", description: "Browse our complete collection" }
        : { title: "Browse All Prompts", description: "Discover our complete collection of AI prompts" };
    }
  };

  const libraryStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Prompts Library",
    description: "Discover thousands of ready-to-use AI prompts for ChatGPT, Claude, and more.",
    numberOfItems: items.length,
  };

  return (
    <>
      <SEO
        title="Browse 3,000+ AI Prompts | Free for ChatGPT, Claude, Gemini | PromptAndGo"
        description="Explore 3,000+ free AI prompts organised by category. Optimised for ChatGPT, Claude, MidJourney, Gemini and more. Copy, customise, and get better results from any AI tool."
        canonical="https://promptandgo.ai/library"
        structuredData={libraryStructuredData}
      />
      <PageHero
        variant="prompt"
        title={<><span className="text-gradient-brand">Prompt</span> Library</>}
        subtitle={<>Find the perfect prompt fast: browse free prompts by category, save your favourites in <Link to="/account/favorites" className="text-accent hover:underline">My Prompts</Link>, or <Link to="/cart" className="text-accent hover:underline">subscribe</Link> to unlock all premium items.</>}
      >
        <Button asChild size="lg" variant="hero" className="px-6">
          <a href="#library-filters"><Search className="h-4 w-4 mr-2" />Browse Prompt Library</a>
        </Button>
        <Button asChild size="lg" variant="inverted"><Link to="/packs">⚡️Power Packs</Link></Button>
        {user ? (
          <Button asChild size="lg" variant="secondary"><Link to="/account/favorites"><Heart className="h-4 w-4 mr-2" />My Prompts</Link></Button>
        ) : (
          <Button asChild size="lg" variant="outline"><Link to="/auth">Login</Link></Button>
        )}
      </PageHero>

      {/* Multi-platform banner */}
      <section className="bg-hero border-b border-white/10">
        <div className="container max-w-6xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-white">Every prompt optimized for any platform, any language.</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {PLATFORMS.filter(p => p.id !== "all").map((p) => (
                <div
                  key={p.id}
                  title={p.name}
                  className={`w-6 h-6 rounded ${p.color} flex items-center justify-center text-white text-[10px] font-bold opacity-70`}
                >
                  {p.badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="container py-10">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Browse Library</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Asian market category tags */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">Popular in Asian markets</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ASIA_CATEGORIES.map((cat) => (
              <button
                key={cat.query}
                onClick={() => handleCategoryClick(cat.query)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 hover:border-accent/40 transition-colors"
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Platform, Language, Asian Context filters */}
        <section className="mb-6">
          <div className="rounded-xl bg-muted/30 border border-border p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              {/* Platform filter */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Monitor className="h-3 w-3" />
                  Platform
                </Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="bg-background border-border h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <span className="flex items-center gap-2">
                          {p.badge && (
                            <span className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center text-white ${p.color}`}>
                              {p.badge}
                            </span>
                          )}
                          {p.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language filter */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-3 w-3" />
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-background border-border h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        <span className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          {l.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Asian Context toggle */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Asian Context</Label>
                <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-background">
                  <Switch
                    checked={asianContext}
                    onCheckedChange={setAsianContext}
                    className="data-[state=checked]:bg-accent"
                  />
                  <span className="text-sm text-muted-foreground">
                    {asianContext ? "On" : "Off"}
                  </span>
                  {asianContext && (
                    <span className="ml-auto text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">ASIA</span>
                  )}
                </div>
              </div>

              {/* Active filter summary */}
              <div className="flex items-end h-full">
                {(platform !== "all" || language !== "all" || asianContext) && (
                  <button
                    onClick={() => { setPlatform("all"); setLanguage("all"); setAsianContext(false); }}
                    className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 pb-2"
                  >
                    Clear platform filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Browse & Search Section */}
        <section className="mb-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <PopularCategories onCategoryClick={handleCategoryClick} />
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Can't find what you need?</h3>
                <p className="text-sm text-muted-foreground mb-3">Let Scout generate a custom prompt tailored to your specific needs.</p>
                <Button asChild size="sm" className="w-full"><Link to="/prompt-studio">Open Prompt Studio</Link></Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Filters */}
        <section id="library-filters" className="mb-6 scroll-mt-20">
          <div className="bg-muted/30 rounded-xl p-4 border">
            <PromptFilters
              categories={categories}
              categoryId={categoryId}
              subcategoryId={subcategoryId}
              query={query}
              includePro={includePro}
              proOnly={proOnly}
              ribbon={ribbon}
              onChange={handleFilterChange}
              onSearch={() => { clearRandom(); refresh(); }}
              onClear={handleClear}
            />
          </div>
        </section>

        {/* Personalized Recommendations */}
        {hasPersonalization && personalizedPrompts.length > 0 && !categoryId && !subcategoryId && !query && !selectedTag && !ribbon && (
          <section className="mt-8 mb-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">🎯 Recommended for You</h2>
              <p className="text-sm text-muted-foreground mt-1">Based on your preferences and goals</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortByComplexity(personalizedPrompts).map((p) => (
                <PromptCard key={p.id} prompt={p as any} categories={categories} defaultAIProvider={defaultAIProvider} />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Want different recommendations? Update preferences in <Link to="/account/profile" className="text-primary hover:underline">Account → Profile</Link>
              </p>
            </div>
          </section>
        )}

        {/* Search Upsell */}
        {query.trim().length >= 2 && <div className="mb-6"><SearchUpsellPacks searchQuery={query} /></div>}

        {/* Results */}
        <section className="mt-0 pt-6">
          {(() => {
            const { title, description } = getTitleAndDescription();
            return (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
            );
          })()}

          <div id="library-results" ref={listRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 scroll-mt-40 md:scroll-mt-48">
            {ribbon === "RECOMMENDED" && hasPersonalization && personalizedPrompts.length > 0 ? (
              sortByComplexity(personalizedPrompts).map((p) => (
                <PromptCard key={p.id} prompt={p as any} categories={categories} defaultAIProvider={defaultAIProvider} />
              ))
            ) : (
              items.map((p, index) => (
                <Fragment key={p.id}>
                  <PromptCard prompt={p as any} categories={categories} defaultAIProvider={defaultAIProvider} />
                  {(index + 1) % 6 === 0 && index < items.length - 1 && (
                    <div className="sm:col-span-2 lg:col-span-3"><PromptStudioCTA variant="inline" /></div>
                  )}
                </Fragment>
              ))
            )}
          </div>
        </section>

        {hasMore && (
          <div className="flex justify-center mt-8 mb-4">
            <Button variant="secondary" onClick={loadMore} disabled={loading} className="sticky bottom-4 z-30 shadow-lg">
              {loading ? "Loading..." : "Load more"}
            </Button>
          </div>
        )}

        <QuickDiscoverySection onSearchClick={handleCategoryClick} />

        {/* Submit Prompt CTA */}
        <section className="mt-12 mb-8 text-center">
          <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-2">Have a great prompt to share?</h3>
              <p className="text-muted-foreground mb-4">Help the community by submitting your best prompts.</p>
              <Button asChild><Link to="/submit-prompt">Submit a Prompt</Link></Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
};

export default PromptLibrary;
