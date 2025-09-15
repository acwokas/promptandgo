import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, X, ArrowDown } from "lucide-react";
import { imagePromptOptions } from "@/data/promptStudioOptions";

interface PromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: {
    style?: string;
    format?: string;
  };
  initialSubject?: string;
}

export const PromptCrafter = ({ onPromptGenerated, initialSelections, initialSubject }: PromptCrafterProps) => {
  const [subject, setSubject] = useState(initialSubject || "");
  const [style, setStyle] = useState(initialSelections?.style || "");
  const [format, setFormat] = useState(initialSelections?.format || "");
  const [colors, setColors] = useState("");
  const [effects, setEffects] = useState("");
  const [lens, setLens] = useState("");
  const [additionalEffects, setAdditionalEffects] = useState<string[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // Auto-generate prompt when initial selections are provided
  useEffect(() => {
    if (initialSelections?.style || initialSelections?.format || initialSubject) {
      // Small delay to allow component to render first
      setTimeout(() => {
        const prompt = buildPrompt();
        if (prompt) onPromptGenerated(prompt);
      }, 100);
    }
  }, []);

  const buildPrompt = () => {
    if (!subject.trim()) return "";

    const promptParts: string[] = [];
    
    // Start with subject
    promptParts.push(subject.trim());
    
    // Add style
    if (style) {
      promptParts.push(`in ${style} style`);
    }
    
    // Add format context
    if (format) {
      const formatData = imagePromptOptions.formats.find(f => f.value === format);
      if (formatData?.aspectRatio) {
        promptParts.push(`designed for ${formatData.label.toLowerCase()}`);
      }
    }
    
    // Add color palette
    if (colors) {
      promptParts.push(`using ${colors} color palette`);
    }
    
    // Add effects
    const allEffects = [...(effects ? [effects] : []), ...additionalEffects];
    if (allEffects.length > 0) {
      promptParts.push(`with ${allEffects.join(", ")} effects`);
    }
    
    // Add lens/camera details
    if (lens) {
      promptParts.push(`shot with ${lens}`);
    }
    
    // Add technical quality terms
    promptParts.push("high quality, professional lighting, detailed");
    
    // Add aspect ratio if format is selected
    if (format) {
      const formatData = imagePromptOptions.formats.find(f => f.value === format);
      if (formatData?.aspectRatio) {
        promptParts.push(`--ar ${formatData.aspectRatio}`);
      }
    }
    
    return promptParts.join(", ");
  };

  useEffect(() => {
    const prompt = buildPrompt();
    setGeneratedPrompt(prompt);
    onPromptGenerated(prompt);
  }, [subject, style, format, colors, effects, lens, additionalEffects, onPromptGenerated]);

  const addEffect = (effect: string) => {
    if (!additionalEffects.includes(effect)) {
      setAdditionalEffects([...additionalEffects, effect]);
    }
  };

  const removeEffect = (effect: string) => {
    setAdditionalEffects(additionalEffects.filter(e => e !== effect));
  };

  const clearAll = () => {
    setSubject("");
    setStyle("");
    setFormat("");
    setColors("");
    setEffects("");
    setLens("");
    setAdditionalEffects([]);
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

console.log("Mobile width debug - window width:", window.innerWidth);
    return (
    <div className="space-y-6 w-full mobile-safe"
         style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* Subject - Free text */}
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium">
          Subject *
        </Label>
        <Input
          id="subject"
          placeholder="What do you want to create? (e.g., 'a futuristic cityscape at sunset')"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="bg-background"
        />
      </div>

      {/* Style */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Art Style</Label>
        <Select value={style} onValueChange={setStyle}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose an art style" />
          </SelectTrigger>
          <SelectContent>
            {imagePromptOptions.styles.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Format/Platform */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Format/Platform</Label>
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose format or platform" />
          </SelectTrigger>
          <SelectContent>
            {imagePromptOptions.formats.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
                {option.aspectRatio && (
                  <span className="text-muted-foreground ml-2">({option.aspectRatio})</span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Colors/Palettes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Color Palette</Label>
        <Select value={colors} onValueChange={setColors}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose color palette" />
          </SelectTrigger>
          <SelectContent>
            {imagePromptOptions.colors.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Primary Effect */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Primary Effect</Label>
        <Select value={effects} onValueChange={setEffects}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose primary effect" />
          </SelectTrigger>
          <SelectContent>
            {imagePromptOptions.effects.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Additional Effects */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Additional Effects</Label>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          {imagePromptOptions.effects
            .filter(effect => effect.value !== effects && !additionalEffects.includes(effect.value))
            .slice(0, 6)
            .map((effect) => (
              <Button
                key={effect.value}
                variant="outline"
                size="sm"
                onClick={() => addEffect(effect.value)}
                className="justify-start text-xs"
              >
                + {effect.label}
              </Button>
            ))}
        </div>
        
        {/* Selected Additional Effects */}
        {additionalEffects.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {additionalEffects.map((effect) => (
                <Badge key={effect} variant="secondary" className="text-xs">
                  {imagePromptOptions.effects.find(e => e.value === effect)?.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEffect(effect)}
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

      {/* Lens/Aperture */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Camera/Lens</Label>
        <Select value={lens} onValueChange={setLens}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose camera or lens style" />
          </SelectTrigger>
          <SelectContent>
            {imagePromptOptions.lenses.map((option) => (
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
          disabled={!subject && !style && !format && !colors && !effects && !lens && additionalEffects.length === 0}
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