import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Star, TrendingUp, Shield, Clock } from "lucide-react";

const testimonials = [
  {
    quote: "These prompts saved me hours of work. The quality is incredible!",
    author: "Marketing Director",
    rating: 5,
  },
  {
    quote: "Best investment I've made for my content creation workflow.",
    author: "Freelance Writer", 
    rating: 5,
  },
  {
    quote: "Finally, prompts that actually work. No more trial and error.",
    author: "Small Business Owner",
    rating: 5,
  },
];

const stats = [
  { icon: Users, value: "2,500+", label: "Happy Users" },
  { icon: Star, value: "4.9/5", label: "1,800+ Reviews" },
  { icon: TrendingUp, value: "50K+", label: "Prompts Used" },
];

export function PacksSocialProof() {
  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-gradient-to-br from-background to-muted/30">
            <CardContent className="p-4 text-center">
              <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Testimonials Carousel */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full snap-center p-6 bg-gradient-to-br from-primary/5 to-transparent"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-sm italic text-foreground mb-3">
                  "{t.quote}"
                </blockquote>
                <div className="text-xs text-muted-foreground">— {t.author}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-3">
        <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
          <Shield className="h-3.5 w-3.5 text-green-500" />
          Secure Checkout
        </Badge>
        <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
          <Clock className="h-3.5 w-3.5 text-blue-500" />
          Instant Access
        </Badge>
        <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
          <Star className="h-3.5 w-3.5 text-yellow-500" />
          Premium Quality
        </Badge>
      </div>
    </div>
  );
}
