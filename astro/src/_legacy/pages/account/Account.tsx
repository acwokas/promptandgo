import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useToast } from "@/components/ui/use-toast";
import UsageDisplay from "@/components/ai/UsageDisplay";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { LogOut, User, CreditCard, Heart, ShieldCheck, Sparkles, Bell, Award } from "lucide-react";

const AccountPage = () => {
  const { user, logout } = useSupabaseAuth();
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("Account page: Auth state", { user: user?.email, isAdmin });

  const accountSections = [
    {
      title: "Profile",
      description: "Manage your personal information and preferences",
      icon: User,
      href: "/account/profile",
      gradient: "from-primary/10 to-primary/5",
    },
    {
      title: "XP & Rewards",
      description: "Track your progress and redeem rewards",
      icon: Award,
      href: "/account/xp",
      gradient: "from-yellow-500/10 to-yellow-500/5",
      badge: "New",
    },
    {
      title: "Purchases",
      description: "View your order history and downloads",
      icon: CreditCard,
      href: "/account/purchases",
      gradient: "from-green-500/10 to-green-500/5",
    },
    {
      title: "Favorites",
      description: "Access your saved prompts and collections",
      icon: Heart,
      href: "/account/favorites",
      gradient: "from-red-500/10 to-red-500/5",
    },
    {
      title: "Security",
      description: "Update your password and security settings",
      icon: ShieldCheck,
      href: "/account/security",
      gradient: "from-accent/10 to-accent/5",
    },
    {
      title: "AI Preferences",
      description: "Customize your AI provider settings",
      icon: Sparkles,
      href: "/account/ai-preferences",
      gradient: "from-primary/10 to-primary/5",
    },
    {
      title: "Notifications",
      description: "Manage your notification preferences",
      icon: Bell,
      href: "/account/notifications",
      gradient: "from-orange-500/10 to-orange-500/5",
    },
  ];

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
      
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
          {accountSections.map((section) => (
            <Link
              key={section.href}
              to={section.href}
              className={`rounded-xl border bg-card p-6 block group hover:shadow-lg transition-all bg-gradient-to-br ${section.gradient || ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <section.icon className="h-6 w-6 text-primary" />
                {section.badge && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {section.badge}
                  </span>
                )}
              </div>
              <h2 className="font-semibold text-lg mb-1">{section.title}</h2>
              <p className="text-muted-foreground text-sm">{section.description}</p>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
};

export default AccountPage;
