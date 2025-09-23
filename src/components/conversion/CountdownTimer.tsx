import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Zap, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

interface CountdownTimerProps {
  variant?: "inline" | "banner" | "popup";
  offer?: string;
  expiryHours?: number;
}

interface CountdownSettings {
  enabled: boolean;
  offer_text: string;
  expiry_hours: number;
}

const CountdownTimer = ({ 
  variant = "banner", 
  offer: propOffer,
  expiryHours: propExpiryHours
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [settings, setSettings] = useState<CountdownSettings | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { isSubscribed, loading: subscriptionLoading } = useSubscriptionStatus();

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('countdown_settings')
          .select('enabled, offer_text, expiry_hours')
          .maybeSingle();

        if (error) {
          console.error('Error loading countdown settings:', error);
          // Fallback to showing countdown if can't load settings
          setSettings({ enabled: true, offer_text: "50% OFF All Power Packs", expiry_hours: 24 });
          setIsVisible(true);
          return;
        }

        if (data) {
          setSettings(data);
          setIsVisible(data.enabled);
        } else {
          // No settings found, use defaults
          setSettings({ enabled: true, offer_text: "50% OFF All Power Packs", expiry_hours: 24 });
          setIsVisible(true);
        }
      } catch (err) {
        console.error('Error loading countdown settings:', err);
        // Fallback to showing countdown if can't load settings
        setSettings({ enabled: true, offer_text: "50% OFF All Power Packs", expiry_hours: 24 });
        setIsVisible(true);
      }
    };

    loadSettings();
  }, []);

  // Use database settings or props as fallback
  const offer = settings?.offer_text || propOffer || "50% OFF All Power Packs";
  const expiryHours = settings?.expiry_hours || propExpiryHours || 24;

  useEffect(() => {
    // Set expiry time to 24 hours from now (or specified hours)
    const now = new Date().getTime();
    const expiry = now + (expiryHours * 60 * 60 * 1000);
    
    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const difference = expiry - currentTime;
      
      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryHours]);

  // Debug logging for mobile issue
  console.log('CountdownTimer debug:', {
    isVisible,
    isSubscribed,
    subscriptionLoading,
    settings,
    shouldRender: isVisible && !isSubscribed && !subscriptionLoading
  });

  // Temporarily bypass subscription check for debugging
  if (!isVisible) {
    return null;
  }

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4 text-red-500 animate-pulse" />
        <span className="text-muted-foreground">Offer expires in:</span>
        <div className="flex gap-1">
          <Badge variant="destructive" className="text-xs animate-pulse">
            {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m
          </Badge>
        </div>
      </div>
    );
  }

  if (variant === "popup") {
    return (
      <div className="bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 animate-pulse" />
          <span className="font-semibold">Limited Time Offer!</span>
        </div>
        <div className="text-sm mb-3">{offer}</div>
        <div className="flex justify-center gap-2 mb-3">
          <div className="bg-white/20 rounded px-2 py-1 text-xs">
            <div className="font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs opacity-75">HRS</div>
          </div>
          <div className="bg-white/20 rounded px-2 py-1 text-xs">
            <div className="font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs opacity-75">MIN</div>
          </div>
          <div className="bg-white/20 rounded px-2 py-1 text-xs">
            <div className="font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs opacity-75">SEC</div>
          </div>
        </div>
        <Button asChild size="sm" variant="secondary" className="w-full">
          <Link to="/packs">Claim Offer Now</Link>
        </Button>
      </div>
    );
  }

  // Default banner variant - Hidden on mobile
  return (
    <div className="hidden sm:block bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground">
      <div className="container px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 animate-pulse" />
              <span className="font-semibold">{offer}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Ends in:</span>
              <div className="flex gap-1">
                <div className="bg-white/20 rounded px-2 py-1 text-xs font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </div>
                <div className="bg-white/20 rounded px-2 py-1 text-xs font-mono">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </div>
                <div className="bg-white/20 rounded px-2 py-1 text-xs font-mono">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </div>
              </div>
            </div>
          </div>
          
          <Button asChild size="sm" variant="secondary" className="shrink-0">
            <Link to="/packs">
              Claim Offer
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;