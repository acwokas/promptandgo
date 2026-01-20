import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AI_PROVIDERS, rewritePromptForProvider } from '@/lib/promptRewriter';
import { useAIPreferences } from '@/hooks/useAIPreferences';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface AIProviderSelectorProps {
  originalPrompt: string;
  className?: string;
  onPromptRewritten?: (rewrittenPrompt: string, providerId: string) => void;
}

export const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({
  originalPrompt,
  className,
  onPromptRewritten
}) => {
  const { getFilteredProviders } = useAIPreferences();
  const [selectedProvider, setSelectedProvider] = useState<string>('chatgpt');
  const [rewrittenPrompt, setRewrittenPrompt] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState<string>('');
  const [showOriginal, setShowOriginal] = useState(false);

  // Rewrite prompt when provider changes or original prompt changes
  useEffect(() => {
    if (originalPrompt && selectedProvider) {
      const rewritten = rewritePromptForProvider(originalPrompt, selectedProvider);
      setRewrittenPrompt(rewritten);
      setEditedPrompt(rewritten);
      onPromptRewritten?.(rewritten, selectedProvider);
    }
  }, [originalPrompt, selectedProvider, onPromptRewritten]);

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setIsEditing(false);
    setShowOriginal(false);
  };

  const handleCopy = async () => {
    try {
      const textToCopy = isEditing ? editedPrompt : rewrittenPrompt;
      await navigator.clipboard.writeText(textToCopy);
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

  const handleSendToAI = () => {
    const provider = AI_PROVIDERS.find(p => p.id === selectedProvider);
    if (!provider) return;

    const promptToSend = isEditing ? editedPrompt : rewrittenPrompt;

    // Copy to clipboard first
    navigator.clipboard.writeText(promptToSend);

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
      // Use link click to avoid referrer issues that cause ERR_BLOCKED_BY_RESPONSE
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.referrerPolicy = 'no-referrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: `Opened ${provider.name}`,
        description: `Your optimized prompt has been copied to clipboard. Paste it in ${provider.name} to get started!`,
        duration: 4000,
      });
    }
  };

  const handleSaveEdit = () => {
    setRewrittenPrompt(editedPrompt);
    setIsEditing(false);
    onPromptRewritten?.(editedPrompt, selectedProvider);
    toast({
      title: "Prompt updated",
      description: "Your edited prompt has been saved."
    });
  };

  const filteredProviders = getFilteredProviders();
  const textProviders = filteredProviders.filter(p => p.category === 'text');
  const imageProviders = filteredProviders.filter(p => p.category === 'image');
  const selectedProviderData = filteredProviders.find(p => p.id === selectedProvider);

  if (!originalPrompt?.trim()) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4 text-center text-muted-foreground">
          Generate a prompt first to see AI platform options
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">AI Platform Optimizer</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOriginal(!showOriginal)}
          >
            {showOriginal ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showOriginal ? 'Hide' : 'Show'} Original
          </Button>
        </div>

        {/* Show original prompt when toggled */}
        {showOriginal && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium text-muted-foreground mb-2">Original Prompt:</div>
            <div className="text-sm">{originalPrompt}</div>
          </div>
        )}

        {/* AI Provider Selection */}
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Text Generation</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {textProviders.map((provider) => (
                <Button
                  key={provider.id}
                  variant={selectedProvider === provider.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleProviderSelect(provider.id)}
                  className={cn(
                    "justify-start h-auto p-3 transition-all duration-200",
                    selectedProvider === provider.id 
                      ? "ring-2 ring-primary/50 shadow-lg" 
                      : "hover:shadow-md hover:border-primary/50"
                  )}
                >
                  <span className="mr-2 text-base">{provider.icon}</span>
                  <span className="text-xs font-medium">{provider.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Image Generation</div>
            <div className="grid grid-cols-2 gap-2">
              {imageProviders.map((provider) => (
                <Button
                  key={provider.id}
                  variant={selectedProvider === provider.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleProviderSelect(provider.id)}
                  className={cn(
                    "justify-start h-auto p-3 transition-all duration-200",
                    selectedProvider === provider.id 
                      ? "ring-2 ring-primary/50 shadow-lg" 
                      : "hover:shadow-md hover:border-primary/50"
                  )}
                >
                  <span className="mr-2 text-base">{provider.icon}</span>
                  <span className="text-xs font-medium">{provider.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Provider Info */}
        {selectedProviderData && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {selectedProviderData.icon} {selectedProviderData.name}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {selectedProviderData.description}
            </span>
          </div>
        )}

        {/* Rewritten Prompt Display */}
        {rewrittenPrompt && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                Optimized for {selectedProviderData?.name}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Edit' : 'Edit'}
              </Button>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  className="min-h-[120px]"
                  placeholder="Edit your prompt..."
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} size="sm">
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setEditedPrompt(rewrittenPrompt);
                      setIsEditing(false);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-muted/50 to-muted rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{rewrittenPrompt}</div>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedProviderData?.icon} Optimized
                  </Badge>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleCopy} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button onClick={handleSendToAI} size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Send to {selectedProviderData?.name}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};