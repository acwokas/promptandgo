import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Navigate } from "react-router-dom";

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
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [packSlug, setPackSlug] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [ribbon, setRibbon] = useState("");

  const ribbonOptions = [
    { value: "", label: "No ribbon" },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim() || !categoryId) {
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
          subcategory_id: subcategoryId || null,
          is_pro: isPro,
          ribbon: ribbon || null
        })
        .select()
        .single();

      if (promptError) throw promptError;

      // Handle tags
      if (tags.trim()) {
        const tagNames = tags.split(",").map(t => t.trim()).filter(Boolean);
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
      if (packSlug) {
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
      setCategoryId("");
      setSubcategoryId("");
      setTags("");
      setPackSlug("");
      setIsPro(false);
      setRibbon("");

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

  const filteredSubcategories = subcategories.filter(sub => sub.category_id === categoryId);

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
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter prompt title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatFor">What For</Label>
                  <Input
                    id="whatFor"
                    value={whatFor}
                    onChange={(e) => setWhatFor(e.target.value)}
                    placeholder="What this prompt is for"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt *</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter the prompt content"
                  rows={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagePrompt">Image Prompt</Label>
                <Textarea
                  id="imagePrompt"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Enter image generation prompt (optional)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description/excerpt"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select value={subcategoryId} onValueChange={setSubcategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {filteredSubcategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pack">Power Pack</Label>
                  <Select value={packSlug} onValueChange={setPackSlug}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pack (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {packs.map((pack) => (
                        <SelectItem key={pack.slug} value={pack.slug}>
                          {pack.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Prompt"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPromptTool;