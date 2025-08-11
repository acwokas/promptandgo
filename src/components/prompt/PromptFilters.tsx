import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Share2, Briefcase, Bot, FileText, Megaphone, HeartPulse, ShoppingBag, Brain, Clock } from "lucide-react";
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

  const popularCats = [
    { label: "Social Media Management", icon: Share2 },
    { label: "Career Development", icon: Briefcase },
    { label: "AI for Business Automation", icon: Bot },
    { label: "Content Creation", icon: FileText },
    { label: "Content Marketing", icon: Megaphone },
    { label: "Health & Wellness", icon: HeartPulse },
    { label: "E-commerce", icon: ShoppingBag },
    { label: "Personal Growth & Mindfulness", icon: Brain },
    { label: "Productivity & Time Management", icon: Clock },
  ] as const;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 items-end">
        <div className="space-y-1">
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

        <div className="space-y-1">
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

        <div className="space-y-1">
          <Label htmlFor="search-input">{searchLabel ?? "Search:"}</Label>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              id="search-input"
              value={query}
              onChange={(e) => onChange({ query: e.target.value })}
              placeholder={searchPlaceholder ?? "Search prompts..."}
              aria-label={searchLabel ?? "Search prompts"}
              className="bg-muted/60 border shadow-sm focus:ring-2 focus:ring-ring"
            />
            <div className="flex items-center gap-2 pl-1">
              <Checkbox
                id="include-pro"
                checked={!!includePro}
                onCheckedChange={(v) => onChange({ includePro: Boolean(v) })}
                aria-label="Include PRO Prompts"
              />
              <Label htmlFor="include-pro" className="text-sm">Include PRO Prompts</Label>
            </div>
            <Button variant="cta" onClick={onSearch} aria-label="Run search">
              Search
            </Button>
            <Button
              variant="ghost"
              onClick={onClear}
              aria-label="Clear filters and search"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-muted-foreground mb-3">Or select a popular category:</p>
        <TooltipProvider>
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-3">
            {popularCats.map((pc) => {
              const catId = categories.find((c) => c.name.toLowerCase().trim() === pc.label.toLowerCase().trim())?.id;
              const Icon = pc.icon;
              const disabled = !catId;
              return (
                <Tooltip key={pc.label}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-12 w-12 p-0 hover-scale"
                      aria-label={pc.label}
                      onClick={() => {
                        if (catId) onChange({ categoryId: catId, subcategoryId: undefined, query: "" });
                      }}
                      disabled={disabled}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{pc.label}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </TooltipProvider>
      </div>
    </>
  );
};
