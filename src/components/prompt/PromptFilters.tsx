import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { Category } from "@/data/prompts";

interface FiltersProps {
  categories: Category[];
  categoryId: Category["id"] | undefined;
  subcategoryId: string | undefined;
  query: string;
  includePro?: boolean;
  proOnly?: boolean;
  ribbon?: string;
  onChange: (next: { 
    categoryId?: string; 
    subcategoryId?: string; 
    query?: string; 
    includePro?: boolean; 
    proOnly?: boolean;
    ribbon?: string 
  }) => void;
  onSearch?: () => void;
  onClear?: () => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  categoryLabel?: string;
  subcategoryLabel?: string;
}

function catAccentIndex(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return (h % 6) + 1;
}

export const PromptFilters = ({ categories, categoryId, subcategoryId, query, includePro, proOnly, ribbon, onChange, onSearch, onClear, searchLabel, searchPlaceholder, categoryLabel, subcategoryLabel }: FiltersProps) => {
  const categoriesSorted = [...categories].sort((a, b) => {
    const an = a.name.trim().toLowerCase();
    const bn = b.name.trim().toLowerCase();
    const isAdv = (n: string) => n === "advanced prompt engineering" || n === "advaced prompt engineering";
    const isAiFor = (n: string) => n.startsWith("ai for") && n !== "ai for business automation";
    const isAiIn = (n: string) => n.startsWith("ai in");
    const aw = (isAdv(an) || isAiFor(an) || isAiIn(an)) ? 1 : 0;
    const bw = (isAdv(bn) || isAiFor(bn) || isAiIn(bn)) ? 1 : 0;
    if (aw !== bw) return aw - bw; // non-bottom first, bottom last
    return a.name.localeCompare(b.name);
  });
  const currentCat = categories.find((c) => c.id === categoryId || c.name === categoryId);
  const subcategoriesSorted = [...(currentCat?.subcategories || [])].sort((a, b) => a.name.localeCompare(b.name));
  const isCategorySelected = Boolean(categoryId);

  const quickButtons = [
    { label: "Content Creation" },
    { label: "Content Marketing" },
    { label: "Social Media" },
    { label: "Ecommerce" },
    { label: "AI for Business Automation" },
    { label: "Career Development" },
    { label: "Lifestyle" },
    { label: "Wellness" },
    { label: "Productivity", search: "Productivity & Time Management" },
  ] as const;

  return (
    <section className="rounded-xl bg-accent/40 border p-4 md:p-6">
      

      <div className="grid gap-3 md:grid-cols-12 items-end">
        <div className="space-y-1 md:col-span-3">
          <Label htmlFor="category-select">{categoryLabel ?? "Category:"}</Label>
          <Select
            value={categoryId ?? "all"}
            onValueChange={(v) => onChange({ categoryId: v === "all" ? undefined : v, subcategoryId: undefined })}
          >
            <SelectTrigger
              id="category-select"
              aria-label="Filter by category"
              className="bg-muted/60 border shadow-sm hover:bg-muted focus:ring-2 focus:ring-ring data-[state=open]:ring-2"
            >
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categoriesSorted.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 md:col-span-3">
          <Label htmlFor="subcategory-select">{subcategoryLabel ?? "Subcategory:"}</Label>
          <Select
            value={subcategoryId ?? "all"}
            onValueChange={(v) => onChange({ subcategoryId: v === "all" ? undefined : v })}
            disabled={!isCategorySelected}
          >
            <SelectTrigger
              id="subcategory-select"
              aria-label="Filter by subcategory"
              className="bg-muted/60 border shadow-sm hover:bg-muted focus:ring-2 focus:ring-ring data-[state=open]:ring-2"
            >
              <SelectValue placeholder={isCategorySelected ? "All" : "Please select a category or search prompts"} />
            </SelectTrigger>
            <SelectContent>
              {isCategorySelected && (
                <>
                  <SelectItem value="all">All</SelectItem>
                  {subcategoriesSorted.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="search-input">{searchLabel ?? "Search:"}</Label>
          <Input
            id="search-input"
            value={query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder={searchPlaceholder ?? "Search prompts..."}
            aria-label={searchLabel ?? "Search prompts"}
            className="bg-muted/60 border shadow-sm focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="ribbon-select">Special:</Label>
          <Select
            value={ribbon ?? "all"}
            onValueChange={(v) => onChange({ ribbon: v === "all" ? undefined : v })}
          >
            <SelectTrigger
              id="ribbon-select"
              aria-label="Filter by special ribbons"
              className="bg-muted/60 border shadow-sm hover:bg-muted focus:ring-2 focus:ring-ring data-[state=open]:ring-2"
            >
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="RECOMMENDED">🎯 Recommended</SelectItem>
              <SelectItem value="MOST_POPULAR">🔥 Most Popular</SelectItem>
              <SelectItem value="HIGHEST_RATED">⭐ Highest Rated (4.5+)</SelectItem>
              <SelectItem value="MY_PROMPTS">❤️ My Prompts</SelectItem>
              <SelectItem value="NEW_PROMPTS">✨ New Prompts</SelectItem>
              <SelectItem value="TRENDING">📈 Trending</SelectItem>
              <SelectItem value="FREE_ONLY">🆓 Free Only</SelectItem>
              <SelectItem value="PRO_ONLY">💎 PRO Only</SelectItem>
              <SelectItem value="MOST_COPIED">📋 Most Copied</SelectItem>
              <SelectItem value="QUICK_WIN">⚡ Quick Win</SelectItem>
              <SelectItem value="RECENTLY_VIEWED">👁️ Recently Viewed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-3 flex items-center gap-2 justify-end md:justify-start flex-wrap">
          <Button variant="cta" className="border border-foreground" onClick={onSearch} aria-label="Run search">
            Search
          </Button>
          <span className="text-foreground">or</span>
          <Button variant="secondary" className="border border-foreground" onClick={onClear} aria-label="Reset filters and search">
            Reset Filters
          </Button>
        </div>
      </div>

    </section>
  );
};
