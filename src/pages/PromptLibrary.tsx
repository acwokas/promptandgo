import SEO from "@/components/SEO";
import { PromptFilters } from "@/components/prompt/PromptFilters";
import { PromptCard } from "@/components/prompt/PromptCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHero from "@/components/layout/PageHero";
import CountdownTimer from "@/components/conversion/CountdownTimer";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Heart, Bot, TrendingUp, Clock, Star, Users, Copy, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useState, useRef, Fragment } from "react";
import type { Category as CategoryType } from "@/data/prompts";
import { toast } from "@/hooks/use-toast";
import { usePersonalizedPrompts } from "@/hooks/usePersonalizedPrompts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PromptStudioCTA } from "@/components/ui/prompt-studio-cta";
import React from "react";

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

  // Reorder results: limit PRO prompts based on ribbon type
const reorderByLockedBuckets = (arr: PromptUI[], ribbon?: string) => {
  const PAGE_SIZE = 20;
  
  // Determine max PRO prompts per page based on ribbon
  let maxProPerPage = 2;
  if (ribbon === "MOST_COPIED") maxProPerPage = 3;
  
  // Sort by prompt length (longest first) within each group
  const pro = arr.filter((p) => !!p.isPro).sort((a, b) => b.prompt.length - a.prompt.length);
  const free = arr.filter((p) => !p.isPro).sort((a, b) => b.prompt.length - a.prompt.length);

  if (pro.length === 0) return free;
  if (free.length === 0) return pro;

  const result: PromptUI[] = [];
  let proIndex = 0;
  let freeIndex = 0;
  
  // Process in chunks of PAGE_SIZE
  const totalItems = arr.length;
  const pages = Math.ceil(totalItems / PAGE_SIZE);
  
  for (let page = 0; page < pages; page++) {
    const pageStart = page * PAGE_SIZE;
    const pageEnd = Math.min(pageStart + PAGE_SIZE, totalItems);
    const pageSize = pageEnd - pageStart;
    
    // Create page array with placeholders
    const pageItems: (PromptUI | null)[] = new Array(pageSize).fill(null);
    
    // Determine PRO positions based on maxProPerPage
    const proPositions = [];
    if (maxProPerPage >= 1 && pageSize > 1) proPositions.push(1); // 2nd position
    if (maxProPerPage >= 2 && pageSize > 5) proPositions.push(5); // 6th position
    if (maxProPerPage >= 3 && pageSize > 9) proPositions.push(9); // 10th position
    
    // Place PRO prompts in fixed positions
    for (const pos of proPositions) {
      if (proIndex < pro.length && pos < pageSize) {
        pageItems[pos] = pro[proIndex++];
      }
    }
    
    // Fill remaining positions with free prompts
    for (let i = 0; i < pageSize; i++) {
      if (pageItems[i] === null && freeIndex < free.length) {
        pageItems[i] = free[freeIndex++];
      }
    }
    
    // Add non-null items to result
    pageItems.forEach(item => {
      if (item) result.push(item);
    });
  }
  
  // If we still have unused prompts, add them at the end
  while (proIndex < pro.length) {
    result.push(pro[proIndex++]);
  }
  while (freeIndex < free.length) {
    result.push(free[freeIndex++]);
  }

  return result;
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
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();

  // Sort prompts by complexity (length) - longest first
  const sortByComplexity = (prompts: PromptUI[]) => {
    return [...prompts].sort((a, b) => b.prompt.length - a.prompt.length);
  };


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
        
        // Determine if we should apply mixed PRO/free logic
        const shouldApplyMixedLogic = ribbon !== "FREE_ONLY" && ribbon !== "PRO_ONLY" && !proOnly && !proSearch;
        
        let rows: any[] = [];
        let count = 0;
        let newHasMore = false;
        
        if (shouldApplyMixedLogic) {
          // For all cases except FREE_ONLY and PRO_ONLY, fetch PRO and free prompts separately to ensure proper mix
          const maxProPerPage = ribbon === "MOST_COPIED" ? 3 : 2;
          const proNeeded = Math.min(maxProPerPage, PAGE_SIZE);
          const freeNeeded = PAGE_SIZE - proNeeded;
          
          // Fetch PRO prompts
          let proQuery = supabase
            .from("prompts")
            .select(
              "id, category_id, subcategory_id, title, what_for, prompt, image_prompt, excerpt, is_pro, ribbon",
              { count: "exact" }
            )
            .eq("is_pro", true);

          // Apply all the same filters
          if (categoryId) proQuery = proQuery.eq("category_id", categoryId);
          if (subcategoryId) proQuery = proQuery.eq("subcategory_id", subcategoryId);
          if (!proSearch && rawQuery) proQuery = proQuery.textSearch("search_vector", rawQuery, { type: "websearch" });
          if (promptIdsForTag) proQuery = proQuery.in("id", promptIdsForTag);
          
          // Apply ribbon-specific filters
          if (ribbon === "NEW_PROMPTS") {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            proQuery = proQuery.gte("created_at", thirtyDaysAgo.toISOString());
          } else if (ribbon && ribbon !== "undefined" && !["RECOMMENDED", "MOST_POPULAR", "HIGHEST_RATED", "TRENDING", "MOST_COPIED"].includes(ribbon)) {
            // Filter by database ribbon if it's not one of our special filters
            proQuery = proQuery.eq("ribbon", ribbon);
          }
          
          // Apply ordering
          if (ribbon === "NEW_PROMPTS") {
            proQuery = proQuery.order("created_at", { ascending: false });
          } else if (ribbon === "MOST_POPULAR" || ribbon === "TRENDING") {
            proQuery = proQuery.order("created_at", { ascending: false });
          } else {
            proQuery = proQuery.order("created_at", { ascending: false });
          }
          
          proQuery = proQuery.limit(proNeeded * 3); // Fetch more to have options

          // Fetch FREE prompts
          let freeQuery = supabase
            .from("prompts")
            .select(
              "id, category_id, subcategory_id, title, what_for, prompt, image_prompt, excerpt, is_pro, ribbon"
            )
            .eq("is_pro", false);

          // Apply all the same filters
          if (categoryId) freeQuery = freeQuery.eq("category_id", categoryId);
          if (subcategoryId) freeQuery = freeQuery.eq("subcategory_id", subcategoryId);
          if (!proSearch && rawQuery) freeQuery = freeQuery.textSearch("search_vector", rawQuery, { type: "websearch" });
          if (promptIdsForTag) freeQuery = freeQuery.in("id", promptIdsForTag);
          
          // Apply ribbon-specific filters
          if (ribbon === "NEW_PROMPTS") {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            freeQuery = freeQuery.gte("created_at", thirtyDaysAgo.toISOString());
          } else if (ribbon && ribbon !== "undefined" && !["RECOMMENDED", "MOST_POPULAR", "HIGHEST_RATED", "TRENDING", "MOST_COPIED"].includes(ribbon)) {
            // Filter by database ribbon if it's not one of our special filters
            freeQuery = freeQuery.eq("ribbon", ribbon);
          }
          
          // Apply ordering
          if (ribbon === "NEW_PROMPTS") {
            freeQuery = freeQuery.order("created_at", { ascending: false });
          } else if (ribbon === "MOST_POPULAR" || ribbon === "TRENDING") {
            freeQuery = freeQuery.order("created_at", { ascending: false });
          } else {
            freeQuery = freeQuery.order("created_at", { ascending: false });
          }
          
          freeQuery = freeQuery.limit(freeNeeded * 2); // Fetch more to have options

          const [proResult, freeResult] = await Promise.all([proQuery, freeQuery]);
          
          if (proResult.error) throw proResult.error;
          if (freeResult.error) throw freeResult.error;

          // Combine results with proper proportions
          const proPrompts = (proResult.data || []).slice(0, proNeeded);
          const freePrompts = (freeResult.data || []).slice(0, freeNeeded);
          
          // If we don't have enough free prompts, fill with more PRO prompts
          const availableProPrompts = (proResult.data || []);
          let finalRows = [...proPrompts, ...freePrompts];
          
          // If we have fewer than PAGE_SIZE items and there are more PRO prompts available, add them
          if (finalRows.length < PAGE_SIZE && availableProPrompts.length > proPrompts.length) {
            const additionalProNeeded = PAGE_SIZE - finalRows.length;
            const additionalProPrompts = availableProPrompts.slice(proPrompts.length, proPrompts.length + additionalProNeeded);
            finalRows = [...finalRows, ...additionalProPrompts];
          }
          
          rows = finalRows;
          count = (proResult.count || 0) + (freeResult.count || 0);
          
          // Estimate pagination based on combined count
          newHasMore = pageNumber * PAGE_SIZE < count;
          
        } else {
          // Regular query for FREE_ONLY, PRO_ONLY, or when explicitly searching for PRO
          if (ribbon === "FREE_ONLY") {
            q = q.eq("is_pro", false);
          } else if (ribbon === "PRO_ONLY") {
            q = q.eq("is_pro", true);
          } else if (ribbon && ribbon !== "undefined" && !["RECOMMENDED", "MOST_POPULAR", "HIGHEST_RATED", "TRENDING", "MOST_COPIED", "NEW_PROMPTS"].includes(ribbon)) {
            // Only filter by database ribbon if it's not one of our special filters
            q = q.eq("ribbon", ribbon);
          }
          
          // Handle standard pro/free filtering
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
        } else if (ribbon === "MOST_COPIED") {
          // Simulate "most copied" by favoring prompts with popular keywords and types
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
          ? Math.ceil(total * 0.4) // Simulate that these filters show ~40% of total
          : total;
        
        // Only calculate newHasMore if it wasn't already set for mixed logic cases
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
  }, [toast]);


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
    console.log("Personalization effect running:", { 
      hasRibbonParam: !!searchParams.get('ribbon'), 
      hasPersonalization, 
      personalizedCount: personalizedPrompts.length, 
      currentRibbon: ribbon, 
      categoryId, 
      subcategoryId, 
      query, 
      userExplicitlySelectedAll 
    });
    if (!searchParams.get('ribbon') && hasPersonalization && personalizedPrompts.length > 0 && !ribbon && !categoryId && !subcategoryId && !query && !userExplicitlySelectedAll) {
      console.log("Setting ribbon to RECOMMENDED");
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

  // Auto-scroll to search results when query or filters change
  useEffect(() => {
    if (loading || randomMode) return;
    if (query || categoryId || subcategoryId || selectedTag || ribbon) {
      // Small delay to ensure the UI has updated
      const timeoutId = setTimeout(() => {
        if (listRef.current) {
          const header = document.querySelector('header');
          const headerHeight = header ? (header as HTMLElement).getBoundingClientRect().height : 0;
          const filtersEl = document.getElementById('library-filters');
          const filtersHeight = filtersEl ? (filtersEl as HTMLElement).getBoundingClientRect().height : 0;
          const extra = 16; // breathing room
          const y = listRef.current.getBoundingClientRect().top + window.scrollY - headerHeight - filtersHeight - extra;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [query, categoryId, subcategoryId, selectedTag, ribbon, loading, randomMode]);

  // Scroll to first prompt when in random mode after items load
  useEffect(() => {
    if (!randomMode) return;
    if (loading) return;
    if (items.length > 0 && listRef.current) {
      const header = document.querySelector('header');
      const headerHeight = header ? (header as HTMLElement).getBoundingClientRect().height : 0;
      const filtersEl = document.getElementById('library-filters');
      const filtersHeight = filtersEl ? (filtersEl as HTMLElement).getBoundingClientRect().height : 0;
      const extra = 8;
      const y = listRef.current.getBoundingClientRect().top + window.scrollY - headerHeight - filtersHeight - extra;
      window.scrollTo({ top: y, behavior: 'auto' });
    }
  }, [items, loading, randomMode]);

  // Enhanced structured data for prompt library
  const libraryStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Prompts Library",
    description: "Discover thousands of ready-to-use AI prompts for ChatGPT, Claude, and more. Copy prompts instantly and get better results from your AI tools.",
    numberOfItems: items.length,
    about: {
      "@type": "Thing",
      name: "AI Prompts",
      description: "Curated collection of AI prompts for various use cases"
    },
    provider: {
      "@type": "Organization",
      name: "PromptandGo.ai"
    }
  };

  return (
    <>
      <CountdownTimer variant="banner" />
      <SEO 
        title="Browse AI Prompts Library" 
        description="Discover thousands of ready-to-use AI prompts for ChatGPT, Claude, and more. Copy prompts instantly and get better results from your AI tools."
        structuredData={libraryStructuredData}
      />
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
        {user ? (
          <Button asChild size="lg" variant="secondary">
            <Link to="/account/favorites"><Heart className="h-4 w-4 mr-2" />My Prompts</Link>
          </Button>
        ) : (
          <Button asChild size="lg" variant="outline">
            <Link to="/auth">Login</Link>
          </Button>
        )}
      </PageHero>
      <main className="container py-10">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Browse Library</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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


        {/* Compact Browse & Search Section */}
        <section className="mb-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Browse by Category - Compact */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-3">Popular Categories</h2>
              <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
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
                  <CardContent className="p-4 text-center">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">Marketing</h3>
                    <p className="text-xs text-muted-foreground">850+</p>
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
                  <CardContent className="p-4 text-center">
                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">Career</h3>
                    <p className="text-xs text-muted-foreground">420+</p>
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
                  <CardContent className="p-4 text-center">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Copy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">Content</h3>
                    <p className="text-xs text-muted-foreground">380+</p>
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
                  <CardContent className="p-4 text-center">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">Productivity</h3>
                    <p className="text-xs text-muted-foreground">290+</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Popular Searches - Compact */}
            <div>
              <h3 className="text-lg font-semibold mb-3">🔍 Popular Searches</h3>
              <p className="text-sm text-muted-foreground mb-4">Quick access to trending searches</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "email marketing", "resume writing", "social media", "interview prep", 
                  "content calendar", "crisis response", "LinkedIn strategy", "data analysis"
                ].map((searchTerm) => (
                  <Button
                    key={searchTerm}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
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
            </div>
          </div>
        </section>

        <section id="library-filters" className="scroll-mt-36 md:scroll-mt-40 sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 py-4 -mx-4 px-4 shadow-sm mb-6">
          {isMobile && (
            <div className="mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search & Filters
                </span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          )}
          
          <div className={isMobile ? (showFilters ? "block" : "hidden") : "block"}>
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
          </div>
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
              {sortByComplexity(personalizedPrompts).map((p) => (
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

        <section className="mt-0 pt-6">
          {(() => {
            // Helper function to get title and description based on ribbon
            const getTitleAndDescription = () => {
              switch (ribbon) {
                case "RECOMMENDED":
                  return {
                    title: "🎯 Recommended for You",
                    description: "Based on your preferences and goals"
                  };
                case "MOST_POPULAR":
                  return {
                    title: "🔥 Most Popular",
                    description: "Top prompts loved by our community"
                  };
                case "NEW_PROMPTS":
                  return {
                    title: "✨ New Prompts",
                    description: "Fresh additions to our library"
                  };
                case "TRENDING":
                  return {
                    title: "📈 Trending",
                    description: "Gaining popularity right now"
                  };
                case "HIGHEST_RATED":
                  return {
                    title: "⭐ Highest Rated",
                    description: "Top-rated prompts by users"
                  };
                case "MOST_COPIED":
                  return {
                    title: "📋 Most Copied",
                    description: "Frequently used prompts"
                  };
                default:
                  if (hasPersonalization && personalizedPrompts.length > 0) {
                    return {
                      title: "All Prompts",
                      description: "Browse our complete collection"
                    };
                  }
                  return {
                    title: "Browse All Prompts",
                    description: "Discover our complete collection of AI prompts"
                  };
              }
            };

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
              // Show personalized prompts when "Recommended" is selected - sorted by complexity
              sortByComplexity(personalizedPrompts).map((p) => (
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
                </div>
              ))
            ) : (
              // Show regular database prompts for all other cases
              items.map((p, index) => (
                <React.Fragment key={p.id}>
                  <PromptCard
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
                  
                  {/* Add Prompt Studio CTA every 6 prompts */}
                  {(index + 1) % 6 === 0 && index < items.length - 1 && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <PromptStudioCTA variant="inline" />
                    </div>
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </section>

        {hasMore && (
          <div className="flex justify-center mt-8 mb-4">
            <Button 
              variant="secondary" 
              onClick={loadMore} 
              disabled={loading}
              className="sticky bottom-4 z-30 shadow-lg border-2 border-background bg-background/95 backdrop-blur-sm"
            >
              {loading ? "Loading..." : "Load more"}
            </Button>
          </div>
        )}

        {/* Quick Discovery Sections */}
        <section className="mt-16 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Discover What's Popular
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore trending prompts, fresh additions, and community favorites to find exactly what you need.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
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

            <Card className="bg-gradient-to-br from-green-50 to-transparent border-green-200 dark:from-green-950 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
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


        {/* Submit Prompt Section */}
        <section className="mt-16 pt-12 border-t border-border">
          <div className="max-w-4xl mx-auto">
            {/* Submit a Prompt Column */}
            <div>
              <div className="text-center max-w-2xl mx-auto">
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
                  PromptandGo reserves the right to edit and revise submitted prompts. 
                  We'll reach out if your prompt is selected for the library.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
};

export default PromptLibrary;
