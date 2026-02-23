import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { Share2, Copy, Linkedin, Twitter, MessageCircle, Send } from "lucide-react";

interface SharePromptButtonProps {
  promptTitle: string;
  promptSlug: string;
  promptCategory: string;
}

export const SharePromptButton = ({
  promptTitle,
  promptSlug,
  promptCategory,
}: SharePromptButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = `https://www.promptandgo.ai/library?prompt=${promptSlug}&ref=share`;
  const shareText = `Check out this AI prompt for ${promptCategory}: ${promptTitle} — optimized for ChatGPT, Claude & more on @promptandgo`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied to clipboard!",
        description: shareText,
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleShareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const handleShareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const handleShareOnWhatsApp = () => {
    const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(
      `${shareText} ${shareUrl}`
    )}`;
    window.open(whatsAppUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const handleShareOnTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="flex-shrink-0"
          title="Share this prompt"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm mb-3">Share this prompt</h3>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Link</span>
          </button>

          <button
            onClick={handleShareOnLinkedIn}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
          >
            <Linkedin className="h-4 w-4 text-[#0A66C2]" />
            <span>Share on LinkedIn</span>
          </button>

          <button
            onClick={handleShareOnTwitter}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
          >
            <Twitter className="h-4 w-4 text-[#1D9BF0]" />
            <span>Share on X</span>
          </button>

          <button
            onClick={handleShareOnWhatsApp}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
          >
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            <span>Share on WhatsApp</span>
          </button>

          <button
            onClick={handleShareOnTelegram}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
          >
            <Send className="h-4 w-4 text-[#0088cc]" />
            <span>Share on Telegram</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
