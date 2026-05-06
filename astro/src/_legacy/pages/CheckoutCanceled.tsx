import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const CheckoutCanceled = () => {
  return (
    <>
      <SEO title="Checkout Canceled" description="Your payment was canceled." />
      <PageHero title={<>Checkout <span className="text-gradient-brand">Canceled</span></>} subtitle={<>You can retry your purchase anytime.</>} minHeightClass="min-h-[28svh]" />
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
              <BreadcrumbPage>Checkout Canceled</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
          Your payment was canceled. <Link to="/cart" className="underline">Return to cart</Link>.
        </div>
      </main>
    </>
  );
};

export default CheckoutCanceled;
