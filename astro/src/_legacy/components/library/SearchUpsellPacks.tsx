import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, Sparkles } from "lucide-react";

interface Pack {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  price_cents: number;
}

// Mapping of search terms to relevant pack keywords
const SEARCH_TO_PACK_KEYWORDS: Record<string, string[]> = {
  "sales": ["sales", "business", "marketing", "career"],
  "seo": ["content", "marketing", "social media"],
  "content": ["content", "marketing", "writing"],
  "social media": ["social media", "content", "marketing"],
  "marketing": ["marketing", "content", "social media", "business"],
  "customer service": ["business", "automation", "productivity"],
  "productivity": ["productivity", "automation", "business"],
  "business": ["business", "strategy", "automation", "career"],
  "writing": ["content", "marketing", "writing"],
  "creative": ["content", "writing", "marketing"],
  "career": ["career", "business", "productivity"],
};

interface SearchUpsellPacksProps {
  searchQuery: string;
}

export function SearchUpsellPacks({ searchQuery }: SearchUpsellPacksProps) {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRelevantPacks = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setPacks([]);
        return;
      }

      setLoading(true);
      try {
        // Find matching keywords for this search
        const queryLower = searchQuery.toLowerCase();
        let keywords: string[] = [];
        
        // Check if search matches any of our predefined mappings
        for (const [term, packKeywords] of Object.entries(SEARCH_TO_PACK_KEYWORDS)) {
          if (queryLower.includes(term) || term.includes(queryLower)) {
            keywords = [...new Set([...keywords, ...packKeywords])];
          }
        }

        // If no specific mapping, use the search query itself
        if (keywords.length === 0) {
          keywords = [queryLower];
        }

        // Fetch packs that match these keywords
        const { data, error } = await supabase
          .from("packs")
          .select("id, name, description, slug, price_cents")
          .eq("is_active", true);

        if (error) throw error;

        // Score and filter packs based on keyword matches
        const scoredPacks = (data || []).map((pack) => {
          const packText = `${pack.name} ${pack.description || ""}`.toLowerCase();
          let score = 0;
          
          for (const keyword of keywords) {
            if (packText.includes(keyword)) {
              score += 2;
            }
          }
          
          // Direct query match gets extra points
          if (packText.includes(queryLower)) {
            score += 3;
          }

          return { ...pack, score };
        });

        // Filter packs with score > 0 and take top 2
        const relevantPacks = scoredPacks
          .filter((p) => p.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 2);

        setPacks(relevantPacks);
      } catch (error) {
        console.error("Error fetching relevant packs:", error);
        setPacks([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search
    const timeout = setTimeout(fetchRelevantPacks, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  if (loading || packs.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20 animate-in slide-in-from-top-2 duration-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">
            Looking for "{searchQuery}" prompts?
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">
          Get a complete pack with more prompts, templates, and examples:
        </p>

        <div className="space-y-2">
          {packs.map((pack) => (
            <Link
              key={pack.id}
              to={`/packs#pack-${pack.id}`}
              className="block"
            >
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/60 hover:bg-background transition-colors border border-transparent hover:border-primary/20">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-sm">{pack.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {pack.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-xs">50% OFF</Badge>
                  <span className="text-sm font-semibold">
                    ${((pack.price_cents || 999) / 200).toFixed(2)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Button asChild variant="link" size="sm" className="mt-2 p-0 h-auto text-xs">
          <Link to="/packs">
            Browse all Power Packs →
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
