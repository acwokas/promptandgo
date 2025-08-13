import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "./useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";

interface ShareOptions {
  url: string;
  contentType: string;
  contentId: string;
  title: string;
}

export function useSharing() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const createShareLink = async (options: ShareOptions): Promise<string | null> => {
    setIsSharing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-share-link', {
        body: {
          original_url: options.url,
          content_type: options.contentType,
          content_id: options.contentId,
          title: options.title,
          shared_by: user?.id || null
        }
      });

      if (error) throw error;

      return data.short_url;
    } catch (error: any) {
      console.error('Share link creation failed:', error);
      toast({
        title: "Sharing failed",
        description: "Unable to create share link. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSharing(false);
    }
  };

  const shareToClipboard = async (options: ShareOptions) => {
    const shortUrl = await createShareLink(options);
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      toast({
        title: "Link copied!",
        description: "The share link has been copied to your clipboard."
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Link created",
        description: shortUrl,
      });
    }
  };

  const shareToSocial = async (platform: 'twitter' | 'facebook' | 'linkedin', options: ShareOptions) => {
    const shortUrl = await createShareLink(options);
    if (!shortUrl) return;

    const encodedUrl = encodeURIComponent(shortUrl);
    const encodedText = encodeURIComponent(options.title);

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const nativeShare = async (options: ShareOptions) => {
    if (!navigator.share) {
      // Fallback to clipboard if native sharing not supported
      await shareToClipboard(options);
      return;
    }

    const shortUrl = await createShareLink(options);
    if (!shortUrl) return;

    try {
      await navigator.share({
        title: options.title,
        url: shortUrl,
      });
    } catch (error) {
      // User cancelled sharing or error occurred
      if ((error as Error).name !== 'AbortError') {
        console.error('Native sharing failed:', error);
        // Fallback to clipboard
        await shareToClipboard({ ...options, url: shortUrl });
      }
    }
  };

  return {
    isSharing,
    shareToClipboard,
    shareToSocial,
    nativeShare,
    createShareLink
  };
}