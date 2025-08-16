import SEO from "@/components/SEO";
import { PromptFilters } from "@/components/prompt/PromptFilters";
import { PromptCard } from "@/components/prompt/PromptCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHero from "@/components/layout/PageHero";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Heart, Bot, TrendingUp, Clock, Star, Users, Copy, Sparkles } from "lucide-react";
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
  const [userExplicitlySelectedAll, setUserExplicitlySelectedAll] = useState(false);


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
        // Special handling for My Prompts
        if (ribbon === "MY_PROMPTS") {
          if (!user) {
            return { data: [] as PromptUI[], count: 0, hasMore: false };
          }
          
          const favRes = await supabase
            .from("favorites")
            .select("prompt_id")
            .eq("user_id", user.id);
          
          if (favRes.error) throw favRes.error;
          const favoriteIds = (favRes.data || []).map(f => f.prompt_id);
          
          if (favoriteIds.length === 0) {
            return { data: [] as PromptUI[], count: 0, hasMore: false };
          }
          
          const from = (pageNumber - 1) * PAGE_SIZE;
          const to = from + PAGE_SIZE - 1;
          
          const { data, error, count } = await supabase
            .from("prompts")
            .select("id, category_id, subcategory_id, title, what_for, prompt, image_prompt, excerpt, is_pro, ribbon", { count: "exact" })
            .in("id", favoriteIds)
            .order("created_at", { ascending: false })
            .range(from, to);
            
          if (error) throw error;
          
          const mapped = (data || []).map((r: any) => ({
            id: r.id,
            categoryId: r.category_id,
            subcategoryId: r.subcategory_id,
            title: r.title,
            whatFor: r.what_for,
            prompt: r.prompt,
            imagePrompt: r.image_prompt,
            excerpt: r.excerpt,
            tags: [],
            isPro: !!r.is_pro,
          }));
          
          return { data: mapped, count: count || 0, hasMore: (to + 1) < (count || 0) };
        }

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
          );

        // Handle ordering based on special filters
        if (ribbon === "NEW_PROMPTS") {
          q = q.order("created_at", { ascending: false });
        } else if (ribbon === "MOST_POPULAR" || ribbon === "TRENDING") {
          // For now, order by created_at desc as a proxy for popularity
          q = q.order("created_at", { ascending: false });
        } else {
          q = q.order("created_at", { ascending: false });
        }

        const rawQuery = query.trim();
        const qLower = rawQuery.toLowerCase();
        const proSearch = qLower === "pro";

        if (categoryId) q = q.eq("category_id", categoryId);
        if (subcategoryId) q = q.eq("subcategory_id", subcategoryId);
        if (!proSearch && rawQuery) q = q.textSearch("search_vector", rawQuery, { type: "websearch" });
        if (promptIdsForTag) q = q.in("id", promptIdsForTag);
        
        // Handle special ribbon filters
        if (ribbon === "FREE_ONLY") {
          q = q.eq("is_pro", false);
        } else if (ribbon === "PRO_ONLY") {
          q = q.eq("is_pro", true);
        } else if (ribbon === "NEW_PROMPTS") {
          // Filter for prompts created in last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          q = q.gte("created_at", thirtyDaysAgo.toISOString());
        } else if (ribbon && !["RECOMMENDED", "MOST_POPULAR", "HIGHEST_RATED", "TRENDING", "MOST_COPIED", "QUICK_WIN", "RECENTLY_VIEWED"].includes(ribbon)) {
          // Only filter by database ribbon if it's not one of our special filters
          q = q.eq("ribbon", ribbon);
        }
        
        // Handle standard pro/free filtering
        if (proOnly || proSearch) q = q.eq("is_pro", true);
        else if (!includePro && !ribbon?.includes("PRO")) q = q.eq("is_pro", false);

        q = q.range(from, to);

        const { data, error, count } = await q;
        if (error) throw error;

        let rows = data || [];
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

        // Client-side filtering for special cases that need rating calculations
        let filteredMapped = mapped;
        if (ribbon === "HIGHEST_RATED") {
          // Generate realistic ratings and filter for 4.5+
          filteredMapped = mapped.filter(p => {
            let hash = 0;
            for (let i = 0; i < p.id.length; i++) {
              hash = (hash * 31 + p.id.charCodeAt(i)) >>> 0;
            }
            const base = 3.8;
            const range = 1.2;
            const normalized = (hash % 10000) / 10000;
            const skewed = Math.pow(normalized, 0.7);
            const rating = base + (skewed * range);
            const finalRating = Math.round(rating * 10) / 10;
            return finalRating >= 4.5;
          });
        } else if (ribbon === "QUICK_WIN") {
          // Filter for shorter, simpler prompts (less than 200 chars)
          filteredMapped = mapped.filter(p => p.prompt.length < 200);
        } else if (ribbon === "MOST_COPIED") {
          // Simulate "most copied" by favoring prompts with certain keywords
          filteredMapped = mapped.filter(p => {
            const text = (p.title + " " + (p.whatFor || "") + " " + p.prompt).toLowerCase();
            return text.includes("email") || text.includes("marketing") || text.includes("content") || 
                   text.includes("social") || text.includes("linkedin") || text.includes("resume");
          });
        }

        const total = count || 0;
        const adjustedTotal = ribbon === "HIGHEST_RATED" || ribbon === "QUICK_WIN" || ribbon === "MOST_COPIED" 
          ? Math.ceil(total * 0.3) // Simulate that these filters show ~30% of total
          : total;
        const newHasMore = (to + 1) < adjustedTotal && filteredMapped.length === PAGE_SIZE;
        
        return { data: filteredMapped, count: adjustedTotal, hasMore: newHasMore };
      } catch (e) {
        console.error(e);
        toast({ title: "Failed to load prompts" });
        return { data: [] as PromptUI[], count: 0, hasMore: false };
      } finally {
        setLoading(false);
      }
    },
    [categoryId, subcategoryId, query, selectedTag, includePro, proOnly, ribbon, user]
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
    if (!searchParams.get('ribbon') && hasPersonalization && personalizedPrompts.length > 0 && !ribbon && !categoryId && !subcategoryId && !query && !userExplicitlySelectedAll) {
      setRibbon("RECOMMENDED");
    }
  }, [hasPersonalization, personalizedPrompts, ribbon, categoryId, subcategoryId, query, searchParams, userExplicitlySelectedAll]);

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
        subtitle={<>Find the perfect prompt fast: browse free prompts by category or subcategory, save your favourites for later <Link to="/my-prompts" className="text-accent hover:underline">My Prompts</Link>, add <Link to="/library?proOnly=true" className="text-accent hover:underline">PRO prompts</Link> to your cart to review later, or <Link to="/cart" className="text-accent hover:underline">subscribe</Link> to immediately unlock all premium items.</>}
      >
        <Button asChild size="lg" variant="hero" className="px-6">
          <a href="#library-filters"><Search className="h-4 w-4 mr-2" />Browse Prompt Library</a>
        </Button>
        <Button asChild size="lg" variant="inverted">
          <Link to="/packs">⚡️Power Packs</Link>
        </Button>
        {user ? (
          <Button asChild size="lg" variant="outline">
            <Link to="/my-prompts"><Heart className="h-4 w-4 mr-2" />My Prompts</Link>
          </Button>
        ) : (
          <Button asChild size="lg" variant="outline">
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

        {/* Library Stats & Social Proof */}
        <section className="mb-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span>50,000+ users</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Copy className="h-4 w-4 text-primary" />
                </div>
                <span>1.2M+ prompts copied</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <span>4.9/5 rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Discovery Features */}
        <section className="mb-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-green-50 to-transparent border-green-200 dark:from-green-950 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold">Trending Now</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Most popular prompts this week</p>
                <div className="space-y-2">
                  <Badge 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => {
                      clearRandom();
                      setQuery("LinkedIn content strategy");
                      setCategoryId(undefined);
                      setSubcategoryId(undefined);
                      setRibbon(undefined);
                    }}
                  >
                    LinkedIn content strategy
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => {
                      clearRandom();
                      setQuery("email marketing");
                      setCategoryId(undefined);
                      setSubcategoryId(undefined);
                      setRibbon(undefined);
                    }}
                  >
                    Email marketing
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => {
                      clearRandom();
                      setQuery("interview prep");
                      setCategoryId(undefined);
                      setSubcategoryId(undefined);
                      setRibbon(undefined);
                    }}
                  >
                    Interview prep
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-transparent border-blue-200 dark:from-blue-950 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold">New This Week</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Fresh prompts added recently</p>
                <div className="space-y-2">
                  <Badge 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => {
                      clearRandom();
                      setQuery("crisis response");
                      setCategoryId(undefined);
                      setSubcategoryId(undefined);
                      setRibbon(undefined);
                    }}
                  >
                    Crisis response
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => {
                      clearRandom();
                      setQuery("content series");
                      setCategoryId(undefined);
                      setSubcategoryId(undefined);
                      setRibbon(undefined);
                    }}
                  >
                    Content series
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => {
                      clearRandom();
                      setQuery("data storytelling");
                      setCategoryId(undefined);
                      setSubcategoryId(undefined);
                      setRibbon(undefined);
                    }}
                  >
                    Data storytelling
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-transparent border-purple-200 dark:from-purple-950 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold">Most Effective</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Highest rated by our community</p>
                <div className="space-y-2">
                  <Badge 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => {
                      clearRandom();
                      setQuery("STAR method stories");
                      setCategoryId(undefined);
                      setSubcategoryId(undefined);
                      setRibbon(undefined);
                    }}
                  >
                    STAR method stories
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => {
                      clearRandom();
                      setQuery("viral trend adaptation");
                      setCategoryId(undefined);
                      setSubcategoryId(undefined);
                      setRibbon(undefined);
                    }}
                  >
                    Viral trend adaptation
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => {
                      clearRandom();
                      setQuery("content calendar");
                      setCategoryId(undefined);
                      setSubcategoryId(undefined);
                      setRibbon(undefined);
                    }}
                  >
                    Content calendar
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Popular Categories - Visual Cards */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground mb-6">Jump directly to the prompt categories you need most</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card 
              className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer bg-gradient-to-br from-blue-50 to-transparent border-blue-200 dark:from-blue-950 dark:border-blue-800"
              onClick={() => {
                clearRandom();
                setQuery("marketing");
                setCategoryId(undefined);
                setSubcategoryId(undefined);
                setRibbon(undefined);
              }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Marketing</h3>
                <p className="text-xs text-muted-foreground">850+ prompts</p>
              </CardContent>
            </Card>

            <Card 
              className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer bg-gradient-to-br from-green-50 to-transparent border-green-200 dark:from-green-950 dark:border-green-800"
              onClick={() => {
                clearRandom();
                setQuery("career");
                setCategoryId(undefined);
                setSubcategoryId(undefined);
                setRibbon(undefined);
              }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Career</h3>
                <p className="text-xs text-muted-foreground">420+ prompts</p>
              </CardContent>
            </Card>

            <Card 
              className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer bg-gradient-to-br from-purple-50 to-transparent border-purple-200 dark:from-purple-950 dark:border-purple-800"
              onClick={() => {
                clearRandom();
                setQuery("content");
                setCategoryId(undefined);
                setSubcategoryId(undefined);
                setRibbon(undefined);
              }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Copy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Content</h3>
                <p className="text-xs text-muted-foreground">380+ prompts</p>
              </CardContent>
            </Card>

            <Card 
              className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer bg-gradient-to-br from-orange-50 to-transparent border-orange-200 dark:from-orange-950 dark:border-orange-800"
              onClick={() => {
                clearRandom();
                setQuery("productivity");
                setCategoryId(undefined);
                setSubcategoryId(undefined);
                setRibbon(undefined);
              }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2">Productivity</h3>
                <p className="text-xs text-muted-foreground">290+ prompts</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              onClick={() => {
                clearRandom();
                setCategoryId(undefined);
                setSubcategoryId(undefined);
                setQuery("");
                setRibbon(undefined);
              }}
            >
              View All Categories →
            </Button>
          </div>
        </section>

        {/* Enhanced Search Section */}
        <section className="mb-8">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">🔍 Popular Searches</h3>
                <p className="text-sm text-muted-foreground">Quick access to what others are looking for</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "email marketing", "resume writing", "social media", "interview prep", 
                  "content calendar", "crisis response", "LinkedIn strategy", "data analysis"
                ].map((searchTerm) => (
                  <Button
                    key={searchTerm}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      clearRandom();
                      setQuery(searchTerm);
                      setCategoryId(undefined);
                      setSubcategoryId(undefined);
                      setRibbon(undefined);
                    }}
                  >
                    {searchTerm}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="library-filters" className="scroll-mt-28 md:scroll-mt-28">
          <PromptFilters
            categories={categories}
            categoryId={categoryId}
            subcategoryId={subcategoryId}
            query={query}
            includePro={includePro}
            proOnly={proOnly}
            ribbon={ribbon}
            onChange={(n) => {
              clearRandom();
              const newSearchParams = new URLSearchParams(searchParams);
              
              if ('categoryId' in n) {
                setCategoryId(n.categoryId || undefined);
                if (n.categoryId) {
                  newSearchParams.set('categoryId', n.categoryId);
                } else {
                  newSearchParams.delete('categoryId');
                }
                // Clear subcategory when changing category
                setSubcategoryId(undefined);
                newSearchParams.delete('subcategoryId');
                // Clear ribbon when selecting category
                setRibbon(undefined);
                setUserExplicitlySelectedAll(false);
                newSearchParams.delete('ribbon');
              }
              
              if ('subcategoryId' in n) {
                setSubcategoryId(n.subcategoryId || undefined);
                if (n.subcategoryId) {
                  newSearchParams.set('subcategoryId', n.subcategoryId);
                } else {
                  newSearchParams.delete('subcategoryId');
                }
              }
              
              if (n.query !== undefined) {
                setQuery(n.query);
                setSelectedTag(undefined); // typing a query clears tag filter
                if (n.query) {
                  newSearchParams.set('q', n.query);
                } else {
                  newSearchParams.delete('q');
                }
                // Clear ribbon when searching
                setRibbon(undefined);
                setUserExplicitlySelectedAll(false);
                newSearchParams.delete('ribbon');
              }
              
              if (n.includePro !== undefined) setIncludePro(!!n.includePro);
              
              if ('ribbon' in n) {
                setRibbon(n.ribbon || undefined);
                // Track when user explicitly selects "All"
                if (!n.ribbon) {
                  setUserExplicitlySelectedAll(true);
                } else {
                  setUserExplicitlySelectedAll(false);
                }
                // Update URL to reflect ribbon change
                if (n.ribbon) {
                  newSearchParams.set('ribbon', n.ribbon);
                } else {
                  newSearchParams.delete('ribbon');
                }
              }
              
              setSearchParams(newSearchParams, { replace: true });
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
              setUserExplicitlySelectedAll(true); // User explicitly wants to see all prompts
              // Clear ribbon completely - don't auto-set to RECOMMENDED
              setRibbon(undefined);
              // Clear all URL search params
              const newSearchParams = new URLSearchParams();
              setSearchParams(newSearchParams, { replace: true });
            }}
          />
        </section>

        {/* Personalized Recommendations - show when no active filters */}
        {hasPersonalization && personalizedPrompts.length > 0 && !categoryId && !subcategoryId && !query && !selectedTag && !ribbon && (
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
            {ribbon === "RECOMMENDED" && hasPersonalization && personalizedPrompts.length > 0 ? (
              // Show personalized prompts when "Recommended" is selected
              personalizedPrompts.map((p) => (
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
              ))
            ) : (
              // Show regular database prompts for all other cases
              items.map((p) => (
                <PromptCard
                  key={p.id}
                  prompt={p as any}
                  categories={categories}
                  onTagClick={(t) => { clearRandom();
                    setSelectedTag(t);
                    setQuery(t); // reflect in input
                    setCategoryId(undefined);
                    setSubcategoryId(undefined);
                    setRibbon(undefined); // Clear ribbon filter when clicking tags
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
              ))
            )}
          </div>
        </section>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <Button variant="secondary" onClick={loadMore} disabled={loading}>
              {loading ? "Loading..." : "Load more"}
            </Button>
          </div>
        )}

        {/* Submit a Prompt Section */}
        <section className="mt-16 pt-12 border-t border-border">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Submit Your Best Prompt
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Share your most effective prompts with the community and help others work smarter.
            </p>
            
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-primary text-lg mb-2">🎉 Win 1 Month Free Premium Membership!</h3>
              <p className="text-muted-foreground">
                Successfully submitted prompts that get added to our library earn you a <strong>free month of premium membership</strong> as our thank you for contributing to the community!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="cta" size="lg">
                <Link to="/submit-prompt">Submit a Prompt</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4 italic">
              PromptAndGo reserves the right to edit and revise submitted prompts. 
              We'll reach out if your prompt is selected for the library.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default PromptLibrary;
