import { useCallback, useEffect, useMemo, useState } from "react";
import { PromptCard } from "@/components/prompt/PromptCard";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import type { Category as CategoryType } from "@/data/prompts";
import { useNavigate } from "react-router-dom";

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

const normalizeTitle = (t?: string | null) => {
  let s = (t || "").toLowerCase().trim();
  s = s.replace(/\s*\((?:variant|variants?|alt|alternate|alternat(?:e|ive)|v\d+|ver(?:sion)?\s*\d+|rev(?:ision)?\s*[a-z0-9]+)\)\s*$/g, "");
  s = s.replace(/\s*[-–—|]\s*(?:variant|alt|alternate|v\d+|ver(?:sion)?\s*\d+|rev(?:ision)?\s*[a-z0-9]+)\s*$/g, "");
  s = s.replace(/\s+(?:v|ver(?:sion)?)\s*\d+\s*$/g, "");
  s = s.replace(/\s*#\d+\s*$/g, "");
  s = s.replace(/\s+/g, " ").trim();
  return s;
};

const PromptsOfTheDay = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [featured, setFeatured] = useState<PromptUI[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadCategories = useCallback(async () => {
    const [catRes, subRes] = await Promise.all([
      supabase.from("categories").select("id,name,slug").order("name"),
      supabase.from("subcategories").select("id,name,slug,category_id").order("name"),
    ]);

    if (catRes.error || subRes.error) return;

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

  const fetchTwoFeatured = useCallback(async () => {
    setLoading(true);
    try {
      const catIds = categories.map((c) => c.id);
      if (catIds.length === 0) {
        setFeatured([]);
        return;
      }

      const dayKey = new Date().toISOString().slice(0, 10);
      const hashStr = (s: string) => {
        let h = 0;
        for (let i = 0; i < s.length; i++) {
          h = (h << 5) - h + s.charCodeAt(i);
          h |= 0;
        }
        return Math.abs(h);
      };

      const pool = [...catIds];
      const firstIdx = hashStr(dayKey + "-a") % pool.length;
      const firstCat = pool.splice(firstIdx, 1)[0];
      const secondIdx = pool.length > 0 ? hashStr(dayKey + "-b") % pool.length : -1;
      const secondCat = secondIdx >= 0 ? pool[secondIdx] : undefined;

      const fetchOneForCategory = async (catId: string, salt: string) => {
        const countRes = await supabase
          .from("prompts")
          .select("id", { count: "exact", head: true })
          .eq("category_id", catId);
        if (countRes.error) return null;
        const total = countRes.count || 0;
        if (total === 0) return null;

        const idx = hashStr(dayKey + salt + catId) % total;
        const { data, error } = await supabase
          .from("prompts")
          .select("id, category_id, subcategory_id, title, what_for, prompt, image_prompt, excerpt")
          .eq("category_id", catId)
          .order("created_at", { ascending: false })
          .range(idx, idx);

        if (error) return null;
        const row = data?.[0];
        if (!row) return null;

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

        return {
          id: row.id,
          categoryId: row.category_id,
          subcategoryId: row.subcategory_id,
          title: row.title,
          whatFor: row.what_for,
          prompt: row.prompt,
          imagePrompt: row.image_prompt,
          excerpt: row.excerpt,
          tags,
        } as PromptUI;
      };

      const results: PromptUI[] = [];
      if (firstCat) {
        const a = await fetchOneForCategory(firstCat, "-a");
        if (a) results.push(a);
      }

      const titleSeen = new Set(results.map((r) => normalizeTitle(r.title)));

      if (secondCat) {
        const b = await fetchOneForCategory(secondCat, "-b");
        if (
          b && !results.some((r) => r.categoryId === b.categoryId) && !titleSeen.has(normalizeTitle(b.title))
        ) {
          results.push(b);
          titleSeen.add(normalizeTitle(b.title));
        } else if (pool.length > 0) {
          const seed = hashStr(dayKey + "-c");
          for (let i = 0; i < pool.length && results.length < 2; i++) {
            const fallbackCat = pool[(i + seed) % pool.length];
            const alt = await fetchOneForCategory(fallbackCat, `-c${i}`);
            if (
              alt && !results.some((r) => r.categoryId === alt.categoryId) &&
              !titleSeen.has(normalizeTitle(alt.title))
            ) {
              results.push(alt);
              titleSeen.add(normalizeTitle(alt.title));
            }
          }
        }
      }

      setFeatured(results);
    } finally {
      setLoading(false);
    }
  }, [categories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (categories.length > 0) fetchTwoFeatured();
  }, [categories, fetchTwoFeatured]);

  return (
    <section aria-labelledby="potd-heading" className="container mb-8">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="potd-heading" className="text-xl md:text-2xl font-semibold">Prompts of the Day:</h2>
        </div>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : featured.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p as any}
                categories={categories}
                onCategoryClick={(cid) => navigate(`/library?categoryId=${cid}`)}
                onSubcategoryClick={(sid, cid) => navigate(`/library?categoryId=${cid}&subcategoryId=${sid}`)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default PromptsOfTheDay;
