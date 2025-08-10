import SEO from "@/components/SEO";
import { PromptFilters } from "@/components/prompt/PromptFilters";
import { PromptCard } from "@/components/prompt/PromptCard";
import { categories, prompts } from "@/data/prompts";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 6;

const PromptLibrary = () => {
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [subcategoryId, setSubcategoryId] = useState<string | undefined>();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter(p => {
      const matchCat = !categoryId || p.categoryId === categoryId;
      const matchSub = !subcategoryId || p.subcategoryId === subcategoryId;
      const textMatch = !q || [p.title, p.excerpt, p.whatFor, p.prompt, ...p.tags].join(" ").toLowerCase().includes(q);
      return matchCat && matchSub && textMatch;
    });
  }, [categoryId, subcategoryId, query]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > visible.length;

  return (
    <>
      <section className="relative bg-hero hero-grid">
        <div className="container py-16 text-center text-primary-foreground">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Prompt Library</h1>
          <p className="text-primary-foreground/80 mt-3 max-w-2xl mx-auto">Search and filter prompts across all categories and subcategories.</p>
        </div>
      </section>
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
          if (n.categoryId !== undefined) setCategoryId(n.categoryId);
          if (n.subcategoryId !== undefined) setSubcategoryId(n.subcategoryId);
          if (n.query !== undefined) setQuery(n.query);
          setPage(1);
        }}
      />

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {visible.map(p => (
          <PromptCard key={p.id} prompt={p} categories={categories} />
        ))}
      </section>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button variant="secondary" onClick={() => setPage((x) => x + 1)}>Load more</Button>
        </div>
      )}
      </main>
    </>
  );
};

export default PromptLibrary;
