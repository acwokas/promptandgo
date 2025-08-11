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
  onChange: (next: { categoryId?: string; subcategoryId?: string; query?: string; includePro?: boolean }) => void;
  onSearch?: () => void;
  onClear?: () => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  categoryLabel?: string;
  subcategoryLabel?: string;
}


export const PromptFilters = ({ categories, categoryId, subcategoryId, query, includePro, onChange, onSearch, onClear, searchLabel, searchPlaceholder, categoryLabel, subcategoryLabel }: FiltersProps) => {
  const categoriesSorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));
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
            value={categoryId ?? ""}
            onValueChange={(v) => onChange({ categoryId: v || undefined, subcategoryId: undefined })}
          >
            <SelectTrigger
              id="category-select"
              aria-label="Filter by category"
              className="bg-muted/60 border shadow-sm hover:bg-muted focus:ring-2 focus:ring-ring data-[state=open]:ring-2"
            >
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {categoriesSorted.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 md:col-span-3">
          <Label htmlFor="subcategory-select">{subcategoryLabel ?? "Sub-Category:"}</Label>
          <Select
            value={subcategoryId ?? ""}
            onValueChange={(v) => onChange({ subcategoryId: v || undefined })}
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
              {isCategorySelected && subcategoriesSorted.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 md:col-span-3">
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

        <div className="md:col-span-3 flex items-end gap-2 justify-end md:justify-start flex-wrap">
          <Button variant="cta" onClick={onSearch} aria-label="Run search">
            Search
          </Button>
          <Button variant="secondary" onClick={onClear} aria-label="Clear filters and search">
            Clear Selections
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-muted-foreground mb-3">Or select a popular category:</p>
        <TooltipProvider>
          <div className="flex flex-wrap gap-2">
            {quickButtons.map((btn) => {
              const label = btn.label;
              const searchTerm = (btn as any).search ?? btn.label;
              const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
              const ln = normalize(searchTerm);
              const match = categories.find((c) => {
                const cn = normalize(c.name);
                return cn === ln || cn.includes(ln) || ln.includes(cn);
              });
              const catId = match?.id;
              return (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      className="bg-primary text-primary-foreground hover:opacity-90 shadow-sm whitespace-nowrap"
                      aria-label={label}
                      onClick={() => {
                        if (catId) onChange({ categoryId: catId, subcategoryId: undefined, query: "" });
                        else onChange({ query: searchTerm });
                      }}
                    >
                      {label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
};
