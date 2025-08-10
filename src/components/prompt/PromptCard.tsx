import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Prompt, Category } from "@/data/prompts";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PromptCardProps {
  prompt: Prompt;
  categories: Category[];
  onTagClick?: (tag: string) => void;
}

export const PromptCard = ({ prompt, categories, onTagClick }: PromptCardProps) => {
  const category = categories.find((c) => c.id === prompt.categoryId);
  const sub = category?.subcategories.find((s) => s.id === prompt.subcategoryId);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copied` });
    } catch {
      toast({ title: `Failed to copy ${label}` });
    }
  };

  const { user } = useSupabaseAuth();
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    const check = async () => {
      if (!user) {
        setIsFav(false);
        return;
      }
      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("prompt_id", prompt.id)
        .maybeSingle();
      if (!ignore) setIsFav(!!data && !error);
    };
    check();
    return () => {
      ignore = true;
    };
  }, [user?.id, prompt.id]);

  const toggleFavorite = async () => {
    if (!user) return;
    setFavLoading(true);
    try {
      if (isFav) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("prompt_id", prompt.id);
        if (error) throw error;
        setIsFav(false);
        toast({ title: "Removed from favourites" });
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, prompt_id: prompt.id });
        if (error) throw error;
        setIsFav(true);
        toast({ title: "Added to favourites" });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to update favourites" });
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
          <span>{category?.name}</span>
          <span>›</span>
          <span>{sub?.name}</span>
        </div>
        <CardTitle className="text-xl leading-tight">{prompt.title}</CardTitle>
        <p className="text-sm text-muted-foreground">🤓 {prompt.whatFor}</p>
        <p className="text-sm text-muted-foreground">✅ {prompt.excerpt}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-xs font-medium mb-1">Prompt:</div>
          <pre className="whitespace-pre-wrap bg-muted/50 p-3 rounded-md text-sm">
            {prompt.prompt}
          </pre>
          <div className="flex items-center gap-2 mt-2">
            <Button
              size="sm"
              variant="hero"
              onClick={() => copy(prompt.prompt, "Prompt")}
            >
              Copy Prompt
            </Button>
            {user ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFavorite}
                      disabled={favLoading}
                      aria-label={isFav ? "Remove from Favourites" : "Add to Favourites"}
                      title={isFav ? "Remove from Favourites" : "Add to Favourites"}
                    >
                      <Heart className={cn("h-5 w-5", isFav ? "fill-current text-primary" : "")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFav ? "Remove from Favourites" : "Add to Favourites"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled aria-label="Add to Favourites" title="Add to Favourites">
                      <Heart className="h-5 w-5 opacity-50" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-col gap-2">
                      <span>Log in to add favourites</span>
                      <div className="flex gap-2">
                        <Link to="/auth"><Button size="sm" variant="secondary">Login</Button></Link>
                        <Link to="/auth"><Button size="sm" variant="outline">Sign up</Button></Link>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {prompt.tags.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium">Related Prompts:</div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {prompt.tags.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  onClick={() => onTagClick?.(t)}
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer"
                  aria-label={`Filter by ${t}`}
                  title={`Filter by ${t}`}
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        )}

        
      </CardContent>
    </Card>
  );
};
