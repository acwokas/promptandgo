import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, CheckCheck, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface AiResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  response: string;
  provider: string;
  originalPrompt?: string;
  onRetry?: () => void;
}

export const AiResponseModal: React.FC<AiResponseModalProps> = ({
  isOpen,
  onClose,
  response,
  provider,
  originalPrompt,
  onRetry
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Response copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy response to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([response], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-response-${provider.toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Response saved as text file",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">AI</span>
            </div>
            Response from {provider}
          </DialogTitle>
          <DialogDescription>
            {originalPrompt && (
              <div className="text-sm text-muted-foreground mt-2">
                <strong>Original prompt:</strong> {originalPrompt.slice(0, 100)}
                {originalPrompt.length > 100 && '...'}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <Textarea
            value={response}
            readOnly
            className="flex-1 min-h-[300px] resize-none bg-muted/50 border-muted text-sm"
            placeholder="AI response will appear here..."
          />
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCopy} variant="outline" size="sm">
              {copied ? (
                <>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Response
                </>
              )}
            </Button>
            
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            
            {onRetry && (
              <Button onClick={onRetry} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            
            <Button onClick={onClose} variant="default" size="sm" className="ml-auto">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};