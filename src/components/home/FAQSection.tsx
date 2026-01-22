import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const faqs = [
  { q: "What are battle-tested prompts?", a: "Our prompts are proven in real-world scenarios by professionals. No guesswork - just results that actually work." },
  { q: "What is Scout Studio?", a: "Our AI-powered prompt builder that creates custom prompts tailored to your specific needs using guided wizards." },
  { q: "Do I need to sign up?", a: "Nope! Browse and copy prompts for free. Sign up only to save favorites and access power packs." },
  { q: "How does AI optimization work?", a: "Scout automatically tailors each prompt for ChatGPT, Claude, Gemini, and other AI platforms for best results." },
  { q: "Works with free AI tools?", a: "Yes! Most prompts work perfectly with free versions of ChatGPT, Claude, and other AI tools." },
  { q: "Can I use them commercially?", a: "Yes! Use prompts and their outputs for any personal or commercial project." },
];

export function FAQSection() {
  return (
    <section className="container py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* FAQ Column */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Quick Questions</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                {faqs.slice(0, 3).map((faq) => (
                  <div key={faq.q} className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-semibold mb-1">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {faqs.slice(3).map((faq) => (
                  <div key={faq.q} className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-semibold mb-1">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <Button asChild variant="ghost" size="sm">
                <Link to="/faqs#top">See All FAQs →</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Pricing/CTA */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 h-fit sticky top-6">
            <h3 className="font-semibold mb-3 text-center">🤖 Everything You Need, Free Forever</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Browse battle-tested prompts, use Scout AI optimization, and get platform-specific versions. Upgrade only for specialized collections.
            </p>
            
            <div className="space-y-3 mb-6">
              {[
                "Scout AI optimization for all platforms",
                "Unlimited battle-tested prompt access",
                "No signup required to browse & copy"
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <Button asChild variant="hero" size="sm" className="w-full">
                <Link to="/library">Browse Prompt Library</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/packs">View Power Packs</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
