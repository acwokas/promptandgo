import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Wand2, Image, Copy, CheckCheck, ArrowRight, Palette, Camera, Sparkles, ChevronDown, Zap, FileText, Briefcase, Megaphone, Calendar, Target, GraduationCap, CheckSquare, Search, Mail, BookOpen, Video, Monitor, Layers } from "lucide-react";
import CountdownTimer from "@/components/conversion/CountdownTimer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PromptCrafter } from "@/components/prompt-studio/PromptCrafter";
import { EventPromptCrafter } from "@/components/prompt-studio/EventPromptCrafter";
import CTAPromptCrafter from "@/components/prompt-studio/CTAPromptCrafter";
import { BlogPromptCrafter } from "@/components/prompt-studio/BlogPromptCrafter";
import { AdCopyPromptCrafter } from "@/components/prompt-studio/AdCopyPromptCrafter";
import { ResearchPromptCrafter } from "@/components/prompt-studio/ResearchPromptCrafter";
import { SalesEmailPromptCrafter } from "@/components/prompt-studio/SalesEmailPromptCrafter";
import { VideoScriptPromptCrafter } from "@/components/prompt-studio/VideoScriptPromptCrafter";
import { JobApplicationPromptCrafter } from "@/components/prompt-studio/JobApplicationPromptCrafter";
import { LearningStudyPromptCrafter } from "@/components/prompt-studio/LearningStudyPromptCrafter";
import { BusinessStrategyPromptCrafter } from "@/components/prompt-studio/BusinessStrategyPromptCrafter";
import { StorytellingPromptCrafter } from "@/components/prompt-studio/StorytellingPromptCrafter";
import { ProductivityWorkflowPromptCrafter } from "@/components/prompt-studio/ProductivityWorkflowPromptCrafter";
import PresentationPromptCrafter from "@/components/prompt-studio/PresentationPromptCrafter";
import VisualPresentationPromptCrafter from "@/components/prompt-studio/VisualPresentationPromptCrafter";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useLoginWidget } from "@/hooks/useLoginWidget";
import { Heart, ArrowDown } from "lucide-react";
import { AiProviderDropdown } from "@/components/ai/AiProviderDropdown";
import { AiResponseModal } from "@/components/ai/AiResponseModal";

const PromptStudioPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"adcopy" | "blog" | "business" | "cta" | "event" | "image" | "job" | "learning" | "presentation" | "productivity" | "research" | "salesemail" | "storytelling" | "video" | "visual">("adcopy");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [aiProvider, setAiProvider] = useState("");
  const [showAiResponse, setShowAiResponse] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  const { openLoginWidget } = useLoginWidget();
  const promptOutputRef = useRef<HTMLDivElement>(null);

  // Initialize from URL parameters
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as "adcopy" | "blog" | "business" | "cta" | "event" | "image" | "job" | "learning" | "productivity" | "research" | "salesemail" | "storytelling" | "video";
    if (tabFromUrl && ['adcopy', 'blog', 'business', 'cta', 'event', 'image', 'job', 'learning', 'productivity', 'research', 'salesemail', 'storytelling', 'video'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
    
    // If there's prompt information in the URL, pre-populate the generated prompt
    const promptFromUrl = searchParams.get('prompt');
    const titleFromUrl = searchParams.get('title');
    const tagsFromUrl = searchParams.get('tags');
    
    if (promptFromUrl) {
      let adaptedPrompt = promptFromUrl;
      
      // Add context about creating similar content
      if (titleFromUrl) {
        adaptedPrompt = `Create content similar to "${titleFromUrl}". ${adaptedPrompt}`;
      }
      
      if (tagsFromUrl) {
        const tags = tagsFromUrl.split(',').filter(tag => tag.trim());
        if (tags.length > 0) {
          adaptedPrompt += ` Include elements related to: ${tags.join(', ')}.`;
        }
      }
      
      adaptedPrompt += " Adapt this to create similar but unique content.";
      setGeneratedPrompt(adaptedPrompt);
      
      // Scroll to the prompt output after a short delay to ensure DOM is ready
      setTimeout(() => {
        const promptElement = document.querySelector('[data-prompt-output]');
        if (promptElement) {
          promptElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, [searchParams]);

  // Extract initial values from URL parameters for Mini Prompt Studio carry-over
  const getInitialValues = () => {
    const subject = searchParams.get('subject') || '';
    const selections: Record<string, string> = {};
    
    // Get all URL parameters except system ones
    for (const [key, value] of searchParams.entries()) {
      if (!['tab', 'subject', 'prompt', 'title', 'tags'].includes(key) && value) {
        selections[key] = value;
      }
    }
    
    return { subject, selections };
  };
  
  const initialValues = getInitialValues();

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

  const handleAiResponse = (response: string, provider: string) => {
    setAiResponse(response);
    setAiProvider(provider);
    setShowAiResponse(true);
  };

  const scrollToPrompt = () => {
    promptOutputRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  return (
    <>
      <CountdownTimer variant="banner" />
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
            <div className="w-full max-w-3xl mx-auto mb-8">
              <div className="relative">
                {/* Background Card */}
                <div className="bg-gradient-to-br from-card/80 to-card/40 border border-border/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
                  {/* Visual Elements */}
                  <div className="absolute top-4 right-4 opacity-20">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute bottom-4 left-4 opacity-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary"></div>
                  </div>
                  
                  <div className="text-center relative z-10">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary/10 border border-primary/20 mb-4">
                        <Wand2 className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Choose Your Topic
                    </h2>
                    <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                      Select a prompt type and let our AI studio guide you through crafting the perfect prompt
                    </p>
                    
                    <Select value={activeTab} onValueChange={(value) => setActiveTab(value as "adcopy" | "blog" | "business" | "cta" | "event" | "image" | "job" | "learning" | "presentation" | "productivity" | "research" | "salesemail" | "storytelling" | "video" | "visual")}>
                      <SelectTrigger className="w-full max-w-md mx-auto h-14 bg-background/80 border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-gradient-primary"></div>
                          <SelectValue placeholder="Select a prompt type to get started" />
                        </div>
                      </SelectTrigger>
                <SelectContent className="bg-popover border-2 border-primary/20 shadow-xl z-50">
                  <SelectItem value="adcopy" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>Ad Copy</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="blog" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Blog Article</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="business" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span>Business Strategy</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cta" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <Megaphone className="h-4 w-4 text-primary" />
                      <span>Call-to-Action</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="event" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Event Planning</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="image" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <Image className="h-4 w-4 text-primary" />
                      <span>Image Generation</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="job" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <Target className="h-4 w-4 text-primary" />
                      <span>Job Application</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="learning" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span>Learning & Study</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="presentation" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <Monitor className="h-4 w-4 text-primary" />
                      <span>Presentation</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="productivity" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="h-4 w-4 text-primary" />
                      <span>Productivity & Workflow</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="research" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4 text-primary" />
                      <span>Research & Analysis</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="salesemail" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>Sales Email</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="storytelling" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>Storytelling</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="video" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <Video className="h-4 w-4 text-primary" />
                      <span>Video Script</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="visual" className="cursor-pointer hover:bg-muted/80">
                    <div className="flex items-center gap-3">
                      <Layers className="h-4 w-4 text-primary" />
                      <span>Visual Presentation Design</span>
                    </div>
                  </SelectItem>
                </SelectContent>
                </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 w-full min-w-0 mt-8">
            {/* Left Column - Prompt Crafter */}
            <Card className="ring-1 ring-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-lg">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    {activeTab === "adcopy" ? (
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    ) : activeTab === "blog" ? (
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    ) : activeTab === "business" ? (
                      <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    ) : activeTab === "cta" ? (
                      <Megaphone className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    ) : activeTab === "event" ? (
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    ) : activeTab === "image" ? (
                      <Image className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    ) : activeTab === "job" ? (
                      <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    ) : activeTab === "learning" ? (
                      <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                     ) : activeTab === "presentation" ? (
                       <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                     ) : activeTab === "productivity" ? (
                       <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                     ) : activeTab === "research" ? (
                      <Search className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    ) : activeTab === "salesemail" ? (
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                     ) : activeTab === "storytelling" ? (
                       <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                     ) : activeTab === "video" ? (
                       <Video className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                     ) : (
                       <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl">
                      {activeTab === "adcopy" ? "Ad Copy Prompt Crafter" :
                       activeTab === "blog" ? "Blog Article Prompt Crafter" :
                       activeTab === "business" ? "Business Strategy Prompt Crafter" :
                       activeTab === "cta" ? "CTA Prompt Crafter" :
                       activeTab === "event" ? "Event Prompt Crafter" :
                       activeTab === "image" ? "Image Prompt Crafter" :
                       activeTab === "job" ? "Job Application Prompt Crafter" :
                       activeTab === "learning" ? "Learning & Study Prompt Crafter" :
                       activeTab === "presentation" ? "Presentation Prompt Crafter" :
                       activeTab === "productivity" ? "Productivity & Workflow Prompt Crafter" :
                       activeTab === "research" ? "Research Prompt Crafter" :
                       activeTab === "salesemail" ? "Sales Email Prompt Crafter" :
                       activeTab === "storytelling" ? "Storytelling Prompt Crafter" :
                       activeTab === "video" ? "Video Script Prompt Crafter" :
                       "Visual Presentation Design Prompt Crafter"}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {activeTab === "adcopy" ? "Craft high-converting ad copy across platforms" :
                       activeTab === "blog" ? "Generate structured, detailed blog article prompts" :
                       activeTab === "business" ? "Build prompts for strategy documents, competitor analysis, or pitch decks" :
                       activeTab === "cta" ? "Create compelling social media call-to-action prompts" :
                       activeTab === "event" ? "Craft detailed event prompts with comprehensive options" :
                       activeTab === "image" ? "Build the perfect image prompt with guided selections" :
                       activeTab === "job" ? "Build professional prompts for CV tailoring, cover letters, or interview preparation" :
                       activeTab === "learning" ? "Create prompts for study guides, flashcards, or simplifying complex concepts" :
                       activeTab === "presentation" ? "Design engaging, structured presentations with slide-by-slide guidance" :
                       activeTab === "productivity" ? "Generate prompts for task planning, prioritisation, and workflow optimisation" :
                       activeTab === "research" ? "Generate detailed prompts for structured research" :
                       activeTab === "salesemail" ? "Build tailored sales outreach and follow-up emails" :
                       activeTab === "storytelling" ? "Craft creative writing prompts for fiction, non-fiction, or presentation narratives" :
                       activeTab === "video" ? "Generate structured video prompts for ads and content" :
                       "Design visually stunning slide deck concepts with layout and visual direction"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {activeTab === "adcopy" ? (
                  <AdCopyPromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                ) : activeTab === "blog" ? (
                  <BlogPromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                ) : activeTab === "business" ? (
                  <BusinessStrategyPromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                ) : activeTab === "cta" ? (
                  <CTAPromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                ) : activeTab === "event" ? (
                  <EventPromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                ) : activeTab === "image" ? (
                  <PromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                ) : activeTab === "job" ? (
                  <JobApplicationPromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                ) : activeTab === "learning" ? (
                  <LearningStudyPromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                ) : activeTab === "presentation" ? (
                  <PresentationPromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                ) : activeTab === "productivity" ? (
                  <ProductivityWorkflowPromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                ) : activeTab === "research" ? (
                  <ResearchPromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                ) : activeTab === "salesemail" ? (
                  <SalesEmailPromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                ) : activeTab === "storytelling" ? (
                  <StorytellingPromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                ) : activeTab === "video" ? (
                  <VideoScriptPromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                ) : (
                  <VisualPresentationPromptCrafter onPromptGenerated={handlePromptGenerated} initialSubject={initialValues.subject} initialSelections={initialValues.selections} />
                )}
              </CardContent>
            </Card>

            {/* Right Column - Generated Prompt */}
            <Card data-prompt-output className="ring-1 ring-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-lg">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl">Your Crafted Prompt</CardTitle>
                    <CardDescription className="text-sm">
                      Ready to use with any AI generator
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div style={{fontSize: '10px', opacity: 0.7}}>Debug: generatedPrompt length: {generatedPrompt?.length || 0}</div>
                </div>
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
                    <div className="space-y-2">
                      <AiProviderDropdown 
                        prompt={generatedPrompt}
                        onResponse={handleAiResponse}
                        className="w-full"
                      />
                      <Button asChild className="w-full" size="sm" variant="outline">
                        <Link to={`/ai/generator?prompt=${encodeURIComponent(generatedPrompt)}`}>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Enhance with Scout
                        </Link>
                      </Button>
                    </div>
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
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Presentation Prompt Crafter</h3>
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
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Negotiation Prompt Crafter</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Coming Soon</p>
                </CardContent>
              </Card>
            </div>
         </div>
        </div>
      </main>

      <AiResponseModal
        isOpen={showAiResponse}
        onClose={() => setShowAiResponse(false)}
        response={aiResponse}
        provider={aiProvider}
        originalPrompt={generatedPrompt}
        onRetry={() => {
          setShowAiResponse(false);
          // The user can click the dropdown again to retry
        }}
      />
    </>
  );
};

export default PromptStudioPage;