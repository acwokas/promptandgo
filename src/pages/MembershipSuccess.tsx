import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const MembershipSuccess = () => {
  useEffect(() => {
    const checkStatus = async () => {
      const { error } = await supabase.functions.invoke('check-subscription');
      if (error) {
        toast({ title: 'Membership check failed' });
      } else {
        toast({ title: 'Membership active' });
      }
    };
    checkStatus();
  }, []);

  return (
    <>
      <SEO title="Membership Success" description="Your membership is now active." />
      <PageHero title={<>Membership <span className="text-gradient-brand">Active</span></>} subtitle={<>Thanks for your membership!</>} minHeightClass="min-h-[28vh]" />
      <main className="container py-10">
        <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">Activating your membership…</div>
      </main>
    </>
  );
};

export default MembershipSuccess;