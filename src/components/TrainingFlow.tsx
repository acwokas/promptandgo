import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUp, ThumbsDown, Heart, X, Star } from "lucide-react";

interface TrainingPrompt {
  id: string;
  title: string;
  whatFor?: string | null;
  prompt: string;
  excerpt?: string | null;
  tags: string[];
  categoryName?: string;
  subcategoryName?: string;
}

interface TrainingFlowProps {
  onComplete: () => void;
  onClose: () => void;
}

export const TrainingFlow = ({ onComplete, onClose }: TrainingFlowProps) => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<TrainingPrompt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<string, 'yes' | 'no'>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadTrainingPrompts();
  }, [user]);

  const loadTrainingPrompts = async () => {
    if (!user) return;

    try {
      // Get user's context for personalization
      const { data: profile } = await supabase
        .from("profiles")
        .select("industry, project_type, preferred_tone, desired_outcome")
        .eq("id", user.id)
        .single();

      // Get 5-8 free prompts for training
      const { data: promptData, error } = await supabase
        .from("prompts")
        .select(`
          id, title, what_for, prompt, excerpt, is_pro,
          categories:category_id(name),
          subcategories:subcategory_id(name)
        `)
        .eq("is_pro", false)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      if (promptData && promptData.length > 0) {
        // Get tags for these prompts
        const promptIds = promptData.map(p => p.id);
        const { data: tagData } = await supabase
          .from("prompt_tags")
          .select("prompt_id, tags:tag_id(name)")
          .in("prompt_id", promptIds);

        // Build tag map
        const tagMap = new Map<string, string[]>();
        (tagData || []).forEach((r: any) => {
          const promptId = r.prompt_id;
          const tagName = r.tags?.name;
          if (promptId && tagName) {
            const existing = tagMap.get(promptId) || [];
            existing.push(tagName);
            tagMap.set(promptId, existing);
          }
        });

        // Select diverse prompts for training (mix of categories)
        const trainingSet = promptData
          .slice(0, 6)
          .map(p => ({
            id: p.id,
            title: p.title,
            whatFor: p.what_for,
            prompt: p.prompt,
            excerpt: p.excerpt,
            tags: tagMap.get(p.id) || [],
            categoryName: (p.categories as any)?.name,
            subcategoryName: (p.subcategories as any)?.name
          }));

        setPrompts(trainingSet);
      }
    } catch (error) {
      console.error("Error loading training prompts:", error);
      toast({
        title: "Error",
        description: "Failed to load training prompts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRating = (promptId: string, rating: 'yes' | 'no') => {
    setRatings(prev => ({ ...prev, [promptId]: rating }));
    
    if (currentIndex < prompts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const addToFavorites = async (promptId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("favorites")
        .insert({
          user_id: user.id,
          prompt_id: promptId
        });

      if (error) {
        if (error.code === '23505') { // Duplicate key
          toast({
            title: "Already in favorites",
            description: "This prompt is already in your favorites"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Added to favorites!",
          description: "You can find this in My Prompts"
        });
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast({
        title: "Error",
        description: "Failed to add to favorites",
        variant: "destructive"
      });
    }
  };

  const updateRecommendedPrompts = async () => {
    if (!user) return;

    try {
      // Get prompts that were rated positively
      const likedPromptIds = Object.entries(ratings)
        .filter(([_, rating]) => rating === 'yes')
        .map(([promptId]) => promptId);

      if (likedPromptIds.length > 0) {
        // Save user-specific preferences for liked prompts
        const preferences = likedPromptIds.map(promptId => ({
          user_id: user.id,
          prompt_id: promptId,
          preference_type: 'liked' as const
        }));

        await supabase
          .from("user_prompt_preferences")
          .upsert(preferences, { 
            onConflict: 'user_id,prompt_id',
            ignoreDuplicates: false 
          });

        console.log('✅ Successfully saved user preferences:', preferences);
      }
    } catch (error) {
      console.error("Error saving user preferences:", error);
    }
  };

  const handleFinish = async () => {
    await updateRecommendedPrompts();
    onComplete();
  };

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>🎯 Loading Your Training Set</DialogTitle>
            <DialogDescription>
              We're finding the perfect prompts for you to try...
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center text-muted-foreground">
            Loading prompts...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showResults) {
    const likedPrompts = prompts.filter(p => ratings[p.id] === 'yes');
    const totalRated = Object.keys(ratings).length;

    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl max-h-[90svh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>🎉 Training Complete!</DialogTitle>
            <DialogDescription>
              You rated {likedPrompts.length} out of {totalRated} prompts positively. These will now show as "RECOMMENDED" for you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {likedPrompts.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Would you like to add any of these to your favorites?
                </p>
                <div className="space-y-3">
                  {likedPrompts.map((prompt) => (
                    <Card key={prompt.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              RECOMMENDED
                            </Badge>
                            <Star className="h-4 w-4 text-yellow-500" />
                          </div>
                          <h4 className="font-medium">{prompt.title}</h4>
                          {prompt.whatFor && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {prompt.whatFor}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {prompt.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addToFavorites(prompt.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                No prompts were marked as favorites. Don't worry - we'll keep learning your preferences!
              </p>
            )}

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-4">
                Based on your ratings, we'll show you more prompts like the ones you liked. 
                You can always update your preferences in your profile.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleFinish} className="flex-1">
                  Explore More Prompts
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const currentPrompt = prompts[currentIndex];
  if (!currentPrompt) return null;

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>🤖 Help Us Learn Your Preferences</DialogTitle>
          <DialogDescription>
            Prompt {currentIndex + 1} of {prompts.length} - Would you find this prompt useful?
          </DialogDescription>
        </DialogHeader>

        <Card className="mt-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{currentPrompt.title}</CardTitle>
              <div className="flex gap-1">
                {currentPrompt.categoryName && (
                  <Badge variant="outline" className="text-xs">
                    {currentPrompt.categoryName}
                  </Badge>
                )}
              </div>
            </div>
            {currentPrompt.whatFor && (
              <p className="text-sm text-muted-foreground">{currentPrompt.whatFor}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{currentPrompt.prompt}</p>
              </div>
              
              {currentPrompt.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {currentPrompt.tags.slice(0, 5).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => handleRating(currentPrompt.id, 'yes')}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Yes, this is useful
          </Button>
          <Button
            onClick={() => handleRating(currentPrompt.id, 'no')}
            variant="outline"
            className="flex-1"
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            Not for me
          </Button>
        </div>

        <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
          <span>Your ratings help us show better recommendations</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};