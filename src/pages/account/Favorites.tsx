import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/prompt/PromptCard";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useEffect, useMemo, useState, useCallback } from "react";
import type { Category as CategoryType } from "@/data/prompts";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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

const FavoritesPage = () => {
  const { user, loading } = useSupabaseAuth();
  const [items, setItems] = useState<PromptUI[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [busy, setBusy] = useState(false);

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
      .map((c: any) => ({ id: c.id, name: c.name, subcategories: subcatByCategory.get(c.id) || [] }));
    setCategories(built);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const loadFavorites = useCallback(async () => {
    if (!user) return;
    setBusy(true);
    try {
      const favRes = await supabase
        .from("favorites")
        .select("prompt_id")
        .eq("user_id", user.id);
      if (favRes.error) throw favRes.error;
      const ids = (favRes.data || []).map((r: any) => r.prompt_id as string);
      if (ids.length === 0) {
        setItems([]);
        return;
      }
      const { data: prompts, error } = await supabase
        .from("prompts")
        .select("id, category_id, subcategory_id, title, what_for, prompt, image_prompt, excerpt")
        .in("id", ids)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const promptIds = (prompts || []).map((r: any) => r.id as string);
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
      const mapped: PromptUI[] = (prompts || []).map((r: any) => ({
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
      setItems(mapped);
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to load favourites" });
    } finally {
      setBusy(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) loadFavorites();
  }, [user, loadFavorites]);

  if (loading) return null;

  return (
    <>
      <SEO
        title="My Favourite Prompts"
        description="Your saved favourite prompts — quick access to what you use most."
      />
      <PageHero
        title={<><span className="text-gradient-brand">My</span> Favourites</>}
        subtitle={<>All the prompts you've saved in one place.</>}
      >
        <Button asChild variant="secondary">
          <Link to="/library">Back to Library</Link>
        </Button>
      </PageHero>
      <main className="container py-8">
        {!user ? (
          <div className="rounded-xl border bg-card p-6 text-center">
            <p className="mb-4">Please log in to view your favourite prompts.</p>
            <Button asChild variant="hero"><Link to="/auth">Login / Sign up</Link></Button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border bg-card p-6 text-center">
            <p className="mb-4">You haven't added any favourites yet.</p>
            <Button asChild variant="hero"><Link to="/library">Browse Prompts</Link></Button>
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <PromptCard key={p.id} prompt={p as any} categories={categories} />
            ))}
          </section>
        )}
      </main>
    </>
  );
};

export default FavoritesPage;
