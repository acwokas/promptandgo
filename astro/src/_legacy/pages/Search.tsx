import { useState, useEffect, useMemo, useCallback } from "react";
import { Search as SearchIcon, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface SearchResult {
  title: string;
  snippet: string;
  category: string;
  language: string;
  type: "prompt" | "template" | "guide";
  url: string;
  popularity: number;
  date: string;
}

const ALL_ITEMS: SearchResult[] = [
  { title: "Japanese Business Email Template", snippet: "Professional keigo email templates for B2B communication in Japan, including seasonal greetings and formal closings.", category: "Business", language: "Japanese", type: "template", url: "/templates", popularity: 2400, date: "2026-04-08" },
  { title: "Mandarin Marketing Copy Generator", snippet: "Create culturally resonant marketing copy in Simplified and Traditional Chinese for social media platforms.", category: "Marketing", language: "Mandarin", type: "prompt", url: "/library", popularity: 1800, date: "2026-04-07" },
  { title: "Korean Customer Service Scripts", snippet: "AI-generated customer support scripts using appropriate honorifics and politeness levels for Korean audiences.", category: "Business", language: "Korean", type: "template", url: "/templates", popularity: 1500, date: "2026-04-06" },
  { title: "Hindi Technical Documentation", snippet: "Generate technical documentation and user guides in Hindi with proper transliteration support.", category: "Technical", language: "Hindi", type: "prompt", url: "/library", popularity: 1200, date: "2026-04-05" },
  { title: "Thai Social Media Content", snippet: "Engaging social media posts for Thai platforms like LINE and Facebook with local cultural references.", category: "Marketing", language: "Thai", type: "prompt", url: "/library", popularity: 980, date: "2026-04-04" },
  { title: "Vietnamese E-commerce Listings", snippet: "Product description templates optimized for Vietnamese e-commerce platforms like Shopee and Tiki.", category: "Business", language: "Vietnamese", type: "template", url: "/templates", popularity: 890, date: "2026-04-03" },
  { title: "Bahasa Indonesia Blog Writing", snippet: "SEO-optimized blog post prompts for Indonesian audiences with natural Bahasa phrasing.", category: "Creative", language: "Bahasa", type: "prompt", url: "/library", popularity: 760, date: "2026-04-02" },
  { title: "Cross-Platform SEO Content Guide", snippet: "Comprehensive guide to optimizing prompts for SEO across ChatGPT, Claude, and Gemini.", category: "Marketing", language: "English", type: "guide", url: "/tips", popularity: 3200, date: "2026-04-01" },
  { title: "How to Write AI Prompts", snippet: "Step-by-step guide for writing effective AI prompts that deliver consistent results.", category: "Education", language: "English", type: "guide", url: "/tips/how-to-write-ai-prompts", popularity: 4500, date: "2026-03-25" },
  { title: "Multilingual Meeting Notes", snippet: "Automatically generate meeting summaries in multiple Asian languages from a single prompt.", category: "Business", language: "English", type: "template", url: "/templates", popularity: 2100, date: "2026-03-20" },
  { title: "Asian Market Research Prompts", snippet: "Deep-dive market research prompts covering APAC consumer behavior and trends.", category: "Business", language: "English", type: "prompt", url: "/library", popularity: 1700, date: "2026-03-18" },
  { title: "Creative Storytelling in Korean", snippet: "Fiction and narrative writing prompts adapted for Korean literary styles and cultural nuance.", category: "Creative", language: "Korean", type: "prompt", url: "/library", popularity: 650, date: "2026-03-15" },
  { title: "ChatGPT vs Claude Comparison", snippet: "Detailed comparison of prompt behavior across ChatGPT and Claude for Asian language tasks.", category: "Education", language: "English", type: "guide", url: "/tips", popularity: 2800, date: "2026-03-10" },
  { title: "Japanese Keigo Business Prompts", snippet: "Master honorific Japanese business writing with AI using correct keigo levels.", category: "Business", language: "Japanese", type: "prompt", url: "/library", popularity: 1900, date: "2026-03-05" },
  { title: "Mandarin Legal Document Templates", snippet: "Legal document drafting templates for Chinese corporate and contract contexts.", category: "Technical", language: "Mandarin", type: "template", url: "/templates", popularity: 1100, date: "2026-03-01" },
  { title: "AI Prompts for Education", snippet: "Teaching and lesson planning prompts for educators working with multilingual Asian classrooms.", category: "Education", language: "English", type: "prompt", url: "/library", popularity: 1400, date: "2026-02-25" },
];

const CATEGORIES = ["Business", "Marketing", "Creative", "Technical", "Education"];
const LANGUAGES = ["English", "Japanese", "Mandarin", "Korean", "Hindi", "Thai", "Vietnamese", "Bahasa"];
const PLATFORMS = ["ChatGPT", "Claude", "Gemini", "DeepSeek", "Qwen", "Perplexity"];
const CONTENT_TYPES = ["All", "Prompts", "Templates", "Guides"] as const;

type SortOption = "relevance" | "newest" | "popular";

const highlightMatch = (text: string, query: string): string => {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark class='bg-primary/30 text-foreground rounded px-0.5'>$1</mark>");
};

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedType, setSelectedType] = useState<typeof CONTENT_TYPES[number]>("All");
  const [sort, setSort] = useState<SortOption>("relevance");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim() && !recentSearches.includes(query.trim())) {
        setRecentSearches(prev => [query.trim(), ...prev].slice(0, 5));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }, []);

  const results = useMemo(() => {
    let filtered = ALL_ITEMS;

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => selectedCategories.includes(item.category));
    }

    if (selectedLanguage !== "all") {
      filtered = filtered.filter(item => item.language === selectedLanguage);
    }

    if (selectedType !== "All") {
      const typeMap: Record<string, string> = { Prompts: "prompt", Templates: "template", Guides: "guide" };
      filtered = filtered.filter(item => item.type === typeMap[selectedType]);
    }

    switch (sort) {
      case "newest":
        return [...filtered].sort((a, b) => b.date.localeCompare(a.date));
      case "popular":
        return [...filtered].sort((a, b) => b.popularity - a.popularity);
      default:
        if (!debouncedQuery.trim()) return [...filtered].sort((a, b) => b.popularity - a.popularity);
        const q = debouncedQuery.toLowerCase();
        return [...filtered].sort((a, b) => {
          const aTitle = a.title.toLowerCase().includes(q) ? 2 : 0;
          const bTitle = b.title.toLowerCase().includes(q) ? 2 : 0;
          return (bTitle + b.popularity / 10000) - (aTitle + a.popularity / 10000);
        });
    }
  }, [debouncedQuery, selectedCategories, selectedLanguage, selectedType, sort]);

  const typeColorMap: Record<string, string> = {
    prompt: "bg-primary/20 text-primary",
    template: "bg-accent/20 text-accent",
    guide: "bg-secondary text-secondary-foreground",
  };

  return (
    <>
      <Helmet>
        <title>Search Prompts & Templates | PromptAndGo</title>
        <meta name="description" content="Search AI prompts, templates, and guides optimized for Asian languages and markets." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Search */}
        <section className="bg-gradient-to-b from-card to-background border-b border-border/50 py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Search PromptAndGo</h1>
            <p className="text-muted-foreground mb-8">Find prompts, templates, and guides across Asian languages and platforms</p>

            <div className="relative max-w-2xl mx-auto">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search prompts, templates, guides..."
                className="pl-12 pr-10 py-6 text-lg bg-card border-border"
                aria-label="Search prompts, templates, and guides"
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setDebouncedQuery(""); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Recent searches */}
            {recentSearches.length > 0 && !debouncedQuery && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="text-xs text-muted-foreground self-center">Recent:</span>
                {recentSearches.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(s)}
                    className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Content */}
        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
              aria-expanded={showFilters}
              aria-controls="search-filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside
              id="search-filters"
              role="complementary"
              aria-label="Search filters"
              className={`w-64 shrink-0 space-y-6 ${showFilters ? "block" : "hidden"} lg:block`}
            >
              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Category</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label htmlFor="lang-filter" className="text-sm font-semibold text-foreground mb-3 block">Language</label>
                <select
                  id="lang-filter"
                  value={selectedLanguage}
                  onChange={e => setSelectedLanguage(e.target.value)}
                  className="w-full rounded-md border border-border bg-card text-foreground px-3 py-2 text-sm"
                >
                  <option value="all">All Languages</option>
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Content Type */}
              <fieldset>
                <legend className="text-sm font-semibold text-foreground mb-3">Content Type</legend>
                <div className="space-y-2">
                  {CONTENT_TYPES.map(t => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                      <input
                        type="radio"
                        name="contentType"
                        checked={selectedType === t}
                        onChange={() => setSelectedType(t)}
                        className="text-primary focus:ring-primary"
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Platform Tags */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(p => (
                    <span key={p} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{p}</span>
                  ))}
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Results header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {debouncedQuery
                    ? `Showing ${results.length} result${results.length !== 1 ? "s" : ""} for "${debouncedQuery}"`
                    : `Showing ${results.length} items`}
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-select" className="text-xs text-muted-foreground">Sort:</label>
                  <select
                    id="sort-select"
                    value={sort}
                    onChange={e => setSort(e.target.value as SortOption)}
                    className="rounded-md border border-border bg-card text-foreground px-2 py-1 text-sm"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>

              {results.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {results.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.url}
                      className="block p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColorMap[item.type]}`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        <span className="text-xs text-muted-foreground ml-auto">{item.language}</span>
                      </div>
                      <h3
                        className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1"
                        dangerouslySetInnerHTML={{ __html: highlightMatch(item.title, debouncedQuery) }}
                      />
                      <p
                        className="text-sm text-muted-foreground line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: highlightMatch(item.snippet, debouncedQuery) }}
                      />
                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span>{(item.popularity / 1000).toFixed(1)}k views</span>
                        <span>{item.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <SearchIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-6">Try broader terms or browse by category</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link to="/library" className="text-sm text-primary hover:underline">Browse Prompts</Link>
                    <Link to="/templates" className="text-sm text-primary hover:underline">View Templates</Link>
                    <Link to="/tips" className="text-sm text-primary hover:underline">Read Guides</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
