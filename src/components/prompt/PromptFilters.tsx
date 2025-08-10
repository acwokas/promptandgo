import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category } from "@/data/prompts";

interface FiltersProps {
  categories: Category[];
  categoryId: string | undefined;
  subcategoryId: string | undefined;
  query: string;
  onChange: (next: { categoryId?: string; subcategoryId?: string; query?: string }) => void;
}

export const PromptFilters = ({ categories, categoryId, subcategoryId, query, onChange }: FiltersProps) => {
  const currentCat = categories.find(c => c.id === categoryId);

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Select value={categoryId} onValueChange={(v) => onChange({ categoryId: v, subcategoryId: undefined })}>
        <SelectTrigger aria-label="Filter by category"><SelectValue placeholder="Category" /></SelectTrigger>
        <SelectContent>
          {categories.map(c => (
            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={subcategoryId} onValueChange={(v) => onChange({ subcategoryId: v })}>
        <SelectTrigger aria-label="Filter by subcategory"><SelectValue placeholder="Subcategory" /></SelectTrigger>
        <SelectContent>
          {(currentCat?.subcategories || []).map(s => (
            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input value={query} onChange={(e)=> onChange({ query: e.target.value })} placeholder="Search prompts..." aria-label="Search prompts" />
    </div>
  );
};
