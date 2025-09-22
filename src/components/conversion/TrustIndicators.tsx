import { Shield, Star, Award, Users, CheckCircle, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export const SecurityBadges = () => (
  <div className="flex items-center justify-center gap-6 py-4">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Shield className="h-4 w-4 text-green-500" />
      <span>SSL Encrypted</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <CheckCircle className="h-4 w-4 text-blue-500" />
      <span>GDPR Compliant</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Star className="h-4 w-4 text-yellow-500" />
      <span>4.9/5 Rating</span>
    </div>
  </div>
);

export const UserStats = () => (
  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 text-center">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div>
        <div className="text-2xl font-bold">5,000+</div>
        <div className="text-sm text-muted-foreground">Active Users</div>
      </div>
      <div>
        <div className="text-2xl font-bold">100K+</div>
        <div className="text-sm text-muted-foreground">Prompts Used</div>
      </div>
      <div>
        <div className="text-2xl font-bold">50+</div>
        <div className="text-sm text-muted-foreground">Hours Saved Daily</div>
      </div>
      <div>
        <div className="text-2xl font-bold">4.9★</div>
        <div className="text-sm text-muted-foreground">User Rating</div>
      </div>
    </div>
  </div>
);

const testimonials = [
  {
    quote: "Saves me 2+ hours every day. The prompts actually work!",
    author: "Sarah M. - Marketing Director"
  },
  {
    quote: "Best investment for my freelance business. ROI in first week.",
    author: "Mike R. - Freelance Writer"
  },
  {
    quote: "Game changer for content creation. Can't work without it now.",
    author: "Lisa K. - Content Creator"
  }
];

export const TestimonialHighlights = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Trusted by Professionals Worldwide</h3>
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">4.9/5 from 1,200+ reviews</span>
        </div>
      </div>
      
      <div className="md:hidden">
        {/* Mobile: Single testimonial carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevTestimonial}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary' : 'bg-primary/30'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTestimonial}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Single testimonial */}
          <div className="bg-background border rounded-lg p-4 text-center">
            <div className="flex items-center gap-0.5 justify-center mb-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              "{testimonials[currentIndex].quote}"
            </p>
            <p className="text-xs font-medium">{testimonials[currentIndex].author}</p>
          </div>
        </div>
      </div>
      
      <div className="hidden md:block">
        {/* Desktop: Grid layout */}
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background border rounded-lg p-4 text-center">
              <div className="flex items-center gap-0.5 justify-center mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                "{testimonial.quote}"
              </p>
              <p className="text-xs font-medium">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AsSeenIn = () => (
  <div className="text-center py-8">
    <p className="text-sm text-muted-foreground mb-4">Trusted by teams at</p>
    <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8 grayscale opacity-60 flex-wrap">
      <div className="font-bold text-sm sm:text-base md:text-lg">Microsoft</div>
      <div className="font-bold text-sm sm:text-base md:text-lg">Google</div>
      <div className="font-bold text-sm sm:text-base md:text-lg">Amazon</div>
      <div className="font-bold text-sm sm:text-base md:text-lg">Spotify</div>
      <div className="font-bold text-sm sm:text-base md:text-lg">Slack</div>
    </div>
    <p className="text-xs text-muted-foreground mt-2">
      *Individual employees, not official company endorsements
    </p>
  </div>
);

export const GuaranteeBadge = () => (
  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
    <div className="flex items-center justify-center gap-2 mb-2">
      <Shield className="h-5 w-5 text-green-600" />
      <span className="font-semibold text-green-800">30-Day Money-Back Guarantee</span>
    </div>
    <p className="text-sm text-green-700">
      Not happy with your results? Get a full refund, no questions asked.
    </p>
  </div>
);