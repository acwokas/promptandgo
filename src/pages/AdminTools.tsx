import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Navigate, Link } from "react-router-dom";
import { Upload, Plus, Download, Settings, MessageCircle, BarChart3 } from "lucide-react";

const AdminTools = () => {
  const { user, loading: authLoading } = useSupabaseAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  console.log("AdminTools: Component state", { 
    isAdmin, 
    adminLoading, 
    authLoading, 
    userEmail: user?.email,
    userId: user?.id 
  });

  // Wait for both auth and admin checks to complete
  if (authLoading || adminLoading) {
    console.log("AdminTools: Still loading", { authLoading, adminLoading });
    return <div>Loading...</div>;
  }

  // Allowlisted email as a temporary safety net while we debug admin role checks
  const emailAllow = ["me@adrianwatkins.com"];
  const effectiveIsAdmin = isAdmin || (user?.email ? emailAllow.includes(user.email) : false);

  console.log("AdminTools: Access decision", { isAdmin, effectiveIsAdmin, userEmail: user?.email });

  if (!effectiveIsAdmin) {
    console.log("AdminTools: User is not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  const tools = [
    {
      title: "Poll Management",
      description: "Create and manage polls, view voting results, and control poll display settings",
      icon: BarChart3,
      href: "/admin/polls",
      color: "text-purple-500"
    },
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
    },
    {
      title: "Widget Settings",
      description: "Control the visibility of feedback widgets and context popups across the platform",
      icon: Settings,
      href: "/admin/widgets",
      color: "text-orange-500"
    },
    {
      title: "User Feedback",
      description: "Review and manage user feedback, bug reports, and feature requests",
      icon: MessageCircle,
      href: "/admin/feedback",
      color: "text-cyan-500"
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
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Admin Tools</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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