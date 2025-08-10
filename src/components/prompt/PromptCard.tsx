import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Prompt, Category } from "@/data/prompts";

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
          <div className="text-xs font-medium mb-1">Prompt</div>
          <pre className="whitespace-pre-wrap bg-muted/50 p-3 rounded-md text-sm">
            {prompt.prompt}
          </pre>
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => copy(prompt.prompt, "Prompt")}
          >
            Copy Prompt
          </Button>
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
