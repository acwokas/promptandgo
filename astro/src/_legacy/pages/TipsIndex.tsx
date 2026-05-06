import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Clock, User } from "lucide-react";
import { format } from "date-fns";
import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { ArticleImage } from "@/components/ui/article-image";
interface Article {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  thumbnail_url: string;
  published_date: string;
  focus_keyword: string;
  meta_description: string;
  keyphrases: string[];
}

const TipsIndex = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, synopsis, thumbnail_url, published_date, focus_keyword, meta_description, keyphrases')
        .eq('is_published', true)
        .order('published_date', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error: any) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.synopsis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.focus_keyword?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.keyphrases?.some(kp => kp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <SEO 
        title="Tips & Guides"
        description="Discover helpful tips, guides, and insights to enhance your AI prompting skills and get the most out of your creative projects."
      />
      
      <PageHero
        title={<>Tips & <span className="text-gradient-brand">Guides</span></>}
        subtitle={<>Discover expert insights and practical tips to master AI prompting and boost your creativity.</>}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8">
          {/* Search */}
          <div className="flex items-center gap-4 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">
              {filteredArticles.length} articles
            </Badge>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Articles Grid */}
          {!loading && (
            <>
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-4">
                    {searchTerm ? 'No articles found' : 'No articles published yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? 'Try adjusting your search terms or browse all articles.' 
                      : 'Check back soon for helpful tips and guides!'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredArticles.map((article) => (
                    <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <Link to={`/tips/${article.slug}`} className="block">
                        {/* Thumbnail */}
                        {article.thumbnail_url ? (
                          <ArticleImage
                            src={article.thumbnail_url}
                            alt={article.title}
                            className="group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <div className="text-primary/40">
                              <User className="w-12 h-12" />
                            </div>
                          </div>
                        )}

                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                              {article.title}
                            </CardTitle>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {format(new Date(article.published_date), 'MMM d, yyyy')}
                          </div>
                        </CardHeader>

                        <CardContent>
                          <CardDescription className="line-clamp-3 mb-4">
                            {article.synopsis || article.meta_description || 'Read this helpful article...'}
                          </CardDescription>

                          {/* Keywords */}
                          {(article.focus_keyword || article.keyphrases?.length > 0) && (
                            <div className="flex flex-wrap gap-1">
                              {article.focus_keyword && (
                                <Badge variant="outline" className="text-xs">
                                  {article.focus_keyword}
                                </Badge>
                              )}
                              {article.keyphrases?.slice(0, 2).map((keyphrase, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {keyphrase}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TipsIndex;