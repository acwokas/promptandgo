import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import UsageDisplay from "@/components/ai/UsageDisplay";

const AccountPage = () => {
  const { user } = useSupabaseAuth();
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();

  console.log("Account page: Auth state", { user: user?.email, isAdmin });

  return (
    <>
      <SEO title="My Account" description="Manage your account: prompts, purchases, and settings." />
      <PageHero
        title={<>
          <span className="text-gradient-brand">My</span> Account
        </>}
        subtitle={<>Access your prompts, view purchases, and manage your settings.</>}
        minHeightClass="min-h-[28vh]"
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
        {user && (
          <Button
            variant="inverted"
            onClick={async () => {
              try {
                // Try to sign out normally first
                const { error } = await supabase.auth.signOut();
                
                if (error) {
                  // If normal signout fails (e.g., session expired), force local signout
                  console.warn("Normal signout failed, forcing local signout:", error.message);
                  await supabase.auth.signOut({ scope: 'local' });
                }
                
                toast({ title: "Signed out successfully" });
              } catch (err: any) {
                // Fallback: force local signout even if everything fails
                console.error("All signout methods failed, clearing local state:", err);
                await supabase.auth.signOut({ scope: 'local' });
                toast({ title: "Signed out" });
              }
            }}
          >
            Log out
          </Button>
        )}
      </PageHero>

      <main className="container py-8">
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
            <h2 className="font-semibold">My Generated Prompts</h2>
            <p className="text-muted-foreground text-sm mt-1">View and manage AI-generated prompts.</p>
          </Link>
        </section>
      </main>
    </>
  );
};

export default AccountPage;
