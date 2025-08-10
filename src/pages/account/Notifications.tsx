import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "pag_notification_prefs";

const NotificationsPage = () => {
  const { toast } = useToast();
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [productNews, setProductNews] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const prefs = JSON.parse(raw);
        setEmailUpdates(!!prefs.emailUpdates);
        setProductNews(!!prefs.productNews);
        setMarketingEmails(!!prefs.marketingEmails);
      }
    } catch {}
  }, []);

  const onSave = () => {
    const prefs = { emailUpdates, productNews, marketingEmails };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    toast({ title: "Preferences saved" });
  };

  return (
    <>
      <SEO title="My Account – Notifications" description="Manage your email notification preferences." />
      <PageHero title={<>Notifications</>} subtitle={<>Choose what updates you want to receive.</>} minHeightClass="min-h-[36vh]" />

      <main className="container py-8 max-w-3xl">
        <div className="rounded-xl border bg-card p-6 grid gap-5">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailUpdates">General email updates</Label>
              <p className="text-xs text-muted-foreground">Occasional updates about your account and saved prompts.</p>
            </div>
            <Switch id="emailUpdates" checked={emailUpdates} onCheckedChange={setEmailUpdates} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="productNews">Product news</Label>
              <p className="text-xs text-muted-foreground">New features, packs, and improvements.</p>
            </div>
            <Switch id="productNews" checked={productNews} onCheckedChange={setProductNews} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketingEmails">Tips & marketing</Label>
              <p className="text-xs text-muted-foreground">Tutorials, tips, and occasional promotions.</p>
            </div>
            <Switch id="marketingEmails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
          </div>

          <div className="flex justify-end">
            <Button variant="cta" onClick={onSave}>Save Preferences</Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotificationsPage;
