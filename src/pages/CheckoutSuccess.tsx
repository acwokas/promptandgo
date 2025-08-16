import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const CheckoutSuccess = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your payment…");

  useEffect(() => {
    const orderId = search.get('order_id');
    const sessionId = search.get('session_id');
    if (!orderId || !sessionId) {
      setStatus('Missing order information.');
      return;
    }
    (async () => {
      const { data, error } = await supabase.functions.invoke('verify-payment', { body: { order_id: orderId, session_id: sessionId } });
      if (error) {
        console.error(error);
        toast({ title: 'Payment verification failed' });
        setStatus('Verification failed. You can find your order in Purchases shortly.');
      } else {
        toast({ title: 'Payment confirmed', description: 'Access granted to your purchase.' });
        setStatus('Success! Redirecting…');
        setTimeout(() => navigate('/account/purchases'), 1000);
      }
    })();
  }, [search, navigate]);

  return (
    <>
      <SEO title="Checkout Success" description="Your payment was successful." />
      <PageHero title={<>Payment <span className="text-gradient-brand">Successful</span></>} subtitle={<>We are finalising your access.</>} minHeightClass="min-h-[28vh]" />
      <main className="container py-8">
        <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">{status}</div>
      </main>
    </>
  );
};

export default CheckoutSuccess;
