import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { SeoOptimizedImage } from "@/components/seo/SeoOptimizedImage";

interface Article {
  slug: string;
  title: string;
  thumbnail_url: string | null;
  published_date: string;
  synopsis: string | null;
  meta_description: string | null;
}

interface LatestArticleSectionProps {
  isReturningUser: boolean;
  latestArticle: Article | null;
  articleLoading: boolean;
}

export function LatestArticleSection({ isReturningUser, latestArticle, articleLoading }: LatestArticleSectionProps) {
  return (
    <section className="py-12 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            {isReturningUser ? 'Latest Article' : 'Welcome to PromptandGo.ai'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isReturningUser ? 'Stay updated with our latest prompt strategies and AI tips' : 'Learn how to get the most out of AI with battle-tested prompts'}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <article>
            {isReturningUser ? (
              latestArticle && !articleLoading ? (
                <Link to={`/tips/${latestArticle.slug}`} className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <Card className="overflow-hidden">
                    <div className="aspect-[16/9] w-full bg-muted overflow-hidden">
                      <img
                        src={latestArticle.thumbnail_url || "/lovable-uploads/62fad3e0-9f93-4964-8448-ab0375c35a17.png"}
                        alt={latestArticle.title}
                        loading="eager"
                        width={800}
                        height={450}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = "/lovable-uploads/62fad3e0-9f93-4964-8448-ab0375c35a17.png";
                        }}
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          Latest Article
                        </div>
                        <time className="text-sm text-muted-foreground">
                          {new Date(latestArticle.published_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {latestArticle.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {latestArticle.synopsis || latestArticle.meta_description}
                      </p>
                      <span className="inline-flex items-center text-primary font-medium">
                        Read more <Sparkles className="h-4 w-4 ml-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ) : articleLoading ? (
                <Card className="overflow-hidden">
                  <div className="aspect-[16/9] w-full bg-muted animate-pulse" />
                  <CardContent className="p-6">
                    <div className="bg-muted animate-pulse h-4 w-32 mb-3 rounded" />
                    <div className="bg-muted animate-pulse h-6 w-3/4 mb-3 rounded" />
                    <div className="bg-muted animate-pulse h-4 w-full mb-2 rounded" />
                    <div className="bg-muted animate-pulse h-4 w-2/3 rounded" />
                  </CardContent>
                </Card>
              ) : (
                <FallbackArticle />
              )
            ) : (
              <WelcomeArticle />
            )}
          </article>
        </div>
        
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/tips">Read All Articles →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FallbackArticle() {
  return (
    <Link to="/tips/beginners-guide-midjourney-prompts" className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
      <Card className="overflow-hidden">
        <SeoOptimizedImage
          src="/lovable-uploads/62fad3e0-9f93-4964-8448-ab0375c35a17.png"
          alt="Beginner's Guide to MidJourney Prompts"
          loading="lazy"
          width={800}
          height={450}
          sizes="(max-width: 768px) 100vw, 800px"
          className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold leading-snug mb-3">Beginner's Guide to MidJourney Prompts That Actually Work</h3>
          <p className="text-muted-foreground mb-4">
            Learn how to build detailed prompts that give you more control, unlock stylistic variety, and save hours of trial and error in MidJourney.
          </p>
          <span className="inline-flex items-center text-primary font-medium">
            Read more <Sparkles className="h-4 w-4 ml-1" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

function WelcomeArticle() {
  return (
    <Link to="/tips/welcome-to-promptandgo-ai" className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
      <Card className="overflow-hidden">
        <SeoOptimizedImage
          src="/lovable-uploads/66b1134b-1d55-416b-b7ea-2719a1a22ec1.png"
          alt="Welcome to PromptandGo: Your Shortcut to Smarter AI Prompts"
          loading="lazy"
          fetchPriority="low"
          width={837}
          height={469}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold leading-snug mb-3">Welcome to PromptandGo.ai: Your Shortcut to Smarter AI Prompts</h3>
          <p className="text-muted-foreground mb-4">
            We give you ready-to-use, field-tested prompts designed for real work. No vague ideas, no guesswork, just clear instructions you can drop straight into ChatGPT, Claude, or Gemini.
          </p>
          <span className="inline-flex items-center text-primary font-medium">
            Read more <Sparkles className="h-4 w-4 ml-1" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
