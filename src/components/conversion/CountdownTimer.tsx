import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Zap, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface CountdownTimerProps {
  variant?: "inline" | "banner" | "popup";
  offer?: string;
  expiryHours?: number;
}

const CountdownTimer = ({ 
  variant = "banner", 
  offer = "50% OFF All Premium Packs",
  expiryHours = 24 
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-4 text-center">
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

  // Default banner variant
  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
      <div className="container px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 animate-pulse" />
              <span className="font-semibold">{offer}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm">
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
              <span className="hidden sm:inline">Claim Offer</span>
              <span className="sm:hidden">Claim</span>
            </Link>
          </Button>
        </div>
        
        {/* Mobile timer */}
        <div className="sm:hidden flex items-center justify-center gap-2 mt-2 text-sm">
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
    </div>
  );
};

export default CountdownTimer;