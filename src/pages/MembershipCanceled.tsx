import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const MembershipCanceled = () => {
  return (
    <>
      <SEO title="Membership Canceled" description="You canceled the membership checkout." />
      <PageHero title={<>Membership <span className="text-gradient-brand">Canceled</span></>} subtitle={<>You can join anytime.</>} minHeightClass="min-h-[28vh]" />
      <main className="container py-10">
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
              <BreadcrumbPage>Membership Canceled</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
          Membership checkout canceled. <Link to="/packs" className="underline">Browse packs</Link>.
        </div>
      </main>
    </>
  );
};

export default MembershipCanceled;