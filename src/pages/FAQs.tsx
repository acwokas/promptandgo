import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { MessageCircle, Sparkles, Heart, Search, HelpCircle, Shield, CheckCircle } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const sections: FAQSection[] = [
  {
    title: "About PromptandGo",
    items: [
      {
        question: "Who created PromptandGo?",
        answer:
          "PromptandGo was created by a team of AI enthusiasts, marketers, and content specialists who test every prompt before publishing. We focus on practical, real-world results rather than theory.",
      },
      {
        question: "Why use PromptandGo instead of free prompts online?",
        answer:
          "We curate and test every prompt for clarity, accuracy, and usefulness. This means you will not waste time sifting through outdated or unproven ideas. Everything here is designed to help you get better results, faster.",
      },
      {
        question: "Is my data safe?",
        answer:
          "Yes. We do not store your AI conversations and all account and payment information is handled securely by trusted third-party providers.",
      },
    ],
  },
  {
    title: "Getting Started",
    items: [
      {
        question: "How do I start if I am new to prompting?",
        answer:
          "Pick any category that matches your goal, copy the prompt, and paste it into your preferred AI tool. Follow the included instructions, then tweak as needed. If you are unsure where to begin, start with our \"Beginner-Friendly\" section.",
      },
      {
        question: "What makes a good prompt?",
        answer:
          "A good prompt is clear, specific, and written with purpose. The best prompts guide the AI by focusing on your intent without adding unnecessary complexity. Every prompt on PromptandGo is designed to help you get strong results without needing to be an expert.",
      },
      {
        question: "Will these prompts work with free AI tools?",
        answer:
          "Yes. All prompts are designed to work with free versions of tools like ChatGPT. You do not need a membership or special setup, just copy and paste into your preferred AI tool.",
      },
    ],
  },
  {
    title: "Using Prompts",
    items: [
      {
        question: "Can I change or combine prompts?",
        answer:
          "Yes. Prompts are starting points and you can adjust them to match your tone, combine them for more complex results, or use them to spark new ideas.",
      },
      {
        question: "How do I save my favourite prompts?",
        answer:
          "Click the save icon on any prompt to add it to your favourites list. This feature is free and lets you find saved prompts quickly any time.",
      },
      {
        question: "Do prompts work with AI tools other than ChatGPT?",
        answer:
          "Yes. Most prompts will work in tools like Claude, Gemini, and Microsoft Copilot. You may need to make small formatting adjustments for each platform.",
      },
    ],
  },
  {
    title: "Payments and Access",
    items: [
      {
        question: "Do I need to pay to use PromptandGo?",
        answer:
          "Many prompts are free to browse and use. You only pay if you choose to unlock one of our PRO prompt packs for advanced tasks such as job applications or productivity systems.",
      },
      {
        question: "Is my payment information safe?",
        answer:
          "Yes. All payments are processed securely through Stripe or PayPal. We never store your full payment details.",
      },
      {
        question: "Do you offer refunds if I do not like a PRO pack?",
        answer:
          "Yes! We offer a 30-day money-back guarantee on all PRO packs and subscriptions. If you're not completely satisfied with your purchase, contact us within 30 days for a full refund, no questions asked. We're confident you'll love the results, but your satisfaction is guaranteed.",
      },
      {
        question: "What if the prompts don't save me time as promised?",
        answer:
          "We guarantee you'll save at least 5 hours per week with our prompts. If you don't see significant time savings in your first month, we'll extend your access for free until you do. Our prompts are tested by real professionals and have a 95% success rate.",
      },
      {
        question: "How quickly will I see results?",
        answer:
          "Most users see immediate results from their first prompt. Our customers typically report saving 2-3 hours in their first day of use. Within a week, the average user saves 10-15 hours and has significantly improved their output quality.",
      },
    ],
  },
  {
    title: "Ownership and Licensing",
    items: [
      {
        question: "Can I use these prompts for commercial projects?",
        answer:
          "Yes. Unless otherwise stated, you can use prompts for both personal and commercial purposes. You are responsible for ensuring the AI output is accurate and appropriate for your needs.",
      },
      {
        question: "Who owns the AI-generated content from these prompts?",
        answer:
          "You own the output once you run a prompt, subject to the terms of the AI tool you used.",
      },
    ],
  },
  {
    title: "Troubleshooting and Support",
    items: [
      {
        question: "What if a prompt does not give me the result I expected?",
        answer:
          "AI outputs can vary. Try rewording the prompt, adding more detail, or combining it with another prompt. All prompts are designed to be flexible so you can adapt them to your style.",
      },
      {
        question: "What if a prompt does not paste correctly into my AI tool?",
        answer:
          "Some platforms add extra formatting when you copy text. Try pasting without formatting using Ctrl+Shift+V or Command+Shift+V, or paste into a plain text editor first.",
      },
      {
        question: "How can I contact support?",
        answer: "Email us at support@promptandgo.ai. We aim to respond within 2 business days.",
      },
      {
        question: "How often do you add new prompts?",
        answer:
          "We add fresh prompts regularly, usually every week. To get updates, join our mailing list or follow us on social media.",
      },
    ],
  },
];

const allQA = sections.flatMap((s) => s.items);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allQA.map((qa) => ({
    "@type": "Question",
    name: qa.question,
    acceptedAnswer: { "@type": "Answer", text: qa.answer },
  })),
};

const FAQs = () => {
  const { user } = useSupabaseAuth();
  return (
    <>
      <SEO
        title="FAQs - PromptandGo"
        description="Find quick answers about PromptandGo: getting started, using prompts, payments, licensing, and support."
        structuredData={faqSchema}
      />

      <PageHero
        minHeightClass="min-h-[32svh]"
        title={<>
          <span className="text-gradient-brand">Got Questions?</span> We’ve Got You
        </>}
        subtitle={
          <>New to prompting? Not sure where to start? Don’t worry, you’re in the right place. Here are quick answers to the things people ask us all the time (and a few they don’t, but probably should).</>
        }
      >
        <Button asChild size="lg" variant="hero" className="px-6">
          <Link to="/library#library-filters">Browse Prompts</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to="/contact">Contact Support</Link>
        </Button>
      </PageHero>

      <div id="top"></div>

      <main className="container py-10 max-w-6xl">
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
              <BreadcrumbPage>FAQs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>


        {/* Quick Stats Section */}
        <section className="mb-12">
          <div className="grid gap-6 md:grid-cols-3">
            <Link to="/library#library-filters">
              <Card className="text-center p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 hover:shadow-lg transition-all cursor-pointer">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">3,000+ Prompts</h3>
                <p className="text-sm text-muted-foreground">Tested and curated for real-world use</p>
              </Card>
            </Link>
            <Link to="/packs#popular-power-packs">
              <Card className="text-center p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20 hover:shadow-lg transition-all cursor-pointer">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Power Packs</h3>
                <p className="text-sm text-muted-foreground">Curated bundles for specific goals</p>
              </Card>
            </Link>
            <Link to="/account/favorites">
              <Card className="text-center p-6 bg-gradient-to-br from-secondary/5 to-primary/5 border-secondary/20 hover:shadow-lg transition-all cursor-pointer">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">My Prompts</h3>
                <p className="text-sm text-muted-foreground">Save your favorites for quick access</p>
              </Card>
            </Link>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* FAQ Sections */}
          <div className="lg:col-span-2 space-y-8">
            {sections.map((section, idx) => (
              <Card key={section.title} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {section.items.map((qa, i) => (
                      <AccordionItem key={qa.question} value={`item-${idx}-${i}`} className="border-b last:border-b-0">
                        <AccordionTrigger className="px-6 py-4 text-left font-medium hover:bg-muted/50 transition-colors">
                          {qa.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                          {qa.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/library#library-filters">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Browse All Prompts
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/packs#popular-power-packs">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Explore ⚡Power Packs
                  </Link>
                </Button>
                {user ? (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/account/favorites">
                      <Heart className="w-4 h-4 mr-2" />
                      My Saved Prompts
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/auth">Get Started Free</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Popular Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Content Creation",
                  "Social Media",
                  "Email Marketing", 
                  "Career Development",
                  "Business Strategy"
                ].map((category) => (
                  <Button
                    key={category}
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                  >
                    <Link to={`/library?q=${encodeURIComponent(category)}#library-results`}>
                      {category}
                    </Link>
                  </Button>
                ))}
              </CardContent>
            </Card>

        {/* Contact Support */}
            <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
              <CardHeader>
                <CardTitle className="text-lg">Still Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Can't find what you're looking for? Our support team responds within 24 hours with personalized help.
                </p>
                <Button asChild className="w-full" variant="secondary">
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Money-Back Guarantee */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:border-green-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-lg text-green-800 dark:text-green-200">
                    30-Day Guarantee
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
                <div className="space-y-2 text-xs text-green-600 dark:text-green-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    <span>Full money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    <span>Keep saved prompts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    <span>No questions asked</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <section aria-labelledby="cta-tail" className="relative bg-hero hero-grid mt-12">
          <div className="container p-8 md:p-12 text-center text-primary-foreground">
            <h2 id="cta-tail" className="text-2xl md:text-3xl font-semibold tracking-tight">Whatever you’re working on, someone’s already used <strong>prompt</strong>andgo to do it faster.</h2>
            <p className="mt-3 text-primary-foreground/85 text-base md:text-lg">✨ Ready to Start Prompting Smarter? Try your first prompt or explore a Power Pack, no sign-up required.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="hero" className="px-6">
                <Link to="/library#library-filters">Browse Prompt Library</Link>
              </Button>
              {user ? (
                <Button asChild size="lg" variant="secondary">
                  <Link to="/account/favorites">My Prompts</Link>
                </Button>
              ) : (
                <Button asChild size="lg" variant="secondary">
                  <Link to="/auth">Login</Link>
                </Button>
              )}
              <Button asChild size="lg" variant="inverted">
                <Link to="/packs">Explore ⚡️Power Packs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default FAQs;
