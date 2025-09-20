import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Copy, Plus, Loader2, History, ExternalLink, Bot, ArrowRight, Send, Heart, Sparkles } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useLoginWidget } from "@/hooks/useLoginWidget";
import { useAIUsage } from "@/hooks/useAIUsage";
import UsageDisplay from "@/components/ai/UsageDisplay";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { AI_PERSONA } from "@/lib/aiPersona";
import { AiProviderDropdown } from "@/components/ai/AiProviderDropdown";
import { AiResponseModal } from "@/components/ai/AiResponseModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AI_PROVIDERS, rewritePromptForProvider } from "@/lib/promptRewriter";
import { useAIPreferences } from "@/hooks/useAIPreferences";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RecentPrompt {
  id: string;
  title: string;
  prompt: string;
  created_at: string;
}

const AIPromptGenerator = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [description, setDescription] = useState("");
  const [context, setContext] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentPrompts, setRecentPrompts] = useState<RecentPrompt[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  
  // AI platform selection state for the results
  const [selectedAIPlatform, setSelectedAIPlatform] = useState<string>('original');
  const [rewrittenPrompt, setRewrittenPrompt] = useState<string>('');
  
  // Daily AI send limits state (matching prompt card implementation)
  const [dailyAISends, setDailyAISends] = useState({ count: 0, remaining: 5, daily_limit: 5, limit_reached: false });
  const [loadingAILimits, setLoadingAILimits] = useState(false);
  
  // Favorites state
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  
  // AI response modal state
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiProvider, setAiProvider] = useState<string>('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  const { getFilteredProviders } = useAIPreferences();
  const { openLoginWidget } = useLoginWidget();
  const { refreshUsage } = useAIUsage();

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

  // Get the displayed prompt (original or rewritten)
  const displayPrompt = selectedAIPlatform === 'original' ? generatedPrompt : rewrittenPrompt;
  
  // Get selected provider data
  const selectedProvider = selectedAIPlatform !== 'original' ? selectedAIPlatform : null;
  const selectedProviderData = selectedProvider 
    ? AI_PROVIDERS.find(p => p.id === selectedProvider)
    : null;

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

  // Load prompt and result from URL parameters or navigation state if provided
  useEffect(() => {
    const promptFromUrl = searchParams.get('prompt');
    const resultFromUrl = searchParams.get('result');
    const state = location.state as { initialPrompt?: string } | null;
    const initialPromptFromState = state?.initialPrompt;

    if (initialPromptFromState) {
      // If we have an initial prompt from navigation state (from "Refine with Scout"), 
      // set it as the description input to refine
      setDescription(initialPromptFromState);
      
      // Clear the state to prevent it from being applied again on re-renders
      if (location.state) {
        window.history.replaceState({}, document.title);
      }
    } else if (promptFromUrl) {
      setDescription(promptFromUrl);
    }
    
    if (resultFromUrl) {
      setGeneratedPrompt(resultFromUrl);
    }
  }, [searchParams, location.state]);

  // Load recent prompts when user is available
  useEffect(() => {
    if (user) {
      loadRecentPrompts();
    }
  }, [user]);

  // Handle AI platform selection
  const handleAIPlatformChange = (platform: string) => {
    setSelectedAIPlatform(platform);
    if (platform === 'original') {
      setRewrittenPrompt('');
    } else {
      const rewritten = rewritePromptForProvider(generatedPrompt, platform);
      setRewrittenPrompt(rewritten);
    }
  };

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
      await navigator.clipboard.writeText(displayPrompt);
      await confirmSendToAI();
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
          return;
        }
        
        // Update local state
        setDailyAISends({
          count: result.daily_limit - result.remaining,
          remaining: result.remaining,
          daily_limit: result.daily_limit,
          limit_reached: result.limit_reached
        });
      } catch (error) {
        console.error('Error checking AI send limits:', error);
        toast({
          title: "Error",
          description: "Failed to check daily limits. Please try again.",
          variant: "destructive"
        });
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
          const successMessage = `${selectedProviderData.name} opened in new tab. Your optimized prompt has been copied to clipboard.`;
            
          toast({
            title: `Opened ${selectedProviderData.name}`,
            description: successMessage,
            duration: 4000,
          });
        }
      } catch (error) {
        // Failed to open, show manual instructions
        toast({
          title: "Unable to open automatically",
          description: (
            <div className="space-y-3">
              <p className="text-sm font-medium">✅ Your optimized prompt is copied to clipboard</p>
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
  };

  const loadRecentPrompts = async () => {
    if (!user) return;
    
    setLoadingRecent(true);
    try {
      const { data, error } = await supabase
        .from('user_generated_prompts')
        .select('id, title, prompt, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentPrompts(data || []);
    } catch (error) {
      console.error('Error loading recent prompts:', error);
    } finally {
      setLoadingRecent(false);
    }
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please describe what you want the AI prompt to do.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-prompt-assistant', {
        body: {
          type: 'generate_prompt',
          prompt: description,
          context: context || undefined
        }
      });

      if (error) {
        // Handle usage limit exceeded
        if (error.message?.includes('usage limit')) {
          toast({
            title: "Usage limit reached",
            description: error.message,
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      if (data?.result) {
        const cleanResponse = data.result.replace(/^```[\s\S]*?\n|```$/g, '').trim();
        setGeneratedPrompt(cleanResponse);
        refreshUsage();
      } else {
        throw new Error('No response received');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedPrompt) {
      toast({
        title: "No prompt to copy",
        description: "Generate a prompt first.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Use displayPrompt to get the correct prompt (original or rewritten)
      const promptToCopy = displayPrompt || generatedPrompt;
      const cleanPrompt = promptToCopy.replace(/^"(.*)"$/, '$1');
      await navigator.clipboard.writeText(cleanPrompt);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleAddToMyPrompts = async () => {
    if (!user) {
      openLoginWidget();
      return;
    }
    
    if (!generatedPrompt.trim()) {
      toast({
        title: "No prompt to save",
        description: "Generate a prompt first before adding to My Prompts.",
        variant: "destructive"
      });
      return;
    }

    try {
      setFavLoading(true);
      
      // Save to user_generated_prompts table
      const { error } = await supabase
        .from('user_generated_prompts')
        .insert({
          user_id: user.id,
          title: description.slice(0, 100) || 'Scout Generated Prompt',
          prompt: generatedPrompt,
          description: description || null,
        });

      if (error) throw error;
      
      setIsFav(true);
      toast({
        title: "Added to My Prompts",
        description: "Your prompt has been saved successfully.",
      });
      
      // Refresh recent prompts
      loadRecentPrompts();
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast({
        title: "Failed to save",
        description: "Could not add prompt to My Prompts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setFavLoading(false);
    }
  };

  const handleCopyRecentPrompt = async (prompt: string) => {
    try {
      // Remove surrounding quotes if present
      const cleanPrompt = prompt.replace(/^"(.*)"$/, '$1');
      await navigator.clipboard.writeText(cleanPrompt);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive"
      });
    }
  };

  // Handle AI response
  const handleAiResponse = (response: string, provider: string) => {
    setAiResponse(response);
    setAiProvider(provider);
    setIsAiModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          {AI_PERSONA.ui.generatorTitle}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {AI_PERSONA.ui.generatorSubtitle}
        </p>
      </div>

      {/* Usage Display for logged-in users */}
      {user && (
        <UsageDisplay usageType="generator" compact />
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Generate or Refine Your Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                What do you want the AI to do? *
                <span className="text-xs text-muted-foreground ml-2">(Tell Scout what you need)</span>
              </label>
              <Textarea
                className="min-h-[120px]"
                placeholder={AI_PERSONA.ui.placeholderText}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Additional Context
                <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
              </label>
              <Input
                placeholder={AI_PERSONA.ui.contextPlaceholder}
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {AI_PERSONA.ui.generatingButton}
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  {AI_PERSONA.ui.generateButton}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Scout's Refined Prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedPrompt ? (
              <div className="space-y-4">
                {/* Prompt Display */}
                <div className="p-4 bg-muted rounded-lg border min-h-[200px]">
                  <pre className="whitespace-pre-wrap text-sm">
                    {displayPrompt}
                  </pre>
                </div>

                {/* AI Platform Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Look for this dropdown in the prompt cards 'Choose your AI platform'</label>
                  <Select value={selectedAIPlatform} onValueChange={handleAIPlatformChange}>
                    <SelectTrigger className="w-full bg-background border shadow-sm">
                      <SelectValue>
                        {selectedAIPlatform === 'original' 
                          ? 'Core Prompt' 
                          : `${AI_PROVIDERS.find(p => p.id === selectedAIPlatform)?.icon} ${AI_PROVIDERS.find(p => p.id === selectedAIPlatform)?.name}`}
                      </SelectValue>
                    </SelectTrigger>
                     <SelectContent className="bg-background border shadow-lg z-50">
                       <SelectItem value="original">Core Prompt</SelectItem>
                       {getFilteredProviders().filter(p => p.category === 'text').map((provider) => (
                         <SelectItem key={provider.id} value={provider.id}>
                           {provider.icon} {provider.name}
                         </SelectItem>
                       ))}
                       {getFilteredProviders().filter(p => p.category === 'image').map((provider) => (
                         <SelectItem key={provider.id} value={provider.id}>
                           {provider.icon} {provider.name}
                         </SelectItem>
                       ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-2">
                  {/* Send to AI Platform */}
                  {selectedProvider && (
                    <div className="space-y-2">
                      <Button 
                        size="sm"
                        variant="default"
                        onClick={handleSendToAI}
                        className="w-full"
                        disabled={dailyAISends.limit_reached || loadingAILimits}
                        title={dailyAISends.limit_reached ? "Daily limit reached (resets at midnight)" : undefined}
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
                  
                  {/* Copy Prompt */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy Prompt</span>
                  </Button>
                  
                  {/* Add to My Prompts - Fourth */}
                  {user ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleAddToMyPrompts}
                      disabled={favLoading}
                      title={isFav ? "Remove from My Prompts" : "Add to My Prompts"}
                    >
                      <Heart className={`h-4 w-4 ${isFav ? "fill-current text-primary" : ""}`} />
                      <span>{isFav ? "Remove from My Prompts" : "Add to My Prompts"}</span>
                    </Button>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-full">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="w-full opacity-50"
                            >
                              <Heart className="h-4 w-4" />
                              <span>Add to My Prompts</span>
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover border shadow-lg p-3 max-w-xs z-50">
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

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    Refined by Scout
                  </Badge>
                  <Badge variant="outline">Ready to Use</Badge>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <div className="flex justify-center mb-4">
                  <video 
                    src="/scout-animation-v2.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                </div>
                <p className="text-base font-medium mb-1">Scout is ready to help!</p>
                <p className="text-sm">Describe what you want the AI to do and Scout will create the perfect prompt</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Generated Prompts Section */}
      {user && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Your Scout Creations
              </CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link to="/account/favorites#my-generated-prompts">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingRecent ? (
              <div className="text-center text-muted-foreground py-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p>Loading your prompts...</p>
              </div>
            ) : recentPrompts.length > 0 ? (
              <div className="space-y-3">
                {recentPrompts.map((prompt) => (
                  <div key={prompt.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm line-clamp-1">
                        {prompt.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {prompt.prompt.substring(0, 120)}
                        {prompt.prompt.length > 120 ? '...' : ''}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(prompt.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyRecentPrompt(prompt.prompt)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No prompts generated yet</p>
                <p className="text-sm">Create your first prompt above to see it here</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tips Section */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Pro Tip
            </div>
            <h3 className="text-lg font-semibold">Get Better Results</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Be specific about your goals, target audience, and desired tone. The more context you provide, 
              the more tailored and effective Scout's prompts will be.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant Upsell - Moved to bottom */}
      <div className="text-center space-y-4 p-6 bg-gradient-to-br from-muted/50 to-background rounded-lg border">
        <h3 className="text-xl font-semibold">Want More AI Power?</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {AI_PERSONA.ui.upsellDescription}
        </p>
        <Button asChild>
          <Link to="/ai/assistant">
            {AI_PERSONA.ui.upsellButton}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
      
      <AiResponseModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        response={aiResponse}
        provider={aiProvider}
        originalPrompt={generatedPrompt}
        onRetry={() => {
          setIsAiModalOpen(false);
          // The retry functionality will be handled by the dropdown
        }}
      />
    </div>
  );
};

export default AIPromptGenerator;