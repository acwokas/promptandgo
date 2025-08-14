import SEO from "@/components/SEO";
import { PromptFilters } from "@/components/prompt/PromptFilters";
import { PromptCard } from "@/components/prompt/PromptCard";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Heart, Bot } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useState, useRef } from "react";
import type { Category as CategoryType } from "@/data/prompts";
import { toast } from "@/hooks/use-toast";
import { usePersonalizedPrompts } from "@/hooks/usePersonalizedPrompts";

const PAGE_SIZE = 6;

interface PromptUI {
  id: string;
  categoryId: string;
  subcategoryId?: string | null;
  title: string;
  whatFor?: string | null;
  prompt: string;
  imagePrompt?: string | null;
  excerpt?: string | null;
  tags: string[];
  isPro?: boolean;
}

// Deduplicate prompts by normalized title to avoid showing near-identical entries
const normalizeTitle = (t?: string | null) => {
  let s = (t || "").toLowerCase().trim();

  // Strip common "variant" suffixes so "Title (variant)" and "Title v2" dedupe
  s = s.replace(/\s*\((?:variant|variants?|alt|alternate|alternat(?:e|ive)|v\d+|ver(?:sion)?\s*\d+|rev(?:ision)?\s*[a-z0-9]+)\)\s*$/g, "");
  s = s.replace(/\s*[-–—|]\s*(?:variant|alt|alternate|v\d+|ver(?:sion)?\s*\d+|rev(?:ision)?\s*[a-z0-9]+)\s*$/g, "");
  s = s.replace(/\s+(?:v|ver(?:sion)?)\s*\d+\s*$/g, "");
  s = s.replace(/\s*#\d+\s*$/g, "");

  // Collapse extra whitespace
  s = s.replace(/\s+/g, " ").trim();
  return s;
};
const dedupeByTitle = (arr: PromptUI[]) => {
  const seen = new Set<string>();
  return arr.filter((p) => {
    const key = normalizeTitle(p.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Reorder results: first up to 2 locked (PRO), then all free, then remaining locked
const reorderByLockedBuckets = (arr: PromptUI[]) => {
  const orderIndex = new Map<string, number>();
  arr.forEach((p, i) => orderIndex.set(p.id, i));

  const pro = arr.filter((p) => !!p.isPro).sort((a, b) => (orderIndex.get(a.id)! - orderIndex.get(b.id)!));
  const free = arr.filter((p) => !p.isPro).sort((a, b) => (orderIndex.get(a.id)! - orderIndex.get(b.id)!));

  const topTwoPro = pro.slice(0, 2);
  const restPro = pro.slice(2);

  return [...topTwoPro, ...free, ...restPro];
};

const PromptLibrary = () => {
  const { user } = useSupabaseAuth();
  const { personalizedPrompts, hasPersonalization, loading: personalizationLoading } = usePersonalizedPrompts();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [subcategoryId, setSubcategoryId] = useState<string | undefined>();
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [randomMode, setRandomMode] = useState<boolean>(false);
  const [includePro, setIncludePro] = useState(true);
  const [proOnly, setProOnly] = useState(false);
  const [ribbon, setRibbon] = useState<string | undefined>();


  const [page, setPage] = useState(1);
  const [items, setItems] = useState<PromptUI[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const isRandomActiveRef = useRef<boolean>(false);
  const clearRandom = () => {
    if (randomMode || searchParams.get('random')) {
      setRandomMode(false);
      isRandomActiveRef.current = false;
      const next = new URLSearchParams(searchParams);
      if (next.has('random')) {
        next.delete('random');
        setSearchParams(next, { replace: true });
      }
    }
  };

  // Load categories + subcategories and compose to existing UI shape
  const loadCategories = useCallback(async () => {
    const [catRes, subRes] = await Promise.all([
      supabase.from("categories").select("id,name,slug").order("name"),
      supabase.from("subcategories").select("id,name,slug,category_id").order("name"),
    ]);

    if (catRes.error) {
      toast({ title: "Failed to load categories" });
      return;
    }
    if (subRes.error) {
      toast({ title: "Failed to load subcategories" });
      return;
    }

    // Only keep categories that actually have at least one subcategory row
    const subcatByCategory = new Map<string, { id: string; name: string }[]>();
    (subRes.data || []).forEach((s: any) => {
      const list = subcatByCategory.get(s.category_id as string) || [];
      list.push({ id: s.id as string, name: s.name as string });
      subcatByCategory.set(s.category_id as string, list);
    });

    const built: CategoryType[] = (catRes.data || [])
      .filter((c: any) => subcatByCategory.has(c.id as string))
      .map((c: any) => ({
        id: c.id as string,
        name: c.name as string,
        subcategories: subcatByCategory.get(c.id as string) || [],
      }));

    setCategories(built);
  }, []);

  // Internal fetcher for a specific page
  const fetchPromptsPage = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      try {
        // If filtering by tag, resolve prompt ids for that tag first
        let promptIdsForTag: string[] | undefined;
        if (selectedTag) {
          const tagRes = await supabase
            .from("tags")
            .select("id")
            .eq("name", selectedTag)
            .maybeSingle();

          if (tagRes.error) throw tagRes.error;
          const tagId = tagRes.data?.id as string | undefined;
          if (!tagId) {
            return { data: [] as PromptUI[], count: 0 };
          }
          const ptRes = await supabase
            .from("prompt_tags")
            .select("prompt_id")
            .eq("tag_id", tagId);
          if (ptRes.error) throw ptRes.error;
          promptIdsForTag = (ptRes.data || []).map((r) => r.prompt_id as string);
          if (promptIdsForTag.length === 0) {
            return { data: [] as PromptUI[], count: 0 };
          }
        }

        const from = (pageNumber - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let q = supabase
          .from("prompts")
          .select(
            "id, category_id, subcategory_id, title, what_for, prompt, image_prompt, excerpt, is_pro, ribbon",
            { count: "exact" }
          )
          .order("created_at", { ascending: false });

        const rawQuery = query.trim();
        const qLower = rawQuery.toLowerCase();
        const proSearch = qLower === "pro";

        if (categoryId) q = q.eq("category_id", categoryId);
        if (subcategoryId) q = q.eq("subcategory_id", subcategoryId);
        if (!proSearch && rawQuery) q = q.textSearch("search_vector", rawQuery, { type: "websearch" });
        if (promptIdsForTag) q = q.in("id", promptIdsForTag);
        if (ribbon) q = q.eq("ribbon", ribbon);
        if (proOnly || proSearch) q = q.eq("is_pro", true);
        else if (!includePro) q = q.eq("is_pro", false);

        q = q.range(from, to);

        const { data, error, count } = await q;
        if (error) throw error;

        const rows = data || [];
        const promptIds = rows.map((r) => r.id as string);

        // Fetch tags for this page's prompts
        let tagMap = new Map<string, string[]>();
        if (promptIds.length > 0) {
          const tagsJoin = await supabase
            .from("prompt_tags")
            .select("prompt_id, tags:tag_id(name)")
            .in("prompt_id", promptIds);
          if (tagsJoin.error) throw tagsJoin.error;
          (tagsJoin.data || []).forEach((r: any) => {
            const pid = r.prompt_id as string;
            const name = (r.tags?.name as string) || undefined;
            if (!name) return;
            const arr = tagMap.get(pid) || [];
            arr.push(name);
            tagMap.set(pid, arr);
          });
        }

        const mapped: PromptUI[] = rows.map((r: any) => ({
          id: r.id,
          categoryId: r.category_id,
          subcategoryId: r.subcategory_id,
          title: r.title,
          whatFor: r.what_for,
          prompt: r.prompt,
          imagePrompt: r.image_prompt,
          excerpt: r.excerpt,
          tags: tagMap.get(r.id) || [],
          isPro: !!r.is_pro,
        }));

        const total = count || 0;
        const newHasMore = to + 1 < total;
        return { data: mapped, count: total, hasMore: newHasMore };
      } catch (e) {
        console.error(e);
        toast({ title: "Failed to load prompts" });
        return { data: [] as PromptUI[], count: 0, hasMore: false };
      } finally {
        setLoading(false);
      }
    },
    [categoryId, subcategoryId, query, selectedTag, includePro, proOnly, ribbon]
  );

  const fetchRandomPrompt = useCallback(async () => {
    setLoading(true);
    try {
      const first = await supabase
        .from("prompts")
        .select("id", { count: "exact" })
        .range(0, 0);
      const total = first.count || 0;
      if (!total) {
        setItems([]);
        setHasMore(false);
        return;
      }
      const index = Math.floor(Math.random() * total);
      const oneRes = await supabase
        .from("prompts")
        .select(
          "id, category_id, subcategory_id, title, what_for, prompt, image_prompt, excerpt, is_pro"
        )
        .range(index, index);
      if (oneRes.error) throw oneRes.error;
      const row: any = (oneRes.data || [])[0];
      if (!row) {
        setItems([]);
        setHasMore(false);
        return;
      }
      const tagsJoin = await supabase
        .from("prompt_tags")
        .select("prompt_id, tags:tag_id(name)")
        .eq("prompt_id", row.id);
      if (tagsJoin.error) throw tagsJoin.error;
      const tagNames = (tagsJoin.data || [])
        .map((r: any) => r.tags?.name as string)
        .filter(Boolean);
      const mapped: PromptUI = {
        id: row.id,
        categoryId: row.category_id,
        subcategoryId: row.subcategory_id,
        title: row.title,
        whatFor: row.what_for,
        prompt: row.prompt,
        imagePrompt: row.image_prompt,
        excerpt: row.excerpt,
        tags: tagNames,
        isPro: !!row.is_pro,
      };
      if (isRandomActiveRef.current) {
        setItems([mapped]);
        setHasMore(false);
        setPage(1);
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to load random prompt" });
    } finally {
      setLoading(false);
    }
  }, [toast]);


  const refresh = useCallback(async () => {
    setPage(1);
    const res = await fetchPromptsPage(1);
    const data = res.data || [];
    setItems(reorderByLockedBuckets(dedupeByTitle(data)));
    setHasMore(!!res.hasMore);
  }, [fetchPromptsPage]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    const next = page + 1;
    const res = await fetchPromptsPage(next);
    const data = res.data || [];
    setItems((prev) => reorderByLockedBuckets(dedupeByTitle([...prev, ...data])));
    setHasMore(!!res.hasMore);
    setPage(next);
  }, [page, hasMore, loading, fetchPromptsPage]);

  // Always land at top when visiting Library
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const isRandom = !!searchParams.get('random');
    setRandomMode(isRandom);
    isRandomActiveRef.current = isRandom;
    const cid = searchParams.get('categoryId') || undefined;
    const sid = searchParams.get('subcategoryId') || undefined;
    const po = searchParams.get('proOnly');
    const q = searchParams.get('q') || undefined;
    const ribbonFromUrl = searchParams.get('ribbon') || undefined;
    if (cid !== undefined) setCategoryId(cid);
    if (sid !== undefined) setSubcategoryId(sid);
    setProOnly(po === '1' || po === 'true');
    if (q !== undefined) setQuery(q);
    if (ribbonFromUrl !== undefined) setRibbon(ribbonFromUrl);
  }, [searchParams]);

  // Set ribbon to "RECOMMENDED" when personalized prompts are available and no explicit ribbon is set
  useEffect(() => {
    if (!searchParams.get('ribbon') && hasPersonalization && personalizedPrompts.length > 0 && !ribbon && !categoryId && !subcategoryId && !query) {
      setRibbon("RECOMMENDED");
    }
  }, [hasPersonalization, personalizedPrompts, ribbon, categoryId, subcategoryId, query, searchParams]);

  // Initial loads
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Refresh when filters or mode change
  useEffect(() => {
    if (randomMode) {
      fetchRandomPrompt();
    } else {
      refresh();
    }
  }, [categoryId, subcategoryId, query, selectedTag, ribbon, randomMode, refresh, fetchRandomPrompt]);

  // Scroll to first prompt when in random mode after items load
  useEffect(() => {
    if (!randomMode) return;
    if (loading) return;
    if (items.length > 0 && listRef.current) {
      const header = document.querySelector('header');
      const headerHeight = header ? (header as HTMLElement).getBoundingClientRect().height : 0;
      const y = listRef.current.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
      window.scrollTo({ top: y, behavior: 'auto' });
    }
  }, [items, loading, randomMode]);

  return (
    <>
      <PageHero
        variant="prompt"
        title={
          <>
            <span className="text-gradient-brand">Prompt</span> Library
          </>
        }
        subtitle={<>Find the perfect prompt fast: browse free prompts by category or subcategory, save your favourites for later <Link to="/account/favorites" className="text-accent hover:underline">My Prompts</Link>, add <Link to="/library?proOnly=true" className="text-accent hover:underline">PRO prompts</Link> to your cart to review later, or <Link to="/cart" className="text-accent hover:underline">subscribe</Link> to immediately unlock all premium items.</>}
      >
        <Button asChild size="lg" variant="hero" className="px-6">
          <a href="#library-filters"><Search className="h-4 w-4 mr-2" />Browse Prompt Library</a>
        </Button>
        <Button asChild size="lg" variant="inverted">
          <Link to="/packs">⚡️Power Packs</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to="/toolkit"><Bot className="h-4 w-4 mr-2 text-blue-500" />AI Tools</Link>
        </Button>
        {user ? (
          <Button asChild size="lg" variant="secondary">
            <Link to="/account/favorites"><Heart className="h-4 w-4 mr-2" />My Prompts</Link>
          </Button>
        ) : (
          <Button asChild size="lg" variant="secondary">
            <Link to="/auth">Login</Link>
          </Button>
        )}
      </PageHero>
      <main className="container py-10">
        <SEO
          title="Prompt Library – Ready-to-use AI Prompts"
          description="Browse prompts by category and subcategory with fast search. Copy-ready cards for marketing, productivity, and sales."
          structuredData={[
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Prompt Library",
              description: "Browse prompts by category and subcategory with fast search.",
              url: typeof window !== 'undefined' ? window.location.href : 'https://promptandgo.ai/library',
            },
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: (items || []).slice(0, 10).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: p.title,
                url: typeof window !== 'undefined' ? `${window.location.origin}/library?q=${encodeURIComponent(p.title)}` : `https://promptandgo.ai/library?q=${encodeURIComponent(p.title)}`,
              })),
            },
          ]}
        />


        <section id="library-filters" className="scroll-mt-28 md:scroll-mt-28">
          <PromptFilters
            categories={categories}
            categoryId={categoryId}
            subcategoryId={subcategoryId}
            query={query}
            includePro={includePro}
            ribbon={ribbon}
            onChange={(n) => {
              clearRandom();
              if (n.categoryId !== undefined) setCategoryId(n.categoryId || undefined);
              if (n.subcategoryId !== undefined) setSubcategoryId(n.subcategoryId || undefined);
              if (n.query !== undefined) {
                setQuery(n.query);
                setSelectedTag(undefined); // typing a query clears tag filter
              }
              if (n.includePro !== undefined) setIncludePro(!!n.includePro);
              if (n.ribbon !== undefined) {
                setRibbon(n.ribbon || undefined);
                // Update URL to reflect ribbon change
                const newSearchParams = new URLSearchParams(searchParams);
                if (n.ribbon) {
                  newSearchParams.set('ribbon', n.ribbon);
                } else {
                  newSearchParams.delete('ribbon');
                }
                setSearchParams(newSearchParams, { replace: true });
              }
            }}
            onSearch={() => { clearRandom(); refresh(); }}
            onClear={() => {
              clearRandom();
              setCategoryId(undefined);
              setSubcategoryId(undefined);
              setQuery("");
              setSelectedTag(undefined);
              setProOnly(false);
              setIncludePro(true);
              setPage(1);
              // Reset ribbon to default based on personalization
              const defaultRibbon = hasPersonalization && personalizedPrompts.length > 0 ? "RECOMMENDED" : undefined;
              setRibbon(defaultRibbon);
              // Clear URL search params as well
              const newSearchParams = new URLSearchParams();
              if (defaultRibbon) {
                newSearchParams.set('ribbon', defaultRibbon);
              }
              setSearchParams(newSearchParams, { replace: true });
            }}
          />
        </section>

        {/* Personalized Recommendations - show when no active filters */}
        {hasPersonalization && personalizedPrompts.length > 0 && !categoryId && !subcategoryId && !query && !selectedTag && (
          <section className="mt-8 mb-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">🎯 Recommended for You</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your preferences and goals
              </p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {personalizedPrompts.map((p) => (
                <div key={p.id} className="relative">
                  <PromptCard
                    prompt={p as any}
                    categories={categories}
                    onTagClick={(t) => { 
                      clearRandom();
                      setSelectedTag(t);
                      setQuery(t);
                      setCategoryId(undefined);
                      setSubcategoryId(undefined);
                      setRibbon(undefined);
                    }}
                    onCategoryClick={(cid) => { 
                      clearRandom();
                      setCategoryId(cid);
                      setSubcategoryId(undefined);
                      setSelectedTag(undefined);
                      setProOnly(false);
                      setQuery("");
                      setRibbon(undefined);
                    }}
                    onSubcategoryClick={(sid, cid) => { 
                      clearRandom();
                      setCategoryId(cid);
                      setSubcategoryId(sid);
                      setSelectedTag(undefined);
                      setProOnly(false);
                      setQuery("");
                      setRibbon(undefined);
                    }}
                    onViewAllPro={() => { 
                      clearRandom();
                      setCategoryId(undefined);
                      setSubcategoryId(undefined);
                      setSelectedTag(undefined);
                      setQuery("");
                      setProOnly(true);
                      setRibbon(undefined);
                    }}
                  />
                  {/* Relevance indicator */}
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full border-2 border-background shadow-sm">
                    Match: {Math.round(p.relevanceScore)}%
                  </div>
                  {/* Match reasons */}
                  {p.matchReason.length > 0 && (
                    <div className="absolute bottom-2 left-2 right-2 bg-background/95 backdrop-blur-sm rounded-md p-2 border text-xs">
                      <div className="text-muted-foreground">
                        {p.matchReason.join(" • ")}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {personalizationLoading && (
              <div className="text-center py-4 text-muted-foreground">
                Loading personalized recommendations...
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Want different recommendations? Update your preferences in{" "}
                <Link to="/account/profile" className="text-primary hover:underline">
                  Account → Profile
                </Link>
              </p>
            </div>
          </section>
        )}

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            {ribbon === "RECOMMENDED" ? "🎯 Recommended Prompts" : 
             hasPersonalization && personalizedPrompts.length > 0 && ribbon !== "RECOMMENDED" ? "All Prompts" : 
             "Browse All Prompts"}
          </h2>
          <div ref={listRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p as any}
                categories={categories}
                onTagClick={(t) => { clearRandom();
                  setSelectedTag(t);
                  setQuery(t); // reflect in input
                  setCategoryId(undefined);
                  setSubcategoryId(undefined);
                }}
                onCategoryClick={(cid) => { clearRandom();
                  setCategoryId(cid);
                  setSubcategoryId(undefined);
                  setSelectedTag(undefined);
                  setProOnly(false);
                  setQuery("");
                }}
                onSubcategoryClick={(sid, cid) => { clearRandom();
                  setCategoryId(cid);
                  setSubcategoryId(sid);
                  setSelectedTag(undefined);
                  setProOnly(false);
                  setQuery("");
                }}
                onViewAllPro={() => { clearRandom();
                  setCategoryId(undefined);
                  setSubcategoryId(undefined);
                  setSelectedTag(undefined);
                  setQuery("");
                  setProOnly(true);
                }}
              />
            ))}
          </div>
        </section>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <Button variant="secondary" onClick={loadMore} disabled={loading}>
              {loading ? "Loading..." : "Load more"}
            </Button>
          </div>
        )}
      </main>
    </>
  );
};

export default PromptLibrary;
