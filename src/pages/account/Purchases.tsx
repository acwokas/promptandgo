import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";

const PurchasesPage = () => {
  return (
    <>
      <SEO title="My Purchases" description="View your purchased prompt packs and invoices." />
      <PageHero
        title={<><span className="text-gradient-brand">My</span> Purchases</>}
        subtitle={<>A history of your purchases and downloads. (Coming soon)</>}
        minHeightClass="min-h-[40vh]"
      />
      <main className="container py-8">
        <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
          No purchases yet.
        </div>
      </main>
    </>
  );
};

export default PurchasesPage;
