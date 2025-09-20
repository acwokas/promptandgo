import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Wand2, Brain, ArrowRight, Sparkles, Palette } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import PageHero from "@/components/layout/PageHero";
import { useEffect } from "react";

const ToolkitPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we have an initialPrompt from navigation state (from "Refine with Scout")
  useEffect(() => {
    const state = location.state as { initialPrompt?: string } | null;
    if (state?.initialPrompt) {
      // Redirect to AI generator with the prompt
      navigate('/ai/generator', { 
        state: { initialPrompt: state.initialPrompt },
        replace: true 
      });
    }
  }, [location.state, navigate]);
  const tools = [
    {
      title: "Scout's Prompt Studio",
      description: "Craft perfect prompts with guided dropdowns and curated options - no guesswork required",
      icon: Palette,
      path: "/ai/studio",
      features: ["Guided creation", "Image prompts", "Event prompts", "Expert quality"],
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Scout Prompt Generator",
      description: "Let Scout create custom prompts from scratch or get AI-powered suggestions tailored to your needs",
      icon: Wand2,
      path: "/ai/generator",
      features: ["Scout-powered creation", "Custom prompts", "Copy & save", "Professional quality"],
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <>
      <SEO 
        title="Meet Scout - Your AI Prompt Explorer"
        description="Meet Scout, your AI prompt explorer. Discover powerful tools for creating perfect prompts, getting expert guidance, and enhancing your AI interactions."
      />
      
      
      <PageHero 
        title={
          <div className="flex flex-col items-center gap-6">
            {/* Scout's Avatar */}
            <div className="relative">
              <video 
                src="/scout-animation-v2.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-32 h-32 rounded-full object-cover border-4 border-primary-foreground/20 shadow-xl hover-scale"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-foreground rounded-full border-4 border-primary/20 flex items-center justify-center">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-foreground/20 rounded-2xl">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <span>Meet Scout</span>
            </div>
          </div>
        }
        subtitle={
          <div className="space-y-6">
            <p className="text-xl leading-relaxed">
              Your friendly AI prompt explorer. Scout offers perfect prompts, expert guidance, and smart tools 
              for any AI task. Let's explore what Scout can do for you!
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge variant="secondary" className="text-sm bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Scout-Powered
              </Badge>
              <Badge variant="outline" className="text-sm border-primary-foreground/30 text-primary-foreground">Free to Use</Badge>
              <Badge variant="outline" className="text-sm border-primary-foreground/30 text-primary-foreground">Expert Quality</Badge>
            </div>
          </div>
        }
        minHeightClass="min-h-[45svh]"
      />

      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Scout</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Tools Grid */}
          <div className="grid gap-8 md:grid-cols-2 mb-16">
            {tools.map((tool) => (
              <Card key={tool.title} className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80">
                <CardHeader className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${tool.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center">
                      <tool.icon className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                  
                  <div>
                    <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {tool.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button asChild className="w-full group-hover:shadow-md transition-shadow">
                    <Link to={tool.path === "/ai/generator" && typeof window !== 'undefined' ? 
                      `${tool.path}${new URLSearchParams(window.location.search).get('prompt') ? 
                        `?prompt=${encodeURIComponent(new URLSearchParams(window.location.search).get('prompt') || '')}` : 
                        ''}` : 
                      tool.path
                    }>
                      Open Tool
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>

          {/* Why Choose Scout Section */}
          <div className="mt-12">
            <div className="text-center space-y-8 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">Why Choose Scout?</h2>
              
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Wand2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Expert Quality</h3>
                  <p className="text-muted-foreground text-sm">
                    Scout creates prompts that rival those made by expert prompt engineers
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Smart & Personalized</h3>
                  <p className="text-muted-foreground text-sm">
                    Scout learns your preferences and tailors recommendations to your specific needs
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Always Improving</h3>
                  <p className="text-muted-foreground text-sm">
                    Scout continuously learns from the latest prompt engineering techniques and best practices
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <Link to="/ai/studio">
                    Start Creating with Scout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ToolkitPage;