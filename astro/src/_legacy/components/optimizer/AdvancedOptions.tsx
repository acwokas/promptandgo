import { Settings2, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const TONE_OPTIONS = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "academic", label: "Academic" },
  { id: "creative", label: "Creative" },
];

const LENGTH_OPTIONS = [
  { id: "concise", label: "Concise", desc: "Brief, to the point" },
  { id: "detailed", label: "Detailed", desc: "Thorough coverage" },
  { id: "comprehensive", label: "Comprehensive", desc: "In-depth analysis" },
];

const INDUSTRY_OPTIONS = [
  { id: "technology", label: "Technology" },
  { id: "finance", label: "Finance" },
  { id: "healthcare", label: "Healthcare" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "education", label: "Education" },
  { id: "marketing", label: "Marketing" },
];

interface AdvancedOptionsProps {
  tone: string;
  setTone: (t: string) => void;
  outputLength: string;
  setOutputLength: (l: string) => void;
  industry: string;
  setIndustry: (i: string) => void;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}

export const AdvancedOptions = ({
  tone, setTone, outputLength, setOutputLength, industry, setIndustry, isOpen, setIsOpen,
}: AdvancedOptionsProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground w-full justify-start">
          <Settings2 className="h-4 w-4" />
          Advanced options
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ml-auto ${isOpen ? "rotate-180" : ""}`} />
          {(tone !== "professional" || outputLength !== "detailed" || industry !== "technology") && (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-3">
        {/* Tone */}
        <div>
          <label className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Tone</label>
          <div className="flex flex-wrap gap-1.5">
            {TONE_OPTIONS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  tone === t.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Output Length */}
        <div>
          <label className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Output Length</label>
          <div className="flex flex-wrap gap-1.5">
            {LENGTH_OPTIONS.map((l) => (
              <button
                key={l.id}
                onClick={() => setOutputLength(l.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  outputLength === l.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Industry */}
        <div>
          <label className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Industry Context</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {INDUSTRY_OPTIONS.map((i) => (
              <option key={i.id} value={i.id}>{i.label}</option>
            ))}
          </select>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
