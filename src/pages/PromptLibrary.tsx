import SEO from "@/components/SEO";
import { PromptFilters } from "@/components/prompt/PromptFilters";
import { PromptCard } from "@/components/prompt/PromptCard";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import { Link, useSearchParams } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useState } from "react";
import type { Category as CategoryType } from "@/data/prompts";
import { toast } from "@/hooks/use-toast";

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
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [subcategoryId, setSubcategoryId] = useState<string | undefined>();
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [searchParams] = useSearchParams();
  const [randomMode, setRandomMode] = useState<boolean>(false);
  const [includePro, setIncludePro] = useState(true);
  const [proOnly, setProOnly] = useState(false);


  const [page, setPage] = useState(1);
  const [items, setItems] = useState<PromptUI[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);


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
            "id, category_id, subcategory_id, title, what_for, prompt, image_prompt, excerpt, is_pro",
            { count: "exact" }
          )
          .order("created_at", { ascending: false });

        if (categoryId) q = q.eq("category_id", categoryId);
        if (subcategoryId) q = q.eq("subcategory_id", subcategoryId);
        if (query.trim()) q = q.textSearch("search_vector", query.trim(), { type: "websearch" });
        if (promptIdsForTag) q = q.in("id", promptIdsForTag);
        if (proOnly) q = q.eq("is_pro", true);
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
    [categoryId, subcategoryId, query, selectedTag, includePro, proOnly]
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
      setItems([mapped]);
      setHasMore(false);
      setPage(1);
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
    setRandomMode(!!searchParams.get('random'));
    const cid = searchParams.get('categoryId') || undefined;
    const sid = searchParams.get('subcategoryId') || undefined;
    const po = searchParams.get('proOnly');
    if (cid !== undefined) setCategoryId(cid);
    if (sid !== undefined) setSubcategoryId(sid);
    setProOnly(po === '1' || po === 'true');
  }, [searchParams]);

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
  }, [categoryId, subcategoryId, query, selectedTag, randomMode, refresh, fetchRandomPrompt]);

  return (
    <>
      <PageHero
        title={
          <>
            <span className="text-gradient-brand">Prompt</span> Library
          </>
        }
        subtitle={<>Find the perfect prompt fast: browse free prompts by category or subcategory, save your favourites for later, add premium prompts to your cart to review later, or subscribe to PromptAndGo to immediately unlock all our paid prompts.</>}
      >
        <Button asChild size="lg" variant="hero" className="px-6">
          <a href="#library-filters">Browse Prompt Library</a>
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
          <Link to="/packs">Explore Premium Packs</Link>
        </Button>
      </PageHero>
      <main className="container py-10">
        <SEO
          title="Prompt Library – Ready-to-use AI Prompts"
          description="Browse prompts by category and subcategory with fast search. Copy-ready cards for marketing, productivity, and sales."
        />


        <section id="library-filters" className="scroll-mt-28 md:scroll-mt-28">
          <PromptFilters
            categories={categories}
            categoryId={categoryId}
            subcategoryId={subcategoryId}
            query={query}
            includePro={includePro}
            onChange={(n) => {
              if (n.categoryId !== undefined) setCategoryId(n.categoryId || undefined);
              if (n.subcategoryId !== undefined) setSubcategoryId(n.subcategoryId || undefined);
              if (n.query !== undefined) {
                setQuery(n.query);
                setSelectedTag(undefined); // typing a query clears tag filter
              }
              if (n.includePro !== undefined) setIncludePro(!!n.includePro);
            }}
            onSearch={refresh}
            onClear={() => {
              setCategoryId(undefined);
              setSubcategoryId(undefined);
              setQuery("");
              setSelectedTag(undefined);
              setProOnly(false);
              setPage(1);
              // No manual refresh here; useEffect will trigger once state updates propagate
            }}
          />
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {items.map((p) => (
            <PromptCard
              key={p.id}
              prompt={p as any}
              categories={categories}
              onTagClick={(t) => {
                setSelectedTag(t);
                setQuery(t); // reflect in input
                setCategoryId(undefined);
                setSubcategoryId(undefined);
              }}
              onCategoryClick={(cid) => {
                setCategoryId(cid);
                setSubcategoryId(undefined);
                setSelectedTag(undefined);
                setProOnly(false);
                setQuery("");
              }}
              onSubcategoryClick={(sid, cid) => {
                setCategoryId(cid);
                setSubcategoryId(sid);
                setSelectedTag(undefined);
                setProOnly(false);
                setQuery("");
              }}
            />
          ))}
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
