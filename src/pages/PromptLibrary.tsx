import SEO from "@/components/SEO";
import { PromptFilters } from "@/components/prompt/PromptFilters";
import { PromptCard } from "@/components/prompt/PromptCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";
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

const PromptLibrary = () => {
  const { user } = useSupabaseAuth();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [subcategoryId, setSubcategoryId] = useState<string | undefined>();
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<PromptUI[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  // Prompt of the Day state
  const [featured, setFeatured] = useState<PromptUI | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(false);

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
            "id, category_id, subcategory_id, title, what_for, prompt, image_prompt, excerpt",
            { count: "exact" }
          )
          .order("created_at", { ascending: false });

        if (categoryId) q = q.eq("category_id", categoryId);
        if (subcategoryId) q = q.eq("subcategory_id", subcategoryId);
        if (query.trim()) q = q.textSearch("search_vector", query.trim(), { type: "websearch" });
        if (promptIdsForTag) q = q.in("id", promptIdsForTag);

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
    [categoryId, subcategoryId, query, selectedTag]
  );

  // Daily deterministic featured prompt
  const fetchPromptOfTheDay = useCallback(async () => {
    setFeaturedLoading(true);
    try {
      // Count total prompts
      const countRes = await supabase
        .from("prompts")
        .select("id", { count: "exact", head: true });
      if (countRes.error) throw countRes.error;
      const total = countRes.count || 0;
      if (total === 0) {
        setFeatured(null);
        return;
      }

      // Deterministic index based on UTC date
      const dayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      let hash = 0;
      for (let i = 0; i < dayKey.length; i++) {
        hash = (hash << 5) - hash + dayKey.charCodeAt(i);
        hash |= 0;
      }
      const idx = Math.abs(hash) % total;

      // Fetch single row at computed offset
      const { data: one, error: oneErr } = await supabase
        .from("prompts")
        .select(
          "id, category_id, subcategory_id, title, what_for, prompt, image_prompt, excerpt"
        )
        .order("created_at", { ascending: false })
        .range(idx, idx);
      if (oneErr) throw oneErr;
      const row = one?.[0];
      if (!row) {
        setFeatured(null);
        return;
      }

      // Fetch tags for this prompt
      const tagsJoin = await supabase
        .from("prompt_tags")
        .select("prompt_id, tags:tag_id(name)")
        .eq("prompt_id", row.id);

      const tags: string[] = [];
      if (!tagsJoin.error) {
        (tagsJoin.data || []).forEach((r: any) => {
          const name = (r.tags?.name as string) || undefined;
          if (name) tags.push(name);
        });
      }

      const mapped: PromptUI = {
        id: row.id,
        categoryId: row.category_id,
        subcategoryId: row.subcategory_id,
        title: row.title,
        whatFor: row.what_for,
        prompt: row.prompt,
        imagePrompt: row.image_prompt,
        excerpt: row.excerpt,
        tags,
      };
      setFeatured(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setFeaturedLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setPage(1);
    const res = await fetchPromptsPage(1);
    const data = res.data || [];
    setItems(dedupeByTitle(data));
    setHasMore(!!res.hasMore);
  }, [fetchPromptsPage]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    const next = page + 1;
    const res = await fetchPromptsPage(next);
    const data = res.data || [];
    setItems((prev) => dedupeByTitle([...prev, ...data]));
    setHasMore(!!res.hasMore);
    setPage(next);
  }, [page, hasMore, loading, fetchPromptsPage]);

  // Always land at top when visiting Library
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Initial loads
  useEffect(() => {
    loadCategories();
    fetchPromptOfTheDay();
  }, [loadCategories, fetchPromptOfTheDay]);

  // Refresh when filters change
  useEffect(() => {
    refresh();
  }, [categoryId, subcategoryId, query, selectedTag, refresh]);

  return (
    <>
      <PageHero
        title={
          <>
            <span className="text-gradient-brand">Prompt</span> Library
          </>
        }
        subtitle={<>Find the perfect prompt fast: browse by category or subcategory, then save your favourites for free to use later.</>}
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

        <section aria-labelledby="potd-heading" className="mb-8">
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="potd-heading" className="text-xl md:text-2xl font-semibold">Prompt of the Day</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              {featuredLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : featured ? (
                <PromptCard
                  prompt={featured as any}
                  categories={categories}
                  onTagClick={(t) => {
                    setSelectedTag(t);
                    setQuery(t);
                    setCategoryId(undefined);
                    setSubcategoryId(undefined);
                  }}
                />
              ) : null}
            </div>
          </div>
        </section>

        <section id="library-filters" className="scroll-mt-28 md:scroll-mt-28">
          <PromptFilters
            categories={categories}
            categoryId={categoryId}
            subcategoryId={subcategoryId}
            query={query}
            onChange={(n) => {
              if (n.categoryId !== undefined) setCategoryId(n.categoryId || undefined);
              if (n.subcategoryId !== undefined) setSubcategoryId(n.subcategoryId || undefined);
              if (n.query !== undefined) {
                setQuery(n.query);
                setSelectedTag(undefined); // typing a query clears tag filter
              }
            }}
            onSearch={refresh}
            onClear={() => {
              setCategoryId(undefined);
              setSubcategoryId(undefined);
              setQuery("");
              setSelectedTag(undefined);
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
