import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Prompt, Category } from "@/data/prompts";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { useLoginWidget } from "@/hooks/useLoginWidget";
import { Heart, Lock, Copy, MessageSquare, Megaphone, ShoppingBag, BarChart2, Briefcase, User, HeartPulse, Clock, Sparkles, Tag, CheckCircle, Star, Wand2, Send, ExternalLink, Bot } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { addToCart, getCart } from "@/lib/cart";
import { AI_PROVIDERS, rewritePromptForProvider } from "@/lib/promptRewriter";
import { useAIPreferences } from "@/hooks/useAIPreferences";
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
  const accentClass = `accent-${accentIndex}`;
  const categoryBgClass = `category-bg-${accentIndex}`;
  const navigate = useNavigate();

  // Auth and user state
  const { user } = useSupabaseAuth();
  const { getFilteredProviders } = useAIPreferences();
  const { openLoginWidget } = useLoginWidget();

  // Rating state management
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [userRating, setUserRating] = useState<number>(0);
  const [isRatingLoading, setIsRatingLoading] = useState(false);

  // AI Provider state
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showSendDialog, setShowSendDialog] = useState(false);
  
  // Daily AI send limits state
  const [dailyAISends, setDailyAISends] = useState({ count: 0, remaining: 5, daily_limit: 5, limit_reached: false });
  const [loadingAILimits, setLoadingAILimits] = useState(false);

  // Anonymous user daily limits (stored in localStorage)
  const getAnonymousLimits = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('anonymous_ai_sends');
    
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        return data;
      }
    }
    
    // Reset for new day or first time
    const newData = { date: today, count: 0, remaining: 5, daily_limit: 5, limit_reached: false };
    localStorage.setItem('anonymous_ai_sends', JSON.stringify(newData));
    return newData;
  };

  const updateAnonymousLimits = () => {
    const current = getAnonymousLimits();
    if (current.count < current.daily_limit) {
      const updated = {
        ...current,
        count: current.count + 1,
        remaining: current.remaining - 1,
        limit_reached: current.count + 1 >= current.daily_limit
      };
      localStorage.setItem('anonymous_ai_sends', JSON.stringify(updated));
      return updated;
    }
    return current;
  };

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

    // Check daily limits (for both authenticated and anonymous users)
    if (dailyAISends.limit_reached) {
      toast({
        title: "Daily limit reached",
        description: `You've used all ${dailyAISends.daily_limit} AI sends for today. Reset at midnight.`,
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

  const confirmSendToAI = async () => {
    if (!selectedProviderData) return;

    // Handle daily limits for both authenticated and anonymous users
    if (user) {
      // Authenticated user - use database tracking
      try {
        const { data, error } = await supabase.rpc('check_and_increment_daily_ai_sends', { p_user_id: user.id });
        if (error) throw error;
        
        const result = data as { success: boolean; remaining: number; limit_reached: boolean; daily_limit: number };
        
        if (!result.success) {
          toast({
            title: "Daily limit reached",
            description: `You've used all ${result.daily_limit} AI sends for today. Reset at midnight.`,
            variant: "destructive"
          });
          setShowSendDialog(false);
          return;
        }
        
        // Update local state
        setDailyAISends({
          count: result.daily_limit - result.remaining,
          remaining: result.remaining,
          daily_limit: result.daily_limit,
          limit_reached: result.limit_reached
        });

        // Add to My Prompts when sending to AI platform
        try {
          await addToFavorites();
        } catch (error) {
          console.error('Error adding to favorites:', error);
        }
      } catch (error) {
        console.error('Error checking AI send limits:', error);
        toast({
          title: "Error",
          description: "Failed to check daily limits. Please try again.",
          variant: "destructive"
        });
        setShowSendDialog(false);
        return;
      }
    } else {
      // Anonymous user - use localStorage tracking
      const updated = updateAnonymousLimits();
      setDailyAISends(updated);
      
      if (updated.limit_reached) {
        toast({
          title: "Daily limit reached",
          description: `You've used all ${updated.daily_limit} AI sends for today. Reset at midnight.`,
          variant: "destructive"
        });
        setShowSendDialog(false);
        return;
      }
    }

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
      try {
        // Try to open automatically first
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          // Popup was blocked, show manual instructions
          toast({
            title: "Popup blocked - Manual steps",
            description: (
              <div className="space-y-3">
                <p className="text-sm font-medium">✅ Your optimized prompt is copied to clipboard</p>
                {user && <p className="text-sm font-medium">✅ Added to My Prompts</p>}
                <div className="space-y-1">
                  <p className="text-sm font-medium">Manual steps:</p>
                  <p className="text-xs">1. Open a new browser tab</p>
                  <p className="text-xs">2. Go to: <span className="font-mono bg-muted px-1 rounded">{url}</span></p>
                  <p className="text-xs">3. Paste your prompt and hit enter</p>
                </div>
              </div>
            ),
            duration: 8000,
          });
        } else {
          // Window opened successfully
          const successMessage = user 
            ? `${selectedProviderData.name} opened in new tab. Your optimized prompt has been copied to clipboard and added to My Prompts.`
            : `${selectedProviderData.name} opened in new tab. Your optimized prompt has been copied to clipboard.`;
            
          toast({
            title: `Opened ${selectedProviderData.name}`,
            description: successMessage,
            duration: 4000,
          });
          
          // Check after delay if window is still open (might be blocked at network level)
          setTimeout(() => {
            try {
              if (newWindow.closed) {
                toast({
                  title: "Site may be blocked",
                  description: (
                    <div className="space-y-2">
                      <p className="text-sm">If {selectedProviderData.name} didn't load, it may be blocked by your network.</p>
                      <p className="text-xs">Manually visit: <span className="font-mono bg-muted px-1 rounded">{url}</span></p>
                      <p className="text-xs">Your prompt is copied to clipboard!</p>
                      {user && <p className="text-xs">Added to My Prompts!</p>}
                    </div>
                  ),
                  duration: 6000,
                });
              }
            } catch (e) {
              // Cross-origin access blocked is actually a good sign - means the page loaded
              console.log(`${selectedProviderData.name} loaded successfully (cross-origin detected)`);
            }
          }, 1000);
        }
      } catch (error) {
        // Failed to open, show manual instructions
        toast({
          title: "Unable to open automatically",
          description: (
            <div className="space-y-3">
              <p className="text-sm font-medium">✅ Your optimized prompt is copied to clipboard</p>
              {user && <p className="text-sm font-medium">✅ Added to My Prompts</p>}
              <div className="space-y-1">
                <p className="text-sm font-medium">Manual steps:</p>
                <p className="text-xs">1. Open a new browser tab</p>
                <p className="text-xs">2. Go to: <span className="font-mono bg-muted px-1 rounded">{url}</span></p>
                <p className="text-xs">3. Paste your prompt and hit enter</p>
              </div>
            </div>
          ),
          duration: 8000,
        });
      }
    }

    setShowSendDialog(false);
  };

  // Add to favorites helper function
  const addToFavorites = async () => {
    if (!user || isFav) return;
    
    try {
      setFavLoading(true);
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        prompt_id: prompt.id,
      });
      if (error && !error.message?.includes("duplicate")) throw error;
      setIsFav(true);
    } finally {
      setFavLoading(false);
    }
  };

  // Handle refining prompt with Scout
  const handleRefineWithScout = async () => {
    try {
      await navigator.clipboard.writeText(displayPrompt);
      navigate('/scout', { state: { initialPrompt: displayPrompt } });
      toast({
        title: "Redirected to Scout Assistant",
        description: "Your prompt has been copied and sent to Scout for refinement.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive"
      });
    }
  };

  // Load daily AI send limits for all users (authenticated and anonymous)
  useEffect(() => {
    const loadDailyLimits = async () => {
      if (user) {
        // Authenticated user - load from database
        try {
          setLoadingAILimits(true);
          const { data, error } = await supabase.rpc('get_daily_ai_sends_count', { p_user_id: user.id });
          if (error) throw error;
          
          const result = data as { count: number; remaining: number; daily_limit: number; limit_reached: boolean };
          
          setDailyAISends({
            count: result.count,
            remaining: result.remaining,
            daily_limit: result.daily_limit,
            limit_reached: result.limit_reached
          });
        } catch (error) {
          console.error('Error loading daily AI limits:', error);
          // Fallback to default limits on error
          setDailyAISends({ count: 0, remaining: 5, daily_limit: 5, limit_reached: false });
        } finally {
          setLoadingAILimits(false);
        }
      } else {
        // Anonymous user - load from localStorage
        const limits = getAnonymousLimits();
        setDailyAISends(limits);
        setLoadingAILimits(false);
      }
    };

    loadDailyLimits();
  }, [user?.id]);

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

  // Use displayedPrompt for consistency and to ensure optimization is applied
  const displayPrompt = displayedPrompt;
  
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
    <Card className={cn("relative overflow-hidden h-full transition animate-float-in hover:shadow-glow-strong border", categoryBgClass)}>
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
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {category && (
            <button
              type="button"
              className="text-blue-500 hover:text-blue-600 hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
              onClick={() => onCategoryClick?.(category.id)}
              aria-label={`Filter by category ${category.name}`}
              title={`Filter by ${category.name}`}
            >
              <span className="inline-flex items-center gap-1.5">
                {getCategoryIcon(category.name)}
                <span>{category.name}</span>
              </span>
            </button>
          )}
          {category && sub && <span className="text-muted-foreground">›</span>}
          {sub && (
            <button
              type="button"
              className="text-blue-500 hover:text-blue-600 hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
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
        <CardTitle className="text-xl leading-tight text-foreground">{displayTitle}</CardTitle>
        
         <p className="text-sm text-muted-foreground">{prompt.whatFor}</p>
         
         {/* Interactive Star Rating */}
         <InteractiveStarRating rating={averageRating} count={totalRatings} userRating={userRating} />
      </CardHeader>
      <CardContent>
        <div>
          <div className="text-xs font-medium mb-1 text-foreground">Core prompt: {prompt.excerpt?.replace(/\.$/, "").toLowerCase()}:</div>
          <div className="relative min-h-[320px] sm:min-h-[300px]">
            <pre className={cn("whitespace-pre-wrap text-foreground bg-background/60 p-4 sm:p-5 rounded-md text-sm leading-6 transition shadow-sm min-h-[320px] sm:min-h-[300px] font-sans", showLock && "blur-sm select-none pointer-events-none")}>
              {displayPrompt}
            </pre>
            {showLock && (
              <div className="absolute inset-0 rounded-md bg-blue-50/90 border border-blue-200/50 flex flex-col items-center justify-center min-h-full p-6">
                <div className="text-center space-y-4 w-full max-w-sm">
                  <div className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-white border border-gray-200 text-foreground">
                    <Lock className="h-4 w-4" aria-hidden />
                    <span>Unlock premium prompt</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="text-muted-foreground">
                      One‑time <span className="line-through">{fmtUSD(PROMPT_ORIGINAL_CENTS)}</span> <span className="text-blue-600 font-medium">{fmtUSD(PROMPT_DISCOUNT_CENTS)}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Or subscribe <span className="line-through">{fmtUSD(SUB_ORIGINAL_CENTS)}</span> <span className="text-blue-600 font-medium">{fmtUSD(SUB_DISCOUNT_CENTS)}</span> / month
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Button size="default" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3" onClick={addPromptToCart}>Buy Prompt {fmtUSD(PROMPT_DISCOUNT_CENTS)}</Button>
                    <Button size="default" variant="outline" className="w-full py-3 border-gray-300 text-foreground hover:bg-gray-50" onClick={handleSubscribeClick}>Subscribe for {fmtUSD(SUB_DISCOUNT_CENTS)}/mo</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {/* AI Platform Selector - Clean Design */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900 sm:text-base">Choose your favorite AI platform:</label>
              
              {/* Clean Dropdown Trigger */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/80 rounded-2xl p-3 sm:p-4">
                <Select value={selectedAIPlatform} onValueChange={handleAIPlatformChange}>
                  <SelectTrigger className="w-full bg-white/90 border-2 border-blue-200/60 rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-left shadow-sm hover:shadow-md transition-all">
                    <SelectValue>
                      <div className="flex items-center gap-2 sm:gap-3">
                        {selectedAIPlatform === 'original' 
                          ? '📄 Core Prompt'
                          : `${AI_PROVIDERS.find(p => p.id === selectedAIPlatform)?.icon} ${AI_PROVIDERS.find(p => p.id === selectedAIPlatform)?.name}`}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border-2 border-blue-200/80 rounded-2xl shadow-xl p-2 z-50">
                    <SelectItem value="original" className={`rounded-xl p-3 sm:p-4 my-1 ${selectedAIPlatform === 'original' ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'}`}>
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-base sm:text-lg">📄</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 text-sm sm:text-base">Core Prompt</div>
                          <div className="text-gray-500 text-xs sm:text-sm">Original Version</div>
                        </div>
                        {selectedAIPlatform === 'original' && (
                          <div className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold">
                            SELECTED
                          </div>
                        )}
                      </div>
                    </SelectItem>
                    {getFilteredProviders().filter(p => p.category === 'text').map((provider) => (
                      <SelectItem key={provider.id} value={provider.id} className={`rounded-xl p-3 sm:p-4 my-1 ${selectedAIPlatform === provider.id ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'}`}>
                        <div className="flex items-center gap-3 w-full">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                            provider.id === 'chatgpt' ? 'bg-green-100' :
                            provider.id === 'claude' ? 'bg-pink-100' :
                            provider.id === 'gemini' ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <span className="text-base sm:text-lg">{provider.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 text-sm sm:text-base">{provider.name}</div>
                            <div className="text-gray-500 text-xs sm:text-sm">
                              {provider.id === 'chatgpt' ? 'OpenAI - Most Popular' :
                               provider.id === 'claude' ? 'Anthropic - Great for Analysis' :
                               provider.id === 'gemini' ? 'Google - Multimodal' :
                               provider.description || 'AI Assistant'}
                            </div>
                          </div>
                          {selectedAIPlatform === provider.id && (
                            <div className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold">
                              SELECTED
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                    {getFilteredProviders().filter(p => p.category === 'image').map((provider) => (
                      <SelectItem key={provider.id} value={provider.id} className={`rounded-xl p-3 sm:p-4 my-1 ${selectedAIPlatform === provider.id ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'}`}>
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-base sm:text-lg">{provider.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 text-sm sm:text-base">{provider.name}</div>
                            <div className="text-gray-500 text-xs sm:text-sm">
                              {provider.id === 'midjourney' ? 'Image Generation' :
                               provider.id === 'dalle' ? 'OpenAI - Image Creation' :
                               provider.description || 'Image Generation'}
                            </div>
                          </div>
                          {selectedAIPlatform === provider.id && (
                            <div className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold">
                              SELECTED
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Send to AI Platform - Second */}
            {selectedProvider && (
              <div className="space-y-2">
                <Button 
                  size="sm"
                  variant="hero"
                  onClick={handleSendToAI}
                  className="w-full"
                  disabled={(showLock && !onCopyClick && !hasAccess) || dailyAISends.limit_reached || loadingAILimits}
                  title={
                    dailyAISends.limit_reached 
                      ? "Daily limit reached (resets at midnight)" 
                      : (showLock && !onCopyClick && !hasAccess ? "Unlock to send" : undefined)
                  }
                >
                  <Send className="h-4 w-4" />
                  <span>Send to {selectedProviderData?.name}</span>
                </Button>
                <div className="text-xs text-center text-muted-foreground">
                  {loadingAILimits ? (
                    "Loading limits..."
                  ) : (
                    `${dailyAISends.remaining || 0}/${dailyAISends.daily_limit} sends remaining today`
                  )}
                </div>
              </div>
            )}
            
            {/* Copy Prompt - Third */}
            <Button
              size="sm"
              variant="outline"
              className="w-full btn-subtle-stroke"
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
            
            {/* Refine with Scout - Fourth */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefineWithScout}
              className="w-full btn-subtle-stroke"
              disabled={showLock && !onCopyClick && !hasAccess}
              title={showLock && !onCopyClick && !hasAccess ? "Unlock to refine" : "Refine this prompt with Scout Assistant"}
            >
              <Bot className="h-4 w-4" />
              <span>Refine prompt with Scout</span>
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
                    <div className="w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="w-full btn-subtle-stroke opacity-50"
                      >
                        <Heart className="h-5 w-5" />
                        <span>Add to My Prompts</span>
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover border shadow-lg p-3 max-w-xs">
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Sign up for free to unlock this feature</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={openLoginWidget}
                          className="flex-1"
                        >
                          Sign Up
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={openLoginWidget}
                          className="flex-1"
                        >
                          Login
                        </Button>
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
            <div className="text-xs font-medium text-foreground">Included in:</div>
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
            <div className="text-xs font-medium text-foreground">Related Prompts:</div>
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
