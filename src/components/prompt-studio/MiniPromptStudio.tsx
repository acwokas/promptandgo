import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Palette, Calendar, Megaphone, Sparkles, Wand2, FileText, Briefcase, GraduationCap, TrendingUp, BookOpen, Zap, Target, Mail, Video, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  imagePromptOptions, 
  eventPromptOptions, 
  ctaPromptOptions,
  blogPromptOptions,
  jobApplicationPromptOptions,
  learningStudyPromptOptions,
  businessStrategyPromptOptions,
  storytellingPromptOptions,
  productivityWorkflowPromptOptions,
  adCopyPromptOptions,
  salesEmailPromptOptions,
  videoScriptPromptOptions,
  researchPromptOptions
} from "@/data/promptStudioOptions";

type CrafterType = "image" | "event" | "cta" | "blog" | "job-application" | "learning" | "business-strategy" | "storytelling" | "productivity" | "ad-copy" | "sales-email" | "video-script" | "research";

const crafterConfigs = {
  image: {
    icon: Palette,
    title: "Image Prompts",
    description: "Create perfect image generation prompts",
    primaryOptions: [
      { key: "style", label: "Style", options: imagePromptOptions.styles.slice(0, 8) },
      { key: "format", label: "Format", options: imagePromptOptions.formats.slice(0, 8) }
    ]
  },
  event: {
    icon: Calendar, 
    title: "Event Prompts",
    description: "Craft comprehensive event planning prompts",
    primaryOptions: [
      { key: "eventType", label: "Event Type", options: eventPromptOptions.eventTypes.slice(0, 8) },
      { key: "tone", label: "Tone", options: eventPromptOptions.tones }
    ]
  },
  cta: {
    icon: Megaphone,
    title: "CTA Prompts", 
    description: "Build compelling call-to-action prompts",
    primaryOptions: [
      { key: "platform", label: "Platform", options: ctaPromptOptions.platforms.slice(0, 8) },
      { key: "contentType", label: "Content Type", options: ctaPromptOptions.contentTypes.slice(0, 8) }
    ]
  },
  blog: {
    icon: FileText,
    title: "Blog Prompts",
    description: "Generate engaging blog article prompts",
    primaryOptions: [
      { key: "targetAudience", label: "Target Audience", options: blogPromptOptions.targetAudiences },
      { key: "articleType", label: "Article Type", options: blogPromptOptions.articleTypes }
    ]
  },
  "job-application": {
    icon: Briefcase,
    title: "Job Application Prompts",
    description: "Create professional job application materials",
    primaryOptions: [
      { key: "applicationType", label: "Application Type", options: jobApplicationPromptOptions.applicationTypes },
      { key: "tone", label: "Tone", options: jobApplicationPromptOptions.toneOfVoice }
    ]
  },
  learning: {
    icon: GraduationCap,
    title: "Learning Prompts",
    description: "Design effective learning and study materials",
    primaryOptions: [
      { key: "targetLevel", label: "Target Level", options: learningStudyPromptOptions.targetLevels },
      { key: "learningFormat", label: "Learning Format", options: learningStudyPromptOptions.learningFormats }
    ]
  },
  "business-strategy": {
    icon: TrendingUp,
    title: "Business Strategy Prompts",
    description: "Develop comprehensive business strategies",
    primaryOptions: [
      { key: "businessType", label: "Business Type", options: businessStrategyPromptOptions.businessTypes },
      { key: "focusArea", label: "Focus Area", options: businessStrategyPromptOptions.focusAreas }
    ]
  },
  storytelling: {
    icon: BookOpen,
    title: "Storytelling Prompts",
    description: "Craft compelling narrative and story prompts",
    primaryOptions: [
      { key: "storyGenre", label: "Story Genre", options: storytellingPromptOptions.storyGenres },
      { key: "setting", label: "Setting", options: storytellingPromptOptions.settings }
    ]
  },
  productivity: {
    icon: Zap,
    title: "Productivity Prompts",
    description: "Optimize workflow and productivity systems",
    primaryOptions: [
      { key: "taskType", label: "Task Type", options: productivityWorkflowPromptOptions.taskTypes },
      { key: "framework", label: "Framework", options: productivityWorkflowPromptOptions.productivityFrameworks }
    ]
  },
  "ad-copy": {
    icon: Target,
    title: "Ad Copy Prompts",
    description: "Create high-converting advertising copy",
    primaryOptions: [
      { key: "platform", label: "Platform", options: adCopyPromptOptions.platforms },
      { key: "adFormat", label: "Ad Format", options: adCopyPromptOptions.adFormats }
    ]
  },
  "sales-email": {
    icon: Mail,
    title: "Sales Email Prompts",
    description: "Write effective sales and outreach emails",
    primaryOptions: [
      { key: "emailPurpose", label: "Email Purpose", options: salesEmailPromptOptions.emailPurposes },
      { key: "recipientRole", label: "Recipient Role", options: salesEmailPromptOptions.recipientRoles }
    ]
  },
  "video-script": {
    icon: Video,
    title: "Video Script Prompts",
    description: "Develop engaging video script content",
    primaryOptions: [
      { key: "videoPurpose", label: "Video Purpose", options: videoScriptPromptOptions.videoPurposes },
      { key: "videoLength", label: "Video Length", options: videoScriptPromptOptions.videoLengths }
    ]
  },
  research: {
    icon: Search,
    title: "Research Prompts",
    description: "Conduct thorough research and analysis",
    primaryOptions: [
      { key: "researchGoal", label: "Research Goal", options: researchPromptOptions.researchGoals },
      { key: "dataScope", label: "Data Scope", options: researchPromptOptions.dataScopes }
    ]
  }
};

const MiniPromptStudio = () => {
  const [activeCrafter, setActiveCrafter] = useState<CrafterType>("image");
  const [subject, setSubject] = useState("");
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const navigate = useNavigate();

  // Rotate the active crafter on page load
  useEffect(() => {
    const crafters: CrafterType[] = ["image", "event", "cta", "blog", "job-application", "learning", "business-strategy", "storytelling", "productivity", "ad-copy", "sales-email", "video-script", "research"];
    const randomCrafter = crafters[Math.floor(Math.random() * crafters.length)];
    setActiveCrafter(randomCrafter);
  }, []);

  // Build prompt in real-time
  useEffect(() => {
    buildPrompt();
  }, [subject, selections, activeCrafter]);

  const buildPrompt = () => {
    if (!subject.trim() && Object.values(selections).every(v => !v)) {
      setGeneratedPrompt("");
      return;
    }

    let prompt = "";
    const config = crafterConfigs[activeCrafter];

    if (activeCrafter === "image") {
      const parts = [];
      if (subject.trim()) parts.push(subject.trim());
      
      if (selections.style) {
        const styleOption = config.primaryOptions[0].options.find(o => o.value === selections.style);
        if (styleOption) parts.push(`in ${styleOption.label} style`);
      }
      
      if (selections.format) {
        const formatOption = config.primaryOptions[1].options.find(o => o.value === selections.format);
        if (formatOption) parts.push(`designed for ${formatOption.label.toLowerCase()}`);
      }
      
      prompt = parts.join(", ");
      if (prompt) prompt += ", high quality, professional";
      
    } else if (activeCrafter === "event") {
      const parts = [];
      if (subject.trim()) parts.push(`Event: ${subject.trim()}`);
      
      if (selections.eventType) {
        const typeOption = config.primaryOptions[0].options.find(o => o.value === selections.eventType);
        if (typeOption) parts.push(`Type: ${typeOption.label}`);
      }
      
      if (selections.tone) {
        const toneOption = config.primaryOptions[1].options.find(o => o.value === selections.tone);
        if (toneOption) parts.push(`Tone: ${toneOption.label}`);
      }
      
      prompt = parts.join("\n");
      if (prompt) prompt = `Plan a comprehensive event with these details:\n\n${prompt}`;
      
    } else if (activeCrafter === "cta") {
      const parts = [];
      if (subject.trim()) parts.push(`Subject: ${subject.trim()}`);
      
      if (selections.platform) {
        const platformOption = config.primaryOptions[0].options.find(o => o.value === selections.platform);
        if (platformOption) parts.push(`Platform: ${platformOption.label}`);
      }
      
      if (selections.contentType) {
        const contentOption = config.primaryOptions[1].options.find(o => o.value === selections.contentType);
        if (contentOption) parts.push(`Content Type: ${contentOption.label}`);
      }
      
      prompt = parts.join("\n");
      if (prompt) prompt = `Create a compelling social media post:\n\n${prompt}`;

    } else {
      // Generic handler for all other prompt types
      const parts = [];
      if (subject.trim()) parts.push(`Topic: ${subject.trim()}`);
      
      // Handle first primary option
      const firstOptionKey = config.primaryOptions[0]?.key;
      if (firstOptionKey && selections[firstOptionKey]) {
        const option = config.primaryOptions[0].options.find(o => o.value === selections[firstOptionKey]);
        if (option) parts.push(`${config.primaryOptions[0].label}: ${option.label}`);
      }
      
      // Handle second primary option
      const secondOptionKey = config.primaryOptions[1]?.key;
      if (secondOptionKey && selections[secondOptionKey]) {
        const option = config.primaryOptions[1].options.find(o => o.value === selections[secondOptionKey]);
        if (option) parts.push(`${config.primaryOptions[1].label}: ${option.label}`);
      }
      
      prompt = parts.join("\n");
      if (prompt) {
        const actionMap = {
          blog: "Write a comprehensive blog article",
          "job-application": "Create professional job application materials",
          learning: "Design effective learning materials",
          "business-strategy": "Develop a business strategy",
          storytelling: "Create a compelling story",
          productivity: "Design a productivity system",
          "ad-copy": "Write high-converting ad copy",
          "sales-email": "Craft an effective sales email",
          "video-script": "Write an engaging video script",
          research: "Conduct thorough research"
        };
        
        const action = actionMap[activeCrafter] || "Generate content";
        prompt = `${action} with these specifications:\n\n${prompt}`;
      }
    }

    setGeneratedPrompt(prompt);
  };

  const config = crafterConfigs[activeCrafter];
  const IconComponent = config.icon;

  const handleSelectionChange = (key: string, value: string) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

  const handleTryStudio = () => {
    // Navigate to full studio with selections as URL params
    const params = new URLSearchParams();
    params.set('tab', activeCrafter);
    if (subject.trim()) params.set('subject', subject.trim());
    Object.entries(selections).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/ai/studio?${params.toString()}`);
  };

  const hasContent = subject.trim() || Object.values(selections).some(value => value);

  return (
    <Card className="w-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-primary/30 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
            <IconComponent className="h-4 w-4 text-secondary-foreground" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Try Scout's Prompt Studio
            </CardTitle>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {config.description} - watch your prompt build in real-time as you make selections!
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Crafter Type Selector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            Choose Prompt Type
          </Label>
          <Select
            value={activeCrafter}
            onValueChange={(value: CrafterType) => {
              setActiveCrafter(value);
              setSelections({});
              setSubject("");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(crafterConfigs) as CrafterType[])
                .sort((a, b) => crafterConfigs[a].title.localeCompare(crafterConfigs[b].title))
                .map((type) => {
                const typeConfig = crafterConfigs[type];
                const TypeIcon = typeConfig.icon;
                return (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4" />
                      <span>{typeConfig.title}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Left Column - Inputs */}
          <div className="space-y-3">
            {/* Subject Input */}
            <div>
              <Label htmlFor="subject" className="text-sm font-medium text-muted-foreground mb-2 block">
                {activeCrafter === "image" ? "What do you want to create?" : 
                 activeCrafter === "event" ? "Event Name" : "Post Subject"}
              </Label>
              <Input
                id="subject"
                placeholder={
                  activeCrafter === "image" ? "e.g., A modern workspace setup" :
                  activeCrafter === "event" ? "e.g., Annual Tech Conference 2025" :
                  "e.g., New product launch announcement"
                }
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Options */}
            {config.primaryOptions.map((optionGroup) => (
              <div key={optionGroup.key}>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  {optionGroup.label}
                </Label>
                <Select
                  value={selections[optionGroup.key] || ""}
                  onValueChange={(value) => handleSelectionChange(optionGroup.key, value)}
                >
                  <SelectTrigger className="text-sm w-full">
                    <SelectValue placeholder={`Choose ${optionGroup.label.toLowerCase()}...`} />
                  </SelectTrigger>
                  <SelectContent className="w-full max-w-none">
                    {optionGroup.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            {/* Progress indicator */}
            {hasContent && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Wand2 className="h-3 w-3 mr-1" />
                  Building prompt...
                </Badge>
              </div>
            )}
          </div>

          {/* Right Column - Live Preview */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground mb-2 block">
              Your Prompt (Live Preview)
            </Label>
            <div className="min-h-[100px] sm:min-h-[120px] p-3 bg-muted/30 border rounded-lg text-sm">
              {generatedPrompt ? (
                <div className="space-y-2">
                  <Textarea
                    value={generatedPrompt}
                    readOnly
                    className="min-h-[120px] sm:min-h-[150px] resize-none bg-transparent border-none p-0 text-sm"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center space-y-2">
                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 mx-auto opacity-40" />
                    <p className="text-xs">Your prompt will appear here as you type</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleTryStudio}
              className="w-full"
              size="sm"
              disabled={!hasContent}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              <span className="truncate">
                {generatedPrompt ? "Continue in Studio" : "Start Building"}
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniPromptStudio;