import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useNewsletterStatus } from "@/hooks/useNewsletterStatus";
import { useToast } from "@/hooks/use-toast";
import { useLoginWidget } from "@/hooks/useLoginWidget";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ShieldCheck, Zap, Clock, BadgeCheck, Globe, Scale, Search, Heart, Bot, Copy, Check, Sparkles, ArrowRight, Users, Target, Brain, Rocket } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { MatchedPowerPacks } from "@/components/MatchedPowerPacks";
import { Badge } from "@/components/ui/badge";
import workflowImage from "@/assets/how-it-works-workflow.jpg";
import scoutImage from "@/assets/scout-optimization.jpg";
import powerPacksImage from "@/assets/power-packs-collection.jpg";

const HowItWorks = () => {
  const { user } = useSupabaseAuth();
  const { isNewsletterSubscribed } = useNewsletterStatus();
  const { toast } = useToast();
  const { openLoginWidget } = useLoginWidget();
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  // Example prompt data
  const examplePrompt = {
    id: "demo-prompt-123",
    title: "Email Marketing Prompt",
    prompt: "Write a compelling email subject line and 150-word email body for [PRODUCT/SERVICE] that [MAIN BENEFIT]. Target audience: [AUDIENCE]. Tone: [professional/casual/urgent]. Include a clear call-to-action."
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(examplePrompt.prompt);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "Prompt copied successfully. Paste it into your AI tool.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please try selecting and copying manually.",
        variant: "destructive",
      });
    }
  };

  const handleAddToFavorites = async () => {
    if (!user) {
      openLoginWidget();
      return;
    }

    setIsLoadingFavorite(true);
    try {
      // This is a demo, so we'll just simulate the action
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited ? "Demo prompt removed from your collection." : "Demo prompt saved to your favorites!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFavorite(false);
    }
  };
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://promptandgo.ai';
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How PromptandGo Works",
    description: "Complete AI productivity toolkit with prompt library, Scout optimization, and Power Packs - all free.",
    step: [
      { "@type": "HowToStep", name: "Browse Library", text: "Explore 3,000+ tested prompts organised by category and use case." },
      { "@type": "HowToStep", name: "Optimize with Scout", text: "Let Scout AI rewrite prompts for your specific AI platform (ChatGPT, Claude, Gemini, etc)." },
      { "@type": "HowToStep", name: "Use Power Packs", text: "Get themed collections of prompts for specific goals like marketing or business strategy." },
      { "@type": "HowToStep", name: "Get Results", text: "Paste optimised prompts into any AI tool and get better results instantly." },
    ],
    mainEntityOfPage: { "@type": "WebPage", "@id": `${origin}/how-it-works` },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is PromptandGo?", acceptedAnswer: { "@type": "Answer", text: "A complete AI productivity toolkit with prompt library, Scout optimization, and Power Packs - all completely free." } },
      { "@type": "Question", name: "How does Scout work?", acceptedAnswer: { "@type": "Answer", text: "Scout AI optimizes any prompt for your specific AI platform, rewriting it for better results on ChatGPT, Claude, Gemini, and more." } },
      { "@type": "Question", name: "Is everything really free?", acceptedAnswer: { "@type": "Answer", text: "Yes! Browse prompts, use Scout optimization, and access many Power Packs completely free. Premium options available for advanced features." } },
    ],
  };
  
  return (<>
    <SEO title="How PromptandGo Works - Free AI Tools & Scout Optimization" description="Discover our complete suite: Prompt Library, Power Packs, and Scout AI that optimizes prompts for any AI platform - all completely free." structuredData={[howToSchema, faqSchema]} />
    <PageHero
      title={<>How <span className="text-gradient-brand">PromptandGo</span> Works</>}
      subtitle={
        <>
          Get better AI results with our complete toolkit: browse 3,000+ tested prompts, use specialised Power Packs, and let Scout optimize everything for your favorite AI platform. All completely free.
        </>
      }
      minHeightClass="min-h-[35svh]"
    >
      <Button asChild size="lg" variant="hero" className="px-6">
        <Link to="/library"><Search className="h-4 w-4 mr-2" />Browse Library</Link>
      </Button>
      <Button asChild size="lg" variant="inverted">
        <Link to="/scout"><Bot className="h-4 w-4 mr-2" />Try Scout AI</Link>
      </Button>
    </PageHero>

    <main className="container py-12">
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
            <BreadcrumbPage>How it Works</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Overview Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Your Complete AI Productivity Toolkit</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Four powerful tools working together to give you better AI results, faster. No learning curve, no subscriptions required.
          </p>
          <Badge className="mt-4 bg-green-600 text-white px-4 py-2 text-lg">
            ✨ Everything is 100% FREE
          </Badge>
        </div>
        
        <div className="relative">
          <img 
            src={workflowImage} 
            alt="PromptandGo workflow showing four steps: Browse prompts, Scout optimization, AI platform selection, and results"
            className="w-full rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-12">Everything You Need, All in One Place</h2>
        
        <div className="grid gap-8 md:grid-cols-2">
          
          {/* Prompt Library */}
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-6 w-6 text-primary" />
                  Prompt Library
                </CardTitle>
                <Badge variant="secondary">3,000+ Prompts</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Browse thousands of tested prompts organized by category. From business writing to creative projects, find exactly what you need in seconds.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Free and PRO prompts available</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>39+ categories to explore</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Copy-paste ready</span>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link to="/library">Browse Library</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Power Packs */}
          <Card className="relative overflow-hidden border-purple-200 bg-gradient-to-br from-purple-50 to-transparent dark:border-purple-800 dark:from-purple-950">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-purple-600" />
                  Power Packs
                </CardTitle>
                <Badge variant="secondary">Themed Collections</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Curated collections of prompts for specific goals. Get everything you need for marketing campaigns, business strategy, content creation, and more.
              </p>
              <div className="mb-4">
                <img 
                  src={powerPacksImage} 
                  alt="Various Power Pack icons including business, creative, productivity themes"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Themed prompt collections</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Special pricing bundles</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Ready-to-use workflows</span>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link to="/packs">View Power Packs</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Scout AI */}
          <Card className="relative overflow-hidden border-blue-200 bg-gradient-to-br from-blue-50 to-transparent dark:border-blue-800 dark:from-blue-950">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-6 w-6 text-blue-600" />
                  Scout AI Assistant
                </CardTitle>
                <Badge className="bg-blue-600 text-white">✨ Smart Optimization</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Your personal AI assistant that optimizes any prompt for your specific AI platform. Get better results from ChatGPT, Claude, Gemini, and more.
              </p>
              <div className="mb-4">
                <img 
                  src={scoutImage} 
                  alt="Scout AI optimizing prompts for different AI platforms"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>Platform-specific optimization</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>Instant prompt rewrites</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>Works with any AI tool</span>
                </div>
              </div>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link to="/scout">Try Scout Free</Link>
              </Button>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card className="relative overflow-hidden border-green-200 bg-gradient-to-br from-green-50 to-transparent dark:border-green-800 dark:from-green-950">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-green-600" />
                  AI Prompt Generator
                </CardTitle>
                <Badge className="bg-green-600 text-white">Create Custom</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Can't find the perfect prompt? Generate custom prompts tailored to your exact needs. Perfect for unique projects and specific requirements.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-green-500" />
                  <span>Custom prompt generation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-green-500" />
                  <span>Tailored to your goals</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-green-500" />
                  <span>Multiple variations</span>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link to="/ai-assistant">Generate Prompts</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How Scout Works Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Scout Makes Every Prompt Better</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Scout analyses your prompts and rewrites them specifically for your chosen AI platform. Get 3x better results instantly.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-blue-50 to-transparent border-blue-200 dark:from-blue-950 dark:border-blue-800">
          <CardContent className="p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">How Scout Optimization Works</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-semibold">Input Any Prompt</h4>
                      <p className="text-sm text-muted-foreground">Paste any prompt from our library or write your own</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-semibold">Choose Your AI Platform</h4>
                      <p className="text-sm text-muted-foreground">Select ChatGPT, Claude, Gemini, or any other AI tool</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-semibold">Get Optimized Prompt</h4>
                      <p className="text-sm text-muted-foreground">Scout rewrites it with platform-specific optimizations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <h4 className="font-semibold">Copy & Get Better Results</h4>
                      <p className="text-sm text-muted-foreground">Paste the optimised prompt and see improved output</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-4 border">
                  <h4 className="font-semibold text-sm mb-2">✨ What Scout Optimizes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Platform-specific formatting and structure</li>
                    <li>• Token efficiency for better performance</li>
                    <li>• Context clarity and instruction precision</li>
                    <li>• Output format specifications</li>
                  </ul>
                </div>
                
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/scout">Try Scout Free <ArrowRight className="h-4 w-4 ml-2" /></Link>
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border">
                  <div className="text-xs text-muted-foreground mb-2">Before Scout (Generic Prompt):</div>
                  <p className="text-sm font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded text-wrap">
                    "Write a marketing email for my product."
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <ArrowRight className="h-6 w-6 text-blue-600" />
                </div>
                
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-blue-200">
                  <div className="text-xs text-blue-600 mb-2">After Scout (Optimized for ChatGPT):</div>
                  <p className="text-sm font-mono bg-blue-50 dark:bg-blue-950 p-3 rounded text-wrap">
                    "Act as an expert email marketer. Write a compelling marketing email for [PRODUCT] targeting [AUDIENCE]. Include: 1) Attention-grabbing subject line, 2) Personal greeting, 3) Problem/solution hook, 4) 3 key benefits, 5) Social proof, 6) Clear CTA. Tone: [SPECIFY]. Length: 150-200 words."
                  </p>
                  <div className="mt-2 text-xs text-blue-600">
                    ↑ 3x more specific, structured for better results
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* How Everything Works Together */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It All Works Together</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Use our tools separately or combine them for maximum results. Here's the complete workflow:
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1 */}
          <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">1</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Start with Our Library or Power Packs</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse 3,000+ tested prompts or grab a Power Pack for your specific goal. Everything is organised by category and use case.
                  </p>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link to="/library">Browse Library</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/packs">View Power Packs</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="bg-gradient-to-r from-blue-50 to-transparent border-blue-200 dark:from-blue-950 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">2</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Optimize with Scout (Optional but Recommended)</h3>
                  <p className="text-muted-foreground mb-4">
                    Let Scout rewrite your prompt specifically for ChatGPT, Claude, Gemini, or any other AI platform. Get 3x better results instantly.
                  </p>
                  <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/scout">Try Scout Free</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="bg-gradient-to-r from-green-50 to-transparent border-green-200 dark:from-green-950 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold">3</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Copy & Paste into Any AI Tool</h3>
                  <p className="text-muted-foreground mb-4">
                    Take your optimised prompt and paste it into ChatGPT, Claude, Gemini, Perplexity, or any other AI platform. Works universally.
                  </p>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>✅ ChatGPT</span>
                    <span>✅ Claude</span>
                    <span>✅ Gemini</span>
                    <span>✅ Perplexity</span>
                    <span>✅ Any AI tool</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="bg-gradient-to-r from-purple-50 to-transparent border-purple-200 dark:from-purple-950 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">4</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Get Better Results, Faster</h3>
                  <p className="text-muted-foreground mb-4">
                    Enjoy higher quality outputs, save hours of prompt crafting, and achieve your goals more efficiently. All completely free.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Rocket className="h-4 w-4 text-purple-600" />
                      <span>3x Better Results</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span>Save Hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-purple-600" />
                      <span>100% Free</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Visual Example */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">See It In Action</h2>
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  Copy a prompt from our library
                </h3>
                <div className="bg-background rounded-lg border p-4 text-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground">{examplePrompt.title}</span>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleCopyPrompt}
                        className="h-6 px-2 text-xs"
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleAddToFavorites}
                        disabled={isLoadingFavorite}
                        className="h-6 px-2 text-xs"
                      >
                        <Heart className={`h-3 w-3 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                      </Button>
                    </div>
                  </div>
                  <p className="font-mono text-xs leading-relaxed mb-3">
                    "{examplePrompt.prompt.substring(0, 100)}..."
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={handleCopyPrompt}
                      variant="outline"
                      className="h-7 px-3 text-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Prompt
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  Let Scout optimize & paste into ChatGPT
                </h3>
                <div className="bg-background rounded-lg border p-4 text-sm">
                  <div className="text-xs text-blue-600 mb-2">Scout Optimized for ChatGPT:</div>
                  <div className="space-y-2">
                    <p className="font-mono text-xs bg-blue-50 dark:bg-blue-950 p-2 rounded">
                      "Act as an expert email marketer. Write a compelling email for [PRODUCT] targeting [AUDIENCE]..."
                    </p>
                    <div className="text-xs text-green-600">✨ 3x more specific structure</div>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-2">ChatGPT Output:</div>
                    <p className="text-xs bg-green-50 dark:bg-green-950 p-2 rounded">
                      "Subject: Save 3+ hours daily with AI automation"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Free Features */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need, Completely Free</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe AI productivity tools should be accessible to everyone. That's why our core features are 100% free forever.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-transparent border-green-200 dark:from-green-950 dark:border-green-800">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Browse 3,000+ Prompts</h3>
            <p className="text-muted-foreground mb-4">
              Access thousands of tested prompts across 39+ categories. No limits, no paywalls.
            </p>
            <Badge className="bg-green-600 text-white">FREE FOREVER</Badge>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-transparent border-blue-200 dark:from-blue-950 dark:border-blue-800">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Scout Optimization</h3>
            <p className="text-muted-foreground mb-4">
              Get unlimited prompt optimizations for any AI platform. Better results, every time.
            </p>
            <Badge className="bg-blue-600 text-white">FREE FOREVER</Badge>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-transparent border-purple-200 dark:from-purple-950 dark:border-purple-800">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Power Pack Access</h3>
            <p className="text-muted-foreground mb-4">
              Many Power Packs are completely free. Premium collections available for advanced needs.
            </p>
            <Badge className="bg-purple-600 text-white">FREEMIUM</Badge>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto mb-16 text-center">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Better AI Results?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start with our library, optimize with Scout, or explore Power Packs. Everything you need to prompt smarter, not harder.
          </p>
          
          <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
            <Button asChild variant="hero" className="px-6">
              <Link to="/library">
                <Search className="h-4 w-4 mr-2" />
                Browse Library
              </Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/scout">
                <Bot className="h-4 w-4 mr-2" />
                Try Scout AI
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/packs">
                <Zap className="h-4 w-4 mr-2" />
                Power Packs
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            No sign-up required to get started • 100% free core features
          </p>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="container py-12 mt-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* FAQ Column */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-8">Frequently Asked Questions</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-semibold mb-1">How does Scout optimization work?</h3>
                  <p className="text-sm text-muted-foreground">Scout analyses your prompt and rewrites it with platform-specific optimizations, better structure, and clearer instructions for improved results.</p>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-semibold mb-1">Is everything really free?</h3>
                  <p className="text-sm text-muted-foreground">Yes! Core features including the library, Scout optimization, and many Power Packs are completely free. Premium options available for advanced features.</p>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-semibold mb-1">Which AI platforms work with Scout?</h3>
                  <p className="text-sm text-muted-foreground">Scout optimizes for ChatGPT, Claude, Gemini, Perplexity, and virtually any text-based AI platform. Just select your platform and get optimised prompts.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-semibold mb-1">How are Power Packs different from the library?</h3>
                  <p className="text-sm text-muted-foreground">Power Packs are curated collections focused on specific goals like marketing campaigns or business strategy, while the library contains individual prompts by category.</p>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-semibold mb-1">Do I need to create an account?</h3>
                  <p className="text-sm text-muted-foreground">No account needed to browse prompts or use Scout! Create a free account to save favorites, access premium Power Packs, and track usage.</p>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-semibold mb-1">How fast will I see better results?</h3>
                  <p className="text-sm text-muted-foreground">Immediately! Users typically see 3x better results from their first optimised prompt. The difference is noticeable from the first use.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Button asChild variant="outline" size="sm">
                <Link to="/faqs">See All FAQs →</Link>
              </Button>
            </div>
          </div>

          {/* Newsletter Sidebar or Matched Packs */}
          <div className="lg:col-span-1">
            {user && isNewsletterSubscribed ? (
              <div className="sticky top-6">
                <MatchedPowerPacks />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border-primary/20 border h-fit sticky top-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  🎯 Get Weekly Tips
                </h3>
                <p className="text-sm text-muted-foreground mb-4">Join 25,000+ users getting our best prompts and AI productivity tips every Tuesday.</p>
                
                <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                  <li>✓ Weekly prompting tips</li>
                  <li>✓ AI productivity insights</li>
                  <li>✓ No spam, unsubscribe anytime</li>
                </ul>
                
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const email = formData.get('email') as string;
                  
                  try {
                    const { error } = await supabase.functions.invoke('newsletter-subscribe', {
                      body: JSON.stringify({ email }),
                      headers: { 'Content-Type': 'application/json' }
                    });
                    
                    if (error) throw error;
                    
                    toast({
                      title: "Welcome aboard! 🎉",
                      description: "Check your email to confirm your subscription.",
                    });
                  } catch (error) {
                    toast({
                      title: "Subscription failed",
                      description: "Please try again or check your email address.",
                      variant: "destructive",
                    });
                  }
                }} className="space-y-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button type="submit" size="sm" className="w-full">
                    Subscribe Free
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
      
    </main>
  </>
  );
};

export default HowItWorks;