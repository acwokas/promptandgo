import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Heart, Bookmark, Trash2, ExternalLink, Search } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserGeneratedPrompt {
  id: string;
  title: string;
  prompt: string;
  description?: string;
  tags: string[];
  created_at: string;
}

const MyPromptsPage = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<UserGeneratedPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserPrompts();
    }
  }, [user]);

  const loadUserPrompts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_generated_prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrompts(data || []);
    } catch (error: any) {
      console.error('Error loading prompts:', error);
      toast({
        title: "Error loading prompts",
        description: "Failed to load your generated prompts.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (promptId: string) => {
    try {
      const { error } = await supabase
        .from('user_generated_prompts')
        .delete()
        .eq('id', promptId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setPrompts(prompts.filter(p => p.id !== promptId));
      toast({
        title: "Prompt deleted",
        description: "Your generated prompt has been removed."
      });
    } catch (error: any) {
      console.error('Error deleting prompt:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the prompt.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <>
        <SEO 
          title="My Prompts - Login Required"
          description="Login to view and manage your generated AI prompts."
        />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Login Required</h1>
          <p className="text-muted-foreground mb-8">
            Please login to view and manage your generated prompts.
          </p>
          <Button asChild>
            <Link to="/auth">Login</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="My Generated Prompts"
        description="View and manage your AI-generated prompts. Copy, edit, or delete your custom prompts."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">My Generated Prompts</h1>
          <p className="text-muted-foreground">
            View and manage all your AI-generated prompts in one place
          </p>
          <div className="mt-4 flex items-center justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/library">
                <Search className="h-4 w-4 mr-2" />
                Browse Library
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48"></div>
              </div>
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No prompts yet</h3>
              <p className="text-muted-foreground mb-6">
                Start generating custom AI prompts to see them here.
              </p>
              <Button asChild>
                <Link to="/ai/generator">Generate Your First Prompt</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {prompts.map((promptData) => (
              <Card key={promptData.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-2">
                        {promptData.title}
                      </CardTitle>
                      {promptData.description && (
                        <CardDescription className="line-clamp-2 mt-1">
                          {promptData.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-3 text-sm max-h-32 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      {promptData.prompt.substring(0, 200)}
                      {promptData.prompt.length > 200 && '...'}
                    </pre>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {promptData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      {new Date(promptData.created_at).toLocaleDateString()}
                    </span>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(promptData.prompt)}
                      >
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(promptData.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link to="/ai/generator">
              <ExternalLink className="h-4 w-4 mr-2" />
              Generate New Prompt
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default MyPromptsPage;