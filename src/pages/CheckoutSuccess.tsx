import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

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
        toast({ title: 'Payment confirmed', description: 'Access granted instantly!' });
        setStatus('✅ Access granted! Your premium content is ready.');
      }
    })();
  }, [search, navigate]);

  return (
    <>
      <SEO title="Checkout Success" description="Your payment was successful." />
      <PageHero title={<>Payment <span className="text-gradient-brand">Successful</span></>} subtitle={<>Access granted instantly! Your premium content is ready.</>} minHeightClass="min-h-[28svh]" />
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
              <BreadcrumbPage>Checkout Success</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="rounded-xl border bg-card p-6 text-center">
          <div className="text-lg font-medium mb-4">{status}</div>
          {status.includes('✅') && (
            <div className="flex gap-4 justify-center">
              <Link 
                to="/packs" 
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                View My Packs
              </Link>
              <Link 
                to="/account/purchases" 
                className="inline-flex items-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Order History
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default CheckoutSuccess;
