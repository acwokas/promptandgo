import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onRemove?: () => void;
  currentImage?: string;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
}

// SVG is a scripting vector when served with image/svg+xml Content-Type. Never allow.
const SAFE_IMAGE_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const SAFE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

export const ImageUpload = ({
  onUpload,
  onRemove,
  currentImage,
  className,
  accept = SAFE_ACCEPT,
  maxSize = 5,
  disabled = false
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `Please select an image smaller than ${maxSize}MB`,
        variant: 'destructive'
      });
      return;
    }

    // MIME whitelist. Rejects image/svg+xml and everything else.
    const safeExt = SAFE_IMAGE_MIME[file.type];
    if (!safeExt) {
      toast({
        title: 'Unsupported image format',
        description: 'Please use JPEG, PNG, WebP, or GIF.',
        variant: 'destructive'
      });
      return;
    }

    // Magic-byte sniff to catch smuggled SVG under a raster MIME.
    const head = new Uint8Array(await file.slice(0, 512).arrayBuffer());
    const asText = new TextDecoder('utf-8', { fatal: false }).decode(head).toLowerCase().trimStart();
    if (
      asText.startsWith('<svg') ||
      asText.startsWith('<?xml') ||
      asText.startsWith('<!doctype svg') ||
      asText.includes('<script')
    ) {
      toast({
        title: 'File content did not match its declared type',
        description: 'The uploaded file appears to contain scripting content.',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Use whitelisted extension and force Content-Type. Do NOT trust the user filename.
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${safeExt}`;
      const filePath = `articles/${fileName}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { error } = await supabase.storage
        .from('article-images')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);

      onUpload(publicUrl.publicUrl);
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      });

    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload image',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (SAFE_IMAGE_MIME[file.type]) {
        uploadImage(file);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please use JPEG, PNG, WebP, or GIF. SVG uploads are not allowed.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current Image Preview */}
      {currentImage && !uploading && (
        <div className="relative">
          <img
            src={currentImage}
            alt="Current image"
            className="w-full max-w-sm h-32 object-cover rounded-lg border"
          />
          {onRemove && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onRemove}
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5",
          uploading && "pointer-events-none"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin mx-auto">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-sm">Uploading image...</p>
              <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {currentImage ? 'Replace image' : 'Upload an image'}
              </p>
              <p className="text-xs text-muted-foreground">
                Drag and drop or click to select • Max {maxSize}MB
              </p>
            </div>
            {!disabled && (
              <Button variant="outline" size="sm" type="button">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};