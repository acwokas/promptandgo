import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { ChevronDown, Send, Bot, Sparkles, Brain, Zap, Image, Palette } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

export interface AiProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'text' | 'image';
  description: string;
}

const AI_PROVIDERS: AiProvider[] = [
  {
    id: 'openai',
    name: 'ChatGPT',
    icon: <Bot className="h-4 w-4" />,
    category: 'text',
    description: 'OpenAI GPT models'
  },
  {
    id: 'anthropic',
    name: 'Claude',
    icon: <Brain className="h-4 w-4" />,
    category: 'text',
    description: 'Anthropic Claude models'
  },
  {
    id: 'google',
    name: 'Gemini',
    icon: <Sparkles className="h-4 w-4" />,
    category: 'text',
    description: 'Google Gemini models'
  },
  {
    id: 'groq',
    name: 'Groq',
    icon: <Zap className="h-4 w-4" />,
    category: 'text',
    description: 'Groq fast inference'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: <Brain className="h-4 w-4" />,
    category: 'text',
    description: 'DeepSeek models'
  },
  {
    id: 'midjourney',
    name: 'MidJourney',
    icon: <Image className="h-4 w-4" />,
    category: 'image',
    description: 'MidJourney image generation'
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    icon: <Palette className="h-4 w-4" />,
    category: 'image',
    description: 'Ideogram AI image creation'
  }
];

interface AiProviderDropdownProps {
  prompt: string;
  onResponse?: (response: string, provider: string) => void;
  className?: string;
  disabled?: boolean;
}

export const AiProviderDropdown: React.FC<AiProviderDropdownProps> = ({
  prompt,
  onResponse,
  className,
  disabled
}) => {
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

    // Handle MidJourney special case - just show a toast message
    if (provider.id === 'midjourney') {
      toast({
        title: "MidJourney Not Available",
        description: "Sorry! MidJourney does not yet allow this. Instead, please use the copy button and paste it directly into MidJourney.",
        variant: "default"
      });
      return;
    }

    // Copy to clipboard
    await navigator.clipboard.writeText(prompt.trim());
    
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
        default:
          toast({
            title: "Prompt copied",
            description: "Your prompt has been copied to clipboard.",
          });
          break;
      }
    }
  };

  const handleOpenAI = () => {
    if (!selectedProvider) return;
    
    const urls = {
      openai: 'https://chatgpt.com/',
      anthropic: 'https://claude.ai/',
      google: 'https://gemini.google.com/',
      groq: 'https://console.groq.com/playground',
      deepseek: 'https://chat.deepseek.com/'
    };
    
    const url = urls[selectedProvider.id as keyof typeof urls];
    if (url) {
      window.open(url, '_blank');
    }
    
    setShowDialog(false);
  };

  const textProviders = AI_PROVIDERS.filter(p => p.category === 'text');
  const imageProviders = AI_PROVIDERS.filter(p => p.category === 'image');

  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            className={cn("w-full", className)}
            disabled={disabled || isLoading || !prompt?.trim()}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending to {selectedProvider?.name}...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send to AI
                <ChevronDown className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            Text Generation
          </div>
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
          
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-t mt-1">
            Image Generation
          </div>
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
              You're all set! It's saved to My Prompts and copied to your clipboard. Now we'll open {selectedProvider?.name} in a new tab and you can paste it directly into the chat.
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