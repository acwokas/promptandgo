import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";

const CheckoutCanceled = () => {
  return (
    <>
      <SEO title="Checkout Canceled" description="Your payment was canceled." />
      <PageHero title={<>Checkout <span className="text-gradient-brand">Canceled</span></>} subtitle={<>You can retry your purchase anytime.</>} minHeightClass="min-h-[40vh]" />
      <main className="container py-8">
        <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
          Your payment was canceled. <Link to="/cart" className="underline">Return to cart</Link>.
        </div>
      </main>
    </>
  );
};

export default CheckoutCanceled;
