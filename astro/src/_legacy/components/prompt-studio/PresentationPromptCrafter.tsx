import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Camera, Plus } from "lucide-react";
import { presentationPromptOptions } from "@/data/promptStudioOptions";

interface PresentationPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: any;
  initialSubject?: string;
}

export default function PresentationPromptCrafter({ onPromptGenerated, initialSelections, initialSubject }: PresentationPromptCrafterProps) {
  const [objective, setObjective] = useState("");
  const [audience, setAudience] = useState("");
  const [length, setLength] = useState("");
  const [tone, setTone] = useState("");
  const [structure, setStructure] = useState("");
  const [format, setFormat] = useState("");
  const [topic, setTopic] = useState(initialSubject || "");
  const [constraints, setConstraints] = useState("");
  const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);

  // Apply initial selections if provided
  useEffect(() => {
    if (initialSelections) {
      setObjective(initialSelections.objective || "");
      setAudience(initialSelections.audience || "");
      setLength(initialSelections.length || "");
      setTone(initialSelections.tone || "");
      setStructure(initialSelections.structure || "");
      setFormat(initialSelections.format || "");
      setConstraints(initialSelections.constraints || "");
      setAdditionalFeatures(initialSelections.additionalFeatures || []);
    }
  }, [initialSelections]);

  useEffect(() => {
    if (objective || audience || length || tone || structure || format || topic || constraints || additionalFeatures.length > 0) {
      buildPrompt();
    }
  }, [objective, audience, length, tone, structure, format, topic, constraints, additionalFeatures]);

  const buildPrompt = () => {
    let prompt = "You are an expert presentation strategist. I need you to design a presentation that is engaging, clear, and persuasive.\n\n";

    if (topic) {
      prompt += `Topic: ${topic}\n`;
    }

    if (objective) {
      const objLabel = presentationPromptOptions.objectives.find(o => o.value === objective)?.label;
      prompt += `Objective: ${objLabel}\n`;
    }

    if (audience) {
      const audLabel = presentationPromptOptions.audiences.find(a => a.value === audience)?.label;
      prompt += `Audience: ${audLabel}\n`;
    }

    if (length) {
      const lengthLabel = presentationPromptOptions.lengths.find(l => l.value === length)?.label;
      prompt += `Length: ${lengthLabel}\n`;
    }

    if (tone) {
      const toneLabel = presentationPromptOptions.tones.find(t => t.value === tone)?.label;
      prompt += `Tone: ${toneLabel}\n`;
    }

    if (structure) {
      const structLabel = presentationPromptOptions.structures.find(s => s.value === structure)?.label;
      prompt += `Structure: Use a ${structLabel} approach with a clear outline including intro, main points, supporting evidence, and closing.\n`;
    }

    prompt += `Content: Suggest key talking points, data visuals, and examples that support the message.\n`;

    if (format) {
      const formatLabel = presentationPromptOptions.formats.find(f => f.value === format)?.label;
      prompt += `Format: Deliver as a ${formatLabel}.\n`;
    }

    if (constraints) {
      prompt += `Constraints: ${constraints}\n`;
    }

    prompt += `Keep text concise for slides, but add speaker notes for elaboration where useful.\n`;

    if (additionalFeatures.length > 0) {
      prompt += `Additional Requirements: ${additionalFeatures.join(', ')}\n`;
    }

    prompt += `\nDeliver the output in a structured outline that I can quickly transfer into a slide deck.`;

    onPromptGenerated(prompt);
  };

  const availableAdditionalFeatures = [
    "Include creative visual suggestions",
    "Add interactive elements",
    "Suggest metaphors and analogies",
    "Include Q&A section prep",
    "Add transition suggestions",
    "Include timing guidelines",
    "Suggest backup slides",
    "Add call-to-action recommendations"
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
    setStructure("");
    setFormat("");
    setTopic("");
    setConstraints("");
    setAdditionalFeatures([]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="topic" className="text-sm font-medium">
            Presentation Topic
          </Label>
          <Input
            id="topic"
            placeholder="e.g., 'Q4 Financial Results' or 'New Product Launch'"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Objective</Label>
          <Select value={objective} onValueChange={setObjective}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose presentation objective" />
            </SelectTrigger>
            <SelectContent>
              {presentationPromptOptions.objectives.map((option) => (
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
              {presentationPromptOptions.audiences.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Presentation Length</Label>
          <Select value={length} onValueChange={setLength}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose presentation length" />
            </SelectTrigger>
            <SelectContent>
              {presentationPromptOptions.lengths.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select presentation tone" />
            </SelectTrigger>
            <SelectContent>
              {presentationPromptOptions.tones.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Structure Approach</Label>
          <Select value={structure} onValueChange={setStructure}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose structure style" />
            </SelectTrigger>
            <SelectContent>
              {presentationPromptOptions.structures.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Output Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose output format" />
            </SelectTrigger>
            <SelectContent>
              {presentationPromptOptions.formats.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="constraints" className="text-sm font-medium">
            Specific Constraints (Optional)
          </Label>
          <Input
            id="constraints"
            placeholder="e.g., 'Must include company branding guidelines' or 'Budget limitations'"
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
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