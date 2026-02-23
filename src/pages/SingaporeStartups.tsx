import React, { useState } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Zap, BarChart3, TrendingUp, Users, FileText, Share2, DollarSign, MessageSquare, Brain } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useNewsletterStatus } from "@/hooks/useNewsletterStatus";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const SingaporeStartups = () => {
  const { user } = useSupabaseAuth();
  const { isNewsletterSubscribed } = useNewsletterStatus();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Welcome to the PromptandGo community. Check your email to confirm.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startupUseCases = [
    {
      icon: FileText,
      title: "Investor Pitch Emails",
      description: "Craft compelling cold emails to investors with data-backed value propositions",
      link: "/library?category=startup&q=investor",
    },
    {
      icon: TrendingUp,
      title: "Go-to-Market Planning",
      description: "Develop detailed GTM strategies, launch plans, and customer acquisition roadmaps",
      link: "/library?category=startup&q=go-to-market",
    },
    {
      icon: Brain,
      title: "Competitor Analysis",
      description: "Structure competitive intelligence and identify market opportunities",
      link: "/library?category=startup&q=competitor",
    },
    {
      icon: Share2,
      title: "Social Media Content",
      description: "Generate LinkedIn posts, Twitter threads, and product announcement copy",
      link: "/library?category=startup&q=social",
    },
    {
      icon: MessageSquare,
      title: "Customer Discovery Interviews",
      description: "Build interview guides and analyze customer feedback at scale",
      link: "/library?category=startup&q=customer",
    },
    {
      icon: DollarSign,
      title: "Financial Projections & Models",
      description: "Create 3-year projections, unit economics analysis, and fundraising decks",
      link: "/library?category=startup&q=financial",
    },
  ];

  const statCards = [
    {
      number: "50,625",
      description: "professionals in Singapore actively seeking AI prompt optimization",
    },
    {
      number: "24.91%",
      description: "whitespace in Entrepreneurship & Startups — no major brand serves this",
    },
    {
      number: "62.72%",
      description: "of business professionals want to automate document management",
    },
    {
      number: "42.45%",
      description: "of learners seeking prompt engineering certification",
    },
  ];

  return (
    <>
      <SEO
        title="AI Prompts for Singapore Startups | PromptAndGo"
        description="Battle-tested AI prompts for Singapore founders — investor pitches, go-to-market plans, marketing copy. Used by 50,625+ professionals in Singapore."
        canonical="https://promptandgo.ai/singapore-startups"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "AI Prompts for Singapore Startups",
            description: "Prompt templates optimized for founders seeking investor pitches, go-to-market plans, marketing copy, and more.",
            image: "https://promptandgo.ai/singapore-startups-og.jpg",
          },
        ]}
      />

      <PageHero
        title="AI Prompts Built for Singapore Startups"
        subtitle="Stop guessing what to prompt. Start with battle-tested templates for founders — investor pitches, go-to-market plans, marketing copy, and more. Optimized by Scout AI for your specific platform."
        minHeightClass="min-h-[40svh]"
      >
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button asChild size="lg" variant="hero" className="px-8">
            <Link to="/optimize">
              Try the Prompt Optimizer Free <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="px-8">
            <Link to="/library?category=startup">
              Browse Startup Prompts
            </Link>
          </Button>
        </div>
      </PageHero>

      <main className="container py-16">
        {/* Market Data Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary px-4 py-2">Market Insights</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Singapore Founders Need Better Prompts</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The data shows massive demand for AI prompt optimization in the startup ecosystem, with huge whitespace for focused solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {statCards.map((stat, index) => (
              <Card key={index} className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <div className="text-4xl font-bold text-primary mb-3">{stat.number}</div>
                  <p className="text-muted-foreground leading-relaxed">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-900 px-4 py-2">Use Cases</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prompts That Actually Help Founders</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Pre-built templates for the specific challenges startup founders face, from raising capital to scaling operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {startupUseCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all hover:border-primary/50 group">
                  <CardContent className="pt-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{useCase.description}</p>
                    <Button asChild variant="ghost" size="sm" className="px-0 text-primary hover:text-primary/80">
                      <Link to={useCase.link} className="inline-flex items-center gap-1">
                        Try this prompt
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-20 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl border border-primary/20 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get optimized prompts in seconds, not hours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Pick a prompt",
                description: "Choose from our library of startup-specific prompts, or describe what you need.",
              },
              {
                step: "2",
                title: "Scout optimizes it",
                description: "Scout AI rewrites it for your AI platform—ChatGPT, Claude, Gemini, or others.",
              },
              {
                step: "3",
                title: "Copy, paste, win",
                description: "Paste the optimized prompt into your AI tool and get better results instantly.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/30 p-12 max-w-3xl mx-auto">
          <div className="text-center">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Join the Bootcamp Community</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get weekly tips, prompt templates, and strategies designed specifically for Singapore founders. Plus early access to new startup features.
            </p>

            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-3 mb-6">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="lg"
                variant="hero"
                disabled={isLoading}
                className="px-8"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground">
              <strong>Built by Adrian Watkins,</strong> founder of AI in Asia and PromptandGo. Based in Singapore.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default SingaporeStartups;
