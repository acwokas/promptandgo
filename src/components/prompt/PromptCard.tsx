import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Prompt, Category } from "@/data/prompts";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { useLoginWidget } from "@/hooks/useLoginWidget";
import { Heart, Lock, Copy, MessageSquare, Megaphone, ShoppingBag, BarChart2, Briefcase, User, HeartPulse, Clock, Sparkles, Tag, CheckCircle, Star, Wand2, Send, ExternalLink, Bot, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { addToCart, getCart } from "@/lib/cart";
import { AI_PROVIDERS, rewritePromptForProvider } from "@/lib/promptRewriter";
import { useAIPreferences } from "@/hooks/useAIPreferences";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';
import { AiProviderDropdown } from "@/components/ai/AiProviderDropdown";
import { AiResponseModal } from "@/components/ai/AiResponseModal";

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

// Generate fallback ratings for prompts without user ratings yet
const generateFallbackRating = (promptId: string, categories: Category[], prompt: Prompt) => {
  let hash = 0;
  for (let i = 0; i < promptId.length; i++) {
    hash = (hash * 31 + promptId.charCodeAt(i)) >>> 0;
  }
  
  // Find the category for this prompt
  const category = categories.find((c) => c.id === prompt.categoryId);
  const categoryName = category?.name?.toLowerCase() || '';
  const promptTitle = prompt.title?.toLowerCase() || '';
  const promptWhatFor = prompt.whatFor?.toLowerCase() || '';
  
  // Check if this is a career or marketing related prompt
  const isCareerPrompt = categoryName.includes('career') || 
                        promptTitle.includes('career') || 
                        promptTitle.includes('resume') || 
                        promptTitle.includes('job') ||
                        promptWhatFor.includes('career') ||
                        promptWhatFor.includes('resume') ||
                        promptWhatFor.includes('job');
  
  const isMarketingPrompt = categoryName.includes('marketing') || 
                           categoryName.includes('market') ||
                           promptTitle.includes('marketing') || 
                           promptTitle.includes('market') ||
                           promptWhatFor.includes('marketing') ||
                           promptWhatFor.includes('market');
  
  if (isCareerPrompt || isMarketingPrompt) {
    // For career and marketing prompts: 4.7 to 5.0 range
    const base = 4.7;
    const range = 0.3;
    const normalized = (hash % 10000) / 10000;
    
    // Make 5.0 ratings rare (about 15% chance)
    const perfectRatingThreshold = 0.85;
    if (normalized > perfectRatingThreshold) {
      return 5.0;
    }
    
    // Bias toward higher ratings within 4.7-4.9 range
    const skewed = Math.pow(normalized, 0.5);
    const rating = base + (skewed * (range - 0.1)); // 4.7 to 4.9 range mostly
    
    // Round to one decimal place
    return Math.round(rating * 10) / 10;
  }
  
  // Default rating logic for other prompts
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

// Interactive star rating component
const InteractiveStarRating = ({ rating, count, userRating }: { rating: number; count: number; userRating?: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`h-3.5 w-3.5 ${
              star <= Math.round(rating) 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-muted-foreground/30'
            }`} 
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-foreground">{rating}</span>
      <span className="text-xs text-muted-foreground">({count} reviews)</span>
    </div>
  );
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
  const sub = category?.subcategories?.find((s) => s.id === prompt.subcategoryId);
  
  const { user, loading: authLoading } = useSupabaseAuth();
  const { openLoginWidget } = useLoginWidget();
  const navigate = useNavigate();
  const { getFilteredProviders } = useAIPreferences();
  
  const [selectedAIPlatform, setSelectedAIPlatform] = useState<string>('original');
  const [isFavorited, setIsFavorited] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiProvider, setAiProvider] = useState('');
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [selectedProviderData, setSelectedProviderData] = useState<any>(null);

  const displayTitle = cleanTitle(prompt.title);
  const isPro = (prompt as any).isPro === true || (prompt as any).isPro === "true";
  const hasAccess = user && (!isPro || user.user_metadata?.subscription_status === 'active');
  
  // Get fallback rating data
  const fallbackRating = generateFallbackRating(prompt.id, categories, prompt);
  const fallbackCount = generateFallbackRatingCount(prompt.id);
  
  // Use fallback data as defaults
  const finalRating = averageRating || fallbackRating;
  const finalCount = totalRatings || fallbackCount;

  // Get optimized prompt based on selected platform
  const displayedPrompt = selectedAIPlatform === 'original' 
    ? prompt.prompt 
    : rewritePromptForProvider(prompt.prompt, selectedAIPlatform);

  useEffect(() => {
    if (user) {
      // Check if favorited
      const checkFavorite = async () => {
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('prompt_id', prompt.id)
          .single();
        setIsFavorited(!!data);
      };
      checkFavorite();
    }
  }, [user, prompt.id]);

  const handleAIPlatformChange = (platformId: string) => {
    setSelectedAIPlatform(platformId);
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      openLoginWidget();
      return;
    }

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('prompt_id', prompt.id);
        setIsFavorited(false);
        toast({ title: "Removed from favorites" });
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            prompt_id: prompt.id,
            prompt_text: prompt.prompt,
          });
        setIsFavorited(true);
        toast({ title: "Added to favorites" });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({ title: "Error updating favorites", variant: "destructive" });
    }
  };

  const handleCopyPrompt = () => {
    if (onCopyClick) {
      onCopyClick();
    } else {
      navigator.clipboard.writeText(displayedPrompt);
      toast({ title: "Prompt copied to clipboard" });
    }
  };

  const addPromptToCart = () => {
    addToCart({
      id: prompt.id,
      type: 'prompt',
      title: prompt.title || 'Untitled Prompt',
      unitAmountCents: 149, // $1.49 in cents
      quantity: 1,
    });
    navigate('/cart');
  };

  const handleSubscribeClick = () => {
    navigate('/account');
  };

  const getCategoryIcon = (name?: string) => {
    const n = (name || "").toLowerCase();
    if (/(social|community|chat|conversation)/.test(n)) return <MessageSquare className="h-3.5 w-3.5" />;
    if (/(market|advert|campaign|growth)/.test(n)) return <Megaphone className="h-3.5 w-3.5" />;
    if (/(ecom|shop|store|retail)/.test(n)) return <ShoppingBag className="h-3.5 w-3.5" />;
    if (/(analytic|data|report|insight)/.test(n)) return <BarChart2 className="h-3.5 w-3.5" />;
    if (/(business|automation|ops)/.test(n)) return <Briefcase className="h-3.5 w-3.5" />;
    if (/(career|job|work|resume|cv)/.test(n)) return <User className="h-3.5 w-3.5" />;
    if (/(wellness|health|fitness|mind)/.test(n)) return <HeartPulse className="h-3.5 w-3.5" />;
    if (/(productivity|time|focus|task)/.test(n)) return <Clock className="h-3.5 w-3.5" />;
    if (/(lifestyle|hobby|creative|inspiration)/.test(n)) return <Sparkles className="h-3.5 w-3.5" />;
    return <Tag className="h-3.5 w-3.5" />;
  };

  const getProviderColor = (providerId: string) => {
    const colorMap: Record<string, string> = {
      'chatgpt': 'bg-green-100 text-green-600',
      'claude': 'bg-purple-100 text-purple-600',
      'gemini': 'bg-yellow-100 text-yellow-600',
      'deepseek': 'bg-indigo-100 text-indigo-600',
      'groq': 'bg-red-100 text-red-600',
      'mistral': 'bg-orange-100 text-orange-600',
      'llama': 'bg-pink-100 text-pink-600',
      'perplexity': 'bg-teal-100 text-teal-600',
      'zenochat': 'bg-cyan-100 text-cyan-600',
      'midjourney': 'bg-violet-100 text-violet-600',
      'ideogram': 'bg-emerald-100 text-emerald-600',
      'nanobanana': 'bg-amber-100 text-amber-600'
    };
    return colorMap[providerId] || 'bg-blue-100 text-blue-600';
  };

  const selectedProviderInfo = AI_PROVIDERS.find(p => p.id === selectedAIPlatform);
  const showLock = isPro && !hasAccess;

  return (
    <>
      <Card className="group relative border-border/50 bg-card hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer">
        <CardHeader className="pb-3">
          {/* Top badges and category */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              {getCategoryIcon(sub?.name || category?.name)}
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0 hover:bg-primary/10">
                {sub?.name || category?.name || "Uncategorized"}
              </Badge>
            </div>
            <div className="flex gap-2">
              {!isPro && (
                <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10 border-0 dark:bg-green-900/20 dark:text-green-400">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  FREE
                </Badge>
              )}
              {isPro && !hasAccess && (
                <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/10 border-0 dark:bg-purple-900/20 dark:text-purple-400">
                  <Lock className="h-3 w-3 mr-1" />
                  PRO
                </Badge>
              )}
              {(prompt as any).ribbon === "RECOMMENDED" && (
                <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/10 border-0 dark:bg-amber-900/20 dark:text-amber-400">
                  <Wand2 className="h-3 w-3 mr-1" />
                  RECOMMENDED
                </Badge>
              )}
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold leading-tight text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {displayTitle}
          </h3>
          
          {/* Description */}
          {prompt.whatFor && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
              {prompt.whatFor}
            </p>
          )}
          
          {/* Rating */}
          <div className="mb-4">
            <InteractiveStarRating rating={finalRating} count={finalCount} userRating={userRating} />
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Tags */}
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {prompt.tags.slice(0, 4).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-secondary/80"
                    onClick={() => onTagClick?.(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {prompt.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{prompt.tags.length - 4} more
                  </Badge>
                )}
              </div>
            )}

            {/* Platform selector */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">
                Platform-optimized prompt:
              </p>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between h-auto p-3 bg-background border hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full ${
                        selectedAIPlatform === 'original' 
                          ? 'bg-blue-100 text-blue-600'
                          : getProviderColor(selectedAIPlatform)
                      }`}>
                        {selectedAIPlatform === 'original' 
                          ? <Bot className="h-4 w-4" />
                          : selectedProviderInfo?.icon || <Bot className="h-4 w-4" />
                        }
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">
                          {selectedAIPlatform === 'original' 
                            ? 'Core Prompt'
                            : selectedProviderInfo?.name || 'Select AI Platform'
                          }
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {selectedAIPlatform === 'original' 
                            ? 'Original Version'
                            : selectedProviderInfo?.description || 'Choose your preferred AI platform'
                          }
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  className="w-[280px] bg-background border shadow-lg z-50 p-0"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <ScrollArea className="h-80">
                    <div className="p-1">
                      <DropdownMenuItem
                        className="p-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
                        onClick={() => handleAIPlatformChange('original')}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Core Prompt</div>
                            <div className="text-xs text-muted-foreground">Original Version</div>
                          </div>
                          {selectedAIPlatform === 'original' && (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Text Generation</DropdownMenuLabel>
                      {getFilteredProviders().filter(p => p.category === 'text').sort((a, b) => a.name.localeCompare(b.name)).map((provider) => (
                        <DropdownMenuItem
                          key={provider.id}
                          className="p-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
                          onClick={() => handleAIPlatformChange(provider.id)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className={`p-1.5 rounded-full ${getProviderColor(provider.id)}`}>
                              {provider.icon}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">{provider.name}</div>
                              <div className="text-xs text-muted-foreground">{provider.description}</div>
                            </div>
                            {selectedAIPlatform === provider.id && (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Image Generation</DropdownMenuLabel>
                      {getFilteredProviders().filter(p => p.category === 'image').sort((a, b) => a.name.localeCompare(b.name)).map((provider) => (
                        <DropdownMenuItem
                          key={provider.id}
                          className="p-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
                          onClick={() => handleAIPlatformChange(provider.id)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className={`p-1.5 rounded-full ${getProviderColor(provider.id)}`}>
                              {provider.icon}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">{provider.name}</div>
                              <div className="text-xs text-muted-foreground">{provider.description}</div>
                            </div>
                            {selectedAIPlatform === provider.id && (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Demo explanation */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                ↑ Try selecting different AI platforms to see Scout optimize the same prompt below
              </p>
            </div>

            {/* Optimized prompt display */}
            <div className="bg-muted/30 rounded-lg p-3 border border-border/50 relative">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">Scout Optimized</span>
              </div>
              <div className="text-sm text-foreground leading-relaxed min-h-[200px] whitespace-pre-wrap">
                {displayedPrompt}
              </div>
              
              {showLock && (
                <div className="absolute inset-0 rounded-lg bg-blue-600/85 backdrop-blur-sm flex flex-col items-center justify-center min-h-[200px] p-6">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 text-sm text-white/90">
                      <Lock className="h-4 w-4" />
                      <span>Unlock PRO Prompt</span>
                    </div>
                    <div className="flex flex-col gap-3 w-full max-w-sm">
                      <Button size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0" onClick={addPromptToCart}>
                        Buy Prompt $1.49
                      </Button>
                      <Button size="lg" className="w-full bg-white hover:bg-gray-50 text-gray-900 border-0" onClick={handleSubscribeClick}>
                        Subscribe $4.99/mo
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleCopyPrompt} 
                      className="flex-1"
                      disabled={showLock && !onCopyClick && !hasAccess}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy optimized prompt to clipboard</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleToggleFavorite} 
                      className="flex-shrink-0"
                    >
                      <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isFavorited ? 'Remove from favorites' : 'Add to favorites'}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

               {(!showLock || hasAccess) && (
                <AiProviderDropdown 
                  prompt={displayedPrompt} 
                  optimizedFor={selectedAIPlatform}
                  onResponse={(response, provider) => {
                    setAiResponse(response);
                    setAiProvider(provider);
                    setIsAiModalOpen(true);
                  }} 
                  className="flex-1"
                />
              )}
            </div>

            {/* Category navigation */}
            <div className="pt-4 border-t border-border/50">
              <div className="flex flex-wrap gap-2 text-sm">
                {category && (
                  <button 
                    onClick={() => onCategoryClick?.(category.id)} 
                    className="text-primary hover:underline cursor-pointer font-medium"
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
                    onClick={() => onSubcategoryClick?.(sub.id, category?.id as string)} 
                    className="text-primary hover:underline cursor-pointer font-medium"
                  >
                    <span>{sub.name}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AiResponseModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        response={aiResponse}
        provider={aiProvider}
        originalPrompt={displayedPrompt}
        onRetry={() => {
          setIsAiModalOpen(false);
        }}
      />

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
              <Button onClick={() => setShowSendDialog(false)}>
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