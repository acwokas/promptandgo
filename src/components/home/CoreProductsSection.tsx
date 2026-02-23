import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Bot, Wand2, Rocket, ArrowRight } from "lucide-react";

export function CoreProductsSection() {
  return (
    <section className="container py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Four Powerful Tools, One Complete Solution</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Whether you prefer ready-made prompts or custom creation, we've got you covered. Mix and match these tools based on your workflow - everything works together seamlessly.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {/* Prompt Library */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Prompt Library</h3>
            <p className="text-sm text-muted-foreground mb-4">3,000+ battle-tested prompts organised by category. Copy, paste, and get results instantly.</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/library">Browse Library</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Power Packs */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Power Packs</h3>
            <p className="text-sm text-muted-foreground mb-4">Curated collections for specific goals like marketing campaigns, job hunting, or creative projects.</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/packs">View Packs</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Scout AI */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Scout AI</h3>
            <p className="text-sm text-muted-foreground mb-4">Your AI prompt companion. Optimizes any prompt for ChatGPT, Claude, MidJourney, and more.</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/scout">Chat with Scout</Link>
            </Button>
          </CardContent>
        </Card>

        {/* AI Prompt Generator */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <Wand2 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">AI Prompt Generator</h3>
            <p className="text-sm text-muted-foreground mb-4">Describe what you want and Scout creates a professional-quality prompt from scratch.</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/ai/generator">Generate Prompts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Platform Examples */}
      <div className="bg-gradient-to-br from-muted/30 to-background rounded-2xl p-8 pb-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Optimized for Every Major AI Platform</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Scout tailors prompts specifically for each AI platform's strengths and requirements.
          </p>
        </div>
        <div className="grid gap-4 grid-cols-3 md:grid-cols-6 max-w-2xl mx-auto mb-8">
          {[
            { label: "GPT", name: "ChatGPT", gradient: "from-green-500 to-emerald-500" },
            { label: "C", name: "Claude", gradient: "from-orange-500 to-red-500" },
            { label: "G", name: "Gemini", gradient: "from-blue-500 to-purple-500" },
            { label: "MJ", name: "MidJourney", gradient: "from-indigo-500 to-blue-600" },
            { label: "P", name: "Perplexity", gradient: "from-purple-500 to-pink-500" },
            { label: "+", name: "& More", gradient: "from-pink-500 to-rose-500" },
          ].map((platform) => (
            <div key={platform.name} className="text-center">
              <div className={`w-12 h-12 bg-gradient-to-r ${platform.gradient} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <span className="text-white font-bold text-sm">{platform.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{platform.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How Everything Works Together */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 mt-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">How It All Works Together</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            The magic happens when you combine our tools. Start anywhere, then let Scout enhance and optimize everything for maximum results.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">1. Start with Proven Prompts</h4>
            <p className="text-sm text-muted-foreground">Browse our library or packs for battle-tested starting points</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">2. Let Scout Optimize</h4>
            <p className="text-sm text-muted-foreground">Scout rewrites for your specific AI platform and use case</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">3. Get Perfect Results</h4>
            <p className="text-sm text-muted-foreground">Copy to your favorite AI platform and achieve better outcomes</p>
          </div>
        </div>

        <div className="text-center mt-8 mb-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/how-it-works">
              Learn More <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
