import { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { usePersonalizedPrompts } from "@/hooks/usePersonalizedPrompts";
import type { Category as CategoryType } from "@/data/prompts";

const PAGE_SIZE = 6;

export interface PromptUI {
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

// Deduplicate prompts by normalized title
const normalizeTitle = (t?: string | null) => {
  let s = (t || "").toLowerCase().trim();
  s = s.replace(/\s*\((?:variant|variants?|alt|alternate|alternat(?:e|ive)|v\d+|ver(?:sion)?\s*\d+|rev(?:ision)?\s*[a-z0-9]+)\)\s*$/g, "");
  s = s.replace(/\s*[-–—|]\s*(?:variant|alt|alternate|v\d+|ver(?:sion)?\s*\d+|rev(?:ision)?\s*[a-z0-9]+)\s*$/g, "");
  s = s.replace(/\s+(?:v|ver(?:sion)?)\s*\d+\s*$/g, "");
  s = s.replace(/\s*#\d+\s*$/g, "");
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

// Reorder results: limit PRO prompts based on ribbon type
const reorderByLockedBuckets = (arr: PromptUI[], ribbon?: string) => {
  const PAGE_SIZE = 20;
  let maxProPerPage = 2;
  if (ribbon === "MOST_COPIED") maxProPerPage = 3;
  
  const pro = arr.filter((p) => !!p.isPro).sort((a, b) => b.prompt.length - a.prompt.length);
  const free = arr.filter((p) => !p.isPro).sort((a, b) => b.prompt.length - a.prompt.length);

  if (pro.length === 0) return free;
  if (free.length === 0) return pro;

  const result: PromptUI[] = [];
  let proIndex = 0;
  let freeIndex = 0;
  
  const totalItems = arr.length;
  const pages = Math.ceil(totalItems / PAGE_SIZE);
  
  for (let page = 0; page < pages; page++) {
    const pageStart = page * PAGE_SIZE;
    const pageEnd = Math.min(pageStart + PAGE_SIZE, totalItems);
    const pageSize = pageEnd - pageStart;
    
    const pageItems: (PromptUI | null)[] = new Array(pageSize).fill(null);
    
    const proPositions = [];
    if (maxProPerPage >= 1 && pageSize > 1) proPositions.push(1);
    if (maxProPerPage >= 2 && pageSize > 5) proPositions.push(5);
    if (maxProPerPage >= 3 && pageSize > 9) proPositions.push(9);
    
    for (const pos of proPositions) {
      if (proIndex < pro.length && pos < pageSize) {
        pageItems[pos] = pro[proIndex++];
      }
    }
    
    for (let i = 0; i < pageSize; i++) {
      if (pageItems[i] === null && freeIndex < free.length) {
        pageItems[i] = free[freeIndex++];
      }
    }
    
    pageItems.forEach(item => {
      if (item) result.push(item);
    });
  }
  
  while (proIndex < pro.length) {
    result.push(pro[proIndex++]);
  }
  while (freeIndex < free.length) {
    result.push(free[freeIndex++]);
  }

  return result;
};

export const sortByComplexity = (prompts: PromptUI[]) => {
  return [...prompts].sort((a, b) => b.prompt.length - a.prompt.length);
};

export function usePromptLibrary() {
  const { user } = useSupabaseAuth();
  const { personalizedPrompts, hasPersonalization, loading: personalizationLoading } = usePersonalizedPrompts();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [subcategoryId, setSubcategoryId] = useState<string | undefined>();
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [randomMode, setRandomMode] = useState<boolean>(false);
  const [includePro, setIncludePro] = useState(true);
  const [proOnly, setProOnly] = useState(false);
  const [ribbon, setRibbon] = useState<string | undefined>();
  const [userExplicitlySelectedAll, setUserExplicitlySelectedAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [defaultAIProvider, setDefaultAIProvider] = useState<string | undefined>();

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<PromptUI[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const isRandomActiveRef = useRef<boolean>(false);
  
  const clearRandom = useCallback(() => {
    if (randomMode || searchParams.get('random')) {
      setRandomMode(false);
      isRandomActiveRef.current = false;
      const next = new URLSearchParams(searchParams);
      if (next.has('random')) {
        next.delete('random');
        setSearchParams(next, { replace: true });
      }
    }
  }, [randomMode, searchParams, setSearchParams]);

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

  const fetchPromptsPage = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      try {
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

        if (ribbon === "NEW_PROMPTS") {
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
        
        const shouldApplyMixedLogic = ribbon !== "FREE_ONLY" && ribbon !== "PRO_ONLY" && !proOnly && !proSearch;
        
        let rows: any[] = [];
        let count = 0;
        let newHasMore = false;
        
        if (shouldApplyMixedLogic) {
          const maxProPerPage = ribbon === "MOST_COPIED" ? 3 : 2;
          const proNeeded = Math.min(maxProPerPage, PAGE_SIZE);
          const freeNeeded = PAGE_SIZE - proNeeded;
          
          let proQuery = supabase
            .from("prompts")
            .select(
              "id, category_id, subcategory_id, title, what_for, prompt, image_prompt, excerpt, is_pro, ribbon",
              { count: "exact" }
            )
            .eq("is_pro", true);

          if (categoryId) proQuery = proQuery.eq("category_id", categoryId);
          if (subcategoryId) proQuery = proQuery.eq("subcategory_id", subcategoryId);
          if (!proSearch && rawQuery) proQuery = proQuery.textSearch("search_vector", rawQuery, { type: "websearch" });
          if (promptIdsForTag) proQuery = proQuery.in("id", promptIdsForTag);
          
          if (ribbon === "NEW_PROMPTS") {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            proQuery = proQuery.gte("created_at", thirtyDaysAgo.toISOString());
          }
          
          proQuery = proQuery.order("created_at", { ascending: false }).limit(proNeeded * 3);

          let freeQuery = supabase
            .from("prompts")
            .select(
              "id, category_id, subcategory_id, title, what_for, prompt, image_prompt, excerpt, is_pro, ribbon"
            )
            .eq("is_pro", false);

          if (categoryId) freeQuery = freeQuery.eq("category_id", categoryId);
          if (subcategoryId) freeQuery = freeQuery.eq("subcategory_id", subcategoryId);
          if (!proSearch && rawQuery) freeQuery = freeQuery.textSearch("search_vector", rawQuery, { type: "websearch" });
          if (promptIdsForTag) freeQuery = freeQuery.in("id", promptIdsForTag);
          
          if (ribbon === "NEW_PROMPTS") {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            freeQuery = freeQuery.gte("created_at", thirtyDaysAgo.toISOString());
          }
          
          freeQuery = freeQuery.order("created_at", { ascending: false }).limit(freeNeeded * 2);

          const [proResult, freeResult] = await Promise.all([proQuery, freeQuery]);
          
          if (proResult.error) throw proResult.error;
          if (freeResult.error) throw freeResult.error;

          const proPrompts = (proResult.data || []).slice(0, proNeeded);
          const freePrompts = (freeResult.data || []).slice(0, freeNeeded);
          
          const availableProPrompts = (proResult.data || []);
          let finalRows = [...proPrompts, ...freePrompts];
          
          if (finalRows.length < PAGE_SIZE && availableProPrompts.length > proPrompts.length) {
            const additionalProNeeded = PAGE_SIZE - finalRows.length;
            const additionalProPrompts = availableProPrompts.slice(proPrompts.length, proPrompts.length + additionalProNeeded);
            finalRows = [...finalRows, ...additionalProPrompts];
          }
          
          rows = finalRows;
          count = (proResult.count || 0) + (freeResult.count || 0);
          newHasMore = pageNumber * PAGE_SIZE < count;
          
        } else {
          if (ribbon === "FREE_ONLY") {
            q = q.eq("is_pro", false);
          } else if (ribbon === "PRO_ONLY") {
            q = q.eq("is_pro", true);
          }
          
          if (proOnly || proSearch) q = q.eq("is_pro", true);
          else if (!includePro && !ribbon?.includes("PRO")) q = q.eq("is_pro", false);

          q = q.range(from, to);

          const { data, error, count: queryCount } = await q;
          if (error) throw error;
          
          rows = data || [];
          count = queryCount || 0;
          newHasMore = (to + 1) < count && rows.length === PAGE_SIZE;
        }

        const promptIds = rows.map((r) => r.id as string);

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

        let filteredMapped = mapped;
        if (ribbon === "HIGHEST_RATED") {
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
        } else if (ribbon === "MOST_COPIED") {
          filteredMapped = mapped.filter(p => {
            const text = (p.title + " " + (p.whatFor || "") + " " + p.prompt).toLowerCase();
            return text.includes("email") || text.includes("marketing") || text.includes("content") || 
                   text.includes("social") || text.includes("linkedin") || text.includes("resume") ||
                   text.includes("template") || text.includes("copy") || text.includes("sales") ||
                   text.includes("business") || text.includes("campaign") || text.includes("strategy");
          });
        }

        const total = count || 0;
        const adjustedTotal = ribbon === "HIGHEST_RATED" || ribbon === "MOST_COPIED" 
          ? Math.ceil(total * 0.4)
          : total;
        
        if (!shouldApplyMixedLogic) {
          newHasMore = (to + 1) < adjustedTotal && filteredMapped.length === PAGE_SIZE;
        }
        
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
  }, []);

  const refresh = useCallback(async () => {
    setPage(1);
    const res = await fetchPromptsPage(1);
    const data = res.data || [];
    const transform = (arr: PromptUI[]) => (ribbon === "PRO_ONLY" ? arr : reorderByLockedBuckets(dedupeByTitle(arr), ribbon));
    setItems(transform(data));
    setHasMore(!!res.hasMore);
  }, [fetchPromptsPage, ribbon]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    const next = page + 1;
    const res = await fetchPromptsPage(next);
    const data = res.data || [];
    const transform = (arr: PromptUI[]) => (ribbon === "PRO_ONLY" ? arr : reorderByLockedBuckets(dedupeByTitle(arr), ribbon));
    setItems((prev) => transform([...(prev || []), ...data]));
    setHasMore(!!res.hasMore);
    setPage(next);
  }, [page, hasMore, loading, fetchPromptsPage, ribbon]);

  // URL sync effects
  useEffect(() => {
    const isRandom = !!searchParams.get('random');
    setRandomMode(isRandom);
    isRandomActiveRef.current = isRandom;
    const cid = searchParams.get('categoryId') || undefined;
    const sid = searchParams.get('subcategoryId') || undefined;
    const po = searchParams.get('proOnly');
    const q = searchParams.get('q') || undefined;
    const ribbonFromUrl = searchParams.get('ribbon') || undefined;
    const aiProvider = searchParams.get('aiProvider') || undefined;
    if (cid !== undefined) setCategoryId(cid);
    if (sid !== undefined) setSubcategoryId(sid);
    setProOnly(po === '1' || po === 'true');
    if (q !== undefined) setQuery(q);
    if (ribbonFromUrl !== undefined) setRibbon(ribbonFromUrl);
    if (aiProvider !== undefined) setDefaultAIProvider(aiProvider);
  }, [searchParams]);

  // Set ribbon to "RECOMMENDED" when personalized prompts are available
  useEffect(() => {
    if (!searchParams.get('ribbon') && hasPersonalization && personalizedPrompts.length > 0 && !ribbon && !categoryId && !subcategoryId && !query && !userExplicitlySelectedAll) {
      setRibbon("RECOMMENDED");
    }
  }, [hasPersonalization, personalizedPrompts, ribbon, categoryId, subcategoryId, query, searchParams, userExplicitlySelectedAll]);

  // Initial category load
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Refresh when filters change
  useEffect(() => {
    if (randomMode) {
      fetchRandomPrompt();
    } else {
      refresh();
    }
  }, [categoryId, subcategoryId, query, selectedTag, ribbon, randomMode, refresh, fetchRandomPrompt]);

  return {
    // State
    user,
    categories,
    categoryId,
    setCategoryId,
    subcategoryId,
    setSubcategoryId,
    query,
    setQuery,
    selectedTag,
    setSelectedTag,
    searchParams,
    setSearchParams,
    location,
    randomMode,
    setRandomMode,
    includePro,
    setIncludePro,
    proOnly,
    setProOnly,
    ribbon,
    setRibbon,
    userExplicitlySelectedAll,
    setUserExplicitlySelectedAll,
    showFilters,
    setShowFilters,
    defaultAIProvider,
    page,
    setPage,
    items,
    hasMore,
    loading,
    listRef,
    
    // Personalization
    personalizedPrompts,
    hasPersonalization,
    personalizationLoading,
    
    // Actions
    clearRandom,
    refresh,
    loadMore,
  };
}
