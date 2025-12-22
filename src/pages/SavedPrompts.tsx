import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSavedPrompts } from '@/hooks/useSavedPrompts';
import SEO from '@/components/SEO';
import PageHero from '@/components/layout/PageHero';
import { toast } from '@/hooks/use-toast';

const SavedPrompts = () => {
  const { savedPrompts, removePrompt, clearAllSaved, count } = useSavedPrompts();

  const handleRemove = (promptId: string, title: string) => {
    removePrompt(promptId);
    toast({ title: `Removed "${title}" from saved prompts` });
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all saved prompts?')) {
      clearAllSaved();
      toast({ title: 'All saved prompts cleared' });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <SEO
        title="Saved Prompts"
        description="Your saved AI prompts for quick access. No login required."
        noindex
      />
      
      <PageHero
        title="Saved Prompts"
        subtitle={count > 0 ? `You have ${count} saved prompt${count !== 1 ? 's' : ''}` : 'Save prompts for quick access later'}
      />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        {count > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Saved prompts are stored locally on this device.
              </p>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>

            <div className="space-y-4">
              {savedPrompts.map((prompt) => (
                <Card key={prompt.id} className="group hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={prompt.slug} 
                          className="hover:text-primary transition-colors"
                        >
                          <CardTitle className="text-lg font-semibold line-clamp-1">
                            {prompt.title}
                          </CardTitle>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {prompt.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Saved {formatDate(prompt.savedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link to={prompt.slug}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(prompt.id, prompt.title)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {prompt.excerpt && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {prompt.excerpt}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Bookmark className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No saved prompts yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Browse our library and click the bookmark icon to save prompts for quick access. 
                No login required!
              </p>
              <Button asChild>
                <Link to="/library">Browse Prompts</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default SavedPrompts;