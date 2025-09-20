import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const { toast } = useToast();

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

    // Show manual instructions instead of trying to open potentially blocked sites
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
        // ChatGPT doesn't support URL parameters for prompts natively
        // Copy to clipboard and open ChatGPT
        await navigator.clipboard.writeText(prompt.trim());
        showManualInstructions('https://chatgpt.com/');
        break;
      
      case 'anthropic':
        // Claude doesn't support URL parameters for prompts natively
        await navigator.clipboard.writeText(prompt.trim());
        showManualInstructions('https://claude.ai/');
        break;
      
      case 'google':
        // Gemini doesn't support URL parameters for prompts natively
        await navigator.clipboard.writeText(prompt.trim());
        showManualInstructions('https://gemini.google.com/');
        break;
      
      case 'groq':
        // Groq doesn't have a web interface like the others
        await navigator.clipboard.writeText(prompt.trim());
        showManualInstructions('https://console.groq.com/playground');
        break;
      
      case 'deepseek':
        // DeepSeek web interface
        await navigator.clipboard.writeText(prompt.trim());
        showManualInstructions('https://chat.deepseek.com/');
        break;
      
      default:
        await navigator.clipboard.writeText(prompt.trim());
        toast({
          title: "Prompt copied",
          description: "Your prompt has been copied to clipboard.",
        });
        break;
    }
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
                Sending to {selectedProvider && AI_PROVIDERS.find(p => p.id === selectedProvider)?.name}...
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
    </TooltipProvider>
  );
};