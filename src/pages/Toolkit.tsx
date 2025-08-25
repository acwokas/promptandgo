import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Wand2, Brain, Bot, ArrowRight, Sparkles } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const ToolkitPage = () => {
  const tools = [
    {
      title: "Scout Prompt Generator",
      description: "Let Scout create custom prompts from scratch or get AI-powered suggestions tailored to your needs",
      icon: Wand2,
      path: "/ai/generator",
      features: ["Scout-powered creation", "Custom prompts", "Copy & save", "Professional quality"],
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Scout AI Assistant",
      description: "Chat with Scout to find prompts and get expert guidance",
      icon: Bot,
      path: "/ai/assistant",
      features: ["Interactive chat", "Prompt discovery", "Expert tips"],
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <>
      <SEO 
        title="Interactive AI Tools - Advanced Prompt Tools"
        description="Discover our powerful interactive AI tools featuring prompt generation, smart recommendations, and an AI assistant to enhance your AI interactions."
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
                <BreadcrumbPage>Interactive</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Interactive
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced AI-powered tools to create, discover, and optimize your prompts. 
              Get professional results with our intelligent interactive tools.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge variant="secondary" className="text-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="text-sm">Free to Use</Badge>
              <Badge variant="outline" className="text-sm">Professional Quality</Badge>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
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

        {/* AI Assistant Upsell */}
        <div className="mt-12 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
          <div className="flex items-center gap-3 mb-4">
            <Bot className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-semibold">Meet Scout - Your AI Prompt Explorer</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Not sure what prompt to create? Chat with Scout for personalized recommendations and expert guidance on finding the perfect prompts for any task.
          </p>
          <Button asChild className="bg-green-500 hover:bg-green-600">
            <Link to="/ai/assistant">
              Chat with Scout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

          {/* Features Section */}
          <div className="text-center space-y-8 bg-muted/30 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6">Why Use Our Interactive Tools?</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Wand2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Professional Quality</h3>
                <p className="text-muted-foreground text-sm">
                  Generate prompts that rival those created by expert prompt engineers
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Smart & Personalized</h3>
                <p className="text-muted-foreground text-sm">
                  Get recommendations tailored to your industry, goals, and preferences
                </p>
              </div>
              
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Meet Scout</h3>
                  <p className="text-muted-foreground text-sm">
                    Get help from Scout, your AI prompt explorer trained on prompt engineering best practices
                  </p>
                </div>
            </div>

            <div className="pt-6">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <Link to="/ai/generator">
                  Start Creating Prompts
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ToolkitPage;