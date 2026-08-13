import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Marketing Director",
    company: "TechStartup Inc.",
    avatar: "SM",
    rating: 5,
    quote: "These prompts saved me 15+ hours per week. I went from struggling with content creation to having a systematic approach that actually works.",
    result: "15 hours saved weekly",
    timeframe: "First week",
    badge: "Marketing Expert"
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Freelance Writer",
    company: "Self-employed",
    avatar: "MC",
    rating: 5,
    quote: "My productivity doubled overnight. What used to take me 4 hours now takes 90 minutes, and the quality is consistently better.",
    result: "2x productivity increase",
    timeframe: "Within 3 days",
    badge: "Content Creator"
  },
  {
    id: 3,
    name: "Jennifer Park",
    role: "Small Business Owner",
    company: "Park's Bakery",
    avatar: "JP",
    rating: 5,
    quote: "I was spending $2000/month on copywriting. Now I create professional content myself for a fraction of the cost.",
    result: "$24k saved annually",
    timeframe: "First month",
    badge: "Small Business"
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Sales Manager",
    company: "CloudSoft Solutions",
    avatar: "DR",
    rating: 5,
    quote: "Our email response rates increased by 180%. These aren't just templates - they're strategic frameworks that actually convert.",
    result: "180% higher response rates",
    timeframe: "Within 2 weeks",
    badge: "Sales Professional"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Content Creator",
    company: "YouTube & Blog",
    avatar: "LT",
    rating: 5,
    quote: "I plan an entire month of content in 2 hours now. My audience growth has been incredible since I started using these prompts.",
    result: "400% audience growth",
    timeframe: "First month",
    badge: "Influencer"
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    role: "Career Changer",
    company: "Tech Transition",
    avatar: "AH",
    rating: 5,
    quote: "Landed 3 job offers using the career prompts. My salary increased by 85% in my career transition from retail to tech.",
    result: "85% salary increase",
    timeframe: "2 months",
    badge: "Career Success"
  }
];

interface RotatingTestimonialsProps {
  variant?: "carousel" | "fade" | "minimal";
  autoRotate?: boolean;
  interval?: number;
}

const RotatingTestimonials = ({ 
  variant = "carousel", 
  autoRotate = true, 
  interval = 5000 
}: RotatingTestimonialsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!autoRotate || isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoRotate, interval, isHovered]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  if (variant === "minimal") {
    return (
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Quote className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-relaxed mb-2">
              "{currentTestimonial.quote}"
            </p>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-primary/10">
                  {currentTestimonial.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <span className="font-medium">{currentTestimonial.name}</span>
                <span className="text-muted-foreground"> • {currentTestimonial.result}</span>
              </div>
            </div>
          </div>
          <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {currentTestimonial.timeframe}
          </Badge>
        </div>
      </div>
    );
  }

  if (variant === "fade") {
    return (
      <Card 
        className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            {Array.from({ length: currentTestimonial.rating }, (_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          
          <Quote className="h-8 w-8 text-primary mx-auto mb-4" />
          
          <p className="text-lg font-medium leading-relaxed mb-6 max-w-2xl mx-auto">
            "{currentTestimonial.quote}"
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {currentTestimonial.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="font-semibold">{currentTestimonial.name}</div>
              <div className="text-sm text-muted-foreground">
                {currentTestimonial.role} • {currentTestimonial.company}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 mb-4">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {currentTestimonial.result}
            </Badge>
            <Badge variant="outline">
              {currentTestimonial.timeframe}
            </Badge>
            <Badge variant="secondary">
              {currentTestimonial.badge}
            </Badge>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center gap-2">
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
        </CardContent>
      </Card>
    );
  }

  // Default carousel variant
  return (
    <Card 
      className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">What Our Users Say</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevTestimonial}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTestimonial}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <div className="flex">
              {Array.from({ length: currentTestimonial.rating }, (_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            
            <Quote className="h-8 w-8 text-primary" />
            
            <p className="text-lg leading-relaxed">
              "{currentTestimonial.quote}"
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {currentTestimonial.result}
              </Badge>
              <Badge variant="outline">
                {currentTestimonial.timeframe}
              </Badge>
            </div>
          </div>
          
          <div className="text-center">
            <Avatar className="h-20 w-20 mx-auto mb-4">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {currentTestimonial.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="font-semibold text-lg">{currentTestimonial.name}</div>
            <div className="text-muted-foreground">
              {currentTestimonial.role}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentTestimonial.company}
            </div>
            <Badge className="mt-2" variant="secondary">
              {currentTestimonial.badge}
            </Badge>
          </div>
        </div>
        
        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mt-6">
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
      </CardContent>
    </Card>
  );
};

export default RotatingTestimonials;