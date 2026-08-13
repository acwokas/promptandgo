import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, X } from "lucide-react";
import { storytellingPromptOptions } from "@/data/promptStudioOptions";

interface StorytellingPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: {
    storyGenre?: string;
    setting?: string;
  };
  initialSubject?: string;
}

export const StorytellingPromptCrafter = ({ onPromptGenerated, initialSelections, initialSubject }: StorytellingPromptCrafterProps) => {
  const [storyGenre, setStoryGenre] = useState(initialSelections?.storyGenre || "");
  const [mainCharacters, setMainCharacters] = useState(initialSubject || "");
  const [setting, setSetting] = useState(initialSelections?.setting || "");
  const [storyLength, setStoryLength] = useState("");
  const [narrativeStyle, setNarrativeStyle] = useState("");
  const [themesMotifs, setThemesMotifs] = useState("");
  const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);

  // Auto-generate prompt when initial selections are provided
  useEffect(() => {
    if (initialSelections?.storyGenre || initialSelections?.setting || initialSubject) {
      setTimeout(() => {
        const prompt = buildPrompt();
        if (prompt) onPromptGenerated(prompt);
      }, 100);
    }
  }, []);

  const buildPrompt = () => {
    if (!storyGenre) return "";

    const promptParts: string[] = [];
    
    promptParts.push("Create a compelling story with the following specifications:");
    
    if (storyGenre) {
      const genreLabel = storytellingPromptOptions.storyGenres.find(g => g.value === storyGenre)?.label;
      if (genreLabel) promptParts.push(`\nStory Genre: ${genreLabel}`);
    }
    
    if (mainCharacters) {
      promptParts.push(`Main Character(s): ${mainCharacters.trim()}`);
    }
    
    if (setting) {
      const settingLabel = storytellingPromptOptions.settings.find(s => s.value === setting)?.label;
      if (settingLabel) promptParts.push(`Setting: ${settingLabel}`);
    }
    
    if (storyLength) {
      const lengthLabel = storytellingPromptOptions.storyLengths.find(l => l.value === storyLength)?.label;
      if (lengthLabel) promptParts.push(`Story Length: ${lengthLabel}`);
    }
    
    if (narrativeStyle) {
      const styleLabel = storytellingPromptOptions.narrativeStyles.find(n => n.value === narrativeStyle)?.label;
      if (styleLabel) promptParts.push(`Narrative Style: ${styleLabel}`);
    }
    
    if (themesMotifs) {
      promptParts.push(`Themes/Motifs: ${themesMotifs.trim()}`);
    }
    
    if (additionalFeatures.length > 0) {
      promptParts.push(`Additional Features: ${additionalFeatures.join(", ")}`);
    }
    
    promptParts.push("\nPlease include:");
    promptParts.push("- Compelling character development");
    promptParts.push("- Engaging plot structure");
    promptParts.push("- Vivid setting descriptions");
    promptParts.push("- Meaningful dialogue");
    promptParts.push("- Emotional resonance");
    promptParts.push("- Satisfying narrative arc");
    
    return promptParts.join("\n");
  };

  useEffect(() => {
    const prompt = buildPrompt();
    onPromptGenerated(prompt);
  }, [storyGenre, mainCharacters, setting, storyLength, narrativeStyle, themesMotifs, additionalFeatures, onPromptGenerated]);

  const availableAdditionalFeatures = [
    "Dialogue-heavy",
    "Plot twist",
    "Moral lesson",
    "Humour injection",
    "Cliffhanger ending"
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
    setStoryGenre("");
    setMainCharacters("");
    setSetting("");
    setStoryLength("");
    setNarrativeStyle("");
    setThemesMotifs("");
    setAdditionalFeatures([]);
  };

  return (
    <div className="space-y-6 w-full mobile-safe">
      {/* Story Genre */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Story Genre *</Label>
        <Select value={storyGenre} onValueChange={setStoryGenre}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose story genre" />
          </SelectTrigger>
          <SelectContent>
            {storytellingPromptOptions.storyGenres.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Character(s) */}
      <div className="space-y-2">
        <Label htmlFor="main-characters" className="text-sm font-medium">
          Main Character(s) *
        </Label>
        <div className="w-full">
          <Textarea
            id="main-characters"
            placeholder="Describe the protagonist(s) (e.g., 'A retired detective in Tokyo')"
            value={mainCharacters}
            onChange={(e) => setMainCharacters(e.target.value)}
            className="w-full min-h-[80px]"
          />
        </div>
      </div>

      {/* Setting */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Setting</Label>
        <Select value={setting} onValueChange={setSetting}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose setting" />
          </SelectTrigger>
          <SelectContent>
            {storytellingPromptOptions.settings.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Story Length */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Story Length</Label>
        <Select value={storyLength} onValueChange={setStoryLength}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose story length" />
          </SelectTrigger>
          <SelectContent>
            {storytellingPromptOptions.storyLengths.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Narrative Style */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Narrative Style</Label>
        <Select value={narrativeStyle} onValueChange={setNarrativeStyle}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose narrative style" />
          </SelectTrigger>
          <SelectContent>
            {storytellingPromptOptions.narrativeStyles.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Themes / Motifs */}
      <div className="space-y-2">
        <Label htmlFor="themes-motifs" className="text-sm font-medium">
          Themes / Motifs
        </Label>
        <div className="w-full">
          <Textarea
            id="themes-motifs"
            placeholder="Enter central ideas (e.g., 'betrayal, hope, technology vs humanity')"
            value={themesMotifs}
            onChange={(e) => setThemesMotifs(e.target.value)}
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
          disabled={!storyGenre && !mainCharacters && !setting && !storyLength && !narrativeStyle && !themesMotifs && additionalFeatures.length === 0}
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