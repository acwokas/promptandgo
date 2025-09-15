import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, X, ArrowDown } from "lucide-react";
import { blogPromptOptions } from "@/data/promptStudioOptions";

interface BlogPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: {
    targetAudience?: string;
    contentGoal?: string;
  };
  initialSubject?: string;
}

export const BlogPromptCrafter = ({ onPromptGenerated, initialSelections, initialSubject }: BlogPromptCrafterProps) => {
  const [workingTitle, setWorkingTitle] = useState(initialSubject || "");
  const [targetAudience, setTargetAudience] = useState(initialSelections?.targetAudience || "");
  const [contentGoal, setContentGoal] = useState(initialSelections?.contentGoal || "");
  const [articleType, setArticleType] = useState("");
  const [toneOfVoice, setToneOfVoice] = useState("");
  const [keywords, setKeywords] = useState("");
  const [lengthFormat, setLengthFormat] = useState("");
  const [structureElements, setStructureElements] = useState<string[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // Auto-generate prompt when initial selections are provided
  useEffect(() => {
    if (initialSelections?.targetAudience || initialSelections?.contentGoal || initialSubject) {
      setTimeout(() => {
        const prompt = buildPrompt();
        if (prompt) onPromptGenerated(prompt);
      }, 100);
    }
  }, []);

  const buildPrompt = () => {
    if (!workingTitle.trim()) return "";

    const promptParts: string[] = [];
    
    promptParts.push("Create a comprehensive blog article with the following specifications:");
    promptParts.push(`\nTopic/Title: ${workingTitle.trim()}`);
    
    if (targetAudience) {
      const audienceLabel = blogPromptOptions.targetAudiences.find(a => a.value === targetAudience)?.label;
      if (audienceLabel) promptParts.push(`Target Audience: ${audienceLabel}`);
    }
    
    if (contentGoal) {
      const goalLabel = blogPromptOptions.contentGoals.find(g => g.value === contentGoal)?.label;
      if (goalLabel) promptParts.push(`Content Goal: ${goalLabel}`);
    }
    
    if (articleType) {
      const typeLabel = blogPromptOptions.articleTypes.find(t => t.value === articleType)?.label;
      if (typeLabel) promptParts.push(`Article Type: ${typeLabel}`);
    }
    
    if (toneOfVoice) {
      const toneLabel = blogPromptOptions.toneOfVoice.find(t => t.value === toneOfVoice)?.label;
      if (toneLabel) promptParts.push(`Tone: ${toneLabel}`);
    }
    
    if (lengthFormat) {
      const lengthLabel = blogPromptOptions.lengthFormats.find(l => l.value === lengthFormat)?.label;
      if (lengthLabel) promptParts.push(`Length: ${lengthLabel}`);
    }
    
    if (structureElements.length > 0) {
      promptParts.push(`Structure Elements: ${structureElements.join(", ")}`);
    }
    
    if (keywords) {
      promptParts.push(`SEO Keywords: ${keywords}`);
    }
    
    promptParts.push("\nPlease include:");
    promptParts.push("- Engaging introduction with hook");
    promptParts.push("- Clear structure with headings");
    promptParts.push("- Actionable insights and takeaways");
    promptParts.push("- SEO-optimized content");
    promptParts.push("- Compelling conclusion with call-to-action");
    
    return promptParts.join("\n");
  };

  useEffect(() => {
    const prompt = buildPrompt();
    setGeneratedPrompt(prompt);
    onPromptGenerated(prompt);
  }, [workingTitle, targetAudience, contentGoal, articleType, toneOfVoice, keywords, lengthFormat, structureElements, onPromptGenerated]);

  const availableStructureElements = [
    "Introduction hook",
    "Bullet-point takeaways", 
    "Data/statistics integration",
    "Expert quotes",
    "Step-by-step guide",
    "Summary/Conclusion"
  ];

  const addStructureElement = (element: string) => {
    if (!structureElements.includes(element)) {
      setStructureElements([...structureElements, element]);
    }
  };

  const removeStructureElement = (element: string) => {
    setStructureElements(structureElements.filter(e => e !== element));
  };

  const clearAll = () => {
    setWorkingTitle("");
    setTargetAudience("");
    setContentGoal("");
    setArticleType("");
    setToneOfVoice("");
    setKeywords("");
    setLengthFormat("");
    setStructureElements([]);
  };

  const scrollToPrompt = () => {
    const promptOutput = document.querySelector('[data-prompt-output]');
    if (promptOutput) {
      promptOutput.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <div className="space-y-6 w-full mobile-safe">
      {/* Topic/Working Title - Free text */}
      <div className="space-y-2">
        <Label htmlFor="working-title" className="text-sm font-medium">
          Topic/Working Title *
        </Label>
        <div className="w-full">
          <Input
            id="working-title"
            placeholder="Enter your main idea or topic (e.g., 'AI trends in Southeast Asia')"
            value={workingTitle}
            onChange={(e) => setWorkingTitle(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Target Audience</Label>
        <Select value={targetAudience} onValueChange={setTargetAudience}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose target readers" />
          </SelectTrigger>
          <SelectContent>
            {blogPromptOptions.targetAudiences.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content Goal */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Content Goal</Label>
        <Select value={contentGoal} onValueChange={setContentGoal}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose content goal" />
          </SelectTrigger>
          <SelectContent>
            {blogPromptOptions.contentGoals.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Article Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Article Type</Label>
        <Select value={articleType} onValueChange={setArticleType}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose article type" />
          </SelectTrigger>
          <SelectContent>
            {blogPromptOptions.articleTypes.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tone of Voice */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tone of Voice</Label>
        <Select value={toneOfVoice} onValueChange={setToneOfVoice}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose tone" />
          </SelectTrigger>
          <SelectContent>
            {blogPromptOptions.toneOfVoice.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Structure Elements */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Structure Elements</Label>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          {availableStructureElements
            .filter(element => !structureElements.includes(element))
            .map((element) => (
              <Button
                key={element}
                variant="outline"
                size="sm"
                onClick={() => addStructureElement(element)}
                className="justify-start text-xs"
              >
                + {element}
              </Button>
            ))}
        </div>
        
        {/* Selected Structure Elements */}
        {structureElements.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {structureElements.map((element) => (
                <Badge key={element} variant="secondary" className="text-xs">
                  {element}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStructureElement(element)}
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SEO/Keywords */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">SEO/Keywords</Label>
        <div className="w-full">
          <Textarea
            placeholder="Add focus keywords (e.g., AI trends, machine learning, automation)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full min-h-[80px]"
          />
        </div>
      </div>

      {/* Length/Format */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Length/Format</Label>
        <Select value={lengthFormat} onValueChange={setLengthFormat}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose length format" />
          </SelectTrigger>
          <SelectContent>
            {blogPromptOptions.lengthFormats.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button
          variant="outline"
          onClick={clearAll}
          className="flex-1"
          disabled={!workingTitle && !targetAudience && !contentGoal && !articleType && !toneOfVoice && !keywords && !lengthFormat && structureElements.length === 0}
        >
          Clear All
        </Button>
        <Button
          onClick={scrollToPrompt}
          className="flex-1"
          disabled={!generatedPrompt}
        >
          <ArrowDown className="h-4 w-4 mr-2" />
          View Your Custom Prompt
        </Button>
      </div>
    </div>
  );
};