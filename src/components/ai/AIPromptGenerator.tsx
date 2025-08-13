import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Copy, Plus, Loader2 } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import UsageDisplay from "@/components/ai/UsageDisplay";

const AIPromptGenerator = () => {
  const [description, setDescription] = useState("");
  const [context, setContext] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();

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

  const handleAddToMyPrompts = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to save prompts to your collection.",
        variant: "destructive"
      });
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
    } catch (error: any) {
      console.error('Error adding to my prompts:', error);
      toast({
        title: "Save failed",
        description: "Failed to save prompt to your collection. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">AI Prompt Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Describe what you want and get a perfectly crafted AI prompt
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
              </label>
              <Textarea
                placeholder="e.g., Write a professional email to decline a job offer politely..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Additional Context (Optional)
              </label>
              <Input
                placeholder="e.g., For a marketing manager position, include gratitude..."
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
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Prompt
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Prompt</CardTitle>
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

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">AI Generated</Badge>
                  <Badge variant="outline">Ready to Use</Badge>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your generated prompt will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
};

export default AIPromptGenerator;