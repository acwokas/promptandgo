import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const AccountPage = () => {
  const { user } = useSupabaseAuth();
  const { isAdmin } = useIsAdmin();

  return (
    <>
      <SEO title="My Account" description="Manage your account: prompts, purchases, and settings." />
      <PageHero
        title={<>
          <span className="text-gradient-brand">My</span> Account
        </>}
        subtitle={<>Access your prompts, view purchases, and manage your settings.</>}
        minHeightClass="min-h-[40vh]"
      >
        <Button asChild variant="hero" className="px-6">
          <Link to="/account/favorites">My Prompts</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/account/purchases">My Purchases</Link>
        </Button>
        {isAdmin && (
          <Button asChild variant="inverted">
            <Link to="/admin/upload">Admin Tools</Link>
          </Button>
        )}
        {user && (
          <Button asChild variant="ghost">
            <Link to="/auth">Log out</Link>
          </Button>
        )}
      </PageHero>

      <main className="container py-8">
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold">Profile</h2>
            <p className="text-muted-foreground text-sm mt-1">Update your display name and avatar. (Coming soon)</p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold">Notifications</h2>
            <p className="text-muted-foreground text-sm mt-1">Choose email preferences for updates. (Coming soon)</p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold">Security</h2>
            <p className="text-muted-foreground text-sm mt-1">Change password and secure your account. (Coming soon)</p>
          </article>
        </section>
      </main>
    </>
  );
};

export default AccountPage;
