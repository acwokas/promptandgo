import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Share2, Copy, Facebook, Linkedin, Smartphone, Instagram } from "lucide-react";

// Custom X (Twitter) icon since lucide-react doesn't have the new X logo
const XIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="m4 4 11.733 16h4.267l-11.733 -16z" />
    <path d="m4 20 6.768 -6.768m2.46 -2.46 6.772 -6.772" />
  </svg>
);

// TikTok icon
const TikTokIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);
import { useSharing } from "@/hooks/useSharing";

interface ShareButtonProps {
  url: string;
  contentType: string;
  contentId: string;
  title: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
  className?: string;
}

const ShareButton = ({ 
  url, 
  contentType, 
  contentId, 
  title, 
  variant = "outline", 
  size = "sm",
  showText = false,
  className
}: ShareButtonProps) => {
  const { isSharing, shareToClipboard, shareToSocial, nativeShare } = useSharing();
  const [open, setOpen] = useState(false);

  const shareOptions = useMemo(() => ({ url, contentType, contentId, title }), [url, contentType, contentId, title]);

  const handleShare = async (method: 'clipboard' | 'x' | 'facebook' | 'linkedin' | 'instagram' | 'tiktok' | 'native') => {
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
          className={`gap-2 ${className || ''}`}
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
          onClick={() => handleShare('x')}
          className="gap-2 cursor-pointer"
        >
          <XIcon className="h-4 w-4" />
          Share on X
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleShare('instagram')}
          className="gap-2 cursor-pointer"
        >
          <Instagram className="h-4 w-4" />
          Share on Instagram
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleShare('tiktok')}
          className="gap-2 cursor-pointer"
        >
          <TikTokIcon className="h-4 w-4" />
          Share on TikTok
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