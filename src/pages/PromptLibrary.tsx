import React, { Fragment, useEffect } from "react";
import SEO from "@/components/SEO";
import { PromptFilters } from "@/components/prompt/PromptFilters";
import { PromptCard } from "@/components/prompt/PromptCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageHero from "@/components/layout/PageHero";
import CountdownTimer from "@/components/conversion/CountdownTimer";
import { Link } from "react-router-dom";
import { Search, Heart } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PromptStudioCTA } from "@/components/ui/prompt-studio-cta";
import { SearchUpsellPacks } from "@/components/library/SearchUpsellPacks";
import { useIsMobile } from "@/hooks/use-mobile";

// Extracted components and hook
import { usePromptLibrary, sortByComplexity } from "@/hooks/usePromptLibrary";
import { PopularCategories } from "@/components/library/PopularCategories";
import { QuickDiscoverySection } from "@/components/library/QuickDiscoverySection";

const PromptLibrary = () => {
  const isMobile = useIsMobile();
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

  // Scroll to hash element or top
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
      <CountdownTimer variant="banner" />
      <SEO 
        title="Browse AI Prompts Library" 
        description="Discover thousands of ready-to-use AI prompts for ChatGPT, Claude, and more."
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

      <main className="container py-10">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Browse Library</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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
