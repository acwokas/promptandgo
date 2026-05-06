import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, X } from "lucide-react";
import { jobApplicationPromptOptions } from "@/data/promptStudioOptions";

interface JobApplicationPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: {
    applicationType?: string;
  };
  initialSubject?: string;
}

export const JobApplicationPromptCrafter = ({ onPromptGenerated, initialSelections, initialSubject }: JobApplicationPromptCrafterProps) => {
  const [positionTitle, setPositionTitle] = useState(initialSubject || "");
  const [companyIndustry, setCompanyIndustry] = useState("");
  const [experienceHighlights, setExperienceHighlights] = useState("");
  const [applicationType, setApplicationType] = useState(initialSelections?.applicationType || "");
  const [toneOfVoice, setToneOfVoice] = useState("");
  const [skillsStrengths, setSkillsStrengths] = useState("");
  const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);

  // Auto-generate prompt when initial selections are provided
  useEffect(() => {
    if (initialSelections?.applicationType || initialSubject) {
      setTimeout(() => {
        const prompt = buildPrompt();
        if (prompt) onPromptGenerated(prompt);
      }, 100);
    }
  }, []);

  const buildPrompt = () => {
    if (!positionTitle.trim()) return "";

    const promptParts: string[] = [];
    
    promptParts.push("Create a professional job application document with the following specifications:");
    promptParts.push(`\nPosition Title: ${positionTitle.trim()}`);
    
    if (companyIndustry) {
      promptParts.push(`Company/Industry: ${companyIndustry.trim()}`);
    }
    
    if (experienceHighlights) {
      promptParts.push(`Experience Highlights: ${experienceHighlights.trim()}`);
    }
    
    if (applicationType) {
      const typeLabel = jobApplicationPromptOptions.applicationTypes.find(t => t.value === applicationType)?.label;
      if (typeLabel) promptParts.push(`Application Type: ${typeLabel}`);
    }
    
    if (toneOfVoice) {
      const toneLabel = jobApplicationPromptOptions.toneOfVoice.find(t => t.value === toneOfVoice)?.label;
      if (toneLabel) promptParts.push(`Tone: ${toneLabel}`);
    }
    
    if (skillsStrengths) {
      promptParts.push(`Skills/Strengths to Emphasise: ${skillsStrengths.trim()}`);
    }
    
    if (additionalFeatures.length > 0) {
      promptParts.push(`Additional Features: ${additionalFeatures.join(", ")}`);
    }
    
    promptParts.push("\nPlease include:");
    promptParts.push("- Professional formatting and structure");
    promptParts.push("- Tailored content for the specific role");
    promptParts.push("- Achievement-focused language");
    promptParts.push("- Industry-relevant keywords");
    promptParts.push("- Clear value proposition");
    promptParts.push("- Professional closing and next steps");
    
    return promptParts.join("\n");
  };

  useEffect(() => {
    const prompt = buildPrompt();
    onPromptGenerated(prompt);
  }, [positionTitle, companyIndustry, experienceHighlights, applicationType, toneOfVoice, skillsStrengths, additionalFeatures, onPromptGenerated]);

  const availableAdditionalFeatures = [
    "ATS-friendly keywords",
    "Metrics and quantified impact", 
    "Personal motivation story",
    "Role-specific examples"
  ];

  const addAdditionalFeature = (feature: string) => {
    if (!additionalFeatures.includes(feature)) {
      setAdditionalFeatures([...additionalFeatures, feature]);
    }
  };

  const removeAdditionalFeature = (feature: string) => {
    setAdditionalFeatures(additionalFeatures.filter(f => f !== feature));
  };

  const clearAll = () => {
    setPositionTitle("");
    setCompanyIndustry("");
    setExperienceHighlights("");
    setApplicationType("");
    setToneOfVoice("");
    setSkillsStrengths("");
    setAdditionalFeatures([]);
  };

  return (
    <div className="space-y-6 w-full mobile-safe">
      {/* Position Title */}
      <div className="space-y-2">
        <Label htmlFor="position-title" className="text-sm font-medium">
          Position Title *
        </Label>
        <div className="w-full">
          <Input
            id="position-title"
            placeholder="Enter the role you're applying for (e.g., 'Marketing Manager')"
            value={positionTitle}
            onChange={(e) => setPositionTitle(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Company / Industry */}
      <div className="space-y-2">
        <Label htmlFor="company-industry" className="text-sm font-medium">
          Company / Industry *
        </Label>
        <div className="w-full">
          <Input
            id="company-industry"
            placeholder="Enter the company name and/or industry (e.g., 'Unilever, FMCG')"
            value={companyIndustry}
            onChange={(e) => setCompanyIndustry(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Experience Highlights */}
      <div className="space-y-2">
        <Label htmlFor="experience-highlights" className="text-sm font-medium">
          Experience Highlights *
        </Label>
        <div className="w-full">
          <Textarea
            id="experience-highlights"
            placeholder="List your key achievements or career highlights"
            value={experienceHighlights}
            onChange={(e) => setExperienceHighlights(e.target.value)}
            className="w-full min-h-[100px]"
          />
        </div>
      </div>

      {/* Application Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Application Type</Label>
        <Select value={applicationType} onValueChange={setApplicationType}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose application type" />
          </SelectTrigger>
          <SelectContent>
            {jobApplicationPromptOptions.applicationTypes.map((option) => (
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
            {jobApplicationPromptOptions.toneOfVoice.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Skills / Strengths to Emphasise */}
      <div className="space-y-2">
        <Label htmlFor="skills-strengths" className="text-sm font-medium">
          Skills / Strengths to Emphasise
        </Label>
        <div className="w-full">
          <Textarea
            id="skills-strengths"
            placeholder="Enter skills (e.g., 'leadership, data analytics, campaign management')"
            value={skillsStrengths}
            onChange={(e) => setSkillsStrengths(e.target.value)}
            className="w-full min-h-[80px]"
          />
        </div>
      </div>

      {/* Additional Features */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Additional Features</Label>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          {availableAdditionalFeatures
            .filter(feature => !additionalFeatures.includes(feature))
            .map((feature) => (
              <Button
                key={feature}
                variant="outline"
                size="sm"
                onClick={() => addAdditionalFeature(feature)}
                className="justify-start text-xs"
              >
                + {feature}
              </Button>
            ))}
        </div>
        
        {/* Selected Additional Features */}
        {additionalFeatures.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {additionalFeatures.map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs">
                  {feature}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAdditionalFeature(feature)}
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

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button
          variant="outline"
          onClick={clearAll}
          className="flex-1"
          disabled={!positionTitle && !companyIndustry && !experienceHighlights && !applicationType && !toneOfVoice && !skillsStrengths && additionalFeatures.length === 0}
        >
          Clear All
        </Button>
        <Card className="flex-1">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Wand2 className="h-4 w-4" />
                Scout is crafting your prompt...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};