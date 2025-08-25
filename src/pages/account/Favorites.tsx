import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PromptCard } from "@/components/prompt/PromptCard";
import { PromptFilters } from "@/components/prompt/PromptFilters";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useEffect, useState, useCallback } from "react";
import type { Category as CategoryType } from "@/data/prompts";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Heart, Bot, Trash2, Search, Zap, Copy, Plus, Sparkles, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
  is_pro?: boolean;
}

interface UserGeneratedPrompt {
  id: string;
  title: string;
  prompt: string;
  description?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}


const PAGE_SIZE = 6;

// Deduplicate prompts by normalized title (strip common variant suffixes)
const normalizeTitle = (t?: string | null) => {
  let s = (t || "").toLowerCase().trim();

  // Remove trailing variant markers like (variant), (v2), - v2, #2, etc.
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

const FavoritesPage = () => {
  const { user, loading } = useSupabaseAuth();

  // Favorites scope
  const [favIds, setFavIds] = useState<string[]>([]);
  
  // AI-generated prompts state
  const [userGeneratedPrompts, setUserGeneratedPrompts] = useState<UserGeneratedPrompt[]>([]);
  const [generatedPromptsLoading, setGeneratedPromptsLoading] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<{ id: string; title: string } | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Power Packs state
  const [userPacks, setUserPacks] = useState<any[]>([]);
  const [packsLoading, setPacksLoading] = useState(false);

  // Filters and UI state (mirrors Prompt Library)
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [subcategoryId, setSubcategoryId] = useState<string | undefined>();
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<PromptUI[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [busy, setBusy] = useState(false);

  // Load favorite IDs for current user
  const loadFavoriteIds = useCallback(async () => {
    if (!user) return;
    setBusy(true);
    try {
      const favRes = await supabase
        .from("favorites")
        .select("prompt_id")
        .eq("user_id", user.id);
      if (favRes.error) throw favRes.error;
      const ids = (favRes.data || []).map((r: any) => r.prompt_id as string);
      setFavIds(ids);
      if (ids.length === 0) {
        setItems([]);
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to load favourites" });
    } finally {
      setBusy(false);
    }
  }, [user?.id]);

  // Build category/subcategory options limited to favorites
  const loadAvailableCategories = useCallback(async (ids: string[]) => {
    if (!ids || ids.length === 0) {
      setCategories([]);
      return;
    }
    const { data: favPrompts, error } = await supabase
      .from("prompts")
      .select("category_id, subcategory_id")
      .in("id", ids);
    if (error) {
      console.error(error);
      return;
    }
    const categorySet = new Set<string>();
    const subcategoryIdsSet = new Set<string>();
    (favPrompts || []).forEach((r: any) => {
      if (r.category_id) categorySet.add(r.category_id as string);
      if (r.subcategory_id) subcategoryIdsSet.add(r.subcategory_id as string);
    });
    if (categorySet.size === 0) {
      setCategories([]);
      return;
    }
    const [catRes, subRes] = await Promise.all([
      supabase.from("categories").select("id,name").in("id", Array.from(categorySet)).order("name"),
      subcategoryIdsSet.size
        ? supabase.from("subcategories").select("id,name,category_id").in("id", Array.from(subcategoryIdsSet)).order("name")
        : Promise.resolve({ data: [], error: null } as any),
    ]);
    if ((catRes as any).error) {
      console.error((catRes as any).error);
      return;
    }
    if ((subRes as any).error) {
      console.error((subRes as any).error);
      return;
    }
    const subcatByCategory = new Map<string, { id: string; name: string }[]>();
    ((subRes as any).data || []).forEach((s: any) => {
      const list = subcatByCategory.get(s.category_id as string) || [];
      list.push({ id: s.id as string, name: s.name as string });
      subcatByCategory.set(s.category_id as string, list);
    });
    const built: CategoryType[] = ((catRes as any).data || [])
      .map((c: any) => ({
        id: c.id as string,
        name: c.name as string,
        subcategories: subcatByCategory.get(c.id as string) || [],
      }))
      .filter((c) => c.subcategories.length > 0);
    setCategories(built);
  }, []);

  // Load user's AI-generated prompts
  const loadUserGeneratedPrompts = useCallback(async () => {
    if (!user) return;
    
    setGeneratedPromptsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_generated_prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserGeneratedPrompts(data || []);
    } catch (error: any) {
      console.error('Error loading user generated prompts:', error);
      toast({ title: "Failed to load AI-generated prompts", variant: "destructive" });
    } finally {
      setGeneratedPromptsLoading(false);
    }
  }, [user]);

  // Load user's Power Packs
  const loadUserPacks = useCallback(async () => {
    if (!user) return;
    
    setPacksLoading(true);
    try {
      const { data, error } = await supabase
        .from('pack_access')
        .select('pack_id, packs(id, name, description, slug)')
        .eq('user_id', user.id);

      if (error) throw error;
      const packs = (data || []).map(item => item.packs).filter(Boolean);
      setUserPacks(packs);
    } catch (error: any) {
      console.error('Error loading user packs:', error);
      toast({ title: "Failed to load Power Packs", variant: "destructive" });
    } finally {
      setPacksLoading(false);
    }
  }, [user]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Prompt copied to clipboard." });
    } catch (error) {
      toast({ title: "Copy failed", description: "Failed to copy prompt to clipboard.", variant: "destructive" });
    }
  };

  const handleDeleteGeneratedPrompt = async (promptId: string) => {
    if (!promptToDelete) return;

    try {
      const { error } = await supabase
        .from('user_generated_prompts')
        .delete()
        .eq('id', promptToDelete.id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setUserGeneratedPrompts(prev => prev.filter(p => p.id !== promptToDelete.id));
      setPromptToDelete(null);
      toast({ title: "Prompt deleted", description: "Your generated prompt has been removed." });
    } catch (error: any) {
      console.error('Error deleting prompt:', error);
      toast({ title: "Delete failed", description: "Failed to delete the prompt.", variant: "destructive" });
    }
  };

  // Generate dynamic tags based on prompt characteristics
  const getDynamicTags = (prompt: UserGeneratedPrompt) => {
    const dynamicTags: string[] = [];
    
    // Length-based tags
    if (prompt.prompt.length < 100) {
      dynamicTags.push("Short");
    } else if (prompt.prompt.length < 300) {
      dynamicTags.push("Medium");
    } else {
      dynamicTags.push("Long");
    }
    
    // Content-based tags
    if (prompt.prompt.toLowerCase().includes('creative') || prompt.prompt.toLowerCase().includes('writing')) {
      dynamicTags.push("Creative");
    }
    if (prompt.prompt.toLowerCase().includes('business') || prompt.prompt.toLowerCase().includes('marketing')) {
      dynamicTags.push("Business");
    }
    if (prompt.prompt.toLowerCase().includes('technical') || prompt.prompt.toLowerCase().includes('code')) {
      dynamicTags.push("Technical");
    }
    if (prompt.prompt.toLowerCase().includes('analysis') || prompt.prompt.toLowerCase().includes('analyze')) {
      dynamicTags.push("Analysis");
    }
    
    // Recent tag for prompts created in the last 7 days
    const createdDate = new Date(prompt.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    if (createdDate > weekAgo) {
      dynamicTags.push("Recent");
    }
    
    return dynamicTags;
  };

  // Get all unique tags from prompts
  const getAllTags = () => {
    const allTags = new Set<string>();
    userGeneratedPrompts.forEach(prompt => {
      prompt.tags.forEach(tag => allTags.add(tag));
      getDynamicTags(prompt).forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  };

  // Filter prompts based on active filter
  const filteredGeneratedPrompts = activeFilter 
    ? userGeneratedPrompts.filter(prompt => {
        const allPromptTags = [...prompt.tags, ...getDynamicTags(prompt)];
        return allPromptTags.includes(activeFilter);
      })
    : userGeneratedPrompts;

  const handleTagClick = (tag: string) => {
    if (activeFilter === tag) {
      setActiveFilter(null); // Clear filter if clicking the same tag
    } else {
      setActiveFilter(tag);
    }
  };

  // Internal fetcher for a specific page (mirrors Prompt Library but scoped to favorites)
  const fetchPromptsPage = useCallback(
    async (pageNumber: number) => {
      if (!favIds || favIds.length === 0) return { data: [] as PromptUI[], count: 0, hasMore: false };
      setBusy(true);
      try {
        // If filtering by tag, resolve prompt ids for that tag first and intersect with favorites
        let constrainedIds: string[] = favIds;
        if (selectedTag) {
          const tagRes = await supabase.from("tags").select("id").eq("name", selectedTag).maybeSingle();
          if (tagRes.error) throw tagRes.error;
          const tagId = tagRes.data?.id as string | undefined;
          if (!tagId) {
            return { data: [] as PromptUI[], count: 0, hasMore: false };
          }
          const ptRes = await supabase.from("prompt_tags").select("prompt_id").eq("tag_id", tagId);
          if (ptRes.error) throw ptRes.error;
          const tagPromptIds = (ptRes.data || []).map((r) => r.prompt_id as string);
          const favSet = new Set(favIds);
          constrainedIds = tagPromptIds.filter((id) => favSet.has(id));
          if (constrainedIds.length === 0) {
            return { data: [] as PromptUI[], count: 0, hasMore: false };
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
          .in("id", constrainedIds)
          .order("created_at", { ascending: false });

        if (categoryId) q = q.eq("category_id", categoryId);
        if (subcategoryId) q = q.eq("subcategory_id", subcategoryId);
        if (query.trim()) q = q.textSearch("search_vector", query.trim(), { type: "websearch" });

        q = q.range(from, to);

        const { data, error, count } = await q;
        if (error) throw error;

        const promptIds = (data || []).map((r) => r.id as string);
        let tagMap = new Map<string, string[]>();
        if (promptIds.length > 0) {
          const join = await supabase
            .from("prompt_tags")
            .select("prompt_id, tags:tag_id(name)")
            .in("prompt_id", promptIds);
          if (join.error) throw join.error;
          (join.data || []).forEach((r: any) => {
            const name = r.tags?.name as string | undefined;
            if (!name) return;
            const arr = tagMap.get(r.prompt_id) || [];
            arr.push(name);
            tagMap.set(r.prompt_id, arr);
          });
        }

const mapped: PromptUI[] = (data || []).map((r: any) => ({
          id: r.id,
          categoryId: r.category_id,
          subcategoryId: r.subcategory_id,
          title: r.title,
          whatFor: r.what_for,
          prompt: r.prompt,
          imagePrompt: r.image_prompt,
          excerpt: r.excerpt,
          tags: tagMap.get(r.id) || [],
          is_pro: r.is_pro,
        }));

        const total = count || 0;
        const newHasMore = to + 1 < total;
        return { data: mapped, count: total, hasMore: newHasMore };
      } catch (e) {
        console.error(e);
        toast({ title: "Failed to load favourites" });
        return { data: [] as PromptUI[], count: 0, hasMore: false };
      } finally {
        setBusy(false);
      }
    },
    [favIds, categoryId, subcategoryId, query, selectedTag]
  );

  const refresh = useCallback(async () => {
    if (!favIds || favIds.length === 0) return;
    setPage(1);
    const res = await fetchPromptsPage(1);
    const data = res.data || [];
    setItems(dedupeByTitle(data));
    setHasMore(!!res.hasMore);
  }, [fetchPromptsPage, favIds]);

  const loadMore = useCallback(async () => {
    if (busy || !hasMore) return;
    const next = page + 1;
    const res = await fetchPromptsPage(next);
    const data = res.data || [];
    setItems((prev) => dedupeByTitle([...(prev || []), ...data]));
    setHasMore(!!res.hasMore);
    setPage(next);
  }, [page, hasMore, busy, fetchPromptsPage]);

  // Initial loads
  useEffect(() => {
    if (user) {
      loadFavoriteIds();
      loadUserGeneratedPrompts();
      loadUserPacks();
    }
  }, [user, loadFavoriteIds, loadUserGeneratedPrompts, loadUserPacks]);

  // Rebuild narrowed category options when favorites change
  useEffect(() => {
    loadAvailableCategories(favIds);
  }, [favIds, loadAvailableCategories]);

  // Refresh when filters change (and when favorites ready)
  useEffect(() => {
    if (favIds.length) refresh();
  }, [categoryId, subcategoryId, query, selectedTag, favIds, refresh]);

  if (loading) return null;

  return (
    <>
      <SEO
        title="My Favourite Prompts"
        description="Your saved favourite prompts — quick access to what you use most."
      />
      <PageHero
        title={<><span className="text-gradient-brand">My</span> Prompts</>}
        subtitle={<>Manage your saved prompts and AI-generated custom prompts</>}
      >
        <Button asChild variant="hero" className="px-6">
          <a href="#my-saved-prompts">
            <Heart className="h-4 w-4 mr-2" />
            My Saved Prompts ({favIds.length})
          </a>
        </Button>
        <Button asChild variant="secondary">
          <a href="#my-generated-prompts">
            <Bot className="h-4 w-4 mr-2" />
            My AI-Generated Prompts ({userGeneratedPrompts.length})
          </a>
        </Button>
        <Button asChild variant="inverted">
          <a href="#my-power-packs">
            <Zap className="h-4 w-4 mr-2 text-yellow-500" />
            My Power Packs ({userPacks.length})
          </a>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/library">Back to Library</Link>
        </Button>
      </PageHero>
      <main className="container py-8">
        {!user ? (
          <div className="rounded-xl border bg-card p-6 text-center">
            <p className="mb-4">Please log in to view your prompts.</p>
            <Button asChild variant="hero"><Link to="/auth">Login / Sign up</Link></Button>
          </div>
        ) : (
          <>
            {/* My Saved Prompts section */}
            <section id="my-saved-prompts" className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Prompts you've saved for quick access</h2>

              {favIds.length === 0 ? (
                <Card className="text-center py-16">
                  <CardContent>
                    <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold mb-2">No saved prompts yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start exploring prompts and click the heart icon to save your favorites.
                    </p>
                    <Button asChild>
                      <Link to="/library">Browse Prompts</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <section id="favorites-filters" className="scroll-mt-28 md:scroll-mt-28">
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
                        // useEffect triggers refresh
                      }}
                      searchLabel="Search My Prompts:"
                      searchPlaceholder="Search My Prompts..."
                      categoryLabel="My Prompt Categories:"
                      subcategoryLabel="My Prompt Subcategories:"
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
                          setQuery("");
                        }}
                        onSubcategoryClick={(sid, cid) => {
                          setCategoryId(cid);
                          setSubcategoryId(sid);
                          setSelectedTag(undefined);
                          setQuery("");
                        }}
                      />
                    ))}
                  </section>

                  {hasMore && (
                    <div className="flex justify-center mt-8">
                      <Button variant="secondary" onClick={loadMore} disabled={busy}>
                        {busy ? "Loading..." : "Load more"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </section>

            {/* My AI-Generated Prompts section */}
            <section id="my-generated-prompts" className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Custom prompts you've generated with our AI tools</h2>
                <Button asChild>
                  <Link to="/ai/generator">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate New Prompt
                  </Link>
                </Button>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    {filteredGeneratedPrompts.length} of {userGeneratedPrompts.length} prompt{userGeneratedPrompts.length !== 1 ? 's' : ''} 
                    {activeFilter && <> • Filtered by: <Badge variant="secondary" className="ml-1">{activeFilter}</Badge></>}
                  </p>
                  {activeFilter && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveFilter(null)}
                      className="text-xs"
                    >
                      Clear Filter
                    </Button>
                  )}
                </div>
              </div>

              {/* Filter Tags */}
              {userGeneratedPrompts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Filter by tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {getAllTags().map((tag) => (
                      <Badge
                        key={tag}
                        variant={activeFilter === tag ? "default" : "outline"}
                        className="cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {generatedPromptsLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-lg h-48"></div>
                    </div>
                  ))}
                </div>
              ) : filteredGeneratedPrompts.length > 0 ? (
                <div className="grid gap-6">
                  {filteredGeneratedPrompts.map((prompt) => {
                    const allTags = [...prompt.tags, ...getDynamicTags(prompt)];
                    return (
                    <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-lg">{prompt.title}</CardTitle>
                            {prompt.description && (
                              <CardDescription>{prompt.description}</CardDescription>
                            )}
                          </div>
                          <Badge variant="secondary" className="ml-4">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Generated
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value={`prompt-${prompt.id}`}>
                            <AccordionTrigger className="text-left">
                              <div className="flex items-center gap-2">
                                <span>View full prompt</span>
                                <Badge variant="secondary" className="text-xs">
                                  {prompt.prompt.length} characters
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="p-4 bg-muted rounded-lg border">
                                <pre className="whitespace-pre-wrap text-sm font-mono">
                                  {prompt.prompt}
                                </pre>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        {/* Preview of prompt (first 150 characters) */}
                        <div className="p-3 bg-muted/30 rounded-lg border-l-4 border-l-primary/20">
                          <p className="text-sm text-muted-foreground italic">
                            "{prompt.prompt.substring(0, 150)}{prompt.prompt.length > 150 ? '...' : ''}"
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {allTags.map((tag) => {
                              const isDynamic = getDynamicTags(prompt).includes(tag);
                              return (
                                <Badge 
                                  key={tag} 
                                  variant={activeFilter === tag ? "default" : "outline"} 
                                  className={`text-xs cursor-pointer hover:bg-muted transition-colors ${
                                    isDynamic ? 'border-primary/40 bg-primary/5' : ''
                                  }`}
                                  onClick={() => handleTagClick(tag)}
                                >
                                  {tag}
                                </Badge>
                              );
                            })}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(prompt.prompt)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPromptToDelete({ id: prompt.id, title: prompt.title })}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Created {new Date(prompt.created_at).toLocaleDateString()}</span>
                          {prompt.updated_at !== prompt.created_at && (
                            <span>Updated {new Date(prompt.updated_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    );
                  })}
                </div>
              ) : activeFilter ? (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Sparkles className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">No Prompts Match Filter</h3>
                        <p className="text-muted-foreground mb-4">
                          No prompts found with the "{activeFilter}" tag.
                        </p>
                        <Button onClick={() => setActiveFilter(null)} variant="outline">
                          Clear Filter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="text-center py-16">
                  <CardContent>
                    <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold mb-2">No AI-generated prompts yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Use our AI tools to generate custom prompts tailored to your needs.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button asChild>
                        <Link to="/ai/generator">Generate Your First Prompt</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to="/ai/assistant">Try Scout Assistant</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tips Section */}
              {userGeneratedPrompts.length > 0 && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="text-lg">💡 Tips for Managing Your AI-Generated Prompts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">Organize with Descriptions</h4>
                        <p className="text-muted-foreground">
                          Use clear descriptions when generating prompts to easily find them later.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Copy and Customize</h4>
                        <p className="text-muted-foreground">
                          Copy prompts to your clipboard and modify them as needed for different use cases.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Regular Cleanup</h4>
                        <p className="text-muted-foreground">
                          Delete prompts you no longer need to keep your collection organized.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Generate Variations</h4>
                        <p className="text-muted-foreground">
                          Create multiple versions of successful prompts for different scenarios.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* My Power Packs section */}
            <section id="my-power-packs" className="mb-16">
              <h2 className="text-2xl font-bold mb-6">My <Zap className="h-6 w-6 inline mx-1 text-yellow-500" /> Power Packs</h2>

              {packsLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-lg h-48"></div>
                    </div>
                  ))}
                </div>
              ) : userPacks.length === 0 ? (
                <Card className="text-center py-16">
                  <CardContent>
                    <Zap className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
                    <h3 className="text-lg font-semibold mb-2">No Power Packs yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Unlock powerful prompt collections designed for specific use cases and industries.
                    </p>
                    <Button asChild>
                      <Link to="/packs">Explore Power Packs</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {userPacks.map((pack) => (
                    <Card key={pack.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          {pack.name}
                        </CardTitle>
                        {pack.description && (
                          <CardDescription className="text-sm">
                            {pack.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <Button asChild variant="outline" className="w-full">
                          <Link to={`/packs/${pack.slug}`}>View Pack</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!promptToDelete} onOpenChange={() => setPromptToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Caution!
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{promptToDelete?.title}"? This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPromptToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteGeneratedPrompt("")}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </>
  );
};

export default FavoritesPage;
