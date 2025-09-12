import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Share2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import SEO from "@/components/SEO";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  synopsis: string;
  thumbnail_url: string;
  published_date: string;
  focus_keyword: string;
  keyphrases: string[];
  meta_description: string;
  meta_title: string;
}

interface ArticleAsset {
  id: string;
  asset_type: string;
  asset_url: string;
  asset_title: string;
  asset_description: string;
  display_order: number;
}

const ArticleView = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [assets, setAssets] = useState<ArticleAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug]);

  const fetchArticle = async (articleSlug: string) => {
    try {
      // Fetch article
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', articleSlug)
        .eq('is_published', true)
        .single();

      if (articleError) {
        if (articleError.code === 'PGRST116') {
          setNotFound(true);
          return;
        }
        throw articleError;
      }

      setArticle(articleData);

      // Fetch assets
      const { data: assetsData, error: assetsError } = await supabase
        .from('article_assets')
        .select('*')
        .eq('article_id', articleData.id)
        .order('display_order');

      if (assetsError) throw assetsError;
      setAssets(assetsData || []);

    } catch (error: any) {
      console.error('Error fetching article:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const shareArticle = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.synopsis || article?.meta_description,
          url: url,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url);
    }
  };

  const renderAsset = (asset: ArticleAsset) => {
    switch (asset.asset_type) {
      case 'image':
        return (
          <div key={asset.id} className="my-6">
            <img
              src={asset.asset_url}
              alt={asset.asset_title || 'Article image'}
              className="w-full rounded-lg shadow-md"
            />
            {(asset.asset_title || asset.asset_description) && (
              <div className="mt-2 text-center">
                {asset.asset_title && (
                  <div className="font-medium text-sm">{asset.asset_title}</div>
                )}
                {asset.asset_description && (
                  <div className="text-xs text-muted-foreground">{asset.asset_description}</div>
                )}
              </div>
            )}
          </div>
        );

      case 'youtube':
        const youtubeId = asset.asset_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
        if (!youtubeId) return null;
        
        return (
          <div key={asset.id} className="my-6">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={asset.asset_title || 'YouTube video'}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
            {(asset.asset_title || asset.asset_description) && (
              <div className="mt-2 text-center">
                {asset.asset_title && (
                  <div className="font-medium text-sm">{asset.asset_title}</div>
                )}
                {asset.asset_description && (
                  <div className="text-xs text-muted-foreground">{asset.asset_description}</div>
                )}
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div key={asset.id} className="my-6">
            <video
              src={asset.asset_url}
              controls
              className="w-full rounded-lg shadow-md"
            >
              Your browser does not support the video tag.
            </video>
            {(asset.asset_title || asset.asset_description) && (
              <div className="mt-2 text-center">
                {asset.asset_title && (
                  <div className="font-medium text-sm">{asset.asset_title}</div>
                )}
                {asset.asset_description && (
                  <div className="text-xs text-muted-foreground">{asset.asset_description}</div>
                )}
              </div>
            )}
          </div>
        );

      case 'link':
        return (
          <Card key={asset.id} className="my-6">
            <CardContent className="p-4">
              <a
                href={asset.asset_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                {asset.asset_title || asset.asset_url}
              </a>
              {asset.asset_description && (
                <p className="text-sm text-muted-foreground mt-2">{asset.asset_description}</p>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-muted rounded w-32"></div>
          <div className="h-10 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <>
        <SEO 
          title="Article Not Found"
          description="The article you're looking for could not be found."
          noindex={true}
        />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/tips">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse All Articles
            </Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={article.meta_title || article.title}
        description={article.meta_description || article.synopsis}
        image={article.thumbnail_url}
        ogType="article"
        publishedTime={article.published_date}
      />
      
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/tips">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tips
              </Link>
            </Button>
          </div>

          {/* Hero Image */}
          {article.thumbnail_url && (
            <div className="aspect-video mb-8 overflow-hidden rounded-lg shadow-lg">
              <img
                src={article.thumbnail_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>
            
            {article.synopsis && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {article.synopsis}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {format(new Date(article.published_date), 'MMMM d, yyyy')}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={shareArticle}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>

            {/* Keywords */}
            {(article.focus_keyword || article.keyphrases?.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {article.focus_keyword && (
                  <Badge variant="default">
                    {article.focus_keyword}
                  </Badge>
                )}
                {article.keyphrases?.map((keyphrase, index) => (
                  <Badge key={index} variant="outline">
                    {keyphrase}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                p: ({ children, ...props }) => (
                  <p className="mb-4 leading-relaxed" {...props}>
                    {children}
                  </p>
                ),
                img: ({ src, alt, ...props }) => (
                  <img
                    src={src}
                    alt={alt}
                    className="rounded-lg shadow-md w-full"
                    {...props}
                  />
                ),
                a: ({ href, children, ...props }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                br: () => <br className="my-2" />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Article Assets */}
          {assets.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
              {assets.map(renderAsset)}
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Found This Helpful?</h3>
            <p className="text-muted-foreground mb-6">
              Explore more tips and guides to enhance your AI prompting skills.
            </p>
            <Button asChild size="lg">
              <Link to="/tips">Browse More Articles</Link>
            </Button>
          </div>
        </div>
      </article>
    </>
  );
};

export default ArticleView;