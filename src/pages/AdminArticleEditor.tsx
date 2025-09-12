import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Save, ArrowLeft, Plus, Trash2, Upload, ExternalLink, Eye, Edit, Columns2, FileEdit } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { format } from "date-fns";
import SEO from "@/components/SEO";
import { ImageUpload } from "@/components/ui/image-upload";
import { ContentImageInserter } from "@/components/ui/content-image-inserter";
import { ContentLinkInserter } from "@/components/ui/content-link-inserter";
import { RichTextToolbar } from "@/components/ui/rich-text-toolbar";

interface Article {
  id?: string;
  title: string;
  slug: string;
  content: string;
  synopsis: string;
  thumbnail_url: string;
  published_date: string | null;
  is_published: boolean;
  focus_keyword: string;
  keyphrases: string[];
  meta_description: string;
  meta_title: string;
}

interface ArticleAsset {
  id?: string;
  article_id: string;
  asset_type: string;
  asset_url: string;
  asset_title: string;
  asset_description: string;
  display_order: number;
}

const AdminArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [article, setArticle] = useState<Article>({
    title: '',
    slug: '',
    content: '',
    synopsis: '',
    thumbnail_url: '',
    published_date: null,
    is_published: false,
    focus_keyword: '',
    keyphrases: [],
    meta_description: '',
    meta_title: ''
  });

  const [assets, setAssets] = useState<ArticleAsset[]>([]);
  const [newKeyphrase, setNewKeyphrase] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [sideBySideMode, setSideBySideMode] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    setLoading(true);
    try {
      // Fetch article
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();

      if (articleError) throw articleError;
      setArticle(articleData);

      // Fetch assets
      const { data: assetsData, error: assetsError } = await supabase
        .from('article_assets')
        .select('*')
        .eq('article_id', articleId)
        .order('display_order');

      if (assetsError) throw assetsError;
      setAssets(assetsData || []);

    } catch (error: any) {
      console.error('Error fetching article:', error);
      toast({
        title: 'Error',
        description: 'Failed to load article',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setArticle(prev => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value)
    }));
  };

  const addKeyphrase = () => {
    if (newKeyphrase.trim() && !article.keyphrases.includes(newKeyphrase.trim())) {
      setArticle(prev => ({
        ...prev,
        keyphrases: [...prev.keyphrases, newKeyphrase.trim()]
      }));
      setNewKeyphrase('');
    }
  };

  const removeKeyphrase = (keyphrase: string) => {
    setArticle(prev => ({
      ...prev,
      keyphrases: prev.keyphrases.filter(kp => kp !== keyphrase)
    }));
  };

  const insertImageIntoContent = (imageMarkdown: string) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = article.content;
    
    // Insert the markdown at cursor position
    const newContent = currentContent.substring(0, start) + 
                      '\n\n' + imageMarkdown + '\n\n' + 
                      currentContent.substring(end);
    
    setArticle(prev => ({ ...prev, content: newContent }));
    
    // Focus back to textarea and position cursor after inserted content
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + imageMarkdown.length + 4; // +4 for the \n\n characters
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertLinkIntoContent = (linkMarkdown: string) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = article.content;
    
    // Insert the markdown at cursor position
    const newContent = currentContent.substring(0, start) + 
                      linkMarkdown + 
                      currentContent.substring(end);
    
    setArticle(prev => ({ ...prev, content: newContent }));
    
    // Focus back to textarea and position cursor after inserted content
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + linkMarkdown.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // When pressing Enter, insert a paragraph break (blank line). Use Shift+Enter for single line break.
  const handleContentKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const textarea = contentTextareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = article.content;
      const newValue = value.slice(0, start) + '\n\n' + value.slice(end);
      setArticle(prev => ({ ...prev, content: newValue }));
      setTimeout(() => {
        textarea.focus();
        const pos = start + 2;
        textarea.setSelectionRange(pos, pos);
      }, 0);
    }
  };

  const addAsset = () => {
    const newAsset: ArticleAsset = {
      article_id: article.id || '',
      asset_type: 'image',
      asset_url: '',
      asset_title: '',
      asset_description: '',
      display_order: assets.length
    };
    setAssets([...assets, newAsset]);
  };

  const updateAsset = (index: number, field: keyof ArticleAsset, value: any) => {
    setAssets(prev => prev.map((asset, i) => 
      i === index ? { ...asset, [field]: value } : asset
    ));
  };

  const removeAsset = (index: number) => {
    setAssets(prev => prev.filter((_, i) => i !== index));
  };

  const saveArticle = async (publish = false) => {
    setSaving(true);
    try {
      // Validation
      if (!article.title.trim() || !article.content.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Title and content are required',
          variant: 'destructive'
        });
        return;
      }

      const articleData = {
        ...article,
        is_published: publish || article.is_published,
        published_date: publish && !article.published_date ? new Date().toISOString() : article.published_date
      };

      let savedArticle;

      if (id === 'new' || !article.id) {
        // Create new article
        const { data, error } = await supabase
          .from('articles')
          .insert([articleData])
          .select()
          .single();

        if (error) throw error;
        savedArticle = data;
        setArticle(savedArticle);
      } else {
        // Update existing article
        const { data, error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', article.id)
          .select()
          .single();

        if (error) throw error;
        savedArticle = data;
      }

      // Save assets
      if (assets.length > 0 && savedArticle.id) {
        // Delete existing assets
        await supabase
          .from('article_assets')
          .delete()
          .eq('article_id', savedArticle.id);

        // Insert new assets
        const assetsToSave = assets
          .filter(asset => asset.asset_url.trim())
          .map(asset => ({
            ...asset,
            article_id: savedArticle.id
          }));

        if (assetsToSave.length > 0) {
          const { error: assetsError } = await supabase
            .from('article_assets')
            .insert(assetsToSave);

          if (assetsError) throw assetsError;
        }
      }

      toast({
        title: 'Success',
        description: `Article ${publish ? 'published' : 'saved'} successfully`
      });

      // Navigate to edit page if this was a new article
      if (id === 'new') {
        navigate(`/admin/articles/edit/${savedArticle.id}`);
      }

    } catch (error: any) {
      console.error('Error saving article:', error);
      toast({
        title: 'Error',
        description: 'Failed to save article',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${id === 'new' ? 'Create' : 'Edit'} Article`}
        description="Article editor for managing blog content"
        noindex={true}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin/articles')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Button>
            <h1 className="text-3xl font-bold">
              {id === 'new' ? 'Create New Article' : 'Edit Article'}
            </h1>
          </div>

          <div className="flex gap-4 mb-6">
            <Button 
              onClick={() => saveArticle(false)}
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button 
              onClick={() => saveArticle(true)}
              disabled={saving}
              variant="default"
            >
              {saving ? 'Publishing...' : 'Publish'}
            </Button>
            {article.is_published && article.slug && (
              <Button variant="outline" asChild>
                <a href={`/tips/${article.slug}`} target="_blank">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live
                </a>
              </Button>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Article Content</CardTitle>
                  <CardDescription>The main content and basic information for your article</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={article.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter article title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={article.slug}
                      onChange={(e) => setArticle(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="url-friendly-slug"
                    />
                    <p className="text-sm text-muted-foreground">
                      Will be available at: /tips/{article.slug}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="synopsis">Synopsis</Label>
                    <Textarea
                      id="synopsis"
                      value={article.synopsis}
                      onChange={(e) => setArticle(prev => ({ ...prev, synopsis: e.target.value }))}
                      placeholder="Brief description of the article"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="content">Content *</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSideBySideMode(!sideBySideMode)}
                        >
                          {sideBySideMode ? (
                            <>
                              <FileEdit className="w-4 h-4 mr-2" />
                              Edit Only
                            </>
                          ) : (
                            <>
                              <Columns2 className="w-4 h-4 mr-2" />
                              Side by Side
                            </>
                          )}
                        </Button>
                        <ContentLinkInserter 
                          onInsert={insertLinkIntoContent}
                          disabled={saving}
                        />
                        <ContentImageInserter 
                          onInsert={insertImageIntoContent}
                          disabled={saving}
                        />
                      </div>
                    </div>
                    <RichTextToolbar 
                      textareaRef={contentTextareaRef}
                      onContentChange={(content) => setArticle(prev => ({ ...prev, content }))}
                    />
                    
                    {sideBySideMode ? (
                      <div className="grid grid-cols-2 gap-4 h-96">
                        <div className="flex flex-col">
                          <Label className="mb-2 text-sm font-medium">Editor</Label>
                          <Textarea
                            ref={contentTextareaRef}
                            id="content"
                            value={article.content}
                            onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                            onKeyDown={handleContentKeyDown}
                            placeholder="Write your article content here..."
                            className="flex-1 font-mono text-sm whitespace-pre-wrap resize-none"
                            style={{ whiteSpace: 'pre-wrap' }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <Label className="mb-2 text-sm font-medium">Live Preview</Label>
                          <div className="flex-1 overflow-y-auto border border-input rounded-md p-3 bg-background">
                            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                              {article.content ? (
                                <ReactMarkdown 
                                  remarkPlugins={[remarkGfm, remarkBreaks]}
                                  components={{
                                    h1: ({children}) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
                                    h2: ({children}) => <h2 className="text-lg font-semibold mt-3 mb-2">{children}</h2>,
                                    h3: ({children}) => <h3 className="text-base font-medium mt-2 mb-1">{children}</h3>,
                                    p: ({children}) => <p className="mb-2 leading-relaxed text-sm">{children}</p>,
                                    br: () => <br className="my-1" />,
                                    img: ({src, alt}) => (
                                      <div className="my-3">
                                        <img src={src} alt={alt} className="w-full rounded shadow-sm" />
                                      </div>
                                    ),
                                    ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                    ol: ({children}) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                                    blockquote: ({children}) => (
                                      <blockquote className="border-l-2 border-primary pl-3 my-2 italic text-muted-foreground text-sm">
                                        {children}
                                      </blockquote>
                                    ),
                                    code: ({children, className}) => {
                                      const isInline = !className;
                                      return isInline ? (
                                        <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                                      ) : (
                                        <pre className="bg-muted p-2 rounded overflow-x-auto my-2">
                                          <code className="text-xs font-mono">{children}</code>
                                        </pre>
                                      );
                                    }
                                  }}
                                >
                                  {article.content}
                                </ReactMarkdown>
                              ) : (
                                <p className="text-muted-foreground text-sm italic">Start typing to see preview...</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Textarea
                        ref={contentTextareaRef}
                        id="content"
                        value={article.content}
                        onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                        onKeyDown={handleContentKeyDown}
                        placeholder="Write your article content here..."
                        rows={15}
                        className="min-h-96 font-mono text-sm whitespace-pre-wrap"
                        style={{ whiteSpace: 'pre-wrap' }}
                      />
                    )}
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Supports Markdown. Press Enter for new paragraph, Shift+Enter for a line break. Use the "Insert Image" button to add images.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab('preview')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail Image</Label>
                    <ImageUpload
                      currentImage={article.thumbnail_url}
                      onUpload={(url) => setArticle(prev => ({ ...prev, thumbnail_url: url }))}
                      onRemove={() => setArticle(prev => ({ ...prev, thumbnail_url: '' }))}
                      className="max-w-md"
                    />
                    <div className="mt-2">
                      <Label htmlFor="thumbnail_url">Or enter URL manually</Label>
                      <Input
                        id="thumbnail_url"
                        value={article.thumbnail_url}
                        onChange={(e) => setArticle(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Article Preview</CardTitle>
                    <CardDescription>Preview how your article will appear to readers</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('content')}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Back to Edit
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    {article.title && (
                      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                    )}
                    {article.synopsis && (
                      <p className="text-lg text-muted-foreground mb-6 italic">{article.synopsis}</p>
                    )}
                    {article.thumbnail_url && (
                      <div className="mb-6">
                        <img 
                          src={article.thumbnail_url} 
                          alt={article.title || "Article thumbnail"}
                          className="w-full max-w-2xl rounded-lg shadow-lg"
                        />
                      </div>
                    )}
                    {article.content ? (
                      <div className="space-y-4">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                          components={{
                            h1: ({children}) => <h1 className="text-2xl font-bold mt-8 mb-4">{children}</h1>,
                            h2: ({children}) => <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>,
                            h3: ({children}) => <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>,
                            p: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
                            br: () => <br className="my-2" />,
                            img: ({src, alt}) => (
                              <div className="my-6">
                                <img src={src} alt={alt} className="w-full rounded-lg shadow-md" />
                              </div>
                            ),
                            ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                            blockquote: ({children}) => (
                              <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-muted-foreground">
                                {children}
                              </blockquote>
                            ),
                            code: ({children, className}) => {
                              const isInline = !className;
                              return isInline ? (
                                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                              ) : (
                                <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                                  <code className="text-sm font-mono">{children}</code>
                                </pre>
                              );
                            }
                          }}
                         >
                           {article.content}
                         </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No content to preview. Start writing in the Content tab.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>Optimize your article for search engines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={article.meta_title}
                      onChange={(e) => setArticle(prev => ({ ...prev, meta_title: e.target.value }))}
                      placeholder="SEO-optimized title (60 characters max)"
                      maxLength={60}
                    />
                    <p className="text-sm text-muted-foreground">
                      {article.meta_title.length}/60 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={article.meta_description}
                      onChange={(e) => setArticle(prev => ({ ...prev, meta_description: e.target.value }))}
                      placeholder="Brief description for search results (160 characters max)"
                      maxLength={160}
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      {article.meta_description.length}/160 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="focus_keyword">Focus Keyword</Label>
                    <Input
                      id="focus_keyword"
                      value={article.focus_keyword}
                      onChange={(e) => setArticle(prev => ({ ...prev, focus_keyword: e.target.value }))}
                      placeholder="Main keyword to target"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Keyphrases</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newKeyphrase}
                        onChange={(e) => setNewKeyphrase(e.target.value)}
                        placeholder="Add a keyphrase"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyphrase())}
                      />
                      <Button onClick={addKeyphrase} type="button">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {article.keyphrases.map((keyphrase, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {keyphrase}
                          <button
                            onClick={() => removeKeyphrase(keyphrase)}
                            className="ml-1 text-xs"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Article Assets</CardTitle>
                  <CardDescription>Manage images, videos, and other media for your article</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={addAsset} className="mb-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Asset
                  </Button>

                  {assets.map((asset, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Asset #{index + 1}</Label>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeAsset(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Asset Type</Label>
                            <select
                              className="w-full p-2 border rounded-md"
                              value={asset.asset_type}
                              onChange={(e) => updateAsset(index, 'asset_type', e.target.value)}
                            >
                              <option value="image">Image</option>
                              <option value="video">Video File</option>
                              <option value="youtube">YouTube Video</option>
                              <option value="link">External Link</option>
                            </select>
                          </div>

                          {asset.asset_type === 'image' ? (
                            <div className="space-y-2 md:col-span-2">
                              <Label>Upload Image</Label>
                              <ImageUpload
                                currentImage={asset.asset_url}
                                onUpload={(url) => updateAsset(index, 'asset_url', url)}
                                onRemove={() => updateAsset(index, 'asset_url', '')}
                              />
                              <div className="mt-2">
                                <Label>Or enter URL manually</Label>
                                <Input
                                  value={asset.asset_url}
                                  onChange={(e) => updateAsset(index, 'asset_url', e.target.value)}
                                  placeholder="https://example.com/image.jpg"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label>Asset URL</Label>
                              <Input
                                value={asset.asset_url}
                                onChange={(e) => updateAsset(index, 'asset_url', e.target.value)}
                                placeholder={
                                  asset.asset_type === 'youtube' 
                                    ? 'https://youtube.com/watch?v=...'
                                    : asset.asset_type === 'video'
                                    ? 'https://example.com/video.mp4'
                                    : 'https://example.com/link'
                                }
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={asset.asset_title}
                              onChange={(e) => updateAsset(index, 'asset_title', e.target.value)}
                              placeholder="Asset title"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                              value={asset.asset_description}
                              onChange={(e) => updateAsset(index, 'asset_description', e.target.value)}
                              placeholder="Asset description"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publication Settings</CardTitle>
                  <CardDescription>Control when and how your article is published</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={article.is_published}
                      onCheckedChange={(checked) => 
                        setArticle(prev => ({ ...prev, is_published: checked }))
                      }
                    />
                    <Label htmlFor="is_published">Published</Label>
                  </div>

                  {article.published_date && (
                    <div className="space-y-2">
                      <Label>Published Date</Label>
                      <Input
                        type="datetime-local"
                        value={article.published_date ? format(new Date(article.published_date), "yyyy-MM-dd'T'HH:mm") : ''}
                        onChange={(e) => 
                          setArticle(prev => ({ 
                            ...prev, 
                            published_date: e.target.value ? new Date(e.target.value).toISOString() : null 
                          }))
                        }
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminArticleEditor;