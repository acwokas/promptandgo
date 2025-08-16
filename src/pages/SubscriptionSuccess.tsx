import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const { error } = await supabase.functions.invoke('check-subscription');
      if (error) {
        console.error(error);
        toast({ title: 'Subscription check failed' });
      } else {
        toast({ title: 'Subscription active' });
      }
      setTimeout(() => navigate('/account/purchases'), 800);
    })();
  }, [navigate]);

  return (
    <>
      <SEO title="Subscription Success" description="Your subscription is now active." />
      <PageHero title={<>Subscription <span className="text-gradient-brand">Active</span></>} subtitle={<>Thanks for subscribing!</>} minHeightClass="min-h-[28vh]" />
      <main className="container py-8">
        <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">Activating your subscription…</div>
      </main>
    </>
  );
};

export default SubscriptionSuccess;
