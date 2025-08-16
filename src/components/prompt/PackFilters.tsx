import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PackFiltersProps {
  query: string;
  onChange: (query: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
}

export const PackFilters = ({ query, onChange, onSearch, onClear }: PackFiltersProps) => {
  return (
    <section className="rounded-xl bg-accent/40 border p-4 md:p-6">
      <div className="grid gap-3 md:grid-cols-12 items-end">
        <div className="space-y-1 md:col-span-6">
          <Label htmlFor="pack-search-input">Search Packs:</Label>
          <Input
            id="pack-search-input"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search packs by name, tags, or contents..."
            aria-label="Search packs"
            className="bg-muted/60 border shadow-sm focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="md:col-span-6 flex items-center gap-2 justify-end md:justify-start flex-wrap">
          <Button variant="cta" className="border border-foreground" onClick={onSearch} aria-label="Run search">
            Search
          </Button>
          <span className="text-foreground">or</span>
          <Button variant="secondary" className="border border-foreground" onClick={onClear} aria-label="Reset search">
            Clear
          </Button>
        </div>
      </div>
    </section>
  );
};