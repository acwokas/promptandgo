import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Camera, Plus } from "lucide-react";
import { pitchDeckPromptOptions } from "@/data/promptStudioOptions";

interface PitchDeckPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: any;
  initialSubject?: string;
}

export default function PitchDeckPromptCrafter({ onPromptGenerated, initialSelections, initialSubject }: PitchDeckPromptCrafterProps) {
  const [objective, setObjective] = useState("");
  const [audience, setAudience] = useState("");
  const [length, setLength] = useState("");
  const [tone, setTone] = useState("");
  const [fundingStage, setFundingStage] = useState("");
  const [industry, setIndustry] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [company, setCompany] = useState(initialSubject || "");
  const [askAmount, setAskAmount] = useState("");
  const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);

  // Apply initial selections if provided
  useEffect(() => {
    if (initialSelections) {
      setObjective(initialSelections.objective || "");
      setAudience(initialSelections.audience || "");
      setLength(initialSelections.length || "");
      setTone(initialSelections.tone || "");
      setFundingStage(initialSelections.fundingStage || "");
      setIndustry(initialSelections.industry || "");
      setBusinessModel(initialSelections.businessModel || "");
      setAskAmount(initialSelections.askAmount || "");
      setAdditionalFeatures(initialSelections.additionalFeatures || []);
    }
  }, [initialSelections]);

  useEffect(() => {
    if (objective || audience || length || tone || fundingStage || industry || businessModel || company || askAmount || additionalFeatures.length > 0) {
      buildPrompt();
    }
  }, [objective, audience, length, tone, fundingStage, industry, businessModel, company, askAmount, additionalFeatures]);

  const buildPrompt = () => {
    let prompt = "You are a world-class pitch deck strategist. I need you to design a powerful, investor-ready deck.\n\n";

    if (company) {
      prompt += `Company/Product: ${company}\n`;
    }

    if (objective) {
      const objLabel = pitchDeckPromptOptions.objectives.find(o => o.value === objective)?.label;
      prompt += `Objective: ${objLabel}\n`;
    }

    if (audience) {
      const audLabel = pitchDeckPromptOptions.audiences.find(a => a.value === audience)?.label;
      prompt += `Audience: ${audLabel}\n`;
    }

    if (length) {
      const lengthLabel = pitchDeckPromptOptions.lengths.find(l => l.value === length)?.label;
      prompt += `Length: ${lengthLabel}\n`;
    }

    if (tone) {
      const toneLabel = pitchDeckPromptOptions.tones.find(t => t.value === tone)?.label;
      prompt += `Tone & Style: ${toneLabel}\n`;
    }

    if (industry) {
      const industryLabel = pitchDeckPromptOptions.industries.find(i => i.value === industry)?.label;
      prompt += `Industry: ${industryLabel}\n`;
    }

    if (businessModel) {
      const modelLabel = pitchDeckPromptOptions.businessModels.find(b => b.value === businessModel)?.label;
      prompt += `Business Model: ${modelLabel}\n`;
    }

    if (askAmount) {
      prompt += `Funding Ask: ${askAmount}\n`;
    }

    prompt += `\nStructure:\n`;
    prompt += `1. Title Slide – strong headline and tagline\n`;
    prompt += `2. Problem – clear pain points backed by evidence\n`;
    prompt += `3. Solution – how we solve it, unique value proposition\n`;
    prompt += `4. Market – TAM, SAM, SOM, with context\n`;
    prompt += `5. Product – demo, screenshots, or concept visuals\n`;
    prompt += `6. Business Model – how we make money\n`;
    prompt += `7. Traction – growth metrics, case studies, milestones\n`;
    prompt += `8. Competition – landscape, our edge\n`;
    prompt += `9. Team – expertise and credibility\n`;
    prompt += `10. Financials – key projections, ask, and use of funds\n`;
    prompt += `11. Closing – recap and call-to-action\n\n`;

    prompt += `Content: Suggest concise text, data visuals, and story flow for each slide.\n`;
    
    if (additionalFeatures.includes("Speaker notes")) {
      prompt += `Speaker Notes: Add persuasive phrasing, storytelling hooks, and closing techniques for each slide.\n`;
    }
    
    prompt += `Constraints: Keep it lean and persuasive — no overcrowding slides.\n`;

    if (additionalFeatures.length > 0) {
      const otherFeatures = additionalFeatures.filter(f => f !== "Speaker notes");
      if (otherFeatures.length > 0) {
        prompt += `Additional Requirements: ${otherFeatures.join(', ')}\n`;
      }
    }

    prompt += `\nDeliver as a slide-by-slide outline with talking points and design suggestions.`;

    onPromptGenerated(prompt);
  };

  const availableAdditionalFeatures = [
    "Speaker notes",
    "Financial projections template",
    "Market sizing methodology",
    "Competitive analysis framework",
    "Traction metrics suggestions",
    "Risk mitigation strategies",
    "Exit strategy outline",
    "Due diligence preparation"
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
    setObjective("");
    setAudience("");
    setLength("");
    setTone("");
    setFundingStage("");
    setIndustry("");
    setBusinessModel("");
    setCompany("");
    setAskAmount("");
    setAdditionalFeatures([]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="company" className="text-sm font-medium">
            Company/Product Name
          </Label>
          <Input
            id="company"
            placeholder="e.g., 'TechStart Inc.' or 'Revolutionary AI Platform'"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Objective</Label>
          <Select value={objective} onValueChange={setObjective}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose pitch objective" />
            </SelectTrigger>
            <SelectContent>
              {pitchDeckPromptOptions.objectives.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Target Audience</Label>
          <Select value={audience} onValueChange={setAudience}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your audience" />
            </SelectTrigger>
            <SelectContent>
              {pitchDeckPromptOptions.audiences.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Deck Length</Label>
          <Select value={length} onValueChange={setLength}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose deck length" />
            </SelectTrigger>
            <SelectContent>
              {pitchDeckPromptOptions.lengths.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Tone & Style</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select presentation tone" />
            </SelectTrigger>
            <SelectContent>
              {pitchDeckPromptOptions.tones.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Industry (Optional)</Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {pitchDeckPromptOptions.industries.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Business Model (Optional)</Label>
          <Select value={businessModel} onValueChange={setBusinessModel}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose business model" />
            </SelectTrigger>
            <SelectContent>
              {pitchDeckPromptOptions.businessModels.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Funding Stage (Optional)</Label>
          <Select value={fundingStage} onValueChange={setFundingStage}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select funding stage" />
            </SelectTrigger>
            <SelectContent>
              {pitchDeckPromptOptions.fundingStages.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="askAmount" className="text-sm font-medium">
            Funding Ask Amount (Optional)
          </Label>
          <Input
            id="askAmount"
            placeholder="e.g., '$2M Series A' or '$500K Seed'"
            value={askAmount}
            onChange={(e) => setAskAmount(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Additional Features</Label>
          <div className="mt-2 space-y-2">
            <div className="flex flex-wrap gap-2">
              {additionalFeatures.map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs">
                  {feature}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => removeAdditionalFeature(feature)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableAdditionalFeatures
                .filter(feature => !additionalFeatures.includes(feature))
                .map((feature) => (
                  <Button
                    key={feature}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => addAdditionalFeature(feature)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {feature}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <Button variant="outline" size="sm" onClick={clearAll}>
          Clear All
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Camera className="h-4 w-4" />
          Scout is crafting your prompt...
        </div>
      </div>
    </div>
  );
}