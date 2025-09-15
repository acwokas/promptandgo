import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, X } from "lucide-react";
import { videoScriptPromptOptions } from "@/data/promptStudioOptions";

interface VideoScriptPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: {
    videoPurpose?: string;
    videoLength?: string;
  };
  initialSubject?: string;
}

export const VideoScriptPromptCrafter = ({ onPromptGenerated, initialSelections, initialSubject }: VideoScriptPromptCrafterProps) => {
  const [videoPurpose, setVideoPurpose] = useState(initialSelections?.videoPurpose || "");
  const [videoLength, setVideoLength] = useState(initialSelections?.videoLength || "");
  const [audience, setAudience] = useState("");
  const [scriptStyle, setScriptStyle] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [videoTopic, setVideoTopic] = useState(initialSubject || "");
  const [visualElements, setVisualElements] = useState<string[]>([]);

  // Auto-generate prompt when initial selections are provided
  useEffect(() => {
    if (initialSelections?.videoPurpose || initialSelections?.videoLength || initialSubject) {
      setTimeout(() => {
        const prompt = buildPrompt();
        if (prompt) onPromptGenerated(prompt);
      }, 100);
    }
  }, []);

  const buildPrompt = () => {
    if (!videoTopic.trim()) return "";

    const promptParts: string[] = [];
    
    promptParts.push("Create a compelling video script with the following specifications:");
    promptParts.push(`\nVideo Topic: ${videoTopic.trim()}`);
    
    if (videoPurpose) {
      const purposeLabel = videoScriptPromptOptions.videoPurposes.find(p => p.value === videoPurpose)?.label;
      if (purposeLabel) promptParts.push(`Video Purpose: ${purposeLabel}`);
    }
    
    if (videoLength) {
      const lengthLabel = videoScriptPromptOptions.videoLengths.find(l => l.value === videoLength)?.label;
      if (lengthLabel) promptParts.push(`Length: ${lengthLabel}`);
    }
    
    if (audience) {
      const audienceLabel = videoScriptPromptOptions.audiences.find(a => a.value === audience)?.label;
      if (audienceLabel) promptParts.push(`Audience: ${audienceLabel}`);
    }
    
    if (scriptStyle) {
      const styleLabel = videoScriptPromptOptions.scriptStyles.find(s => s.value === scriptStyle)?.label;
      if (styleLabel) promptParts.push(`Script Style: ${styleLabel}`);
    }
    
    if (callToAction) {
      const ctaLabel = videoScriptPromptOptions.ctaOptions.find(c => c.value === callToAction)?.label;
      if (ctaLabel) promptParts.push(`Call-to-Action: ${ctaLabel}`);
    }
    
    if (visualElements.length > 0) {
      promptParts.push(`Visual Elements: ${visualElements.join(", ")}`);
    }
    
    promptParts.push("\nPlease include:");
    promptParts.push("- Engaging hook within first 3 seconds");
    promptParts.push("- Clear structure with scene descriptions");
    promptParts.push("- Dialogue/voiceover scripts");
    promptParts.push("- Visual cues and directions");
    promptParts.push("- Timing and pacing notes");
    promptParts.push("- Strong call-to-action");
    promptParts.push("- Production recommendations");
    
    return promptParts.join("\n");
  };

  useEffect(() => {
    const prompt = buildPrompt();
    onPromptGenerated(prompt);
  }, [videoTopic, videoPurpose, videoLength, audience, scriptStyle, callToAction, visualElements, onPromptGenerated]);

  const availableVisualElements = [
    "On-screen text",
    "B-roll footage",
    "Animations", 
    "Product demo",
    "Customer quote"
  ];

  const addVisualElement = (element: string) => {
    if (!visualElements.includes(element)) {
      setVisualElements([...visualElements, element]);
    }
  };

  const removeVisualElement = (element: string) => {
    setVisualElements(visualElements.filter(e => e !== element));
  };

  const clearAll = () => {
    setVideoTopic("");
    setVideoPurpose("");
    setVideoLength("");
    setAudience("");
    setScriptStyle("");
    setCallToAction("");
    setVisualElements([]);
  };

  return (
    <div className="space-y-6 w-full mobile-safe">
      {/* Video Topic - Free text */}
      <div className="space-y-2">
        <Label htmlFor="video-topic" className="text-sm font-medium">
          Video Topic *
        </Label>
        <Input
          id="video-topic"
          placeholder="Enter your video topic or subject"
          value={videoTopic}
          onChange={(e) => setVideoTopic(e.target.value)}
          className="bg-background"
        />
      </div>

      {/* Video Purpose */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Video Purpose *</Label>
        <Select value={videoPurpose} onValueChange={setVideoPurpose}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose video purpose" />
          </SelectTrigger>
          <SelectContent>
            {videoScriptPromptOptions.videoPurposes.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Video Length */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Length</Label>
        <Select value={videoLength} onValueChange={setVideoLength}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose video length" />
          </SelectTrigger>
          <SelectContent>
            {videoScriptPromptOptions.videoLengths.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Audience */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Audience</Label>
        <Select value={audience} onValueChange={setAudience}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose target audience" />
          </SelectTrigger>
          <SelectContent>
            {videoScriptPromptOptions.audiences.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Script Style */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Script Style</Label>
        <Select value={scriptStyle} onValueChange={setScriptStyle}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose script style" />
          </SelectTrigger>
          <SelectContent>
            {videoScriptPromptOptions.scriptStyles.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Visual Elements */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Visual Elements</Label>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          {availableVisualElements
            .filter(element => !visualElements.includes(element))
            .map((element) => (
              <Button
                key={element}
                variant="outline"
                size="sm"
                onClick={() => addVisualElement(element)}
                className="justify-start text-xs"
              >
                + {element}
              </Button>
            ))}
        </div>
        
        {/* Selected Visual Elements */}
        {visualElements.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {visualElements.map((element) => (
                <Badge key={element} variant="secondary" className="text-xs">
                  {element}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVisualElement(element)}
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

      {/* Call-to-Action */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Call-to-Action</Label>
        <Select value={callToAction} onValueChange={setCallToAction}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose call-to-action" />
          </SelectTrigger>
          <SelectContent>
            {videoScriptPromptOptions.ctaOptions.map((option) => (
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
          disabled={!videoTopic && !videoPurpose && !videoLength && !audience && !scriptStyle && !callToAction && visualElements.length === 0}
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