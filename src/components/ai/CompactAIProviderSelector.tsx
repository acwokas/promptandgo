import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Send, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AI_PROVIDERS, rewritePromptForProvider } from '@/lib/promptRewriter';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CompactAIProviderSelectorProps {
  originalPrompt: string;
  className?: string;
  onPromptRewritten?: (rewrittenPrompt: string, providerId: string) => void;
}

export const CompactAIProviderSelector: React.FC<CompactAIProviderSelectorProps> = ({
  originalPrompt,
  className,
  onPromptRewritten
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('chatgpt');
  const [rewrittenPrompt, setRewrittenPrompt] = useState<string>('');

  // Rewrite prompt when provider changes or original prompt changes
  useEffect(() => {
    if (originalPrompt && selectedProvider) {
      const rewritten = rewritePromptForProvider(originalPrompt, selectedProvider);
      setRewrittenPrompt(rewritten);
      onPromptRewritten?.(rewritten, selectedProvider);
    }
  }, [originalPrompt, selectedProvider, onPromptRewritten]);

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rewrittenPrompt);
      toast({
        title: "Copied!",
        description: "Optimized prompt copied to clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleSendToAI = () => {
    const provider = AI_PROVIDERS.find(p => p.id === selectedProvider);
    if (!provider) return;

    // Copy to clipboard first
    navigator.clipboard.writeText(rewrittenPrompt);

    // Open the respective AI platform
    const urls: Record<string, string> = {
      chatgpt: 'https://chatgpt.com/',
      claude: 'https://claude.ai/',
      gemini: 'https://gemini.google.com/',
      deepseek: 'https://chat.deepseek.com/',
      groq: 'https://console.groq.com/playground',
      mistral: 'https://chat.mistral.ai/',
      llama: 'https://www.llama2.ai/',
      zenochat: 'https://zenochat.ai/'
    };

    const url = urls[selectedProvider];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      toast({
        title: `Opened ${provider.name}`,
        description: `${provider.name} opened in new tab. Your optimized prompt has been copied to clipboard.`
      });
    }
  };

  const selectedProviderData = AI_PROVIDERS.find(p => p.id === selectedProvider);
  const textProviders = AI_PROVIDERS.filter(p => p.category === 'text');
  const imageProviders = AI_PROVIDERS.filter(p => p.category === 'image');

  if (!originalPrompt?.trim()) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Provider Selector Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <span className="mr-1">{selectedProviderData?.icon}</span>
            <span className="text-xs">{selectedProviderData?.name}</span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
            Text Generation
          </div>
          {textProviders.map((provider) => (
            <DropdownMenuItem
              key={provider.id}
              onClick={() => handleProviderSelect(provider.id)}
              className="cursor-pointer"
            >
              <span className="mr-2">{provider.icon}</span>
              <span className="text-xs">{provider.name}</span>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
            Image Generation
          </div>
          {imageProviders.map((provider) => (
            <DropdownMenuItem
              key={provider.id}
              onClick={() => handleProviderSelect(provider.id)}
              className="cursor-pointer"
            >
              <span className="mr-2">{provider.icon}</span>
              <span className="text-xs">{provider.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Quick Actions */}
      <Button onClick={handleCopy} variant="outline" size="sm" className="h-8">
        <Copy className="h-3 w-3 mr-1" />
        Copy
      </Button>
      
      <Button onClick={handleSendToAI} size="sm" className="h-8">
        <Send className="h-3 w-3 mr-1" />
        Send
      </Button>

      {/* Status Badge */}
      <Badge variant="secondary" className="text-xs">
        {selectedProviderData?.icon} Optimized
      </Badge>
    </div>
  );
};