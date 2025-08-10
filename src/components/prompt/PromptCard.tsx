import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Prompt, Category } from "@/data/prompts";

interface PromptCardProps {
  prompt: Prompt;
  categories: Category[];
}

export const PromptCard = ({ prompt, categories }: PromptCardProps) => {
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
          {prompt.tags.map((t) => (
            <Badge key={t} variant="secondary">{t}</Badge>
          ))}
        </div>
        <CardTitle className="text-xl leading-tight">{prompt.title}</CardTitle>
        <p className="text-sm text-muted-foreground">🤓 {prompt.whatFor}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-xs font-medium mb-1">Prompt</div>
          <pre className="whitespace-pre-wrap bg-muted/50 p-3 rounded-md text-sm">
            {prompt.prompt}
          </pre>
          <Button size="sm" variant="outline" className="mt-2" onClick={() => copy(prompt.prompt, "Prompt")}>
            Copy Prompt
          </Button>
        </div>
        <div>
          <div className="text-xs font-medium mb-1">Image Prompt</div>
          <pre className="whitespace-pre-wrap bg-muted/50 p-3 rounded-md text-sm">
            {prompt.imagePrompt}
          </pre>
          <Button size="sm" variant="outline" className="mt-2" onClick={() => copy(prompt.imagePrompt, "Image prompt")}>
            Copy Image Prompt
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{prompt.excerpt}</p>
      </CardContent>
    </Card>
  );
};
