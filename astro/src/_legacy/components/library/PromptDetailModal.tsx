import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Sparkles, BarChart3, Check, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface PromptDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: {
    title: string;
    prompt: string;
    category: string;
    categoryIcon: string;
    difficulty: string;
    platforms: string[];
    usageCount: string;
    copyCount: string;
  } | null;
}

const PLATFORM_COMPAT: Record<string, string> = {
  ChatGPT: "Excellent",
  Claude: "Excellent",
  Gemini: "Good",
  Qwen: "Good",
  DeepSeek: "Good",
  "Ernie Bot": "Fair",
};

const COMPAT_COLORS: Record<string, string> = {
  Excellent: "text-emerald-500",
  Good: "text-amber-500",
  Fair: "text-muted-foreground",
};

function highlightVariables(text: string) {
  return text.split(/(\[[^\]]+\])/g).map((part, i) =>
    part.startsWith("[") ? (
      <span key={i} className="bg-primary/15 text-primary font-semibold px-0.5 rounded">{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const RELATED_PROMPTS = [
  { title: "Email Follow-Up Sequence", category: "Sales", difficulty: "Intermediate" },
  { title: "Product Launch Announcement", category: "Marketing", difficulty: "Beginner" },
  { title: "Customer Feedback Survey", category: "Customer Service", difficulty: "Beginner" },
];

export const PromptDetailModal = ({ open, onOpenChange, prompt }: PromptDetailModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!prompt) return null;

  const copyText = () => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{prompt.categoryIcon}</span>
            <Badge variant="outline" className="text-[10px]">{prompt.category}</Badge>
            <Badge variant="secondary" className="text-[10px]">{prompt.difficulty}</Badge>
          </div>
          <DialogTitle className="text-xl">{prompt.title}</DialogTitle>
        </DialogHeader>

        {/* Full Prompt */}
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {highlightVariables(prompt.prompt)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={copyText} className="gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <Link to="/optimize">
                <Sparkles className="h-4 w-4" /> Open in Optimizer
              </Link>
            </Button>
          </div>

          {/* Usage Stats */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Copy className="h-3.5 w-3.5" />
              <span>Copied <strong className="text-foreground">{prompt.copyCount}</strong> times</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Optimized <strong className="text-foreground">{prompt.usageCount}</strong> times</span>
            </div>
          </div>

          {/* Why This Prompt Works */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Why This Prompt Works
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex gap-2"><span className="text-primary">•</span> Clear role assignment tells the AI exactly what expertise to apply</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Numbered structure prevents vague, unorganized responses</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Variable placeholders [like this] make it instantly reusable</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Specific constraints (word count, tone, format) ensure consistent quality</li>
            </ul>
          </div>

          {/* Platform Compatibility */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Platform Compatibility</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(PLATFORM_COMPAT).map(([platform, rating]) => (
                <div key={platform} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border">
                  <span className="text-xs font-medium">{platform}</span>
                  <span className={`text-xs font-bold ${COMPAT_COLORS[rating]}`}>{rating}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Prompts */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Related Prompts</h3>
            <div className="grid gap-2">
              {RELATED_PROMPTS.map((rp) => (
                <div key={rp.title} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">{rp.title}</p>
                    <p className="text-[10px] text-muted-foreground">{rp.category} · {rp.difficulty}</p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
