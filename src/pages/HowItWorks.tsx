import SEO from "@/components/SEO";

const HowItWorks = () => (
  <main className="container py-10">
    <SEO title="How it Works" description="Browse, filter, and copy prompts for instant productivity." />
    <h1 className="text-3xl font-bold mb-2">How it Works</h1>
    <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
      <li>Browse by category or search.</li>
      <li>Open a card and copy the prompt you need.</li>
      <li>Adapt for your brand or client and ship.</li>
    </ol>
  </main>
);

export default HowItWorks;
