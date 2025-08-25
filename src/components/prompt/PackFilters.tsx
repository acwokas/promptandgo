import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PackFiltersProps {
  query: string;
  filter: string;
  onChange: (query: string) => void;
  onFilterChange: (filter: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
}

export const PackFilters = ({ query, filter, onChange, onFilterChange, onSearch, onClear }: PackFiltersProps) => {
  return (
    <section className="rounded-xl bg-accent/40 border p-2 md:p-6">
      <div className="grid gap-2 md:gap-3 md:grid-cols-12 items-end">
        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="pack-filter-select" className="text-xs md:text-sm">Filter:</Label>
          <Select
            value={filter}
            onValueChange={onFilterChange}
          >
            <SelectTrigger
              id="pack-filter-select"
              aria-label="Filter power packs"
              className="bg-muted/60 border shadow-sm hover:bg-muted focus:ring-2 focus:ring-ring data-[state=open]:ring-2 h-8 md:h-10 text-sm"
            >
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="my-packs">My ⚡Power Packs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 md:col-span-6">
          <Label htmlFor="pack-search-input" className="text-xs md:text-sm">Search ⚡ Power Packs:</Label>
          <Input
            id="pack-search-input"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search packs..."
            aria-label="Search power packs"
            className="bg-muted/60 border shadow-sm focus:ring-2 focus:ring-ring h-8 md:h-10 text-sm px-3 py-1"
          />
        </div>

        <div className="md:col-span-4 flex items-center gap-1 md:gap-2 justify-end md:justify-start flex-wrap">
          <Button variant="cta" size="sm" className="border border-foreground text-xs md:text-sm px-3 py-1 h-8 md:h-10" onClick={onSearch} aria-label="Run search">
            Search
          </Button>
          <span className="text-foreground text-xs md:text-sm hidden md:inline">or</span>
          <Button variant="secondary" size="sm" className="border border-foreground text-xs md:text-sm px-3 py-1 h-8 md:h-10" onClick={onClear} aria-label="Reset search">
            Clear
          </Button>
        </div>
      </div>
    </section>
  );
};