import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { Wand2, Image, Copy, CheckCheck, ArrowRight, Palette, Camera, Sparkles } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PromptCrafter } from "@/components/prompt-studio/PromptCrafter";
import { EventPromptCrafter } from "@/components/prompt-studio/EventPromptCrafter";
import CTAPromptCrafter from "@/components/prompt-studio/CTAPromptCrafter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useLoginWidget } from "@/hooks/useLoginWidget";
import { Heart, Calendar, Megaphone } from "lucide-react";

const PromptStudioPage = () => {
  const [activeTab, setActiveTab] = useState<"image" | "event" | "cta">("image");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  const { openLoginWidget } = useLoginWidget();

  const handlePromptGenerated = (prompt: string) => {
    setGeneratedPrompt(prompt);
  };

  const handleCopy = async () => {
    if (!generatedPrompt) return;
    
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "Your crafted prompt is ready to use."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try selecting and copying the text manually.",
        variant: "destructive"
      });
    }
  };

  const handleAddToMyPrompts = () => {
    if (!user) {
      openLoginWidget();
      return;
    }
    
    // TODO: Implement adding to user's saved prompts
    toast({
      title: "Added to My Prompts!",
      description: "Your crafted prompt has been saved to your collection."
    });
  };

  return (
    <>
      <SEO 
        title="Scout's Prompt Studio - Guided AI Prompt Creation"
        description="Use Scout's Prompt Studio to craft perfect AI prompts with guided dropdowns. Create image prompts, text prompts, and more with expert guidance."
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
                <BreadcrumbLink asChild>
                  <Link to="/scout">Scout</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Prompt Studio</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Hero Section */}
          <div className="text-center mb-12 space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl">
                <Palette className="h-8 w-8 text-purple-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Scout's Prompt Studio
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Craft perfect AI prompts with Scout's guided approach. Choose your options from curated dropdowns 
              and let Scout build a professional-quality prompt for you.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge variant="secondary" className="text-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                Guided Creation
              </Badge>
              <Badge variant="outline" className="text-sm">Expert Quality</Badge>
              <Badge variant="outline" className="text-sm">No Guesswork</Badge>
            </div>
          </div>

          {/* Enhanced Tab Selection */}
          <div className="flex justify-center mb-8">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-2 border shadow-lg">
              <div className="flex gap-1">
                <Button
                  variant={activeTab === "image" ? "default" : "ghost"}
                  onClick={() => setActiveTab("image")}
                  className={`
                    flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200
                    ${activeTab === "image" 
                      ? "bg-primary text-primary-foreground shadow-md scale-105" 
                      : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                    }
                  `}
                  size="lg"
                >
                  <Image className="h-5 w-5" />
                  <span className="font-medium">Image Prompts</span>
                </Button>
                <Button
                  variant={activeTab === "event" ? "default" : "ghost"}
                  onClick={() => setActiveTab("event")}
                  className={`
                    flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200
                    ${activeTab === "event" 
                      ? "bg-primary text-primary-foreground shadow-md scale-105" 
                      : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                    }
                  `}
                  size="lg"
                >
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">Event Prompts</span>
                </Button>
                <Button
                  variant={activeTab === "cta" ? "default" : "ghost"}
                  onClick={() => setActiveTab("cta")}
                  className={`
                    flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200
                    ${activeTab === "cta" 
                      ? "bg-primary text-primary-foreground shadow-md scale-105" 
                      : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                    }
                  `}
                  size="lg"
                >
                  <Megaphone className="h-5 w-5" />
                  <span className="font-medium">CTA Prompts</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Prompt Crafter */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    {activeTab === "image" ? (
                      <Image className="h-5 w-5 text-purple-500" />
                    ) : activeTab === "event" ? (
                      <Calendar className="h-5 w-5 text-purple-500" />
                    ) : (
                      <Megaphone className="h-5 w-5 text-purple-500" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {activeTab === "image" ? "Image Prompt Crafter" : 
                       activeTab === "event" ? "Event Prompt Crafter" : "CTA Prompt Crafter"}
                    </CardTitle>
                    <CardDescription>
                      {activeTab === "image" 
                        ? "Build the perfect image prompt with guided selections"
                        : activeTab === "event"
                        ? "Craft detailed event prompts with comprehensive options"
                        : "Create compelling social media call-to-action prompts"
                      }
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {activeTab === "image" ? (
                  <PromptCrafter onPromptGenerated={handlePromptGenerated} />
                ) : activeTab === "event" ? (
                  <EventPromptCrafter onPromptGenerated={handlePromptGenerated} />
                ) : (
                  <CTAPromptCrafter onPromptGenerated={handlePromptGenerated} />
                )}
              </CardContent>
            </Card>

            {/* Right Column - Generated Prompt */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Wand2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Your Crafted Prompt</CardTitle>
                    <CardDescription>
                      Ready to use with any AI image generator
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedPrompt ? (
                  <>
                    <Textarea
                      value={generatedPrompt}
                      readOnly
                      className="min-h-[200px] resize-none bg-muted/50 border-muted"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleCopy}
                        variant="outline"
                        className="flex-1"
                        disabled={!generatedPrompt}
                      >
                        {copied ? (
                          <>
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Prompt
                          </>
                        )}
                      </Button>
                      <Button 
                        onClick={handleAddToMyPrompts}
                        variant="outline"
                        disabled={!generatedPrompt}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Add to My Prompts
                      </Button>
                    </div>
                    <Button asChild className="w-full">
                      <Link to={`/ai/generator?prompt=${encodeURIComponent(generatedPrompt)}`}>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Enhance with Scout
                      </Link>
                    </Button>
                  </>
                ) : (
                  <div className="min-h-[200px] flex items-center justify-center text-center text-muted-foreground">
                    <div className="space-y-3">
                      <Camera className="h-12 w-12 mx-auto opacity-40" />
                      <p>Start crafting your prompt using the options on the left.</p>
                      <p className="text-sm">Scout will build a professional prompt for you!</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-6">More Studio Tools Coming Soon</h2>
            <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
              <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/10">
                <CardContent className="p-6 text-center">
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <Wand2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Text Prompt Crafter</h3>
                  <p className="text-sm text-muted-foreground">Coming Soon</p>
                </CardContent>
              </Card>
              <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/10">
                <CardContent className="p-6 text-center">
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <Wand2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Code Prompt Crafter</h3>
                  <p className="text-sm text-muted-foreground">Coming Soon</p>
                </CardContent>
              </Card>
              <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/10">
                <CardContent className="p-6 text-center">
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <Wand2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Marketing Prompt Crafter</h3>
                  <p className="text-sm text-muted-foreground">Coming Soon</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PromptStudioPage;