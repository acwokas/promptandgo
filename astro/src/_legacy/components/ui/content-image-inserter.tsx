import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "./image-upload";
import { Input } from "./input";
import { Label } from "./label";
import { Image as ImageIcon } from "lucide-react";

interface ContentImageInserterProps {
  onInsert: (imageMarkdown: string) => void;
  disabled?: boolean;
}

export const ContentImageInserter = ({ onInsert, disabled }: ContentImageInserterProps) => {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");

  const handleInsert = () => {
    if (!imageUrl.trim()) return;

    const alt = altText.trim() || "Article image";
    let markdown = `![${alt}](${imageUrl})`;
    
    if (caption.trim()) {
      markdown += `\n*${caption}*`;
    }

    onInsert(markdown);
    
    // Reset form
    setImageUrl("");
    setAltText("");
    setCaption("");
    setOpen(false);
  };

  const handleUpload = (url: string) => {
    setImageUrl(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} type="button">
          <ImageIcon className="w-4 h-4 mr-2" />
          Insert Image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>
            Upload an image or provide a URL to insert into your article content.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Upload Section */}
          <div>
            <Label>Upload Image</Label>
            <ImageUpload
              currentImage={imageUrl}
              onUpload={handleUpload}
              onRemove={() => setImageUrl("")}
            />
          </div>

          {/* Manual URL */}
          <div className="space-y-2">
            <Label htmlFor="image-url">Or enter image URL</Label>
            <Input
              id="image-url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Alt Text */}
          <div className="space-y-2">
            <Label htmlFor="alt-text">Alt Text</Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image for accessibility"
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Image caption text"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsert} disabled={!imageUrl.trim()}>
              Insert Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};