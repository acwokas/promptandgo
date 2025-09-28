import React, { useState, useEffect } from 'react';
import { useAIPreferences } from '@/hooks/useAIPreferences';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChevronDown, Send, Bot, Sparkles, Brain, Zap, Image, Palette, Search, Rocket, Wind } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { AI_PROVIDERS } from '@/lib/promptRewriter';

// Create icon mapping for the AI providers from promptRewriter
const getProviderIcon = (providerId: string, providerIcon: string): React.ReactNode => {
  const iconMap: { [key: string]: React.ReactNode } = {
    chatgpt: <Bot className="h-4 w-4" />,
    claude: <Brain className="h-4 w-4" />,
    gemini: <Sparkles className="h-4 w-4" />,
    deepseek: <Search className="h-4 w-4" />,
    groq: <Zap className="h-4 w-4" />,
    mistral: <Wind className="h-4 w-4" />,
    llama: <Bot className="h-4 w-4" />,
    perplexity: <Search className="h-4 w-4" />,
    zenochat: <Rocket className="h-4 w-4" />,
    midjourney: <Image className="h-4 w-4" />,
    ideogram: <Palette className="h-4 w-4" />,
    nanobanana: <Image className="h-4 w-4" />
  };
  return iconMap[providerId] || <Bot className="h-4 w-4" />;
};

export interface AiProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'text' | 'image';
  description: string;
}

interface AiProviderDropdownProps {
  prompt: string;
  onResponse?: (response: string, provider: string) => void;
  className?: string;
  disabled?: boolean;
  optimizedFor?: string; // The AI platform this prompt is optimized for
}

export const AiProviderDropdown: React.FC<AiProviderDropdownProps> = ({
  prompt,
  onResponse,
  className,
  disabled,
  optimizedFor
}) => {
  const { getFilteredProviders } = useAIPreferences();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AiProvider | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleProviderSelect = async (provider: AiProvider) => {
    if (!prompt?.trim()) {
      toast({
        title: "No prompt available",
        description: "Please generate a prompt first before sending to AI.",
        variant: "destructive"
      });
      return;
    }

    // Handle MidJourney special case - show dialog but with different messaging
    if (provider.id === 'midjourney') {
      // Add branding and copy to clipboard
      const brandedPrompt = `${prompt.trim()}\n\n---\nGet the most from AI with prompts optimised by PromptandGo.ai.`;
      await navigator.clipboard.writeText(brandedPrompt);
      
      // Save to favorites if logged in
      if (isLoggedIn) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            await supabase
              .from('favorites')
              .insert({
                user_id: session.user.id,
                prompt_id: null,
                prompt_text: prompt.trim(),
                created_at: new Date().toISOString()
              });
          }
        } catch (error) {
          console.error('Error saving to favorites:', error);
        }
      }

      setSelectedProvider(provider);
      
      if (isLoggedIn) {
        setShowDialog(true);
      } else {
        toast({
          title: "Prompt ready to use!",
          description: (
            <div className="space-y-3">
              <p className="text-sm font-medium">✅ Your optimized prompt is copied to clipboard</p>
              <div className="space-y-1">
                <p className="text-sm font-medium">Manual steps:</p>
                <p className="text-xs">1. Open Discord and navigate to MidJourney</p>
                <p className="text-xs">2. Paste your prompt in any channel</p>
                <p className="text-xs">3. Your image will be generated</p>
              </div>
              <p className="text-xs text-muted-foreground">💡 MidJourney works through Discord</p>
            </div>
          ),
          duration: 8000,
        });
      }
      return;
    }

    // Add branding and copy to clipboard
    const brandedPrompt = `${prompt.trim()}\n\n---\nGet the most from AI with prompts optimised by PromptandGo.ai.`;
    await navigator.clipboard.writeText(brandedPrompt);
    
    // Save to favorites if logged in
    if (isLoggedIn) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase
            .from('favorites')
            .insert({
              user_id: session.user.id,
              prompt_id: null, // This would need to be the actual prompt ID if available
              prompt_text: prompt.trim(),
              created_at: new Date().toISOString()
            });
        }
      } catch (error) {
        console.error('Error saving to favorites:', error);
      }
    }

    setSelectedProvider(provider);
    
    if (isLoggedIn) {
      setShowDialog(true);
    } else {
      // Show manual instructions for non-logged-in users
      const showManualInstructions = (url: string) => {
        toast({
          title: "Prompt ready to use!",
          description: (
            <div className="space-y-3">
              <p className="text-sm font-medium">✅ Your optimized prompt is copied to clipboard</p>
              <div className="space-y-1">
                <p className="text-sm font-medium">Manual steps:</p>
                <p className="text-xs">1. Open a new browser tab</p>
                <p className="text-xs">2. Go to: <span className="font-mono bg-muted px-1 rounded">{url}</span></p>
                <p className="text-xs">3. Paste your prompt and hit enter</p>
              </div>
              <p className="text-xs text-muted-foreground">💡 If the site is blocked on your network, try using a different device or network</p>
            </div>
          ),
          duration: 8000,
        });
      };

      switch (provider.id) {
        case 'openai':
          showManualInstructions('https://chatgpt.com/');
          break;
        case 'claude':
          showManualInstructions('https://claude.ai/');
          break;
        case 'anthropic':
          showManualInstructions('https://claude.ai/');
          break;
        case 'google':
          showManualInstructions('https://gemini.google.com/');
          break;
        case 'groq':
          showManualInstructions('https://console.groq.com/playground');
          break;
        case 'deepseek':
          showManualInstructions('https://chat.deepseek.com/');
          break;
        case 'chatgpt':
          showManualInstructions('https://chatgpt.com/');
          break;
        case 'mistral':
          showManualInstructions('https://chat.mistral.ai/');
          break;
        case 'llama':
          showManualInstructions('https://www.llama2.ai/');
          break;
        case 'zenochat':
          showManualInstructions('https://www.zenochat.ai/');
          break;
        default:
          toast({
            title: "Prompt copied",
            description: "Your prompt has been copied to clipboard.",
          });
          break;
      }
    }
  };

  const handleDirectSend = async () => {
    if (!prompt?.trim()) {
      toast({
        title: "No prompt available",
        description: "Please generate a prompt first before sending to AI.",
        variant: "destructive"
      });
      return;
    }

    // Get the optimized platform or default to ChatGPT
    const targetProvider = optimizedPlatform || convertedProviders.find(p => p.id === 'chatgpt');
    
    if (targetProvider) {
      await handleProviderSelect(targetProvider);
    }
  };

  const handleOpenAI = () => {
    if (!selectedProvider) return;
    
    const urls = {
      openai: 'https://chatgpt.com/',
      chatgpt: 'https://chatgpt.com/',
      claude: 'https://claude.ai/',
      anthropic: 'https://claude.ai/',
      google: 'https://gemini.google.com/',
      groq: 'https://console.groq.com/playground',
      deepseek: 'https://chat.deepseek.com/',
      mistral: 'https://chat.mistral.ai/',
      llama: 'https://www.llama2.ai/',
      perplexity: 'https://www.perplexity.ai/',
      zenochat: 'https://www.zenochat.ai/',
      midjourney: 'https://discord.com/channels/@me'
    };
    
    const url = urls[selectedProvider.id as keyof typeof urls];
    if (url) {
      window.open(url, '_blank');
    }
    
    setShowDialog(false);
  };

  // Convert AI_PROVIDERS to the component format and sort alphabetically
  const convertedProviders = AI_PROVIDERS.map(provider => ({
    id: provider.id,
    name: provider.name,
    icon: getProviderIcon(provider.id, provider.icon),
    category: provider.category,
    description: provider.description
  }));

  const textProviders = convertedProviders
    .filter(p => p.category === 'text')
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const imageProviders = convertedProviders
    .filter(p => p.category === 'image')
    .sort((a, b) => a.name.localeCompare(b.name));

  // Get the optimized platform info
  const optimizedPlatform = optimizedFor && optimizedFor !== 'original' 
    ? convertedProviders.find(p => p.id === optimizedFor)
    : null;

  const buttonText = optimizedPlatform 
    ? `Send to ${optimizedPlatform.name}`
    : 'Send to AI';

  return (
    <TooltipProvider>
      <DropdownMenu>
        <div className={cn("flex w-full", className)}>
          {/* Main send button */}
          <Button
            variant="default"
            className="flex-1 rounded-r-none border-r-0"
            disabled={disabled || isLoading || !prompt?.trim()}
            onClick={handleDirectSend}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending to {selectedProvider?.name}...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {buttonText}
              </>
            )}
          </Button>
          
          {/* Dropdown trigger */}
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="px-3 rounded-l-none"
              disabled={disabled || isLoading}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent align="start" className="w-64 p-0 z-50">
          <ScrollArea className="h-80">
            <div className="p-1">
              <DropdownMenuLabel>Text Generation</DropdownMenuLabel>
              {textProviders.map((provider) => (
                <DropdownMenuItem
                  key={provider.id}
                  onClick={() => handleProviderSelect(provider)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    {provider.icon}
                    <div className="flex-1">
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-xs text-muted-foreground">{provider.description}</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Image Generation</DropdownMenuLabel>
              {imageProviders.map((provider) => (
                provider.id === 'midjourney' ? (
                  <Tooltip key={provider.id}>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem
                        onClick={() => handleProviderSelect(provider)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-3 w-full">
                          {provider.icon}
                          <div className="flex-1">
                            <div className="font-medium">{provider.name}</div>
                            <div className="text-xs text-muted-foreground">{provider.description}</div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sorry! MidJourney does not yet allow this. Instead, please use the copy button and paste it directly into MidJourney.</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <DropdownMenuItem
                    key={provider.id}
                    onClick={() => handleProviderSelect(provider)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full">
                      {provider.icon}
                      <div className="flex-1">
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-xs text-muted-foreground">{provider.description}</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                )
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {selectedProvider?.icon}
              {selectedProvider?.name}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedProvider?.id === 'midjourney' 
                ? "You're all set! It's saved to My Prompts and copied to your clipboard. Now we'll open Discord where you can paste it directly into any MidJourney channel."
                : "You're all set! It's saved to My Prompts and copied to your clipboard. Now we'll open " + selectedProvider?.name + " in a new tab and you can paste it directly into the chat."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleOpenAI}>
              Open {selectedProvider?.name}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};