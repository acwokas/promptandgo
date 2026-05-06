import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, X } from "lucide-react";
import { learningStudyPromptOptions } from "@/data/promptStudioOptions";

interface LearningStudyPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: {
    targetLevel?: string;
    learningFormat?: string;
  };
  initialSubject?: string;
}

export const LearningStudyPromptCrafter = ({ onPromptGenerated, initialSelections, initialSubject }: LearningStudyPromptCrafterProps) => {
  const [subjectTopic, setSubjectTopic] = useState(initialSubject || "");
  const [targetLevel, setTargetLevel] = useState(initialSelections?.targetLevel || "");
  const [learningFormat, setLearningFormat] = useState(initialSelections?.learningFormat || "");
  const [toneOfVoice, setToneOfVoice] = useState("");
  const [keyFocusAreas, setKeyFocusAreas] = useState("");
  const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);

  // Auto-generate prompt when initial selections are provided
  useEffect(() => {
    if (initialSelections?.targetLevel || initialSelections?.learningFormat || initialSubject) {
      setTimeout(() => {
        const prompt = buildPrompt();
        if (prompt) onPromptGenerated(prompt);
      }, 100);
    }
  }, []);

  const buildPrompt = () => {
    if (!subjectTopic.trim()) return "";

    const promptParts: string[] = [];
    
    promptParts.push("Create educational content with the following specifications:");
    promptParts.push(`\nSubject/Topic: ${subjectTopic.trim()}`);
    
    if (targetLevel) {
      const levelLabel = learningStudyPromptOptions.targetLevels.find(l => l.value === targetLevel)?.label;
      if (levelLabel) promptParts.push(`Target Level: ${levelLabel}`);
    }
    
    if (learningFormat) {
      const formatLabel = learningStudyPromptOptions.learningFormats.find(f => f.value === learningFormat)?.label;
      if (formatLabel) promptParts.push(`Learning Format: ${formatLabel}`);
    }
    
    if (toneOfVoice) {
      const toneLabel = learningStudyPromptOptions.toneOfVoice.find(t => t.value === toneOfVoice)?.label;
      if (toneLabel) promptParts.push(`Tone: ${toneLabel}`);
    }
    
    if (keyFocusAreas) {
      promptParts.push(`Key Focus Areas: ${keyFocusAreas.trim()}`);
    }
    
    if (additionalFeatures.length > 0) {
      promptParts.push(`Additional Features: ${additionalFeatures.join(", ")}`);
    }
    
    promptParts.push("\nPlease include:");
    promptParts.push("- Clear, structured learning objectives");
    promptParts.push("- Level-appropriate explanations");
    promptParts.push("- Engaging and memorable content");
    promptParts.push("- Practical examples and applications");
    promptParts.push("- Progress checkpoints");
    promptParts.push("- Learning reinforcement techniques");
    
    return promptParts.join("\n");
  };

  useEffect(() => {
    const prompt = buildPrompt();
    onPromptGenerated(prompt);
  }, [subjectTopic, targetLevel, learningFormat, toneOfVoice, keyFocusAreas, additionalFeatures, onPromptGenerated]);

  const availableAdditionalFeatures = [
    "Real-world examples",
    "Visual analogies",
    "Practice quiz",
    "Key formulas/equations",
    "Mnemonics"
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
    setSubjectTopic("");
    setTargetLevel("");
    setLearningFormat("");
    setToneOfVoice("");
    setKeyFocusAreas("");
    setAdditionalFeatures([]);
  };

  return (
    <div className="space-y-6 w-full mobile-safe">
      {/* Subject / Topic */}
      <div className="space-y-2">
        <Label htmlFor="subject-topic" className="text-sm font-medium">
          Subject / Topic *
        </Label>
        <div className="w-full">
          <Input
            id="subject-topic"
            placeholder="What do you want to learn? (e.g., 'Quantum Mechanics basics')"
            value={subjectTopic}
            onChange={(e) => setSubjectTopic(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Target Level */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Target Level</Label>
        <Select value={targetLevel} onValueChange={setTargetLevel}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose target level" />
          </SelectTrigger>
          <SelectContent>
            {learningStudyPromptOptions.targetLevels.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Learning Format */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Learning Format</Label>
        <Select value={learningFormat} onValueChange={setLearningFormat}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose learning format" />
          </SelectTrigger>
          <SelectContent>
            {learningStudyPromptOptions.learningFormats.map((option) => (
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
            {learningStudyPromptOptions.toneOfVoice.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Key Focus Areas */}
      <div className="space-y-2">
        <Label htmlFor="key-focus-areas" className="text-sm font-medium">
          Key Focus Areas
        </Label>
        <div className="w-full">
          <Textarea
            id="key-focus-areas"
            placeholder="Enter subtopics (e.g., 'wave-particle duality, uncertainty principle')"
            value={keyFocusAreas}
            onChange={(e) => setKeyFocusAreas(e.target.value)}
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
          disabled={!subjectTopic && !targetLevel && !learningFormat && !toneOfVoice && !keyFocusAreas && additionalFeatures.length === 0}
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