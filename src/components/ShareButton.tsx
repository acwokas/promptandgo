import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Share2, Copy, Twitter, Facebook, Linkedin, Smartphone } from "lucide-react";
import { useSharing } from "@/hooks/useSharing";

interface ShareButtonProps {
  url: string;
  contentType: string;
  contentId: string;
  title: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
}

const ShareButton = ({ 
  url, 
  contentType, 
  contentId, 
  title, 
  variant = "outline", 
  size = "sm",
  showText = false 
}: ShareButtonProps) => {
  const { isSharing, shareToClipboard, shareToSocial, nativeShare } = useSharing();
  const [open, setOpen] = useState(false);

  const shareOptions = { url, contentType, contentId, title };

  const handleShare = async (method: 'clipboard' | 'twitter' | 'facebook' | 'linkedin' | 'native') => {
    setOpen(false);
    
    switch (method) {
      case 'clipboard':
        await shareToClipboard(shareOptions);
        break;
      case 'native':
        await nativeShare(shareOptions);
        break;
      default:
        await shareToSocial(method, shareOptions);
        break;
    }
  };

  // Check if native sharing is available
  const hasNativeShare = typeof navigator !== 'undefined' && navigator.share;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          disabled={isSharing}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          {showText && (isSharing ? "Sharing..." : "Share")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border shadow-lg z-50">
        <DropdownMenuItem 
          onClick={() => handleShare('clipboard')}
          className="gap-2 cursor-pointer"
        >
          <Copy className="h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
        
        {hasNativeShare && (
          <DropdownMenuItem 
            onClick={() => handleShare('native')}
            className="gap-2 cursor-pointer"
          >
            <Smartphone className="h-4 w-4" />
            Share via Device
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          onClick={() => handleShare('twitter')}
          className="gap-2 cursor-pointer"
        >
          <Twitter className="h-4 w-4" />
          Share on Twitter
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleShare('facebook')}
          className="gap-2 cursor-pointer"
        >
          <Facebook className="h-4 w-4" />
          Share on Facebook
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleShare('linkedin')}
          className="gap-2 cursor-pointer"
        >
          <Linkedin className="h-4 w-4" />
          Share on LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;