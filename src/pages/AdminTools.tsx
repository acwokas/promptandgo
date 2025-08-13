import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Navigate, Link } from "react-router-dom";
import { Upload, Plus, Download } from "lucide-react";

const AdminTools = () => {
  const { loading: authLoading } = useSupabaseAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  console.log("AdminTools: Component state", { isAdmin, adminLoading, authLoading });

  // Wait for both auth and admin checks to complete
  if (authLoading || adminLoading) {
    console.log("AdminTools: Still loading", { authLoading, adminLoading });
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    console.log("AdminTools: User is not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  const tools = [
    {
      title: "Bulk Upload",
      description: "Upload categories, subcategories, tags, and prompts in bulk via JSON or CSV",
      icon: Upload,
      href: "/admin/upload",
      color: "text-blue-500"
    },
    {
      title: "Prompt Tool",
      description: "Create individual prompts with full control over categories, tags, packs, and ribbons",
      icon: Plus,
      href: "/admin/prompts",
      color: "text-green-500"
    },
    {
      title: "Export Data",
      description: "Download complete CSV exports of all prompts and Power Packs for backup or analysis",
      icon: Download,
      href: "/admin/export",
      color: "text-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Admin Tools"
        description="Administrative tools for managing the platform"
      />
      
      <PageHero
        title="Admin Tools"
        subtitle="Manage categories, prompts, and platform content"
        variant="admin"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.map((tool) => (
            <Card key={tool.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <tool.icon className={`h-8 w-8 ${tool.color}`} />
                  <CardTitle>{tool.title}</CardTitle>
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to={tool.href}>Open Tool</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTools;