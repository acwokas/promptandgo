import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Copy, Plus, Loader2, History, ExternalLink, Bot, ArrowRight } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useLoginWidget } from "@/hooks/useLoginWidget";
import { useAIUsage } from "@/hooks/useAIUsage";
import UsageDisplay from "@/components/ai/UsageDisplay";
import { Link, useSearchParams } from "react-router-dom";
import { AI_PERSONA } from "@/lib/aiPersona";
import { AiProviderDropdown } from "@/components/ai/AiProviderDropdown";
import { AiResponseModal } from "@/components/ai/AiResponseModal";
import { AIProviderSelector } from "@/components/ai/AIProviderSelector";

interface RecentPrompt {
  id: string;
  title: string;
  prompt: string;
  created_at: string;
}

const AIPromptGenerator = () => {
  const [searchParams] = useSearchParams();
  const [description, setDescription] = useState("");
  const [context, setContext] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentPrompts, setRecentPrompts] = useState<RecentPrompt[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  
  // AI response modal state
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiProvider, setAiProvider] = useState<string>('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  const { openLoginWidget } = useLoginWidget();
  const { refreshUsage } = useAIUsage();

  
  // Load prompt and result from URL parameters if provided
  useEffect(() => {
    const promptFromUrl = searchParams.get('prompt');
    const resultFromUrl = searchParams.get('result');
    if (promptFromUrl) {
      setDescription(promptFromUrl);
    }
    if (resultFromUrl) {
      setGeneratedPrompt(resultFromUrl);
    }
  }, [searchParams]);

  // Load recent prompts when user is available
  useEffect(() => {
    if (user) {
      loadRecentPrompts();
    }
  }, [user]);

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
        if (error.message?.includes('Daily limit exceeded') || data?.usageExceeded) {
          window.location.href = `/ai-credits-exhausted?type=generator&usage=${data?.currentUsage || 0}&limit=${data?.dailyLimit || 0}`;
          return;
        }
        throw error;
      }

      setGeneratedPrompt(data.result);
      
      // Refresh usage display after successful generation
      refreshUsage();
      
      toast({
        title: AI_PERSONA.greetings.successMessage,
        description: "Your AI prompt has been created successfully."
      });
    } catch (error: any) {
      console.error('Error generating prompt:', error);
      
      // Check if it's a usage limit error
      if (error.message?.includes('Daily limit exceeded')) {
        window.location.href = '/ai-credits-exhausted?type=generator';
        return;
      }

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
    try {
      // Remove surrounding quotes if present
      const cleanPrompt = generatedPrompt.replace(/^"(.*)"$/, '$1');
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

    try {
      // Extract first 50 chars of description as title
      const title = description.substring(0, 50).trim() + (description.length > 50 ? '...' : '');
      
      const { error } = await supabase
        .from('user_generated_prompts')
        .insert({
          user_id: user.id,
          title: title,
          prompt: generatedPrompt,
          description: description,
          tags: ['ai-generated']
        });

      if (error) throw error;

      toast({
        title: "Added to My Prompts!",
        description: "The generated prompt has been saved to your personal collection."
      });

      // Refresh recent prompts after adding
      loadRecentPrompts();
    } catch (error: any) {
      console.error('Error adding to my prompts:', error);
      toast({
        title: "Save failed",
        description: "Failed to save prompt to your collection. Please try again.",
        variant: "destructive"
      });
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">{AI_PERSONA.ui.generatorTitle}</h1>
          <Badge variant="secondary" className="text-xs">{AI_PERSONA.greetings.generator}</Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
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
              Generate Your Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                What do you want the AI to do? *
                <span className="text-xs text-muted-foreground ml-2">(Tell Scout what you need)</span>
              </label>
              <Textarea
                placeholder={AI_PERSONA.ui.placeholderText}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Additional Context (Optional)
                <span className="text-xs text-muted-foreground ml-2">(Help Scout understand your needs better)</span>
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
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
              Scout's Generated Prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedPrompt ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg border">
                  <pre className="whitespace-pre-wrap text-sm">
                    {generatedPrompt}
                  </pre>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" onClick={handleAddToMyPrompts}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to My Prompts
                  </Button>
                </div>
                
                {/* AI Provider Selector with Real-time Rewriting */}
                <AIProviderSelector 
                  originalPrompt={generatedPrompt}
                  className="w-full"
                  onPromptRewritten={(rewritten, provider) => {
                    // Optional: Update local state or trigger analytics
                    console.log(`Prompt rewritten for ${provider}:`, rewritten);
                  }}
                />

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    Created by Scout
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
                  <div key={prompt.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1 truncate">
                          {prompt.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {prompt.prompt.substring(0, 120)}
                          {prompt.prompt.length > 120 ? '...' : ''}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(prompt.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyRecentPrompt(prompt.prompt)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {recentPrompts.length === 5 && (
                  <div className="text-center pt-2">
                    <Button asChild variant="link" size="sm">
                      <Link to="/account/favorites#my-generated-prompts">
                        View all {recentPrompts.length}+ prompts →
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <History className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="mb-2">No generated prompts yet</p>
                <p className="text-xs">Generate your first prompt above to see it here</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 Tips for Better Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Be Specific</h4>
              <p className="text-muted-foreground">
                The more details you provide, the more tailored your prompt will be.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Include Context</h4>
              <p className="text-muted-foreground">
                Mention the audience, tone, or specific requirements.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Define the Output</h4>
              <p className="text-muted-foreground">
                Specify the format or structure you want in the result.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Use Examples</h4>
              <p className="text-muted-foreground">
                Provide examples of what good results should look like.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant Upsell - Moved to bottom */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
        <div className="flex items-center gap-3 mb-3">
          <Bot className="h-5 w-5 text-green-500" />
          <h3 className="font-semibold text-green-700 dark:text-green-300">{AI_PERSONA.ui.upsellTitle}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {AI_PERSONA.ui.upsellDescription}
        </p>
        <Button asChild size="sm" className="bg-green-500 hover:bg-green-600">
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