import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category } from "@/data/prompts";

interface FiltersProps {
  categories: Category[];
  categoryId: string | undefined;
  subcategoryId: string | undefined;
  query: string;
  onChange: (next: { categoryId?: string; subcategoryId?: string; query?: string }) => void;
  onSearch?: () => void;
  onClear?: () => void;
}

export const PromptFilters = ({ categories, categoryId, subcategoryId, query, onChange, onSearch, onClear }: FiltersProps) => {
  const categoriesSorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));
  const currentCat = categories.find((c) => c.id === categoryId || c.name === categoryId);
  const subcategoriesSorted = [...(currentCat?.subcategories || [])].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="grid gap-4 md:grid-cols-3 items-end">
      <div className="space-y-1">
        <Label htmlFor="category-select">Category:</Label>
        <Select
          value={categoryId ?? ""}
          onValueChange={(v) => onChange({ categoryId: v || undefined, subcategoryId: undefined })}
        >
          <SelectTrigger id="category-select" aria-label="Filter by category">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {categoriesSorted.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="subcategory-select">Sub-Category:</Label>
        <Select
          value={subcategoryId ?? ""}
          onValueChange={(v) => onChange({ subcategoryId: v || undefined })}
        >
          <SelectTrigger id="subcategory-select" aria-label="Filter by subcategory">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {subcategoriesSorted.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="search-input">Search</Label>
        <div className="flex gap-2">
          <Input
            id="search-input"
            value={query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="Search prompts..."
            aria-label="Search prompts"
          />
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
  );
};
