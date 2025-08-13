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
import { Download, FileSpreadsheet } from "lucide-react";

const AdminExport = () => {
  const { loading: authLoading } = useSupabaseAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [loading, setLoading] = useState(false);

  // Wait for both auth and admin checks to complete
  if (authLoading || adminLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
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

      // Fetch all pack associations
      const { data: packPrompts, error: packsError } = await supabase
        .from("pack_prompts")
        .select(`
          prompt_id,
          packs:pack_id(name, slug)
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

      const packsByPrompt = new Map<string, string>();
      packPrompts?.forEach((pp: any) => {
        packsByPrompt.set(pp.prompt_id, pp.packs.slug);
      });

      // Convert to CSV format
      const csvData = prompts?.map((prompt: any) => ({
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
        pack_slug: packsByPrompt.get(prompt.id) || "",
        is_pro: prompt.is_pro,
        ribbon: prompt.ribbon || ""
      }));

      // Convert to CSV string
      const headers = [
        "title", "what_for", "prompt", "image_prompt", "excerpt",
        "category_slug", "category_name", "subcategory_slug", "subcategory_name",
        "tags", "pack_slug", "is_pro", "ribbon"
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
      // Fetch all packs
      const { data: packs, error: packsError } = await supabase
        .from("packs")
        .select("*")
        .order("name");

      if (packsError) throw packsError;

      // Convert to CSV format
      const csvData = packs?.map((pack: any) => ({
        name: pack.name,
        slug: pack.slug,
        description: pack.description || "",
        price_cents: pack.price_cents,
        is_active: pack.is_active
      }));

      // Convert to CSV string
      const headers = ["name", "slug", "description", "price_cents", "is_active"];

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
                Download a complete CSV of all prompts including categories, subcategories, tags, pack associations, PRO status, and ribbons.
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
                <li>Prompts CSV includes all metadata: categories, subcategories, tags, pack associations, PRO status, and ribbons</li>
                <li>CSV files are named with the current date for easy organization</li>
                <li>The export format is fully compatible with the bulk upload tool</li>
                <li>Tags are exported as comma-separated values</li>
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