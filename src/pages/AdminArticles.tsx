import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import { format } from "date-fns";
import SEO from "@/components/SEO";

interface Article {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  thumbnail_url: string;
  published_date: string;
  is_published: boolean;
  focus_keyword: string;
  created_at: string;
  updated_at: string;
}

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error: any) {
      console.error('Error fetching articles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch articles',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Article deleted successfully'
      });
      
      fetchArticles();
    } catch (error: any) {
      console.error('Error deleting article:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete article',
        variant: 'destructive'
      });
    }
  };

  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    try {
      const updateData: any = { is_published: !currentStatus };
      
      // If publishing for the first time, set published_date
      if (!currentStatus) {
        updateData.published_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Article ${!currentStatus ? 'published' : 'unpublished'} successfully`
      });
      
      fetchArticles();
    } catch (error: any) {
      console.error('Error updating article:', error);
      toast({
        title: 'Error',
        description: 'Failed to update article status',
        variant: 'destructive'
      });
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.synopsis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.focus_keyword?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Manage Articles" 
        description="Admin interface for managing blog articles"
        noindex={true}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Article Management</h1>
              <p className="text-muted-foreground">Create and manage your blog articles</p>
            </div>
            <Button asChild>
              <a href="/admin/articles/new">
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
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

          <div className="grid gap-4">
            {filteredArticles.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-muted-foreground mb-4">
                    {searchTerm ? 'No articles found matching your search.' : 'No articles created yet.'}
                  </div>
                  <Button asChild>
                    <a href="/admin/articles/new">Create Your First Article</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {article.synopsis || 'No synopsis provided'}
                        </CardDescription>
                      </div>
                      {article.thumbnail_url && (
                        <img
                          src={article.thumbnail_url}
                          alt={article.title}
                          className="w-16 h-16 object-cover rounded ml-4"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={article.is_published ? "default" : "secondary"}>
                          {article.is_published ? 'Published' : 'Draft'}
                        </Badge>
                        {article.focus_keyword && (
                          <Badge variant="outline">{article.focus_keyword}</Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          /{article.slug}
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {article.published_date ? (
                          <span>Published: {format(new Date(article.published_date), 'MMM d, yyyy')}</span>
                        ) : (
                          <span>Created: {format(new Date(article.created_at), 'MMM d, yyyy')}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button size="sm" asChild>
                          <a href={`/admin/articles/edit/${article.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </a>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={article.is_published ? "secondary" : "default"}
                          onClick={() => togglePublishStatus(article.id, article.is_published)}
                        >
                          {article.is_published ? 'Unpublish' : 'Publish'}
                        </Button>

                        {article.is_published && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/tips/${article.slug}`} target="_blank">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </a>
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteArticle(article.id, article.title)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminArticles;