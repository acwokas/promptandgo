import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAIUsage } from "@/hooks/useAIUsage";
import { Wand2, Copy, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AIPromptWidget = () => {
  const [description, setDescription] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { refreshUsage } = useAIUsage();

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
          context: undefined
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
        title: "Prompt generated!",
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
      await navigator.clipboard.writeText(generatedPrompt);
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

  return (
    <Card className="w-full bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wand2 className="h-5 w-5 text-primary" />
          Try Scout Prompt Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Describe what you need and get a perfectly crafted prompt instantly
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="e.g., Write a professional email to decline a job offer politely..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px] text-sm"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={`/toolkit${description.trim() ? `?prompt=${encodeURIComponent(description.trim())}` : ''}`}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {generatedPrompt && (
          <div className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-lg border text-sm">
              <pre className="whitespace-pre-wrap">
                {generatedPrompt.length > 200 
                  ? `${generatedPrompt.substring(0, 200)}...` 
                  : generatedPrompt}
              </pre>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopy} size="sm">
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to={`/ai/generator?prompt=${encodeURIComponent(description.trim())}&result=${encodeURIComponent(generatedPrompt)}`}>
                  View Full Generator →
                </Link>
              </Button>
            </div>
          </div>
        )}

        {!generatedPrompt && (
          <div className="text-center text-muted-foreground py-4 text-xs">
            <Wand2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Your generated prompt will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIPromptWidget;