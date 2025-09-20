import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    id: 'meta',
    name: 'Llama-3',
    icon: <Zap className="h-4 w-4" />,
    category: 'text',
    description: 'Meta Llama models'
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
    id: 'cohere',
    name: 'Cohere',
    icon: <Sparkles className="h-4 w-4" />,
    category: 'text',
    description: 'Cohere Command models'
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

    setIsLoading(true);
    setSelectedProvider(provider.id);

    try {
      const { data, error } = await supabase.functions.invoke('send-to-ai-provider', {
        body: {
          provider: provider.id,
          prompt: prompt.trim(),
          temperature: 0.7,
          maxTokens: 1000
        }
      });

      if (error) {
        console.error('AI Provider error:', error);
        toast({
          title: "Error",
          description: error.message || `Failed to send prompt to ${provider.name}`,
          variant: "destructive"
        });
        return;
      }

      if (data?.response) {
        toast({
          title: "Response received",
          description: `Got response from ${provider.name}`,
        });
        onResponse?.(data.response, provider.name);
      } else {
        throw new Error('No response received');
      }
    } catch (error) {
      console.error('Send to AI error:', error);
      toast({
        title: "Error",
        description: `Failed to send prompt to ${provider.name}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setSelectedProvider(null);
    }
  };

  const textProviders = AI_PROVIDERS.filter(p => p.category === 'text');
  const imageProviders = AI_PROVIDERS.filter(p => p.category === 'image');

  return (
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};