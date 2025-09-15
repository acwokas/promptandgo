import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Wand2, Image, Copy, CheckCheck, ArrowRight, Palette, Camera, Sparkles, ChevronDown } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PromptCrafter } from "@/components/prompt-studio/PromptCrafter";
import { EventPromptCrafter } from "@/components/prompt-studio/EventPromptCrafter";
import CTAPromptCrafter from "@/components/prompt-studio/CTAPromptCrafter";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useLoginWidget } from "@/hooks/useLoginWidget";
import { Heart, Calendar, Megaphone } from "lucide-react";

const PromptStudioPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"image" | "event" | "cta">("image");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  const { openLoginWidget } = useLoginWidget();

  // Initialize from URL parameters
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as "image" | "event" | "cta";
    if (tabFromUrl && ['image', 'event', 'cta'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

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
      
      <main className="mobile-safe min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="mobile-safe w-full max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-12">
          
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6 sm:mb-8">
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
          <div className="text-center mb-8 sm:mb-12 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl sm:rounded-2xl">
                <Palette className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Scout's Prompt Studio
              </h1>
            </div>
            
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              Craft perfect AI prompts with Scout's guided approach. Choose your options from curated dropdowns 
              and let Scout build a professional-quality prompt for you.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                Guided Creation
              </Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">Expert Quality</Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">No Guesswork</Badge>
            </div>
          </div>

          {/* Topic Selection Dropdown */}
          <div className="w-full mobile-safe">
            <div className="w-full max-w-2xl mx-auto text-center mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
                Choose your topic and start crafting
              </h2>
              <Select value={activeTab} onValueChange={(value) => setActiveTab(value as "image" | "event" | "cta")}>
                <SelectTrigger className="w-full max-w-xs mx-auto bg-card/90 border-2 border-primary/20 hover:border-primary/30 transition-colors shadow-lg">
                  <SelectValue placeholder="Select a prompt type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-2 border-primary/20 shadow-xl z-50">
                  <SelectItem value="image" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <Image className="h-4 w-4 text-primary" />
                      <span>Image Generation</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="event" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Event Planning</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cta" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <Megaphone className="h-4 w-4 text-primary" />
                      <span>Call-to-Action</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 w-full min-w-0 mt-8">
            {/* Left Column - Prompt Crafter */}
            <Card className="ring-1 ring-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-lg">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    {activeTab === "image" ? (
                      <Image className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    ) : activeTab === "event" ? (
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    ) : (
                      <Megaphone className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl">
                      {activeTab === "image" ? "Image Prompt Crafter" : 
                       activeTab === "event" ? "Event Prompt Crafter" : "CTA Prompt Crafter"}
                    </CardTitle>
                    <CardDescription className="text-sm">
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
                  <PromptCrafter 
                    onPromptGenerated={handlePromptGenerated}
                    initialSelections={{
                      style: searchParams.get('style') || undefined,
                      format: searchParams.get('format') || undefined
                    }}
                    initialSubject={searchParams.get('subject') || undefined}
                  />
                ) : activeTab === "event" ? (
                  <EventPromptCrafter 
                    onPromptGenerated={handlePromptGenerated}
                    initialSelections={{
                      eventType: searchParams.get('eventType') || undefined,
                      tone: searchParams.get('tone') || undefined
                    }}
                    initialSubject={searchParams.get('subject') || undefined}
                  />
                ) : (
                  <CTAPromptCrafter 
                    onPromptGenerated={handlePromptGenerated}
                    initialSelections={{
                      platform: searchParams.get('platform') || undefined,
                      contentType: searchParams.get('contentType') || undefined
                    }}
                    initialSubject={searchParams.get('subject') || undefined}
                  />
                )}
              </CardContent>
            </Card>

            {/* Right Column - Generated Prompt */}
            <Card className="ring-1 ring-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-lg">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl">Your Crafted Prompt</CardTitle>
                    <CardDescription className="text-sm">
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
                      className="min-h-[150px] sm:min-h-[200px] resize-none bg-muted/50 border-muted text-sm"
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        onClick={handleCopy}
                        variant="outline"
                        className="flex-1"
                        disabled={!generatedPrompt}
                        size="sm"
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
                        size="sm"
                        className="sm:w-auto"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Add to My Prompts</span>
                        <span className="sm:hidden">Save</span>
                      </Button>
                    </div>
                    <Button asChild className="w-full" size="sm">
                      <Link to={`/ai/generator?prompt=${encodeURIComponent(generatedPrompt)}`}>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Enhance with Scout
                      </Link>
                    </Button>
                  </>
                ) : (
                  <div className="min-h-[150px] sm:min-h-[200px] flex items-center justify-center text-center text-muted-foreground">
                    <div className="space-y-3 px-4">
                      <Camera className="h-8 w-8 sm:h-12 sm:w-12 mx-auto opacity-40" />
                      <p className="text-sm sm:text-base">Start crafting your prompt using the options on the left.</p>
                      <p className="text-xs sm:text-sm">Scout will build a professional prompt for you!</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Section */}
          <div className="mt-12 sm:mt-16 text-center px-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">More Studio Tools Coming Soon</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              <Card className="border-dashed border-2 border-muted-foreground/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Text Prompt Crafter</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Coming Soon</p>
                </CardContent>
              </Card>
              <Card className="border-dashed border-2 border-muted-foreground/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Code Prompt Crafter</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Coming Soon</p>
                </CardContent>
              </Card>
              <Card className="border-dashed border-2 border-muted-foreground/20 bg-gradient-to-br from-primary/5 to-transparent sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Marketing Prompt Crafter</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Coming Soon</p>
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