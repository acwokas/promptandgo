import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, Trash2, Edit, Plus, Sparkles, AlertTriangle } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface GeneratedPrompt {
  id: string;
  title: string;
  prompt: string;
  description: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const MyGeneratedPrompts = () => {
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [promptToDelete, setPromptToDelete] = useState<{ id: string; title: string } | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadPrompts();
    }
  }, [user]);

  const loadPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('user_generated_prompts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrompts(data || []);
    } catch (error: any) {
      console.error('Error loading prompts:', error);
      toast({
        title: "Loading failed",
        description: "Failed to load your generated prompts.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (prompt: string) => {
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

  const handleDeleteConfirm = async () => {
    if (!promptToDelete) return;

    try {
      const { error } = await supabase
        .from('user_generated_prompts')
        .delete()
        .eq('id', promptToDelete.id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setPrompts(prompts.filter(p => p.id !== promptToDelete.id));
      setPromptToDelete(null);
      toast({
        title: "Deleted!",
        description: "Prompt has been deleted."
      });
    } catch (error: any) {
      console.error('Error deleting prompt:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete prompt.",
        variant: "destructive"
      });
    }
  };

  // Generate dynamic tags based on prompt characteristics
  const getDynamicTags = (prompt: GeneratedPrompt) => {
    const dynamicTags: string[] = [];
    
    // Length-based tags
    if (prompt.prompt.length < 100) {
      dynamicTags.push("Short");
    } else if (prompt.prompt.length < 300) {
      dynamicTags.push("Medium");
    } else {
      dynamicTags.push("Long");
    }
    
    // Content-based tags
    if (prompt.prompt.toLowerCase().includes('creative') || prompt.prompt.toLowerCase().includes('writing')) {
      dynamicTags.push("Creative");
    }
    if (prompt.prompt.toLowerCase().includes('business') || prompt.prompt.toLowerCase().includes('marketing')) {
      dynamicTags.push("Business");
    }
    if (prompt.prompt.toLowerCase().includes('technical') || prompt.prompt.toLowerCase().includes('code')) {
      dynamicTags.push("Technical");
    }
    if (prompt.prompt.toLowerCase().includes('analysis') || prompt.prompt.toLowerCase().includes('analyze')) {
      dynamicTags.push("Analysis");
    }
    
    // Recent tag for prompts created in the last 7 days
    const createdDate = new Date(prompt.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    if (createdDate > weekAgo) {
      dynamicTags.push("Recent");
    }
    
    return dynamicTags;
  };

  // Get all unique tags from prompts
  const getAllTags = () => {
    const allTags = new Set<string>();
    prompts.forEach(prompt => {
      prompt.tags.forEach(tag => allTags.add(tag));
      getDynamicTags(prompt).forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  };

  // Filter prompts based on active filter
  const filteredPrompts = activeFilter 
    ? prompts.filter(prompt => {
        const allPromptTags = [...prompt.tags, ...getDynamicTags(prompt)];
        return allPromptTags.includes(activeFilter);
      })
    : prompts;

  const handleTagClick = (tag: string) => {
    if (activeFilter === tag) {
      setActiveFilter(null); // Clear filter if clicking the same tag
    } else {
      setActiveFilter(tag);
    }
  };

  if (loading) {
    return (
      <>
        <SEO 
          title="My Generated Prompts - AI Created Content"
          description="View and manage your AI-generated prompts. Access your personal collection of custom prompts created with our AI generator."
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading your prompts...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="My Generated Prompts - AI Created Content"
        description="View and manage your AI-generated prompts. Access your personal collection of custom prompts created with our AI generator."
      />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">My Generated Prompts</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your personal collection of AI-generated prompts. Create, manage, and reuse your custom prompts.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {filteredPrompts.length} of {prompts.length} prompt{prompts.length !== 1 ? 's' : ''} 
              {activeFilter && <> • Filtered by: <Badge variant="secondary" className="ml-1">{activeFilter}</Badge></>}
            </p>
            {activeFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveFilter(null)}
                className="text-xs"
              >
                Clear Filter
              </Button>
            )}
          </div>
          <Button asChild>
            <Link to="/ai/generator">
              <Plus className="h-4 w-4 mr-2" />
              Generate New Prompt
            </Link>
          </Button>
        </div>

        {/* Filter Tags */}
        {prompts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Filter by tags:</h3>
            <div className="flex flex-wrap gap-2">
              {getAllTags().map((tag) => (
                <Badge
                  key={tag}
                  variant={activeFilter === tag ? "default" : "outline"}
                  className="cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Prompts Grid */}
        {filteredPrompts.length > 0 ? (
          <div className="grid gap-6">
            {filteredPrompts.map((prompt) => {
              const allTags = [...prompt.tags, ...getDynamicTags(prompt)];
              return (
              <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{prompt.title}</CardTitle>
                      {prompt.description && (
                        <CardDescription>{prompt.description}</CardDescription>
                      )}
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Generated
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={`prompt-${prompt.id}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <span>View full prompt</span>
                          <Badge variant="secondary" className="text-xs">
                            {prompt.prompt.length} characters
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 bg-muted rounded-lg border">
                          <pre className="whitespace-pre-wrap text-sm font-mono">
                            {prompt.prompt}
                          </pre>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Preview of prompt (first 150 characters) */}
                  <div className="p-3 bg-muted/30 rounded-lg border-l-4 border-l-primary/20">
                    <p className="text-sm text-muted-foreground italic">
                      "{prompt.prompt.substring(0, 150)}{prompt.prompt.length > 150 ? '...' : ''}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {allTags.map((tag) => {
                        const isDynamic = getDynamicTags(prompt).includes(tag);
                        return (
                          <Badge 
                            key={tag} 
                            variant={activeFilter === tag ? "default" : "outline"} 
                            className={`text-xs cursor-pointer hover:bg-muted transition-colors ${
                              isDynamic ? 'border-primary/40 bg-primary/5' : ''
                            }`}
                            onClick={() => handleTagClick(tag)}
                          >
                            {tag}
                          </Badge>
                        );
                      })}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(prompt.prompt)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPromptToDelete({ id: prompt.id, title: prompt.title })}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Created {new Date(prompt.created_at).toLocaleDateString()}</span>
                    {prompt.updated_at !== prompt.created_at && (
                      <span>Updated {new Date(prompt.updated_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        ) : activeFilter ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">No Prompts Match Filter</h3>
                  <p className="text-muted-foreground mb-4">
                    No prompts found with the "{activeFilter}" tag.
                  </p>
                  <Button onClick={() => setActiveFilter(null)} variant="outline">
                    Clear Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">No Generated Prompts Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start creating custom AI prompts with our intelligent generator.
                  </p>
                  <Button asChild>
                    <Link to="/ai/generator">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Prompt
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">💡 Tips for Managing Your Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Organize with Descriptions</h4>
                <p className="text-muted-foreground">
                  Use clear descriptions when generating prompts to easily find them later.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Copy and Customize</h4>
                <p className="text-muted-foreground">
                  Copy prompts to your clipboard and modify them as needed for different use cases.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Regular Cleanup</h4>
                <p className="text-muted-foreground">
                  Delete prompts you no longer need to keep your collection organized.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Generate Variations</h4>
                <p className="text-muted-foreground">
                  Create multiple versions of successful prompts for different scenarios.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!promptToDelete} onOpenChange={() => setPromptToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Caution!
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{promptToDelete?.title}"? This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPromptToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </>
  );
};

export default MyGeneratedPrompts;