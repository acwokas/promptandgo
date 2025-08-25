import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Download, FileSpreadsheet, Archive } from "lucide-react";

const AdminExport = () => {
  const { user, loading: authLoading } = useSupabaseAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [loading, setLoading] = useState(false);

  // Wait for both auth and admin checks to complete
  if (authLoading || adminLoading) {
    return <div>Loading...</div>;
  }

  const emailAllow = ["me@adrianwatkins.com"];
  const effectiveIsAdmin = isAdmin || (user?.email ? emailAllow.includes(user.email) : false);

  if (!effectiveIsAdmin) {
    return <Navigate to="/" replace />;
  }

  const exportPrompts = async () => {
    setLoading(true);
    try {
      // Fetch all prompts with their related data
      const { data: prompts, error: promptsError } = await supabase
        .from("prompts")
        .select(`
          id,
          title,
          what_for,
          prompt,
          image_prompt,
          excerpt,
          is_pro,
          ribbon,
          category_id,
          subcategory_id,
          categories:category_id(name, slug),
          subcategories:subcategory_id(name, slug)
        `);

      if (promptsError) throw promptsError;

      // Fetch all tags for each prompt
      const { data: promptTags, error: tagsError } = await supabase
        .from("prompt_tags")
        .select(`
          prompt_id,
          tags:tag_id(name)
        `);

      if (tagsError) throw tagsError;

      // Fetch all pack associations with pack details
      const { data: packPrompts, error: packsError } = await supabase
        .from("pack_prompts")
        .select(`
          prompt_id,
          packs:pack_id(name, slug, price_cents)
        `);

      if (packsError) throw packsError;

      // Create maps for quick lookup
      const tagsByPrompt = new Map<string, string[]>();
      promptTags?.forEach((pt: any) => {
        if (!tagsByPrompt.has(pt.prompt_id)) {
          tagsByPrompt.set(pt.prompt_id, []);
        }
        tagsByPrompt.get(pt.prompt_id)?.push(pt.tags.name);
      });

      const packsByPrompt = new Map<string, { slug: string, name: string, price_cents: number }>();
      packPrompts?.forEach((pp: any) => {
        packsByPrompt.set(pp.prompt_id, {
          slug: pp.packs.slug,
          name: pp.packs.name,
          price_cents: pp.packs.price_cents || 0
        });
      });

      // Convert to CSV format
      const csvData = prompts?.map((prompt: any) => {
        const packInfo = packsByPrompt.get(prompt.id);
        return {
          title: prompt.title,
          what_for: prompt.what_for || "",
          prompt: prompt.prompt,
          image_prompt: prompt.image_prompt || "",
          excerpt: prompt.excerpt || "",
          category_slug: prompt.categories?.slug || "",
          category_name: prompt.categories?.name || "",
          subcategory_slug: prompt.subcategories?.slug || "",
          subcategory_name: prompt.subcategories?.name || "",
          tags: tagsByPrompt.get(prompt.id)?.join(", ") || "",
          pack_slug: packInfo?.slug || "",
          pack_name: packInfo?.name || "",
          pack_price_cents: packInfo?.price_cents || "",
          is_pro: prompt.is_pro,
          ribbon: prompt.ribbon || ""
        };
      });

      // Convert to CSV string
      const headers = [
        "title", "what_for", "prompt", "image_prompt", "excerpt",
        "category_slug", "category_name", "subcategory_slug", "subcategory_name",
        "tags", "pack_slug", "pack_name", "pack_price_cents", "is_pro", "ribbon"
      ];

      const csvContent = [
        headers.join(","),
        ...(csvData?.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            const stringValue = String(value || "");
            if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(",")
        ) || [])
      ].join("\n");

      // Download file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prompts-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export complete",
        description: `Exported ${csvData?.length || 0} prompts to CSV`,
      });

    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "Failed to export prompts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportPacks = async () => {
    setLoading(true);
    try {
      // Fetch all packs and their tags
      const [packsResult, packTagsResult] = await Promise.all([
        supabase
          .from("packs")
          .select("*")
          .order("name"),
        supabase
          .from("pack_tags")
          .select(`
            pack_id,
            tags:tag_id(name)
          `)
      ]);

      if (packsResult.error) throw packsResult.error;
      if (packTagsResult.error) throw packTagsResult.error;

      // Create map for pack tags
      const tagsByPack = new Map<string, string[]>();
      packTagsResult.data?.forEach((pt: any) => {
        if (!tagsByPack.has(pt.pack_id)) {
          tagsByPack.set(pt.pack_id, []);
        }
        tagsByPack.get(pt.pack_id)?.push(pt.tags.name);
      });

      // Convert to CSV format
      const csvData = packsResult.data?.map((pack: any) => ({
        name: pack.name,
        slug: pack.slug,
        description: pack.description || "",
        price_cents: pack.price_cents,
        is_active: pack.is_active,
        tags: tagsByPack.get(pack.id)?.join(", ") || ""
      }));

      // Convert to CSV string
      const headers = ["name", "slug", "description", "price_cents", "is_active", "tags"];

      const csvContent = [
        headers.join(","),
        ...(csvData?.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            const stringValue = String(value || "");
            if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(",")
        ) || [])
      ].join("\n");

      // Download file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `packs-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export complete",
        description: `Exported ${csvData?.length || 0} packs to CSV`,
      });

    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "Failed to export packs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportAll = async () => {
    setLoading(true);
    try {
      // Fetch everything in parallel
      const [promptsResult, packsResult, categoriesResult, subcategoriesResult, tagsResult, packPromptsResult, promptTagsResult, packTagsResult] = await Promise.all([
        supabase
          .from("prompts")
          .select(`
            id,
            title,
            what_for,
            prompt,
            image_prompt,
            excerpt,
            is_pro,
            ribbon,
            category_id,
            subcategory_id,
            categories:category_id(name, slug),
            subcategories:subcategory_id(name, slug)
          `),
        supabase
          .from("packs")
          .select("*")
          .order("name"),
        supabase
          .from("categories")
          .select("*")
          .order("name"),
        supabase
          .from("subcategories")
          .select("*")
          .order("name"),
        supabase
          .from("tags")
          .select("*")
          .order("name"),
        supabase
          .from("pack_prompts")
          .select(`
            prompt_id,
            pack_id,
            packs:pack_id(name, slug, price_cents)
          `),
        supabase
          .from("prompt_tags")
          .select(`
            prompt_id,
            tags:tag_id(name)
          `),
        supabase
          .from("pack_tags")
          .select(`
            pack_id,
            tags:tag_id(name)
          `)
      ]);

      // Check for errors
      if (promptsResult.error) throw promptsResult.error;
      if (packsResult.error) throw packsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;
      if (subcategoriesResult.error) throw subcategoriesResult.error;
      if (tagsResult.error) throw tagsResult.error;
      if (packPromptsResult.error) throw packPromptsResult.error;
      if (promptTagsResult.error) throw promptTagsResult.error;
      if (packTagsResult.error) throw packTagsResult.error;

      // Create maps for quick lookup
      const tagsByPrompt = new Map<string, string[]>();
      promptTagsResult.data?.forEach((pt: any) => {
        if (!tagsByPrompt.has(pt.prompt_id)) {
          tagsByPrompt.set(pt.prompt_id, []);
        }
        tagsByPrompt.get(pt.prompt_id)?.push(pt.tags.name);
      });

      const packsByPrompt = new Map<string, { slug: string, name: string, price_cents: number, pack_id: string }>();
      packPromptsResult.data?.forEach((pp: any) => {
        packsByPrompt.set(pp.prompt_id, {
          slug: pp.packs.slug,
          name: pp.packs.name,
          price_cents: pp.packs.price_cents || 0,
          pack_id: pp.pack_id
        });
      });

      // Create map for pack tags
      const tagsByPack = new Map<string, string[]>();
      packTagsResult.data?.forEach((pt: any) => {
        if (!tagsByPack.has(pt.pack_id)) {
          tagsByPack.set(pt.pack_id, []);
        }
        tagsByPack.get(pt.pack_id)?.push(pt.tags.name);
      });

      // Create pack info map with tags
      const packInfoMap = new Map<string, any>();
      packsResult.data?.forEach((pack: any) => {
        packInfoMap.set(pack.id, {
          ...pack,
          tags: tagsByPack.get(pack.id)?.join(", ") || ""
        });
      });

      // Create comprehensive data with all relationships
      const comprehensiveData = promptsResult.data?.map((prompt: any) => {
        const packInfo = packsByPrompt.get(prompt.id);
        const fullPackInfo = packInfo ? packInfoMap.get(packInfo.pack_id) : null;
        
        return {
          // Prompt data
          prompt_title: prompt.title,
          prompt_what_for: prompt.what_for || "",
          prompt_content: prompt.prompt,
          prompt_image_prompt: prompt.image_prompt || "",
          prompt_excerpt: prompt.excerpt || "",
          prompt_is_pro: prompt.is_pro,
          prompt_ribbon: prompt.ribbon || "",
          
          // Category data
          category_name: prompt.categories?.name || "",
          category_slug: prompt.categories?.slug || "",
          subcategory_name: prompt.subcategories?.name || "",
          subcategory_slug: prompt.subcategories?.slug || "",
          
          // Prompt Tags
          prompt_tags: tagsByPrompt.get(prompt.id)?.join("; ") || "",
          
          // Power Pack data (if associated)
          pack_name: packInfo?.name || "",
          pack_slug: packInfo?.slug || "",
          pack_price_cents: packInfo?.price_cents || "",
          pack_price_dollars: packInfo ? (packInfo.price_cents / 100).toFixed(2) : "",
          pack_tags: fullPackInfo?.tags || "",
          
          // Status
          in_power_pack: packInfo ? "Yes" : "No",
          prompt_type: prompt.is_pro ? "PRO" : "Free"
        };
      }) || [];

      // Convert to CSV string
      const headers = [
        "prompt_title", "prompt_what_for", "prompt_content", "prompt_image_prompt", "prompt_excerpt",
        "prompt_is_pro", "prompt_type", "prompt_ribbon",
        "category_name", "category_slug", "subcategory_name", "subcategory_slug",
        "prompt_tags", "in_power_pack", "pack_name", "pack_slug", "pack_price_cents", "pack_price_dollars", "pack_tags"
      ];

      const csvContent = [
        headers.join(","),
        ...comprehensiveData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            const stringValue = String(value || "");
            if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n") || stringValue.includes(";")) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(",")
        )
      ].join("\n");

      // Download file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `complete-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Complete export successful",
        description: `Exported ${comprehensiveData.length} prompts with full Power Pack relationships`,
      });

    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "Failed to export complete data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Admin Export"
        description="Export prompts and packs data"
      />
      
      <PageHero
        title="Admin Export"
        subtitle="Download CSV exports of all prompts and Power Packs"
        variant="admin"
      />

      <AdminBreadcrumb 
        items={[
          { label: "Export Data" }
        ]} 
      />

      <div className="container mx-auto px-4 py-12">
        {/* Export All - Featured Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Archive className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-xl">Export Complete Dataset</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Export everything in one comprehensive CSV with full Power Pack relationships
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Download a single comprehensive CSV containing all prompts with their Power Pack associations, 
                including pack names, pricing, categories, tags, and detailed relationships. Perfect for 
                complete data analysis and backup.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>All prompts with full metadata</li>
                  <li>Power Pack names and pricing</li>
                  <li>Category and subcategory details</li>
                  <li>Complete tag associations</li>
                </ul>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>PRO vs Free prompt status</li>
                  <li>Pack membership indicators</li>
                  <li>Ribbon and special attributes</li>
                  <li>Ready for analysis and reporting</li>
                </ul>
              </div>
              <Button 
                onClick={exportAll} 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                {loading ? "Exporting Complete Dataset..." : "Export Complete Dataset"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-blue-500" />
                <CardTitle>Export Prompts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Download a CSV of all prompts including categories, subcategories, tags, Power Pack associations with names and pricing, PRO status, and ribbons.
              </p>
              <p className="text-sm text-muted-foreground">
                This CSV format is compatible with the bulk upload tool for re-importing.
              </p>
              <Button 
                onClick={exportPrompts} 
                disabled={loading}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {loading ? "Exporting..." : "Export Prompts CSV"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-green-500" />
                <CardTitle>Export Power Packs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Download a complete CSV of all Power Packs including names, slugs, descriptions, pricing, and active status.
              </p>
              <p className="text-sm text-muted-foreground">
                This provides a backup of all your Power Pack configurations.
              </p>
              <Button 
                onClick={exportPacks} 
                disabled={loading}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {loading ? "Exporting..." : "Export Packs CSV"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Export Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li><strong>Complete Export:</strong> Single CSV with all prompts and Power Pack relationships including pricing</li>
                <li><strong>Prompts CSV:</strong> All prompt metadata with pack names, slugs, and pricing information</li>
                <li><strong>Power Packs CSV:</strong> All pack configurations with names, descriptions, and pricing</li>
                <li>CSV files are named with the current date for easy organization</li>
                <li>The export formats are compatible with analysis tools and re-importing</li>
                <li>Tags are exported with semicolons in complete export, commas in prompt export</li>
                <li>Boolean values (is_pro, is_active) are exported as true/false</li>
                <li>Empty fields are exported as empty strings for consistency</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminExport;