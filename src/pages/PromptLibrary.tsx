import SEO from "@/components/SEO";
import { PromptFilters } from "@/components/prompt/PromptFilters";
import { PromptCard } from "@/components/prompt/PromptCard";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
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
const normalizeTitle = (t?: string | null) => (t || "").trim().toLowerCase();
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
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [subcategoryId, setSubcategoryId] = useState<string | undefined>();
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

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

  // Initial loads
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

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
        subtitle={<>Search and filter prompts across all categories and subcategories.</>}
      />
      <main className="container py-10">
        <SEO
          title="Prompt Library – Ready-to-use AI Prompts"
          description="Browse prompts by category and subcategory with fast search. Copy-ready cards for marketing, productivity, and sales."
        />

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
            refresh();
          }}
        />

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
