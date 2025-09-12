import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, ExternalLink } from "lucide-react";

interface ContentLinkInserterProps {
  onInsert: (linkMarkdown: string) => void;
  disabled?: boolean;
}

export function ContentLinkInserter({ onInsert, disabled }: ContentLinkInserterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isExternal, setIsExternal] = useState(false);

  const handleInsert = () => {
    if (!linkText.trim() || !linkUrl.trim()) return;

    const finalUrl = isExternal && !linkUrl.startsWith('http') ? `https://${linkUrl}` : linkUrl;
    const linkMarkdown = `[${linkText}](${finalUrl})`;
    
    onInsert(linkMarkdown);
    
    // Reset form
    setLinkText("");
    setLinkUrl("");
    setIsExternal(false);
    setIsOpen(false);
  };

  const handleUrlChange = (url: string) => {
    setLinkUrl(url);
    setIsExternal(url.startsWith('http') || url.includes('.'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Link className="w-4 h-4 mr-2" />
          Insert Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
          <DialogDescription>
            Add a link to internal pages or external websites.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-text">Link Text</Label>
            <Input
              id="link-text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Click here to learn more"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              value={linkUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="/tips/another-article or https://example.com"
            />
            {isExternal && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="w-3 h-3" />
                External link (will open in new tab)
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            <p><strong>Internal links:</strong> /tips/article-slug, /library, /packs</p>
            <p><strong>External links:</strong> https://example.com or example.com</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!linkText.trim() || !linkUrl.trim()}>
            Insert Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}