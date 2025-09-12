import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Palette, Calendar, Megaphone, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { imagePromptOptions, eventPromptOptions, ctaPromptOptions } from "@/data/promptStudioOptions";

type CrafterType = "image" | "event" | "cta";

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
  }
};

const MiniPromptStudio = () => {
  const [activeCrafter, setActiveCrafter] = useState<CrafterType>("image");
  const [selections, setSelections] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Rotate the active crafter on page load
  useEffect(() => {
    const crafters: CrafterType[] = ["image", "event", "cta"];
    const randomCrafter = crafters[Math.floor(Math.random() * crafters.length)];
    setActiveCrafter(randomCrafter);
  }, []);

  const config = crafterConfigs[activeCrafter];
  const IconComponent = config.icon;

  const handleSelectionChange = (key: string, value: string) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

  const handleTryStudio = () => {
    // Navigate to full studio with selections as URL params
    const params = new URLSearchParams();
    params.set('tab', activeCrafter);
    Object.entries(selections).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/scout/studio?${params.toString()}`);
  };

  const hasSelections = Object.values(selections).some(value => value);

  return (
    <Card className="w-full bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
            <IconComponent className="h-4 w-4 text-secondary-foreground" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Try Prompt Studio
            </CardTitle>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {config.description} - make your selections and see the magic happen!
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Crafter Type Selector */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
          {(Object.keys(crafterConfigs) as CrafterType[]).map((type) => {
            const typeConfig = crafterConfigs[type];
            const TypeIcon = typeConfig.icon;
            return (
              <Button
                key={type}
                variant={activeCrafter === type ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setActiveCrafter(type);
                  setSelections({});
                }}
                className={`
                  flex-1 flex items-center gap-2 text-xs
                  ${activeCrafter === type ? "shadow-sm" : ""}
                `}
              >
                <TypeIcon className="h-3 w-3" />
                <span className="hidden sm:inline">{typeConfig.title.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {config.primaryOptions.map((optionGroup) => (
            <div key={optionGroup.key}>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                {optionGroup.label}
              </label>
              <Select
                value={selections[optionGroup.key] || ""}
                onValueChange={(value) => handleSelectionChange(optionGroup.key, value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder={`Choose ${optionGroup.label.toLowerCase()}...`} />
                </SelectTrigger>
                <SelectContent>
                  {optionGroup.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        {hasSelections && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {Object.values(selections).filter(Boolean).length} of {config.primaryOptions.length} selected
            </Badge>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleTryStudio}
          className="w-full"
          size="sm"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          {hasSelections ? "Continue in Studio" : "Try Full Studio"}
        </Button>

        {/* Preview hint */}
        {!hasSelections && (
          <div className="text-center text-muted-foreground py-2 text-xs">
            <IconComponent className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p>Make selections above to see your prompt take shape</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MiniPromptStudio;