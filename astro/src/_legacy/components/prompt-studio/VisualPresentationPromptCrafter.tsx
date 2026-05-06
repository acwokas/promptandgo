import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Camera, Plus } from "lucide-react";
import { visualPresentationPromptOptions } from "@/data/promptStudioOptions";

interface VisualPresentationPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: any;
  initialSubject?: string;
}

export default function VisualPresentationPromptCrafter({ onPromptGenerated, initialSelections, initialSubject }: VisualPresentationPromptCrafterProps) {
  const [objective, setObjective] = useState("");
  const [audience, setAudience] = useState("");
  const [style, setStyle] = useState("");
  const [format, setFormat] = useState("");
  const [visualType, setVisualType] = useState("");
  const [storytelling, setStorytelling] = useState("");
  const [colorPalette, setColorPalette] = useState("");
  const [typography, setTypography] = useState("");
  const [topic, setTopic] = useState(initialSubject || "");
  const [constraints, setConstraints] = useState("");
  const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);

  // Apply initial selections if provided
  useEffect(() => {
    if (initialSelections) {
      setObjective(initialSelections.objective || "");
      setAudience(initialSelections.audience || "");
      setStyle(initialSelections.style || "");
      setFormat(initialSelections.format || "");
      setVisualType(initialSelections.visualType || "");
      setStorytelling(initialSelections.storytelling || "");
      setColorPalette(initialSelections.colorPalette || "");
      setTypography(initialSelections.typography || "");
      setConstraints(initialSelections.constraints || "");
      setAdditionalFeatures(initialSelections.additionalFeatures || []);
    }
  }, [initialSelections]);

  useEffect(() => {
    if (objective || audience || style || format || visualType || storytelling || colorPalette || typography || topic || constraints || additionalFeatures.length > 0) {
      buildPrompt();
    }
  }, [objective, audience, style, format, visualType, storytelling, colorPalette, typography, topic, constraints, additionalFeatures]);

  const buildPrompt = () => {
    let prompt = "You are a world-class visual presentation designer. I need you to craft a visually stunning slide deck concept.\n\n";

    if (topic) {
      prompt += `Topic: ${topic}\n`;
    }

    if (objective) {
      const objLabel = visualPresentationPromptOptions.objectives.find(o => o.value === objective)?.label;
      prompt += `Objective: ${objLabel}\n`;
    }

    if (audience) {
      const audLabel = visualPresentationPromptOptions.audiences.find(a => a.value === audience)?.label;
      prompt += `Audience: ${audLabel}\n`;
    }

    if (style) {
      const styleLabel = visualPresentationPromptOptions.styles.find(s => s.value === style)?.label;
      prompt += `Tone & Style: ${styleLabel}\n`;
    }

    if (format) {
      const formatLabel = visualPresentationPromptOptions.formats.find(f => f.value === format)?.label;
      prompt += `Format: ${formatLabel} focusing on layout, visuals, and flow.\n`;
    }

    if (visualType) {
      const visualLabel = visualPresentationPromptOptions.visualTypes.find(v => v.value === visualType)?.label;
      prompt += `Visuals: Emphasize ${visualLabel} along with imagery, icons, charts, and design motifs that bring the story to life.\n`;
    }

    if (storytelling) {
      const storyLabel = visualPresentationPromptOptions.storytellingApproaches.find(s => s.value === storytelling)?.label;
      prompt += `Storytelling: Use ${storyLabel} approach and recommend where to use visuals, metaphors, or design-led storytelling techniques.\n`;
    }

    prompt += `Constraints: Slides should be uncluttered, with balance between text and visuals.`;

    if (constraints) {
      prompt += ` Additional constraints: ${constraints}`;
    }
    prompt += `\n`;

    let optionalFeatures = [];

    if (colorPalette) {
      const colorLabel = visualPresentationPromptOptions.colorPalettes.find(c => c.value === colorPalette)?.label;
      optionalFeatures.push(`${colorLabel} color palette`);
    }

    if (typography) {
      const typoLabel = visualPresentationPromptOptions.typography.find(t => t.value === typography)?.label;
      optionalFeatures.push(`${typoLabel} typography`);
    }

    if (additionalFeatures.length > 0) {
      optionalFeatures.push(...additionalFeatures);
    }

    if (optionalFeatures.length > 0) {
      prompt += `Optional: Suggest ${optionalFeatures.join(', ')} that fit the theme.\n`;
    }

    prompt += `\nDeliver the output as a slide design outline, with clear notes on visual direction for each slide.`;

    onPromptGenerated(prompt);
  };

  const availableAdditionalFeatures = [
    "Animation and transition suggestions",
    "Interactive element recommendations",
    "Accessibility considerations",
    "Print-friendly alternatives",
    "Mobile presentation adaptations",
    "Brand consistency guidelines",
    "Template variations",
    "Export format recommendations"
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
    setStyle("");
    setFormat("");
    setVisualType("");
    setStorytelling("");
    setColorPalette("");
    setTypography("");
    setTopic("");
    setConstraints("");
    setAdditionalFeatures([]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="topic" className="text-sm font-medium">
            Design Topic/Theme
          </Label>
          <Input
            id="topic"
            placeholder="e.g., 'Sustainable Future' or 'Digital Transformation'"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Design Objective</Label>
          <Select value={objective} onValueChange={setObjective}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose design objective" />
            </SelectTrigger>
            <SelectContent>
              {visualPresentationPromptOptions.objectives.map((option) => (
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
              {visualPresentationPromptOptions.audiences.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Visual Style</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose visual style" />
            </SelectTrigger>
            <SelectContent>
              {visualPresentationPromptOptions.styles.map((option) => (
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
              {visualPresentationPromptOptions.formats.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Visual Type Focus</Label>
          <Select value={visualType} onValueChange={setVisualType}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select visual type emphasis" />
            </SelectTrigger>
            <SelectContent>
              {visualPresentationPromptOptions.visualTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Storytelling Approach</Label>
          <Select value={storytelling} onValueChange={setStorytelling}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose storytelling method" />
            </SelectTrigger>
            <SelectContent>
              {visualPresentationPromptOptions.storytellingApproaches.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Color Palette (Optional)</Label>
          <Select value={colorPalette} onValueChange={setColorPalette}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select color palette style" />
            </SelectTrigger>
            <SelectContent>
              {visualPresentationPromptOptions.colorPalettes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Typography Style (Optional)</Label>
          <Select value={typography} onValueChange={setTypography}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select typography style" />
            </SelectTrigger>
            <SelectContent>
              {visualPresentationPromptOptions.typography.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="constraints" className="text-sm font-medium">
            Design Constraints (Optional)
          </Label>
          <Input
            id="constraints"
            placeholder="e.g., 'Must use company colors' or 'Limited to 10 slides'"
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