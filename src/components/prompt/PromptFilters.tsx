import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
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
    <section className="rounded-xl bg-accent/40 border border-primary p-3 md:p-6">
      {/* Mobile: Stack vertically with compact spacing */}
      <div className="space-y-3 md:hidden">
        {/* Search first on mobile for immediate access */}
        <div className="space-y-1">
          <Label htmlFor="search-input-mobile" className="text-xs">{searchLabel ?? "Search:"}</Label>
          <Input
            id="search-input-mobile"
            value={query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder={searchPlaceholder ?? "Search prompts..."}
            aria-label={searchLabel ?? "Search prompts"}
            className="bg-muted/60 border shadow-sm focus:ring-2 focus:ring-ring h-8 text-sm px-3 py-1"
          />
        </div>

        {/* Two-column grid for filters on mobile */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="category-select-mobile" className="text-sm">{categoryLabel ?? "Category:"}</Label>
            <Select
              value={categoryId ?? "all"}
              onValueChange={(v) => onChange({ categoryId: v === "all" ? undefined : v, subcategoryId: undefined })}
            >
              <SelectTrigger
                id="category-select-mobile"
                aria-label="Filter by category"
                className="bg-muted/60 border shadow-sm hover:bg-muted focus:border-2 focus:border-ring data-[state=open]:border-2 data-[state=open]:border-ring h-9 text-sm transition-colors"
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

          <div className="space-y-1">
            <Label htmlFor="subcategory-select-mobile" className="text-sm">{subcategoryLabel ?? "Subcategory:"}</Label>
            <Select
              value={subcategoryId ?? "all"}
              onValueChange={(v) => onChange({ subcategoryId: v === "all" ? undefined : v })}
              disabled={!isCategorySelected}
            >
              <SelectTrigger
                id="subcategory-select-mobile"
                aria-label="Filter by subcategory"
                className="bg-muted/60 border shadow-sm hover:bg-muted focus:border-2 focus:border-ring data-[state=open]:border-2 data-[state=open]:border-ring h-9 text-sm transition-colors"
              >
                <SelectValue placeholder={isCategorySelected ? "All" : "Select category first"} />
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
        </div>

        {/* Special filter - hidden on mobile, shown on desktop */}
        <div className="space-y-1 hidden md:block">
          <Label htmlFor="ribbon-select-mobile" className="text-sm">Special:</Label>
          <Select
            value={ribbon ?? "all"}
            onValueChange={(v) => onChange({ ribbon: v === "all" ? undefined : v })}
          >
            <SelectTrigger
              id="ribbon-select-mobile"
              aria-label="Filter by special ribbons"
              className="bg-muted/60 border shadow-sm hover:bg-muted focus:border-2 focus:border-ring data-[state=open]:border-2 data-[state=open]:border-ring h-9 text-sm transition-colors"
            >
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="RECOMMENDED">🎯 Recommended</SelectItem>
              <SelectItem value="MOST_POPULAR">🔥 Most Popular</SelectItem>
              <SelectItem value="HIGHEST_RATED">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  Highest Rated (4.5+)
                </div>
              </SelectItem>
              <SelectItem value="NEW_PROMPTS">✨ New Prompts</SelectItem>
              <SelectItem value="TRENDING">📈 Trending</SelectItem>
              <SelectItem value="FREE_ONLY">🆓 Free Only</SelectItem>
              <SelectItem value="PRO_ONLY">💎 PRO Only</SelectItem>
              <SelectItem value="MOST_COPIED">📋 Most Copied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button variant="cta" size="sm" className="flex-1" onClick={onSearch} aria-label="Run search">
            Search
          </Button>
          <Button variant="secondary" size="sm" className="flex-1" onClick={onClear} aria-label="Reset filters and search">
            Reset
          </Button>
        </div>
      </div>

      {/* Desktop: Original horizontal layout */}
      <div className="hidden md:grid gap-3 md:grid-cols-12 items-end">
        <div className="space-y-1 md:col-span-3">
          <Label htmlFor="category-select">{categoryLabel ?? "Category:"}</Label>
          <Select
            value={categoryId ?? "all"}
            onValueChange={(v) => onChange({ categoryId: v === "all" ? undefined : v, subcategoryId: undefined })}
          >
            <SelectTrigger
              id="category-select"
              aria-label="Filter by category"
              className="bg-muted/60 border shadow-sm hover:bg-muted focus:border-2 focus:border-ring data-[state=open]:border-2 data-[state=open]:border-ring transition-colors"
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
              className="bg-muted/60 border shadow-sm hover:bg-muted focus:border-2 focus:border-ring data-[state=open]:border-2 data-[state=open]:border-ring transition-colors"
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
              className="bg-muted/60 border shadow-sm hover:bg-muted focus:border-2 focus:border-ring data-[state=open]:border-2 data-[state=open]:border-ring transition-colors"
            >
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="RECOMMENDED">🎯 Recommended</SelectItem>
              <SelectItem value="MOST_POPULAR">🔥 Most Popular</SelectItem>
              <SelectItem value="HIGHEST_RATED">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  Highest Rated (4.5+)
                </div>
              </SelectItem>
              <SelectItem value="NEW_PROMPTS">✨ New Prompts</SelectItem>
              <SelectItem value="TRENDING">📈 Trending</SelectItem>
              <SelectItem value="FREE_ONLY">🆓 Free Only</SelectItem>
              <SelectItem value="PRO_ONLY">💎 PRO Only</SelectItem>
              <SelectItem value="MOST_COPIED">📋 Most Copied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2 flex items-center gap-2 justify-end">
          <Button variant="cta" className="border border-foreground" onClick={onSearch} aria-label="Run search">
            Search
          </Button>
          <Button variant="secondary" className="border border-foreground" onClick={onClear} aria-label="Reset filters and search">
            Reset
          </Button>
        </div>
      </div>

    </section>
  );
};
