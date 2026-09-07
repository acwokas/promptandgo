import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, User } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface AvatarUploadProps {
  onAvatarUpdate?: (url: string) => void;
}

export const AvatarUpload = ({ onAvatarUpdate }: AvatarUploadProps) => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.user_metadata?.avatar_url || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);

      if (!user) {
        throw new Error("No user found");
      }

      // Whitelist MIME + extension. SVG is a scripting vector - never allow.
      const MIME_TO_EXT: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
      };
      const safeExt = MIME_TO_EXT[file.type];
      if (!safeExt) {
        throw new Error("Unsupported image format. Please use JPEG, PNG, WebP, or GIF.");
      }

      // Magic-byte sniff: reject anything that starts with an SVG/XML/script signature
      // even if the browser reported a safe MIME.
      const head = new Uint8Array(await file.slice(0, 512).arrayBuffer());
      const asText = new TextDecoder('utf-8', { fatal: false }).decode(head).toLowerCase().trimStart();
      if (
        asText.startsWith('<svg') ||
        asText.startsWith('<?xml') ||
        asText.startsWith('<!doctype svg') ||
        asText.includes('<script')
      ) {
        throw new Error("File content did not match its declared image type.");
      }

      // Force server-side extension + content-type using the whitelisted values,
      // NOT the user-supplied filename. Prevents .svg smuggled under .jpg.
      const fileName = `${user.id}/avatar.${safeExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: '3600',
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      // Update profile table if it exists
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        });

      setAvatarUrl(publicUrl);
      onAvatarUpdate?.(publicUrl);
      
      toast({
        title: "Avatar updated",
        description: "Your avatar has been updated successfully."
      });

    } catch (error: any) {
      toast({
        title: "Upload failed", 
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
    if (!ALLOWED.has(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please use JPEG, PNG, WebP, or GIF. SVG uploads are not allowed.",
        variant: "destructive"
      });
      return;
    }

    uploadAvatar(file);
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-16 h-16">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="bg-muted">
          <User className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Avatar"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Used in AI chat responses
        </p>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};