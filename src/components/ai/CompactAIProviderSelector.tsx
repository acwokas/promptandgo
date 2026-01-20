import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, ChevronDown, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AI_PROVIDERS, rewritePromptForProvider } from '@/lib/promptRewriter';
import { cn } from '@/lib/utils';
import { useAIPreferences } from '@/hooks/useAIPreferences';
import { useLoginWidget } from '@/hooks/useLoginWidget';
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
  const { getFilteredProviders, isLoggedIn } = useAIPreferences();
  const { openLoginWidget } = useLoginWidget();
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
      llama: 'https://www.llama2.ai/'
    };

    const url = urls[selectedProvider];
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
          toast({
            title: `Opened ${provider.name}`,
            description: `${provider.name} opened in new tab. Your optimized prompt has been copied to clipboard.`,
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

  const filteredProviders = getFilteredProviders();
  const selectedProviderData = filteredProviders.find(p => p.id === selectedProvider);
  const textProviders = filteredProviders.filter(p => p.category === 'text');
  const imageProviders = filteredProviders.filter(p => p.category === 'image');

  // If selected provider is not in filtered list, reset to first available
  useEffect(() => {
    if (filteredProviders.length > 0 && !filteredProviders.find(p => p.id === selectedProvider)) {
      setSelectedProvider(filteredProviders[0].id);
    }
  }, [filteredProviders, selectedProvider]);

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
        <DropdownMenuContent align="start" className="w-48 z-[100] bg-card border border-border shadow-lg backdrop-blur-sm">
          {!isLoggedIn && (
            <>
              <div className="px-3 py-2 text-xs">
                <div className="font-medium text-foreground">🔓 Sign in to customize</div>
                <div className="text-muted-foreground mt-1">
                  Choose your preferred AI providers
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 w-full h-7 text-xs"
                  onClick={openLoginWidget}
                >
                  Sign In
                </Button>
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          
          {textProviders.length > 0 && (
            <>
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
            </>
          )}
          
          {textProviders.length > 0 && imageProviders.length > 0 && (
            <DropdownMenuSeparator />
          )}
          
          {imageProviders.length > 0 && (
            <>
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
            </>
          )}
          
          {filteredProviders.length === 0 && isLoggedIn && (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              No AI providers selected. Visit your account settings to choose providers.
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Quick Actions */}
      <Button onClick={handleCopy} variant="outline" size="sm" className="h-8">
        <Copy className="h-3 w-3 mr-1" />
        Copy
      </Button>
      
      <Button onClick={handleSendToAI} size="sm" className="h-8">
        <ExternalLink className="h-3 w-3 mr-1" />
        Send to {selectedProviderData?.name}
      </Button>

      {/* Status Badge */}
      <Badge variant="secondary" className="text-xs">
        {selectedProviderData?.icon} Optimized
      </Badge>
    </div>
  );
};