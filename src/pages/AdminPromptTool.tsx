import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Navigate } from "react-router-dom";
import { Lock, CheckCircle, MessageSquare, Megaphone, ShoppingBag, BarChart2, Briefcase, User, HeartPulse, Clock, Sparkles, Tag, Copy, Heart } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

interface Pack {
  id: string;
  name: string;
  slug: string;
}

const AdminPromptTool = () => {
  const { loading: authLoading } = useSupabaseAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);

  // Form state
  const [title, setTitle] = useState("");
  const [whatFor, setWhatFor] = useState("");
  const [prompt, setPrompt] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("none");
  const [subcategoryId, setSubcategoryId] = useState("none");
  const [tags, setTags] = useState("");
  const [packSlug, setPackSlug] = useState("none");
  const [isPro, setIsPro] = useState(false);
  const [ribbon, setRibbon] = useState("none");
  
  // Add new item states
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewSubcategory, setShowNewSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [showNewPack, setShowNewPack] = useState(false);
  const [newPackName, setNewPackName] = useState("");
  const [newPackDescription, setNewPackDescription] = useState("");
  const [newPackPrice, setNewPackPrice] = useState("999");
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false);

  // Character limits
  const limits = {
    title: 100,
    whatFor: 150,
    prompt: 2000,
    imagePrompt: 500,
    excerpt: 300
  };

  const ribbonOptions = [
    { value: "none", label: "No ribbon" },
    { value: "popular", label: "Popular" },
    { value: "bestseller", label: "Bestseller" },
    { value: "new", label: "New" },
    { value: "trending", label: "Trending" },
    { value: "featured", label: "Featured" }
  ];

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      const [categoriesRes, subcategoriesRes, packsRes] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("subcategories").select("*").order("name"),
        supabase.from("packs").select("*").order("name")
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (subcategoriesRes.data) setSubcategories(subcategoriesRes.data);
      if (packsRes.data) setPacks(packsRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load categories, subcategories, and packs",
        variant: "destructive",
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "add-new") {
      setShowNewCategory(true);
      setCategoryId("none");
      setSubcategoryId("none");
    } else {
      setShowNewCategory(false);
      setCategoryId(value);
      setSubcategoryId("none");
    }
  };

  const handleSubcategoryChange = (value: string) => {
    if (value === "add-new") {
      setShowNewSubcategory(true);
      setSubcategoryId("none");
    } else {
      setShowNewSubcategory(false);
      setSubcategoryId(value);
    }
  };

  const handlePackChange = (value: string) => {
    if (value === "add-new") {
      setShowNewPack(true);
      setPackSlug("none");
    } else {
      setShowNewPack(false);
      setPackSlug(value);
    }
  };

  const createCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { data, error } = await supabase
        .from("categories")
        .insert({ name: newCategoryName.trim(), slug })
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, data]);
      setCategoryId(data.id);
      setShowNewCategory(false);
      setNewCategoryName("");
      
      toast({
        title: "Success",
        description: "Category created successfully!",
      });
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const createSubcategory = async () => {
    if (!newSubcategoryName.trim() || categoryId === "none") return;

    try {
      const slug = newSubcategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { data, error } = await supabase
        .from("subcategories")
        .insert({ 
          name: newSubcategoryName.trim(), 
          slug, 
          category_id: categoryId 
        })
        .select()
        .single();

      if (error) throw error;

      setSubcategories(prev => [...prev, data]);
      setSubcategoryId(data.id);
      setShowNewSubcategory(false);
      setNewSubcategoryName("");
      
      toast({
        title: "Success",
        description: "Subcategory created successfully!",
      });
    } catch (error) {
      console.error("Error creating subcategory:", error);
      toast({
        title: "Error",
        description: "Failed to create subcategory",
        variant: "destructive",
      });
    }
  };

  const createPack = async () => {
    if (!newPackName.trim()) return;

    try {
      const slug = newPackName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { data, error } = await supabase
        .from("packs")
        .insert({ 
          name: newPackName.trim(), 
          slug,
          description: newPackDescription.trim() || null,
          price_cents: parseInt(newPackPrice)
        })
        .select()
        .single();

      if (error) throw error;

      setPacks(prev => [...prev, data]);
      setPackSlug(data.slug);
      setShowNewPack(false);
      setNewPackName("");
      setNewPackDescription("");
      setNewPackPrice("999");
      
      toast({
        title: "Success",
        description: "Power Pack created successfully!",
      });
    } catch (error) {
      console.error("Error creating pack:", error);
      toast({
        title: "Error",
        description: "Failed to create power pack",
        variant: "destructive",
      });
    }
  };

  const generateAutoTags = (title: string, prompt: string, whatFor?: string) => {
    const text = `${title} ${prompt} ${whatFor || ''}`.toLowerCase();
    
    // Common words to exclude
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'you', 'your', 'i', 'my', 'me', 'we', 'our', 'us', 'they', 'them', 'their', 'it', 'its']);
    
    // Extract meaningful words
    const words = text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    // Get top 5 most frequent words as tags
    return Object.entries(words)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word)
      .join(', ');
  };

  const getCharacterCount = (text: string, limit: number) => {
    const remaining = limit - text.length;
    const isOverLimit = remaining < 0;
    return {
      count: text.length,
      remaining: Math.max(0, remaining),
      isOverLimit,
      display: isOverLimit ? `${Math.abs(remaining)} over limit` : `${remaining} remaining`
    };
  };

  const getCategoryIcon = (name?: string) => {
    const n = (name || "").toLowerCase();
    if (/(social|community|chat|conversation)/.test(n)) return <MessageSquare className="h-3.5 w-3.5" aria-hidden />;
    if (/(market|advert|campaign|growth)/.test(n)) return <Megaphone className="h-3.5 w-3.5" aria-hidden />;
    if (/(ecom|shop|store|retail)/.test(n)) return <ShoppingBag className="h-3.5 w-3.5" aria-hidden />;
    if (/(analytic|data|report|insight)/.test(n)) return <BarChart2 className="h-3.5 w-3.5" aria-hidden />;
    if (/(business|automation|ops)/.test(n)) return <Briefcase className="h-3.5 w-3.5" aria-hidden />;
    if (/(career|job|work|resume|cv)/.test(n)) return <User className="h-3.5 w-3.5" aria-hidden />;
    if (/(wellness|health|fitness|mind)/.test(n)) return <HeartPulse className="h-3.5 w-3.5" aria-hidden />;
    if (/(productivity|time|focus|task)/.test(n)) return <Clock className="h-3.5 w-3.5" aria-hidden />;
    if (/(lifestyle|hobby|creative|inspiration)/.test(n)) return <Sparkles className="h-3.5 w-3.5" aria-hidden />;
    return <Tag className="h-3.5 w-3.5" aria-hidden />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim() || !categoryId || categoryId === "none") {
      toast({
        title: "Error",
        description: "Please fill in title, prompt, and category",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create the prompt
      const { data: promptData, error: promptError } = await supabase
        .from("prompts")
        .insert({
          title: title.trim(),
          what_for: whatFor.trim() || null,
          prompt: prompt.trim(),
          image_prompt: imagePrompt.trim() || null,
          excerpt: excerpt.trim() || null,
          category_id: categoryId,
          subcategory_id: subcategoryId === "none" ? null : subcategoryId || null,
          is_pro: isPro,
          ribbon: ribbon === "none" ? null : ribbon || null
        })
        .select()
        .single();

      if (promptError) throw promptError;

      // Handle tags
      let finalTags = tags.trim();
      if (!finalTags) {
        // Auto-generate tags if none provided
        finalTags = generateAutoTags(title, prompt, whatFor);
      }
      
      if (finalTags) {
        const tagNames = finalTags.split(",").map(t => t.trim()).filter(Boolean);
        const tagPromises = tagNames.map(async (tagName) => {
          // First, try to insert the tag (will fail if it already exists)
          try {
            await supabase
              .from("tags")
              .insert({ name: tagName })
              .select()
              .single();
          } catch (error) {
            // Ignore error if tag exists
          }

          // Get the tag ID
          const { data: tagData } = await supabase
            .from("tags")
            .select("id")
            .eq("name", tagName)
            .single();

          if (tagData) {
            // Link tag to prompt
            await supabase
              .from("prompt_tags")
              .insert({
                prompt_id: promptData.id,
                tag_id: tagData.id
              });
          }
        });

        await Promise.all(tagPromises);
      }

      // Handle pack association
      if (packSlug && packSlug !== "none") {
        const { data: packData } = await supabase
          .from("packs")
          .select("id")
          .eq("slug", packSlug)
          .single();

        if (packData) {
          await supabase
            .from("pack_prompts")
            .insert({
              pack_id: packData.id,
              prompt_id: promptData.id
            });
        }
      }

      toast({
        title: "Success",
        description: "Prompt created successfully!",
      });

      // Reset form
      setTitle("");
      setWhatFor("");
      setPrompt("");
      setImagePrompt("");
      setExcerpt("");
      setCategoryId("none");
      setSubcategoryId("none");
      setTags("");
      setPackSlug("none");
      setIsPro(false);
      setRibbon("none");

    } catch (error) {
      console.error("Error creating prompt:", error);
      toast({
        title: "Error",
        description: "Failed to create prompt",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Wait for both auth and admin checks to complete
  if (authLoading || adminLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const filteredSubcategories = subcategories.filter(sub => sub.category_id === (categoryId === "none" ? "" : categoryId));

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Admin Prompt Tool"
        description="Create new prompts"
      />
      
      <PageHero
        title="Admin Prompt Tool"
        subtitle="Create and manage individual prompts"
        variant="admin"
      />

      <AdminBreadcrumb 
        items={[
          { label: "Prompt Tool" }
        ]} 
      />

      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= limits.title) {
                        setTitle(value);
                      }
                    }}
                    placeholder="Enter prompt title"
                    className={getCharacterCount(title, limits.title).isOverLimit ? "border-destructive" : ""}
                  />
                  <div className={`text-xs ${getCharacterCount(title, limits.title).isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
                    {getCharacterCount(title, limits.title).display}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatFor">What For</Label>
                  <Input
                    id="whatFor"
                    value={whatFor}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= limits.whatFor) {
                        setWhatFor(value);
                      }
                    }}
                    placeholder="What this prompt is for"
                    className={getCharacterCount(whatFor, limits.whatFor).isOverLimit ? "border-destructive" : ""}
                  />
                  <div className={`text-xs ${getCharacterCount(whatFor, limits.whatFor).isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
                    {getCharacterCount(whatFor, limits.whatFor).display}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt *</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= limits.prompt) {
                      setPrompt(value);
                    }
                  }}
                  placeholder="Enter the prompt content"
                  rows={8}
                  className={getCharacterCount(prompt, limits.prompt).isOverLimit ? "border-destructive" : ""}
                />
                <div className={`text-xs ${getCharacterCount(prompt, limits.prompt).isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
                  {getCharacterCount(prompt, limits.prompt).display}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagePrompt">Image Prompt</Label>
                <Textarea
                  id="imagePrompt"
                  value={imagePrompt}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= limits.imagePrompt) {
                      setImagePrompt(value);
                    }
                  }}
                  placeholder="Enter image generation prompt (optional)"
                  rows={3}
                  className={getCharacterCount(imagePrompt, limits.imagePrompt).isOverLimit ? "border-destructive" : ""}
                />
                <div className={`text-xs ${getCharacterCount(imagePrompt, limits.imagePrompt).isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
                  {getCharacterCount(imagePrompt, limits.imagePrompt).display}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= limits.excerpt) {
                      setExcerpt(value);
                    }
                  }}
                  placeholder="Brief description/excerpt"
                  rows={3}
                  className={getCharacterCount(excerpt, limits.excerpt).isOverLimit ? "border-destructive" : ""}
                />
                <div className={`text-xs ${getCharacterCount(excerpt, limits.excerpt).isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
                  {getCharacterCount(excerpt, limits.excerpt).display}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={categoryId} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select a category</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="add-new">+ Add new category</SelectItem>
                    </SelectContent>
                  </Select>
                  {showNewCategory && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter category name"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        onClick={createCategory} 
                        size="sm"
                        disabled={!newCategoryName.trim()}
                      >
                        Add
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => {setShowNewCategory(false); setNewCategoryName("");}} 
                        variant="outline" 
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select value={subcategoryId} onValueChange={handleSubcategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {filteredSubcategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                      {categoryId !== "none" && (
                        <SelectItem value="add-new">+ Add new subcategory</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {showNewSubcategory && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        placeholder="Enter subcategory name"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        onClick={createSubcategory} 
                        size="sm"
                        disabled={!newSubcategoryName.trim() || categoryId === "none"}
                      >
                        Add
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => {setShowNewSubcategory(false); setNewSubcategoryName("");}} 
                        variant="outline" 
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
                <div className="text-xs text-muted-foreground">
                  Leave blank to auto-generate tags from title and prompt content
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pack">Power Pack</Label>
                  <Select value={packSlug} onValueChange={handlePackChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pack (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {packs.map((pack) => (
                        <SelectItem key={pack.slug} value={pack.slug}>
                          {pack.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="add-new">+ Add new power pack</SelectItem>
                    </SelectContent>
                  </Select>
                  {showNewPack && (
                    <div className="space-y-2 mt-2">
                      <div className="flex gap-2">
                        <Input
                          value={newPackName}
                          onChange={(e) => setNewPackName(e.target.value)}
                          placeholder="Power pack name"
                          className="flex-1"
                        />
                        <Input
                          value={newPackPrice}
                          onChange={(e) => setNewPackPrice(e.target.value)}
                          placeholder="Price (cents)"
                          type="number"
                          className="w-32"
                        />
                      </div>
                      <Textarea
                        value={newPackDescription}
                        onChange={(e) => setNewPackDescription(e.target.value)}
                        placeholder="Description (optional)"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          onClick={createPack} 
                          size="sm"
                          disabled={!newPackName.trim()}
                        >
                          Add Pack
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => {
                            setShowNewPack(false); 
                            setNewPackName(""); 
                            setNewPackDescription(""); 
                            setNewPackPrice("999");
                          }} 
                          variant="outline" 
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ribbon">Ribbon</Label>
                  <Select value={ribbon} onValueChange={setRibbon}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ribbon" />
                    </SelectTrigger>
                    <SelectContent>
                      {ribbonOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPro"
                  checked={isPro}
                  onCheckedChange={setIsPro}
                />
                <Label htmlFor="isPro">PRO prompt</Label>
              </div>

              <div className="flex gap-4">
                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                  <DialogTrigger asChild>
                    <Button 
                      type="button" 
                      variant="outline" 
                      disabled={!title.trim() || !prompt.trim() || categoryId === "none"}
                      className="flex-1"
                    >
                      Preview Prompt
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Prompt Preview</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Prompt Card Preview - Matching actual PromptCard appearance */}
                      <Card className="relative overflow-hidden">
                        <CardHeader>
                          <div className="mb-2">
                            {isPro ? (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                <Lock className="h-3.5 w-3.5" aria-hidden />
                                <span>PRO</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <CheckCircle className="h-3.5 w-3.5" aria-hidden />
                                <span>FREE</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                            {categories.find(c => c.id === categoryId) && (
                              <span className="inline-flex items-center gap-1.5 text-primary">
                                {getCategoryIcon(categories.find(c => c.id === categoryId)?.name)}
                                <span>{categories.find(c => c.id === categoryId)?.name}</span>
                              </span>
                            )}
                            {categories.find(c => c.id === categoryId) && filteredSubcategories.find(s => s.id === subcategoryId) && <span>›</span>}
                            {filteredSubcategories.find(s => s.id === subcategoryId) && (
                              <span className="inline-flex items-center gap-1.5 text-primary">
                                {getCategoryIcon(filteredSubcategories.find(s => s.id === subcategoryId)?.name)}
                                <span>{filteredSubcategories.find(s => s.id === subcategoryId)?.name}</span>
                              </span>
                            )}
                          </div>
                          
                          <CardTitle className="text-xl leading-tight">{title || "Untitled"}</CardTitle>
                          {whatFor && <p className="text-sm text-muted-foreground">🤓 {whatFor}</p>}
                          {excerpt && <p className="text-sm text-muted-foreground">✅ {excerpt}</p>}
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div>
                            <div className="text-xs font-medium mb-1">Prompt:</div>
                            <div className="relative">
                              <pre className="whitespace-pre-wrap p-4 sm:p-5 rounded-md text-[0.975rem] sm:text-[1.05rem] leading-7 bg-muted border font-mono"> 
                                {prompt || "No prompt content"}
                              </pre>
                            </div>
                            
                            <div className="mt-2 flex flex-col gap-2">
                              <Button size="sm" variant="default" className="w-full" disabled>
                                <Copy className="h-4 w-4" />
                                <span>Copy Prompt</span>
                              </Button>
                              <Button variant="outline" size="sm" className="w-full" disabled>
                                <Heart className="h-5 w-5" />
                                <span>Add to My Prompts</span>
                              </Button>
                            </div>
                          </div>

                          {imagePrompt && (
                            <div>
                              <div className="text-xs font-medium mb-1">Image Prompt:</div>
                              <div className="p-3 bg-muted rounded-md border">
                                <p className="whitespace-pre-wrap text-sm font-mono">{imagePrompt}</p>
                              </div>
                            </div>
                          )}

                          {packs.find(p => p.slug === packSlug) && (
                            <div className="space-y-2">
                              <div className="text-xs font-medium">Power Pack:</div>
                              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 border border-primary/20">
                                <span className="text-sm font-medium text-primary">
                                  {packs.find(p => p.slug === packSlug)?.name}
                                </span>
                              </div>
                            </div>
                          )}

                          {ribbon !== "none" && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium">Ribbon:</span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                {ribbonOptions.find(r => r.value === ribbon)?.label}
                              </span>
                            </div>
                          )}

                          {(tags || generateAutoTags(title, prompt, whatFor)) && (
                            <div className="space-y-2">
                              <div className="text-xs font-medium">Tags:</div>
                              <div className="flex flex-wrap gap-1">
                                {(tags || generateAutoTags(title, prompt, whatFor)).split(',').map((tag: string, i: number) => (
                                  <span key={i} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
                                    {tag.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Prompt"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPromptTool;