import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Prompt, Category } from "@/data/prompts";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Lock, Copy, MessageSquare, Megaphone, ShoppingBag, BarChart2, Briefcase, User, HeartPulse, Clock, Sparkles, Tag, CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { addToCart, getCart } from "@/lib/cart";
import ShareButton from "@/components/ShareButton";

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

// Map a category/subcategory name to a stable accent index (1..6)
const categoryAccentIndex = (name?: string) => {
  const s = name || "misc";
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 6) + 1;
};

interface PromptCardProps {
  prompt: Prompt;
  categories: Category[];
  onTagClick?: (tag: string) => void;
  onCategoryClick?: (categoryId: string) => void;
  onSubcategoryClick?: (subcategoryId: string, categoryId: string) => void;
  onViewAllPro?: () => void;
  onCopyClick?: () => void;
}

export const PromptCard = ({ prompt, categories, onTagClick, onCategoryClick, onSubcategoryClick, onViewAllPro, onCopyClick }: PromptCardProps) => {
  const category = categories.find((c) => c.id === prompt.categoryId);
  const sub = category?.subcategories.find((s) => s.id === prompt.subcategoryId);
  const displayTitle = cleanTitle(prompt.title);
  const seed = category?.id || (prompt as any).categoryId || category?.name || displayTitle;
  const accentIndex = categoryAccentIndex(String(seed));
  const accentClass = `category-accent-${accentIndex}`;
  const navigate = useNavigate();

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
  const PROMPT_ORIGINAL_CENTS = 199;
  const PROMPT_DISCOUNT_CENTS = 96;
  const SUB_ORIGINAL_CENTS = 2499;
  const SUB_DISCOUNT_CENTS = 1299;
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
        const subRes = await supabase.rpc('get_subscriber_info', { p_user_id: user.id });
        if (subRes.data?.[0]?.subscribed) {
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
    if (!user) {
      console.debug('[favorites] click ignored — no user')
      toast({ title: "Please log in to save prompts" })
      return;
    }
    setFavLoading(true);
    console.debug('[favorites] toggling', { userId: user.id, promptId: prompt.id, isFav })
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
        console.debug('[favorites] removed', { promptId: prompt.id })
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, prompt_id: prompt.id });
        if (error) {
          const code = (error as any).code || (error as any).details;
          if (code === "23505" || String((error as any).message || "").toLowerCase().includes("duplicate")) {
            setIsFav(true);
            toast({ title: "Already in favourites" });
            console.debug('[favorites] already favorited (unique constraint)', { promptId: prompt.id })
          } else {
            throw error;
          }
        } else {
          setIsFav(true);
          toast({ title: "Added to favourites" });
          console.debug('[favorites] added', { promptId: prompt.id })
        }
      }
    } catch (e) {
      console.error(e);
      console.error('[favorites] failed to toggle', e);
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
    const exists = getCart().some((i) => i.type === 'subscription' && i.id === 'monthly');
    if (exists) {
      toast({ title: 'Already in cart', description: 'Monthly All-Access Subscription is already in your cart.' });
      return;
    }
    addToCart({ id: 'monthly', type: 'subscription', title: 'Monthly All-Access Subscription', unitAmountCents: SUB_DISCOUNT_CENTS, quantity: 1 }, !!user);
    toast({ title: 'Subscription added to cart', description: `Monthly All-Access Subscription — ${fmtUSD(SUB_DISCOUNT_CENTS)}/mo` });
  };

  const addFirstPackToCart = () => {
    if (!packs.length) return;
    const p = packs[0];
    addToCart({ id: p.id, type: 'pack', title: p.name, unitAmountCents: PACK_DISCOUNT_CENTS, quantity: 1 }, !!user);
    toast({ title: 'Pack added to cart', description: `${p.name} — ${fmtUSD(PACK_DISCOUNT_CENTS)}` });
  };

  const addPromptToCart = () => {
    if (hasAccess) {
      toast({ title: 'Prompt already purchased!' });
      return;
    }
    const already = getCart().some((i) => i.type === 'prompt' && i.id === prompt.id);
    if (already) {
      toast({ title: 'Already added to cart' });
      return;
    }
    addToCart({ id: prompt.id, type: 'prompt', title: displayTitle, unitAmountCents: PROMPT_DISCOUNT_CENTS, quantity: 1 }, !!user);
    toast({ title: 'Prompt added to cart', description: `${displayTitle} — ${fmtUSD(PROMPT_DISCOUNT_CENTS)}` });
  };
  const showLock = isPro && !hasAccess;
  const hasRibbon = (isPro && !hasAccess) || (!isPro);

  const getCategoryIcon = (name?: string) => {
    const n = (name || "").toLowerCase();
    if (/(social|community|chat|conversation)/.test(n)) return <MessageSquare className="h-3.5 w-3.5" aria-hidden />;
    if (/(market|advert|campaign|growth)/.test(n)) return <Megaphone className="h-3.5 w-3.5" aria-hidden />;
    if (/(ecom|shop|store|retail)/.test(n)) return <ShoppingBag className="h-3.5 w-3.5" aria-hidden />;
    if (/(analytic|data|report|insight)/.test(n)) return <BarChart2 className="h-3.5 w-3.5" aria-hidden />;
    if (/(business|automation|ops)/.test(n)) return <Briefcase className="h-3.5 w-3.5" aria-hidden />;
    if (/(career|job|work|resume|cv)/.test(n)) return <User className="h-3.5 w-3.5" aria-hidden />;
    if (/(wellness|health|fitness|mind)/.test(n)) return <HeartPulse className="h-3.5 w-3.5" aria-hidden />;
    if (/(productivity|time|focus|task)/.test(n)) return <Clock className="h-3.5 w-3.5" aria-hidden />;
    if (/(lifestyle|hobby|creative|inspiration)/.test(n)) return <Sparkles className="h-3.5 w-3.5" aria-hidden />;
    return <Tag className="h-3.5 w-3.5" aria-hidden />;
  };

  return (
    <Card className={cn("relative overflow-hidden h-full with-category-accent glass-card transition animate-float-in hover:shadow-glow-strong", accentClass)} style={{ ['--category-accent' as any]: `var(--accent-${accentIndex})` }}>
      <CardHeader>
        <div className="mb-2">
          {isPro && !hasAccess && (
            <div className="pro-ribbon inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              <span>PRO</span>
            </div>
          )}
          {!isPro && (
            <div className="free-ribbon inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold">
              <CheckCircle className="h-3.5 w-3.5" aria-hidden />
              <span>FREE</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
          {category && (
            <button
              type="button"
              className="text-primary hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
              onClick={() => onCategoryClick?.(category.id)}
              aria-label={`Filter by category ${category.name}`}
              title={`Filter by ${category.name}`}
            >
              <span className={cn("inline-flex items-center gap-1.5", accentClass)}>
                {getCategoryIcon(category.name)}
                <span>{category.name}</span>
              </span>
            </button>
          )}
          {category && sub && <span>›</span>}
          {sub && (
            <button
              type="button"
              className="text-primary hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
              onClick={() => onSubcategoryClick?.(sub.id, category?.id as string)}
              aria-label={`Filter by subcategory ${sub.name}`}
              title={`Filter by ${sub.name}`}
            >
              <span className="inline-flex items-center gap-1.5">
                <span>{sub.name}</span>
              </span>
            </button>
          )}
        </div>
        <CardTitle className="text-xl leading-tight">{displayTitle}</CardTitle>
        
         <p className="text-sm text-muted-foreground">{prompt.whatFor}</p>
      </CardHeader>
      <CardContent>
        <div>
          <div className="text-xs font-medium mb-1">{prompt.excerpt?.replace(/\.$/, '')}:</div>
          <div className="relative">
            <pre className={cn("whitespace-pre-wrap prompt-editorial p-4 sm:p-5 rounded-md text-[0.975rem] sm:text-[1.05rem] leading-7 transition shadow-elegant", showLock && "blur-sm select-none pointer-events-none")}> 
              {prompt.prompt}
            </pre>
            {showLock && (
              <div className="absolute inset-0 rounded-md glass-overlay flex items-center justify-center">
                <div className="text-center p-5 space-y-4 max-w-[520px]">
                  <div className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full bg-background/40 border border-brand/30">
                    <Lock className="h-4 w-4" aria-hidden />
                    <span>Unlock premium prompt</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>
                      One‑time <span className="line-through">{fmtUSD(PROMPT_ORIGINAL_CENTS)}</span> <span className="text-primary font-medium">{fmtUSD(PROMPT_DISCOUNT_CENTS)}</span>
                    </div>
                    <div>
                      Or subscribe <span className="line-through">{fmtUSD(SUB_ORIGINAL_CENTS)}</span> <span className="text-primary font-medium">{fmtUSD(SUB_DISCOUNT_CENTS)}</span> / month
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 justify-center items-stretch">
                    <Button size="sm" variant="hero" className="w-full" onClick={addPromptToCart}>Buy Prompt {fmtUSD(PROMPT_DISCOUNT_CENTS)}</Button>
                    <Button size="sm" variant="secondary" className="w-full btn-subtle-stroke" onClick={handleSubscribeClick}>Subscribe for {fmtUSD(SUB_DISCOUNT_CENTS)}/mo</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              size="sm"
              variant="hero"
              className="w-full"
              disabled={showLock && !onCopyClick && !hasAccess}
              title={showLock && !onCopyClick && !hasAccess ? "Unlock to copy" : undefined}
              onClick={() => { if (onCopyClick) onCopyClick(); else if (!showLock || hasAccess) copy(prompt.prompt, "Prompt"); }}
            >
              <Copy className="h-4 w-4" />
              <span>Copy Prompt</span>
            </Button>
            {user ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full btn-subtle-stroke"
                      onClick={toggleFavorite}
                      disabled={favLoading}
                      aria-label={isFav ? "Remove from My Prompts" : "Add to My Prompts"}
                      title={isFav ? "Remove from My Prompts" : "Add to My Prompts"}
                    >
                      <Heart className={cn("h-5 w-5", isFav ? "fill-current text-primary" : "")} />
                      <span>{isFav ? "Remove from My Prompts" : "Add to My Prompts"}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFav ? "Remove from My Prompts" : "Add to My Prompts"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full btn-subtle-stroke" onClick={() => navigate('/auth')} aria-label="Add to My Prompts" title="Add to My Prompts">
                      <Heart className="h-5 w-5" />
                      <span>Add to My Prompts</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-col gap-2">
                      <span>Log in to add to My Prompts</span>
                      <div className="flex gap-2">
                        <Link to="/auth"><Button size="sm" variant="secondary">Login</Button></Link>
                        <Link to="/auth"><Button size="sm" variant="outline">Sign up</Button></Link>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <ShareButton
              url={`${window.location.origin}/library?search=${encodeURIComponent(prompt.title)}`}
              contentType="prompt"
              contentId={prompt.id}
              title={`Check out this AI prompt: ${prompt.title}`}
              variant="outline"
              size="sm"
              showText={true}
            />
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
            <div>
              <Link to={`/packs?highlight=${packs[0].id}`}>
                <Button size="sm" variant="hero" className="w-full">Included in Power Pack. Open Now.</Button>
              </Link>
            </div>
          </div>
        )}



        {prompt.tags.length > 0 && (
          <div className="space-y-2 mt-6">
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
