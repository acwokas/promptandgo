import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, X } from "lucide-react";
import { businessStrategyPromptOptions } from "@/data/promptStudioOptions";

interface BusinessStrategyPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: {
    businessType?: string;
    focusArea?: string;
  };
  initialSubject?: string;
}

export const BusinessStrategyPromptCrafter = ({ onPromptGenerated, initialSelections, initialSubject }: BusinessStrategyPromptCrafterProps) => {
  const [businessType, setBusinessType] = useState(initialSelections?.businessType || "");
  const [focusArea, setFocusArea] = useState(initialSelections?.focusArea || "");
  const [framework, setFramework] = useState("");
  const [marketRegion, setMarketRegion] = useState(initialSubject || "");
  const [strategyHorizon, setStrategyHorizon] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);

  // Auto-generate prompt when initial selections are provided
  useEffect(() => {
    if (initialSelections?.businessType || initialSelections?.focusArea || initialSubject) {
      setTimeout(() => {
        const prompt = buildPrompt();
        if (prompt) onPromptGenerated(prompt);
      }, 100);
    }
  }, []);

  const buildPrompt = () => {
    if (!businessType) return "";

    const promptParts: string[] = [];
    
    promptParts.push("Create a comprehensive business strategy document with the following specifications:");
    
    if (businessType) {
      const typeLabel = businessStrategyPromptOptions.businessTypes.find(t => t.value === businessType)?.label;
      if (typeLabel) promptParts.push(`\nBusiness Type: ${typeLabel}`);
    }
    
    if (focusArea) {
      const areaLabel = businessStrategyPromptOptions.focusAreas.find(f => f.value === focusArea)?.label;
      if (areaLabel) promptParts.push(`Focus Area: ${areaLabel}`);
    }
    
    if (framework) {
      const frameworkLabel = businessStrategyPromptOptions.frameworks.find(f => f.value === framework)?.label;
      if (frameworkLabel) promptParts.push(`Framework: ${frameworkLabel}`);
    }
    
    if (marketRegion) {
      promptParts.push(`Market/Region: ${marketRegion.trim()}`);
    }
    
    if (strategyHorizon) {
      const horizonLabel = businessStrategyPromptOptions.strategyHorizons.find(h => h.value === strategyHorizon)?.label;
      if (horizonLabel) promptParts.push(`Strategy Horizon: ${horizonLabel}`);
    }
    
    if (outputFormat) {
      const formatLabel = businessStrategyPromptOptions.outputFormats.find(o => o.value === outputFormat)?.label;
      if (formatLabel) promptParts.push(`Output Format: ${formatLabel}`);
    }
    
    if (additionalFeatures.length > 0) {
      promptParts.push(`Additional Features: ${additionalFeatures.join(", ")}`);
    }
    
    promptParts.push("\nPlease include:");
    promptParts.push("- Clear strategic objectives and goals");
    promptParts.push("- Market analysis and insights");
    promptParts.push("- Competitive positioning");
    promptParts.push("- Implementation roadmap");
    promptParts.push("- Success metrics and KPIs");
    promptParts.push("- Risk assessment and mitigation strategies");
    
    return promptParts.join("\n");
  };

  useEffect(() => {
    const prompt = buildPrompt();
    onPromptGenerated(prompt);
  }, [businessType, focusArea, framework, marketRegion, strategyHorizon, outputFormat, additionalFeatures, onPromptGenerated]);

  const availableAdditionalFeatures = [
    "Competitor analysis",
    "Consumer personas",
    "Risk mitigation plan",
    "KPIs and success metrics",
    "Market entry recommendations"
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
    setBusinessType("");
    setFocusArea("");
    setFramework("");
    setMarketRegion("");
    setStrategyHorizon("");
    setOutputFormat("");
    setAdditionalFeatures([]);
  };

  return (
    <div className="space-y-6 w-full mobile-safe">
      {/* Business Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Business Type *</Label>
        <Select value={businessType} onValueChange={setBusinessType}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose business type" />
          </SelectTrigger>
          <SelectContent>
            {businessStrategyPromptOptions.businessTypes.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Focus Area */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Focus Area *</Label>
        <Select value={focusArea} onValueChange={setFocusArea}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose focus area" />
          </SelectTrigger>
          <SelectContent>
            {businessStrategyPromptOptions.focusAreas.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Framework */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Framework</Label>
        <Select value={framework} onValueChange={setFramework}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose framework" />
          </SelectTrigger>
          <SelectContent>
            {businessStrategyPromptOptions.frameworks.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Market / Region */}
      <div className="space-y-2">
        <Label htmlFor="market-region" className="text-sm font-medium">
          Market / Region
        </Label>
        <div className="w-full">
          <Input
            id="market-region"
            placeholder="Enter market or region focus (e.g., 'APAC, Singapore')"
            value={marketRegion}
            onChange={(e) => setMarketRegion(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Strategy Horizon */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Strategy Horizon</Label>
        <Select value={strategyHorizon} onValueChange={setStrategyHorizon}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose strategy horizon" />
          </SelectTrigger>
          <SelectContent>
            {businessStrategyPromptOptions.strategyHorizons.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Output Format */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Output Format</Label>
        <Select value={outputFormat} onValueChange={setOutputFormat}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose output format" />
          </SelectTrigger>
          <SelectContent>
            {businessStrategyPromptOptions.outputFormats.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          disabled={!businessType && !focusArea && !framework && !marketRegion && !strategyHorizon && !outputFormat && additionalFeatures.length === 0}
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