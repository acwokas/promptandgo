import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, X, ArrowDown } from "lucide-react";
import { adCopyPromptOptions } from "@/data/promptStudioOptions";

interface AdCopyPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: {
    platform?: string;
    adFormat?: string;
  };
  initialSubject?: string;
}

export const AdCopyPromptCrafter = ({ onPromptGenerated, initialSelections, initialSubject }: AdCopyPromptCrafterProps) => {
  const [productOffer, setProductOffer] = useState(initialSubject || "");
  const [platform, setPlatform] = useState(initialSelections?.platform || "");
  const [adFormat, setAdFormat] = useState(initialSelections?.adFormat || "");
  const [audienceType, setAudienceType] = useState("");
  const [ctaFocus, setCtaFocus] = useState("");
  const [toneOfVoice, setToneOfVoice] = useState("");
  const [wordLength, setWordLength] = useState("");
  const [powerWords, setPowerWords] = useState<string[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // Auto-generate prompt when initial selections are provided
  useEffect(() => {
    if (initialSelections?.platform || initialSelections?.adFormat || initialSubject) {
      setTimeout(() => {
        const prompt = buildPrompt();
        if (prompt) onPromptGenerated(prompt);
      }, 100);
    }
  }, []);

  const buildPrompt = () => {
    if (!productOffer.trim()) return "";

    const promptParts: string[] = [];
    
    promptParts.push("Create high-converting ad copy with the following specifications:");
    promptParts.push(`\nProduct/Offer: ${productOffer.trim()}`);
    
    if (platform) {
      const platformLabel = adCopyPromptOptions.platforms.find(p => p.value === platform)?.label;
      if (platformLabel) promptParts.push(`Platform: ${platformLabel}`);
    }
    
    if (adFormat) {
      const formatLabel = adCopyPromptOptions.adFormats.find(f => f.value === adFormat)?.label;
      if (formatLabel) promptParts.push(`Ad Format: ${formatLabel}`);
    }
    
    if (audienceType) {
      const audienceLabel = adCopyPromptOptions.audienceTypes.find(a => a.value === audienceType)?.label;
      if (audienceLabel) promptParts.push(`Audience: ${audienceLabel}`);
    }
    
    if (ctaFocus) {
      const ctaLabel = adCopyPromptOptions.ctaFocus.find(c => c.value === ctaFocus)?.label;
      if (ctaLabel) promptParts.push(`CTA Focus: ${ctaLabel}`);
    }
    
    if (toneOfVoice) {
      const toneLabel = adCopyPromptOptions.toneOfVoice.find(t => t.value === toneOfVoice)?.label;
      if (toneLabel) promptParts.push(`Tone: ${toneLabel}`);
    }
    
    if (wordLength) {
      const lengthLabel = adCopyPromptOptions.wordLengths.find(w => w.value === wordLength)?.label;
      if (lengthLabel) promptParts.push(`Length: ${lengthLabel}`);
    }
    
    if (powerWords.length > 0) {
      promptParts.push(`Power Words to Include: ${powerWords.join(", ")}`);
    }
    
    promptParts.push("\nPlease include:");
    promptParts.push("- Compelling headline that grabs attention");
    promptParts.push("- Clear value proposition");
    promptParts.push("- Strong call-to-action");
    promptParts.push("- Audience-appropriate messaging");
    promptParts.push("- Platform-optimized format");
    promptParts.push("- Conversion-focused language");
    
    return promptParts.join("\n");
  };

  useEffect(() => {
    const prompt = buildPrompt();
    setGeneratedPrompt(prompt);
    onPromptGenerated(prompt);
  }, [productOffer, platform, adFormat, audienceType, ctaFocus, toneOfVoice, wordLength, powerWords, onPromptGenerated]);

  const availablePowerWords = [
    "Free", "Proven", "Limited", "Guaranteed", "Exclusive", "New"
  ];

  const addPowerWord = (word: string) => {
    if (!powerWords.includes(word)) {
      setPowerWords([...powerWords, word]);
    }
  };

  const removePowerWord = (word: string) => {
    setPowerWords(powerWords.filter(w => w !== word));
  };

  const clearAll = () => {
    setProductOffer("");
    setPlatform("");
    setAdFormat("");
    setAudienceType("");
    setCtaFocus("");
    setToneOfVoice("");
    setWordLength("");
    setPowerWords([]);
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

  return (
    <div className="space-y-6 w-full mobile-safe">
      {/* Product/Offer - Free text */}
      <div className="space-y-2">
        <Label htmlFor="product-offer" className="text-sm font-medium">
          Product/Offer *
        </Label>
        <Input
          id="product-offer"
          placeholder="Describe the product, service, or promotion"
          value={productOffer}
          onChange={(e) => setProductOffer(e.target.value)}
          className="w-full bg-background"
        />
      </div>

      {/* Platform */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Platform</Label>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose platform" />
          </SelectTrigger>
          <SelectContent>
            {adCopyPromptOptions.platforms.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ad Format */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Ad Format</Label>
        <Select value={adFormat} onValueChange={setAdFormat}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose ad format" />
          </SelectTrigger>
          <SelectContent>
            {adCopyPromptOptions.adFormats.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Audience Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Audience Type</Label>
        <Select value={audienceType} onValueChange={setAudienceType}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose audience type" />
          </SelectTrigger>
          <SelectContent>
            {adCopyPromptOptions.audienceTypes.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* CTA Focus */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">CTA Focus</Label>
        <Select value={ctaFocus} onValueChange={setCtaFocus}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose CTA focus" />
          </SelectTrigger>
          <SelectContent>
            {adCopyPromptOptions.ctaFocus.map((option) => (
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
            {adCopyPromptOptions.toneOfVoice.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Word Length */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Word Length</Label>
        <Select value={wordLength} onValueChange={setWordLength}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose word length" />
          </SelectTrigger>
          <SelectContent>
            {adCopyPromptOptions.wordLengths.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Power Words */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Power Words</Label>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          {availablePowerWords
            .filter(word => !powerWords.includes(word))
            .map((word) => (
              <Button
                key={word}
                variant="outline"
                size="sm"
                onClick={() => addPowerWord(word)}
                className="justify-start text-xs"
              >
                + {word}
              </Button>
            ))}
        </div>
        
        {/* Selected Power Words */}
        {powerWords.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {powerWords.map((word) => (
                <Badge key={word} variant="secondary" className="text-xs">
                  {word}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePowerWord(word)}
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
          disabled={!productOffer && !platform && !adFormat && !audienceType && !ctaFocus && !toneOfVoice && !wordLength && powerWords.length === 0}
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