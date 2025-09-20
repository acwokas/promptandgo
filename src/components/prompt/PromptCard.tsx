import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Prompt, Category } from "@/data/prompts";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { useLoginWidget } from "@/hooks/useLoginWidget";
import { Heart, Lock, Copy, MessageSquare, Megaphone, ShoppingBag, BarChart2, Briefcase, User, HeartPulse, Clock, Sparkles, Tag, CheckCircle, Star, Wand2, Send, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { addToCart, getCart } from "@/lib/cart";
import ShareButton from "@/components/ShareButton";
import { AI_PROVIDERS, rewritePromptForProvider } from "@/lib/promptRewriter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AiProviderDropdown } from "@/components/ai/AiProviderDropdown";
import { AiResponseModal } from "@/components/ai/AiResponseModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

// Fallback ratings for prompts without user ratings yet
const generateFallbackRating = (promptId: string) => {
  let hash = 0;
  for (let i = 0; i < promptId.length; i++) {
    hash = (hash * 31 + promptId.charCodeAt(i)) >>> 0;
  }
  
  // Generate rating between 3.8 and 5.0, with most being 4.2-4.8
  const base = 3.8;
  const range = 1.2;
  const normalized = (hash % 10000) / 10000;
  
  // Bias toward higher ratings (bell curve effect)
  const skewed = Math.pow(normalized, 0.7);
  const rating = base + (skewed * range);
  
  // Round to one decimal place
  return Math.round(rating * 10) / 10;
  };

// Generate fallback rating count
const generateFallbackRatingCount = (promptId: string) => {
  let hash = 0;
  for (let i = 0; i < promptId.length; i++) {
    hash = (hash * 17 + promptId.charCodeAt(i)) >>> 0;
  }
  // Generate count between 80 and 1000
  return Math.floor(80 + (hash % 920));
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

  // Auth and user state
  const { user } = useSupabaseAuth();
  const { openLoginWidget } = useLoginWidget();

  // Rating state management
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [userRating, setUserRating] = useState<number>(0);
  const [isRatingLoading, setIsRatingLoading] = useState(false);

  // AI Provider state
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showSendDialog, setShowSendDialog] = useState(false);

  // Get the displayed prompt (rewritten or original)
  const displayedPrompt = selectedProvider 
    ? rewritePromptForProvider(prompt.prompt, selectedProvider)
    : prompt.prompt;

  // Get selected provider data
  const selectedProviderData = selectedProvider 
    ? AI_PROVIDERS.find(p => p.id === selectedProvider)
    : null;

  // Handle sending to AI
  const handleSendToAI = async () => {
    if (!selectedProvider) {
      toast({
        title: "No AI provider selected",
        description: "Please select an AI provider first.",
        variant: "destructive"
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(displayedPrompt);
      setShowSendDialog(true);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive"
      });
    }
  };

  const confirmSendToAI = () => {
    if (!selectedProviderData) return;

    // URLs for different AI providers
    const urls: Record<string, string> = {
      chatgpt: 'https://chatgpt.com/',
      claude: 'https://claude.ai/',
      gemini: 'https://gemini.google.com/',
      deepseek: 'https://chat.deepseek.com/',
      groq: 'https://console.groq.com/playground',
      mistral: 'https://chat.mistral.ai/',
      llama: 'https://www.llama2.ai/',
      zenochat: 'https://zenochat.ai/',
      midjourney: 'https://discord.com/channels/@me',
      ideogram: 'https://ideogram.ai/'
    };

    const url = urls[selectedProvider!];
    if (url) {
      // Always show the manual instructions since many networks block AI platforms
      toast({
        title: "Prompt copied to clipboard!",
        description: (
          <div className="space-y-2">
            <p className="text-sm font-medium">Your optimized prompt is ready to use.</p>
            <p className="text-sm">If {selectedProviderData.name} doesn't open automatically, manually visit:</p>
            <p className="text-xs font-mono break-all bg-muted p-2 rounded">{url}</p>
            <p className="text-xs text-muted-foreground">Then paste your prompt there!</p>
          </div>
        ),
        duration: 6000,
      });

      try {
        // Try to open in new tab, but don't rely on it working
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        
        // If the window opened successfully, show a brief success message after a delay
        if (newWindow && !newWindow.closed && typeof newWindow.closed !== 'undefined') {
          setTimeout(() => {
            try {
              if (!newWindow.closed) {
                // Window is still open, likely successful
                console.log(`Successfully opened ${selectedProviderData.name}`);
              }
            } catch (e) {
              // Cross-origin error is expected and indicates the page loaded
              console.log(`${selectedProviderData.name} opened (cross-origin detected)`);
            }
          }, 1500);
        }
      } catch (error) {
        // Silently handle errors - the manual instructions are already shown
        console.warn(`Failed to open ${selectedProviderData.name}:`, error);
      }
    }

    setShowSendDialog(false);
  };

  // Load ratings data
  useEffect(() => {
    let cancelled = false;
    const loadRatings = async () => {
      try {
        // Get overall rating for the prompt
        const { data: ratingData } = await supabase.rpc('get_prompt_rating', { prompt_id_param: prompt.id });
        
        if (!cancelled && ratingData?.[0]) {
          const avgRating = Number(ratingData[0].average_rating) || 0;
          const totalCount = Number(ratingData[0].total_ratings) || 0;
          
          // Use fallback if no ratings yet
          if (totalCount === 0) {
            setAverageRating(generateFallbackRating(prompt.id));
            setTotalRatings(generateFallbackRatingCount(prompt.id));
          } else {
            setAverageRating(avgRating);
            setTotalRatings(totalCount);
          }
        }

        // Get user's rating if logged in
        if (user) {
          const { data: userRatingData } = await supabase
            .from('user_ratings')
            .select('rating')
            .eq('user_id', user.id)
            .eq('prompt_id', prompt.id)
            .maybeSingle();
          
          if (!cancelled) {
            setUserRating(userRatingData?.rating || 0);
          }
        }
      } catch (error) {
        console.error('Error loading ratings:', error);
        if (!cancelled) {
          // Use fallback data on error
          setAverageRating(generateFallbackRating(prompt.id));
          setTotalRatings(generateFallbackRatingCount(prompt.id));
        }
      }
    };

    loadRatings();
    return () => { cancelled = true; };
  }, [user?.id, prompt.id]);

  // Handle star rating click
  const handleStarClick = async (rating: number) => {
    if (!user) {
      openLoginWidget();
      return;
    }

    setIsRatingLoading(true);
    try {
      // Insert or update user rating
      const { error } = await supabase
        .from('user_ratings')
        .upsert({
          user_id: user.id,
          prompt_id: prompt.id,
          rating: rating
        });

      if (error) throw error;

      setUserRating(rating);
      toast({ title: `Rated ${rating} star${rating !== 1 ? 's' : ''}` });

      // Refresh overall rating
      const { data: ratingData } = await supabase.rpc('get_prompt_rating', { prompt_id_param: prompt.id });
      if (ratingData?.[0]) {
        const avgRating = Number(ratingData[0].average_rating) || 0;
        const totalCount = Number(ratingData[0].total_ratings) || 0;
        setAverageRating(avgRating);
        setTotalRatings(totalCount);
      }
    } catch (error) {
      console.error('Error saving rating:', error);
      toast({ title: "Failed to save rating" });
    } finally {
      setIsRatingLoading(false);
    }
  };

  // Interactive star rating component
  const InteractiveStarRating = ({ rating, count, userRating }: { rating: number; count: number; userRating: number }) => {
    const [hoveredStar, setHoveredStar] = useState(0);
    
    return (
      <div className="flex items-center gap-2 mt-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => {
            const starNumber = i + 1;
            const isFilled = starNumber <= (hoveredStar || userRating);
            const isPartOfAverage = !userRating && starNumber <= Math.floor(rating);
            const isHalfStar = !userRating && starNumber === Math.floor(rating) + 1 && rating % 1 >= 0.5;
            
            return (
              <button
                key={starNumber}
                type="button"
                className={cn(
                  "relative transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring rounded-sm",
                  user ? "cursor-pointer" : "cursor-default"
                )}
                onClick={() => user && handleStarClick(starNumber)}
                onMouseEnter={() => user && setHoveredStar(starNumber)}
                onMouseLeave={() => user && setHoveredStar(0)}
                disabled={isRatingLoading}
                aria-label={user ? `Rate ${starNumber} star${starNumber !== 1 ? 's' : ''}` : undefined}
              >
                {isHalfStar ? (
                  <div className="relative">
                    <Star className="h-4 w-4 text-gray-300" />
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                ) : (
                  <Star 
                    className={cn(
                      "h-4 w-4 transition-colors",
                      (isFilled || isPartOfAverage) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300",
                      hoveredStar && starNumber <= hoveredStar && user && "fill-yellow-500 text-yellow-500"
                    )} 
                  />
                )}
              </button>
            );
          })}
        </div>
        <span className="text-sm font-medium text-foreground">{rating || 0}</span>
        <span className="text-xs text-muted-foreground">({count.toLocaleString()})</span>
        {userRating > 0 && (
          <span className="text-xs text-primary font-medium">
            Your rating: {userRating}★
          </span>
        )}
      </div>
    );
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copied` });
    } catch {
      toast({ title: `Failed to copy ${label}` });
    }
  };

  // Additional state management
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const isPro = (prompt as any).isPro || (prompt as any).is_pro || false;
  
  // AI response modal state
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiProvider, setAiProvider] = useState<string>('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedAIPlatform, setSelectedAIPlatform] = useState<string>('original');
  const [rewrittenPrompt, setRewrittenPrompt] = useState<string>('');
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

        // Check subscription with better error handling
        const subRes = await supabase.rpc('get_subscriber_info', { p_user_id: user.id });
        if (subRes.error) {
          console.warn('Failed to check subscription:', subRes.error);
          // If auth error, assume no access but don't crash
          if (!cancelled) setHasAccess(false);
          return;
        }
        if (subRes.data?.[0]?.subscribed) {
          if (!cancelled) setHasAccess(true);
          return;
        }

        // Check direct prompt access
        const pa = await supabase.from('prompt_access').select('user_id').eq('user_id', user.id).eq('prompt_id', prompt.id).maybeSingle();
        if (pa.error) {
          console.warn('Failed to check prompt access:', pa.error);
          if (!cancelled) setHasAccess(false);
          return;
        }
        if (pa.data) {
          if (!cancelled) setHasAccess(true);
          return;
        }

        // Check pack access intersect
        if (packIds.length) {
          const pacc = await supabase.from('pack_access').select('pack_id').eq('user_id', user.id).in('pack_id', packIds);
          if (pacc.error) {
            console.warn('Failed to check pack access:', pacc.error);
            if (!cancelled) setHasAccess(false);
            return;
          }
          if ((pacc.data || []).length > 0) {
            if (!cancelled) setHasAccess(true);
            return;
          }
        }
        if (!cancelled) setHasAccess(false);
      } catch (e) {
        console.error('Access check failed:', e);
        if (!cancelled) setHasAccess(false);
      }
    };
    loadAccessAndPacks();
    return () => { cancelled = true; };
  }, [user?.id, prompt.id]);

  const toggleFavorite = async () => {
    if (!user) {
      console.debug('[favorites] click ignored — no user')
      openLoginWidget();
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
    const exists = getCart().some((i) => i.type === 'membership' && i.id === 'monthly');
    if (exists) {
      toast({ title: 'Already in cart', description: 'Monthly All-Access Membership is already in your cart.' });
      return;
    }
    addToCart({ id: 'monthly', type: 'membership', title: 'Monthly All-Access Membership', unitAmountCents: SUB_DISCOUNT_CENTS, quantity: 1 }, !!user);
    toast({ title: 'Membership added to cart', description: `Monthly All-Access Membership — ${fmtUSD(SUB_DISCOUNT_CENTS)}/mo` });
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
  
  // Handle AI response
  const handleAiResponse = (response: string, provider: string) => {
    setAiResponse(response);
    setAiProvider(provider);
    setIsAiModalOpen(true);
  };

  // Handle AI platform selection
  const handleAIPlatformChange = (platform: string) => {
    setSelectedAIPlatform(platform);
    if (platform === 'original') {
      setRewrittenPrompt('');
      setSelectedProvider(null); // Clear selected provider for original
    } else {
      const rewritten = rewritePromptForProvider(prompt.prompt, platform);
      setRewrittenPrompt(rewritten);
      setSelectedProvider(platform); // Set selected provider for Send button
    }
  };

  // Get the prompt text to display (original or rewritten)
  const displayPrompt = selectedAIPlatform === 'original' ? prompt.prompt : rewrittenPrompt;
  
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
    <>
    <Card className={cn("relative overflow-hidden h-full with-category-accent glass-card transition animate-float-in hover:shadow-glow-strong", accentClass)} style={{ ['--category-accent' as any]: `var(--accent-${accentIndex})` }}>
      <CardHeader>
        <div className="mb-2 flex gap-2 flex-wrap">
          {(prompt as any).ribbon === "RECOMMENDED" && (
            <div className="recommended-ribbon inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              <span>RECOMMENDED</span>
            </div>
          )}
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
         
         {/* Interactive Star Rating */}
         <InteractiveStarRating rating={averageRating} count={totalRatings} userRating={userRating} />
      </CardHeader>
      <CardContent>
        <div>
          <div className="text-xs font-medium mb-1">{prompt.excerpt?.replace(/\.$/, '')}:</div>
          <div className="relative min-h-[320px] sm:min-h-[300px]">
            <pre className={cn("whitespace-pre-wrap prompt-editorial p-4 sm:p-5 rounded-md text-[0.975rem] sm:text-[1.05rem] leading-7 transition shadow-elegant min-h-[320px] sm:min-h-[300px]", showLock && "blur-sm select-none pointer-events-none")}>
              {displayPrompt}
            </pre>
            {showLock && (
              <div className="absolute inset-0 rounded-md glass-overlay flex flex-col items-center justify-center min-h-full p-4">
                <div className="text-center space-y-4 w-full max-w-xs">
                  <div className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full bg-background/40 border border-brand/30">
                    <Lock className="h-4 w-4" aria-hidden />
                    <span>Unlock premium prompt</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-2">
                    <div>
                      One‑time <span className="line-through">{fmtUSD(PROMPT_ORIGINAL_CENTS)}</span> <span className="text-primary font-medium">{fmtUSD(PROMPT_DISCOUNT_CENTS)}</span>
                    </div>
                    <div>
                      Or subscribe <span className="line-through">{fmtUSD(SUB_ORIGINAL_CENTS)}</span> <span className="text-primary font-medium">{fmtUSD(SUB_DISCOUNT_CENTS)}</span> / month
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <Button size="sm" variant="hero" className="w-full text-xs py-2" onClick={addPromptToCart}>Buy Prompt {fmtUSD(PROMPT_DISCOUNT_CENTS)}</Button>
                    <Button size="sm" variant="secondary" className="w-full btn-subtle-stroke text-xs py-2" onClick={handleSubscribeClick}>Subscribe for {fmtUSD(SUB_DISCOUNT_CENTS)}/mo</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {/* AI Platform Selector */}
            <div className="space-y-2">
              <Select value={selectedAIPlatform} onValueChange={handleAIPlatformChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {selectedAIPlatform === 'original' 
                      ? 'Original Prompt' 
                      : `${AI_PROVIDERS.find(p => p.id === selectedAIPlatform)?.icon} ${AI_PROVIDERS.find(p => p.id === selectedAIPlatform)?.name}`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original Prompt</SelectItem>
                  {AI_PROVIDERS.filter(p => p.category === 'text').map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.icon} {provider.name}
                    </SelectItem>
                  ))}
                  {AI_PROVIDERS.filter(p => p.category === 'image').map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.icon} {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              size="sm"
              variant="hero"
              className="w-full"
              disabled={showLock && !onCopyClick && !hasAccess}
              title={showLock && !onCopyClick && !hasAccess ? "Unlock to copy" : undefined}
              onClick={() => { 
                if (onCopyClick) onCopyClick(); 
                else if (!showLock || hasAccess) copy(displayPrompt, "Prompt"); 
              }}
            >
              <Copy className="h-4 w-4" />
              <span>Copy Prompt</span>
            </Button>
            
            {selectedProvider && (
              <Button 
                size="sm"
                onClick={handleSendToAI}
                className="w-full"
              >
                <Send className="h-4 w-4" />
                <span>Send to {selectedProviderData?.name}</span>
              </Button>
            )}
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
                    <Button variant="outline" size="sm" className="w-full btn-subtle-stroke" onClick={openLoginWidget} aria-label="Add to My Prompts" title="Add to My Prompts">
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
            <div className="flex flex-wrap gap-2 relative">
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
              <div className="absolute bottom-0 right-0">
                <ShareButton
                  url={`${window.location.origin}/library?search=${encodeURIComponent(prompt.title)}`}
                  contentType="prompt"
                  contentId={prompt.id}
                  title={`Check out this AI prompt: ${prompt.title}`}
                  variant="ghost"
                  size="sm"
                  showText={false}
                  className="h-6 w-6 p-1 text-muted-foreground hover:text-foreground"
                />
              </div>
            </div>
          </div>
        )}

      </CardContent>
      
      <AiResponseModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        response={aiResponse}
        provider={aiProvider}
        originalPrompt={displayPrompt}
        onRetry={() => {
          setIsAiModalOpen(false);
          // The retry functionality will be handled by the dropdown
        }}
      />
    </Card>

    {/* Send to AI Confirmation Dialog */}
    {showSendDialog && (
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedProviderData?.icon}
              Open {selectedProviderData?.name}?
            </DialogTitle>
            <DialogDescription>
              We'll open {selectedProviderData?.name} in a new tab and your optimized prompt has been copied to your clipboard. You can paste it directly into the chat.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSendToAI}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open {selectedProviderData?.name}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}
    </>
  );
};
