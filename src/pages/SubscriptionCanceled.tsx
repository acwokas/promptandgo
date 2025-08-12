import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";

const SubscriptionCanceled = () => {
  return (
    <>
      <SEO title="Subscription Canceled" description="You canceled the subscription checkout." />
      <PageHero title={<>Subscription <span className=\"text-gradient-brand\">Canceled</span></>} subtitle={<>You can subscribe anytime.</>} minHeightClass="min-h-[40vh]" />
      <main className="container py-8">
        <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
          Subscription checkout canceled. <Link to="/packs" className="underline">Browse packs</Link>.
        </div>
      </main>
    </>
  );
};

export default SubscriptionCanceled;
