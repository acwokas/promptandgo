import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

export function MainCTASection() {
  return (
    <section aria-labelledby="cta-main" className="relative bg-hero hero-grid py-12" id="cta">
      <div className="container p-6 md:p-8 text-center text-primary-foreground">
        <h2 id="cta-main" className="text-2xl md:text-3xl font-semibold tracking-tight">
          Stop guessing what to prompt. Start with <strong>battle-tested</strong> foundations that actually work.
        </h2>
        <p className="mt-3 text-primary-foreground/85 text-base md:text-lg">
          ✨ Browse thousands of proven prompts or let Scout build custom ones for your specific needs.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild variant="hero" className="px-6">
            <Link to="/library"><Search className="h-4 w-4 mr-2" />Browse Battle-Tested Prompts</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function FinalCTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
      <div className="container text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Save 10+ Hours This Week?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join 5,000+ professionals who've already transformed their productivity. 
          Start with our free prompts, no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button asChild size="lg" className="px-8">
            <Link to="/library">
              Get Started FREE <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/packs">View Power Packs</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          No signup required • 30-day money-back guarantee on premium plans
        </p>
      </div>
    </section>
  );
}
