import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Prompt, Category } from "@/data/prompts";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { addToCart } from "@/lib/cart";

// Clean display title by removing common variant markers
const cleanTitle = (t?: string | null) => {
  let s = (t || "").trim();
  
  // Remove parenthetical content that contains variant-like words
  s = s.replace(/\s*\([^)]*(?:variant|alt|alternate|ver|version|rev|revision|v\d+)\b[^)]*\)\s*/gi, " ");
  
  // Remove trailing separators with variant markers
  s = s.replace(/\s*[-–—|]\s*(?:variant|variants?|alt|alternate|ver|version|rev|revision)\b.*$/gi, "");
  
  // Remove trailing version/revision patterns more aggressively
  s = s.replace(/\s+(?:v|ver|version)\s*\d+.*$/gi, "");
  s = s.replace(/\s*(?:rev|revision)\s*[a-z0-9]+.*$/gi, "");
  s = s.replace(/\s*#\d+.*$/gi, "");
  
  // Remove standalone "variant" and numbers at the end
  s = s.replace(/\s+variant\b.*$/gi, "");
  s = s.replace(/\s+\d+\s*$/g, "");
  
  // Clean up whitespace and punctuation
  s = s.replace(/\s+/g, " ").trim();
  s = s.replace(/[\s,:;.-]+$/g, "");
  
  return s;
};

interface PromptCardProps {
  prompt: Prompt;
  categories: Category[];
  onTagClick?: (tag: string) => void;
}

export const PromptCard = ({ prompt, categories, onTagClick }: PromptCardProps) => {
  const category = categories.find((c) => c.id === prompt.categoryId);
  const sub = category?.subcategories.find((s) => s.id === prompt.subcategoryId);
  const displayTitle = cleanTitle(prompt.title);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copied` });
    } catch {
      toast({ title: `Failed to copy ${label}` });
    }
  };

  const { user } = useSupabaseAuth();
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const isPro = (prompt as any).isPro || (prompt as any).is_pro || false;
  const [hasAccess, setHasAccess] = useState(false);
  const [packs, setPacks] = useState<{ id: string; name: string }[]>([]);
  const now = new Date();
  const monthName = now.toLocaleString(undefined, { month: 'long' });
  const PACK_ORIGINAL_CENTS = 999;
  const PACK_DISCOUNT_CENTS = 499;
  const SUB_ORIGINAL_CENTS = 1499;
  const SUB_DISCOUNT_CENTS = 999;
  const fmtUSD = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  useEffect(() => {
    let ignore = false;
    const check = async () => {
      if (!user) {
        setIsFav(false);
        return;
      }
      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("prompt_id", prompt.id)
        .maybeSingle();
      if (!ignore) setIsFav(!!data && !error);
    };
    check();
    return () => {
      ignore = true;
    };
  }, [user?.id, prompt.id]);

  useEffect(() => {
    let cancelled = false;
    const loadAccessAndPacks = async () => {
      try {
        // Load pack names this prompt belongs to
        const pp = await supabase.from('pack_prompts').select('pack_id').eq('prompt_id', prompt.id);
        const packIds = (pp.data || []).map((r: any) => r.pack_id);
        if (packIds.length) {
          const packsRes = await supabase.from('packs').select('id,name').in('id', packIds);
          if (!cancelled && !packsRes.error) setPacks((packsRes.data || []).map((p: any) => ({ id: p.id, name: p.name })));
        } else {
          if (!cancelled) setPacks([]);
        }

        if (!user) {
          if (!cancelled) setHasAccess(false);
          return;
        }

        // Check subscription
        const subRes = await supabase.from('subscribers').select('subscribed').eq('user_id', user.id).maybeSingle();
        if (subRes.data?.subscribed) {
          if (!cancelled) setHasAccess(true);
          return;
        }

        // Check direct prompt access
        const pa = await supabase.from('prompt_access').select('user_id').eq('user_id', user.id).eq('prompt_id', prompt.id).maybeSingle();
        if (pa.data) {
          if (!cancelled) setHasAccess(true);
          return;
        }

        // Check pack access intersect
        if (packIds.length) {
          const pacc = await supabase.from('pack_access').select('pack_id').eq('user_id', user.id).in('pack_id', packIds);
          if ((pacc.data || []).length > 0) {
            if (!cancelled) setHasAccess(true);
            return;
          }
        }
        if (!cancelled) setHasAccess(false);
      } catch (e) {
        console.error(e);
        if (!cancelled) setHasAccess(false);
      }
    };
    loadAccessAndPacks();
    return () => { cancelled = true; };
  }, [user?.id, prompt.id]);

  const toggleFavorite = async () => {
    if (!user) return;
    setFavLoading(true);
    try {
      if (isFav) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("prompt_id", prompt.id);
        if (error) throw error;
        setIsFav(false);
        toast({ title: "Removed from favourites" });
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, prompt_id: prompt.id });
        if (error) throw error;
        setIsFav(true);
        toast({ title: "Added to favourites" });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to update favourites" });
    } finally {
      setFavLoading(false);
    }
};

  const handleSubscribeClick = async () => {
    if (!user) {
      window.location.assign('/auth');
      return;
    }
    toast({ title: 'Subscription checkout', description: 'Stripe checkout will be enabled after keys are configured.' });
  };

  const addFirstPackToCart = () => {
    if (!packs.length) return;
    const p = packs[0];
    addToCart({ id: p.id, type: 'pack', title: p.name, unitAmountCents: PACK_DISCOUNT_CENTS, quantity: 1 });
    toast({ title: 'Pack added to cart', description: `${p.name} — ${fmtUSD(PACK_DISCOUNT_CENTS)}` });
  };

  const showLock = isPro && !hasAccess;

  return (
    <Card className="relative overflow-hidden h-full">
      {isPro && !hasAccess && (
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <Badge variant="destructive">PRO</Badge>
          <Badge variant="secondary">SALE</Badge>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
          <span>{category?.name}</span>
          <span>›</span>
          <span>{sub?.name}</span>
        </div>
        <CardTitle className="text-xl leading-tight">{displayTitle}</CardTitle>
        {isPro && !hasAccess && (
          <div className="mt-1 text-xs text-muted-foreground">
            Subscription {fmtUSD(SUB_ORIGINAL_CENTS)} → <span className="text-primary font-medium">{fmtUSD(SUB_DISCOUNT_CENTS)}</span>
            {packs.length > 0 && (
              <> • Pack {fmtUSD(PACK_ORIGINAL_CENTS)} → <span className="text-primary font-medium">{fmtUSD(PACK_DISCOUNT_CENTS)}</span></>
            )}
          </div>
        )}
        <p className="text-sm text-muted-foreground">🤓 {prompt.whatFor}</p>
        <p className="text-sm text-muted-foreground">✅ {prompt.excerpt}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-xs font-medium mb-1">Prompt:</div>
          <div className="relative">
            <pre className={cn("whitespace-pre-wrap bg-muted/50 p-3 rounded-md text-sm transition", showLock && "blur-sm select-none pointer-events-none")}>
              {prompt.prompt}
            </pre>
            {showLock && (
              <div className="absolute inset-0 rounded-md bg-gradient-to-b from-background/60 to-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center p-4 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Lock className="h-4 w-4" /> PRO content locked
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Unlock with Subscription {fmtUSD(SUB_DISCOUNT_CENTS)} {packs.length > 0 && <>or buy the pack {fmtUSD(PACK_DISCOUNT_CENTS)}</>}
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" onClick={handleSubscribeClick}>Subscribe {fmtUSD(SUB_DISCOUNT_CENTS)}</Button>
                    {packs.length > 0 && (
                      <Button size="sm" variant="secondary" onClick={addFirstPackToCart}>Add Pack {fmtUSD(PACK_DISCOUNT_CENTS)}</Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Button
              size="sm"
              variant="hero"
              onClick={() => copy(prompt.prompt, "Prompt")}
            >
              Copy Prompt
            </Button>
            {user ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFavorite}
                      disabled={favLoading}
                      aria-label={isFav ? "Remove from Favourites" : "Add to Favourites"}
                      title={isFav ? "Remove from Favourites" : "Add to Favourites"}
                    >
                      <Heart className={cn("h-5 w-5", isFav ? "fill-current text-primary" : "")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFav ? "Remove from Favourites" : "Add to Favourites"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled aria-label="Add to Favourites" title="Add to Favourites">
                      <Heart className="h-5 w-5 opacity-50" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-col gap-2">
                      <span>Log in to add favourites</span>
                      <div className="flex gap-2">
                        <Link to="/auth"><Button size="sm" variant="secondary">Login</Button></Link>
                        <Link to="/auth"><Button size="sm" variant="outline">Sign up</Button></Link>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {packs.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium">Included in:</div>
            <div className="flex flex-wrap gap-2 text-xs">
              {packs.map((p) => (
                <Badge key={p.id} variant="outline">{p.name}</Badge>
              ))}
              <Link to="/packs"><Button size="sm" variant="link">View packs</Button></Link>
            </div>
          </div>
        )}

        {prompt.tags.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium">Related Prompts:</div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {prompt.tags.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  onClick={() => onTagClick?.(t)}
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer"
                  aria-label={`Filter by ${t}`}
                  title={`Filter by ${t}`}
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};
