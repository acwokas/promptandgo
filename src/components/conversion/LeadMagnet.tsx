import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Mail, Download, CheckCircle, Sparkles, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LeadMagnetProps {
  variant?: 'default' | 'popup' | 'sidebar' | 'inline';
  offer?: {
    title: string;
    description: string;
    items: string[];
    value?: string;
  };
  className?: string;
}

const defaultOffer = {
  title: "Free AI Prompt Starter Pack",
  description: "Get 25 high-converting prompts that save 10+ hours weekly",
  items: [
    "25 battle-tested AI prompts",
    "ChatGPT & Claude optimized versions", 
    "Time-saving email templates",
    "Content creation shortcuts",
    "Business strategy prompts"
  ],
  value: "$97"
};

const LeadMagnet = ({ 
  variant = 'default', 
  offer = defaultOffer,
  className = '' 
}: LeadMagnetProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { 
          email,
          source: 'lead-magnet',
          lead_magnet: offer.title
        }
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "🎉 Success!",
        description: "Check your email for your free prompt pack!"
      });

      // Track conversion
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'lead_magnet_conversion', {
          event_category: 'engagement',
          event_label: offer.title
        });
      }

    } catch (error: any) {
      console.error('Lead magnet signup error:', error);
      
      if (error.message?.includes('already subscribed')) {
        toast({
          title: "You're already subscribed!",
          description: "Check your email for the free prompt pack.",
        });
        setIsSuccess(true);
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again in a moment.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const SuccessState = () => (
    <div className="text-center py-8">
      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Check Your Email!</h3>
      <p className="text-muted-foreground mb-4">
        Your free prompt pack is on its way. Don't forget to check your spam folder.
      </p>
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm font-medium mb-2">What's next?</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Download your free prompts</li>
          <li>• Try them with ChatGPT or Claude</li>
          <li>• Join our community for more tips</li>
        </ul>
      </div>
    </div>
  );

  const FormContent = () => (
    <>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          {offer.value && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Worth {offer.value} - FREE
            </Badge>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
        <p className="text-muted-foreground">{offer.description}</p>
      </div>

      <div className="bg-muted/30 rounded-lg p-4 mb-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          What you'll get:
        </h4>
        <ul className="space-y-2">
          {offer.items.map((item, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Get Free Prompt Pack
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          No spam, ever. Unsubscribe with one click anytime.
        </p>
      </form>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <Clock className="h-4 w-4" />
          <span className="font-medium">Limited time:</span>
          Free access expires soon
        </div>
      </div>
    </>
  );

  if (variant === 'popup') {
    return (
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${className}`}>
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            {isSuccess ? <SuccessState /> : <FormContent />}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <Card className={`sticky top-4 ${className}`}>
        <CardContent className="p-4">
          {isSuccess ? <SuccessState /> : <FormContent />}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 border ${className}`}>
        {isSuccess ? <SuccessState /> : <FormContent />}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        {isSuccess ? <SuccessState /> : <FormContent />}
      </CardContent>
    </Card>
  );
};

export default LeadMagnet;