import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Star } from "lucide-react";

interface QuickDiscoverySectionProps {
  onSearchClick: (query: string) => void;
}

export function QuickDiscoverySection({ onSearchClick }: QuickDiscoverySectionProps) {
  return (
    <section className="mt-16 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
          Discover What's Popular
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore trending prompts, fresh additions, and community favorites to find exactly what you need.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trending Now */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Trending Now</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Most popular prompts this week</p>
            <div className="space-y-2">
              <Badge 
                variant="secondary" 
                className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => onSearchClick("LinkedIn content strategy")}
              >
                LinkedIn content strategy
              </Badge>
              <Badge 
                variant="secondary" 
                className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => onSearchClick("email marketing")}
              >
                Email marketing
              </Badge>
              <Badge 
                variant="secondary" 
                className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => onSearchClick("interview prep")}
              >
                Interview prep
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* New This Week */}
        <Card className="bg-gradient-to-br from-green-50 to-transparent border-green-200 dark:from-green-950 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold">New This Week</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Fresh prompts added recently</p>
            <div className="space-y-2">
              <Badge 
                variant="secondary" 
                className="text-xs cursor-pointer hover:bg-green-500/20 transition-colors"
                onClick={() => onSearchClick("AI art generation")}
              >
                AI art generation
              </Badge>
              <Badge 
                variant="secondary" 
                className="text-xs cursor-pointer hover:bg-green-500/20 transition-colors"
                onClick={() => onSearchClick("business strategy")}
              >
                Business strategy
              </Badge>
              <Badge 
                variant="secondary" 
                className="text-xs cursor-pointer hover:bg-green-500/20 transition-colors"
                onClick={() => onSearchClick("code review")}
              >
                Code review
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Community Favorites */}
        <Card className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20 dark:from-accent/20 dark:border-accent/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-semibold">Community Favorites</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Highest rated by users</p>
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-accent/20 transition-colors"
                onClick={() => onSearchClick("resume writing")}
              >
                Resume writing
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-accent/20 transition-colors"
                onClick={() => onSearchClick("product description")}
              >
                Product description
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-accent/20 transition-colors"
                onClick={() => onSearchClick("social media post")}
              >
                Social media post
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
