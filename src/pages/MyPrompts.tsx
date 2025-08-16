import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Heart, Bookmark, Trash2, ExternalLink, Search, Bot } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PromptCard } from "@/components/prompt/PromptCard";
import type { Category as CategoryType } from "@/data/prompts";
import { toast as toastUtil } from "@/hooks/use-toast";

interface UserGeneratedPrompt {
  id: string;
  title: string;
  prompt: string;
  description?: string;
  tags: string[];
  created_at: string;
}

interface SavedPrompt {
  id: string;
  categoryId: string;
  subcategoryId?: string | null;
  title: string;
  whatFor?: string | null;
  prompt: string;
  excerpt?: string | null;
  tags: string[];
  isPro?: boolean;
}

const MyPromptsPage = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  
  // State for saved prompts (favorites)
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [savedPromptsLoading, setSavedPromptsLoading] = useState(false);
  
  // State for AI-generated prompts
  const [userGeneratedPrompts, setUserGeneratedPrompts] = useState<UserGeneratedPrompt[]>([]);
  const [generatedPromptsLoading, setGeneratedPromptsLoading] = useState(false);
  
  // Categories for PromptCard
  const [categories, setCategories] = useState<CategoryType[]>([]);

  // Load categories for PromptCard functionality
  const loadCategories = useCallback(async () => {
    const [catRes, subRes] = await Promise.all([
      supabase.from("categories").select("id,name,slug").order("name"),
      supabase.from("subcategories").select("id,name,slug,category_id").order("name"),
    ]);

    if (catRes.error || subRes.error) return;

    const subcatByCategory = new Map<string, { id: string; name: string }[]>();
    (subRes.data || []).forEach((s: any) => {
      const list = subcatByCategory.get(s.category_id as string) || [];
      list.push({ id: s.id as string, name: s.name as string });
      subcatByCategory.set(s.category_id as string, list);
    });

    const built: CategoryType[] = (catRes.data || [])
      .filter((c: any) => subcatByCategory.has(c.id as string))
      .map((c: any) => ({
        id: c.id as string,
        name: c.name as string,
        subcategories: subcatByCategory.get(c.id as string) || [],
      }));

    setCategories(built);
  }, []);

  // Load user's saved prompts (favorites)
  const loadSavedPrompts = useCallback(async () => {
    if (!user) return;
    
    setSavedPromptsLoading(true);
    try {
      const { data: favoriteIds } = await supabase
        .from("favorites")
        .select("prompt_id")
        .eq("user_id", user.id);

      if (!favoriteIds || favoriteIds.length === 0) {
        setSavedPrompts([]);
        return;
      }

      const { data, error } = await supabase
        .from("prompts")
        .select("id, category_id, subcategory_id, title, what_for, prompt, excerpt, is_pro")
        .in("id", favoriteIds.map(f => f.prompt_id))
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mappedPrompts = (data || []).map((r: any) => ({
        id: r.id,
        categoryId: r.category_id,
        subcategoryId: r.subcategory_id,
        title: r.title,
        whatFor: r.what_for,
        prompt: r.prompt,
        excerpt: r.excerpt,
        tags: [],
        isPro: !!r.is_pro,
      }));

      setSavedPrompts(mappedPrompts);
    } catch (error: any) {
      console.error('Error loading saved prompts:', error);
      toastUtil({ title: "Failed to load saved prompts", variant: "destructive" });
    } finally {
      setSavedPromptsLoading(false);
    }
  }, [user]);

  // Load user's AI-generated prompts
  const loadUserGeneratedPrompts = useCallback(async () => {
    if (!user) return;
    
    setGeneratedPromptsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_generated_prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserGeneratedPrompts(data || []);
    } catch (error: any) {
      console.error('Error loading user generated prompts:', error);
      toastUtil({ title: "Failed to load AI-generated prompts", variant: "destructive" });
    } finally {
      setGeneratedPromptsLoading(false);
    }
  }, [user]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Prompt copied to clipboard." });
    } catch (error) {
      toast({ title: "Copy failed", description: "Failed to copy prompt to clipboard.", variant: "destructive" });
    }
  };

  const handleDeleteGeneratedPrompt = async (promptId: string) => {
    try {
      const { error } = await supabase
        .from('user_generated_prompts')
        .delete()
        .eq('id', promptId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setUserGeneratedPrompts(prev => prev.filter(p => p.id !== promptId));
      toast({ title: "Prompt deleted", description: "Your generated prompt has been removed." });
    } catch (error: any) {
      console.error('Error deleting prompt:', error);
      toast({ title: "Delete failed", description: "Failed to delete the prompt.", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (user) {
      loadCategories();
      loadSavedPrompts();
      loadUserGeneratedPrompts();
    }
  }, [user, loadCategories, loadSavedPrompts, loadUserGeneratedPrompts]);

  if (!user) {
    return (
      <>
        <SEO 
          title="My Prompts - Login Required"
          description="Login to view and manage your saved prompts and AI-generated prompts."
        />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Login Required</h1>
          <p className="text-muted-foreground mb-8">
            Please login to view and manage your saved prompts and AI-generated prompts.
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
        title="My Prompts - Saved & AI-Generated"
        description="View and manage your saved prompts and AI-generated custom prompts all in one place."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">My Prompts</h1>
          <p className="text-muted-foreground">
            Manage your saved prompts and AI-generated custom prompts
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/library">
                <Search className="h-4 w-4 mr-2" />
                Browse Library
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/toolkit">
                <Bot className="h-4 w-4 mr-2" />
                AI Tools
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick navigation for sections */}
        <section className="mb-12">
          <div className="flex justify-center gap-4 mb-6">
            <Button asChild variant="outline" size="sm">
              <a href="#my-saved-prompts">
                <Heart className="h-4 w-4 mr-2" />
                My Saved Prompts ({savedPrompts.length})
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="#my-generated-prompts">
                <Bot className="h-4 w-4 mr-2" />
                My AI-Generated Prompts ({userGeneratedPrompts.length})
              </a>
            </Button>
          </div>
        </section>

        {/* My Saved Prompts section */}
        <section id="my-saved-prompts" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">My Saved Prompts</h2>
            <p className="text-muted-foreground">
              Prompts you've saved for quick access
            </p>
          </div>

          {savedPromptsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-48"></div>
                </div>
              ))}
            </div>
          ) : savedPrompts.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No saved prompts yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring prompts and click the heart icon to save your favorites.
                </p>
                <Button asChild>
                  <Link to="/library">Browse Prompts</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt as any}
                  categories={categories}
                  onTagClick={() => {}}
                  onCategoryClick={() => {}}
                  onSubcategoryClick={() => {}}
                  onCopyClick={() => {}}
                />
              ))}
            </div>
          )}
        </section>

        {/* My AI-Generated Prompts section */}
        <section id="my-generated-prompts" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">My AI-Generated Prompts</h2>
            <p className="text-muted-foreground">
              Custom prompts you've generated with our AI tools
            </p>
          </div>

          {generatedPromptsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-48"></div>
                </div>
              ))}
            </div>
          ) : userGeneratedPrompts.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No AI-generated prompts yet</h3>
                <p className="text-muted-foreground mb-6">
                  Use our AI tools to generate custom prompts tailored to your needs.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button asChild>
                    <Link to="/ai/generator">Generate Your First Prompt</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/ai-assistant">Try AI Assistant</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userGeneratedPrompts.map((promptData) => (
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
                          onClick={() => handleDeleteGeneratedPrompt(promptData.id)}
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
        </section>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="mr-4">
            <Link to="/ai/generator">
              <ExternalLink className="h-4 w-4 mr-2" />
              Generate New Prompt
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/library">
              <Search className="h-4 w-4 mr-2" />
              Explore More Prompts
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default MyPromptsPage;