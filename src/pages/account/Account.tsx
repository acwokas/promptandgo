import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import UsageDisplay from "@/components/ai/UsageDisplay";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { LogOut } from "lucide-react";

const AccountPage = () => {
  const { user } = useSupabaseAuth();
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("Account page: Auth state", { user: user?.email, isAdmin });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <SEO title="My Account" description="Manage your account: prompts, purchases, and settings." />
      <PageHero
        title={<>
          <span className="text-gradient-brand">My</span> Account
        </>}
        subtitle={<>Access your prompts, view purchases, and manage your settings.</>}
        minHeightClass="min-h-[28svh]"
      >
        <Button asChild variant="hero" className="px-6">
          <Link to="/account/favorites">My Prompts</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/account/favorites#my-generated-prompts">AI Generated</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/account/purchases">My Purchases</Link>
        </Button>
        {isAdmin && (
          <Button asChild variant="inverted">
            <Link to="/admin">Admin Tools</Link>
          </Button>
        )}
        <Button variant="outline" onClick={handleLogout} className="ml-auto">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </PageHero>

      <main className="container py-8">
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
              <BreadcrumbPage>My Account</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* AI Usage Overview */}
        <div className="mb-8">
          <UsageDisplay />
        </div>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/account/profile" className="rounded-xl border bg-card p-5 block group hover:shadow-md transition-all">
            <h2 className="font-semibold">Profile</h2>
            <p className="text-muted-foreground text-sm mt-1">Update your display name and avatar.</p>
          </Link>
          <Link to="/account/notifications" className="rounded-xl border bg-card p-5 block group hover:shadow-md transition-all">
            <h2 className="font-semibold">Notifications</h2>
            <p className="text-muted-foreground text-sm mt-1">Choose what emails you receive.</p>
          </Link>
          <Link to="/account/security" className="rounded-xl border bg-card p-5 block group hover:shadow-md transition-all">
            <h2 className="font-semibold">Security</h2>
            <p className="text-muted-foreground text-sm mt-1">Change your password and log out.</p>
          </Link>
          <Link to="/account/favorites#my-generated-prompts" className="rounded-xl border bg-card p-5 block group hover:shadow-md transition-all">
            <h2 className="font-semibold">My Saved Prompts</h2>
            <p className="text-muted-foreground text-sm mt-1">View and manage your saved and AI-generated prompts.</p>
          </Link>
        </section>
      </main>
    </>
  );
};

export default AccountPage;
