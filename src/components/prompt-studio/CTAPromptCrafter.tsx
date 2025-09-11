import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ctaPromptOptions } from "@/data/promptStudioOptions";
import { toast } from "sonner";

interface CTAPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
}

const CTAPromptCrafter: React.FC<CTAPromptCrafterProps> = ({ onPromptGenerated }) => {
  const [subjectMessage, setSubjectMessage] = useState("");
  const [platform, setPlatform] = useState("");
  const [postFormat, setPostFormat] = useState("");
  const [contentType, setContentType] = useState("");
  const [toneOfVoice, setToneOfVoice] = useState("");
  const [audienceSegmentation, setAudienceSegmentation] = useState("");
  const [geoLocation, setGeoLocation] = useState("");
  const [engagementGoal, setEngagementGoal] = useState("");
  const [visualStyle, setVisualStyle] = useState("");
  const [ctaStyle, setCtaStyle] = useState("");
  const [hashtagStrategy, setHashtagStrategy] = useState("");
  const [postingTimeframe, setPostingTimeframe] = useState("");
  const [powerWords, setPowerWords] = useState<string[]>([]);
  const [customDescription, setCustomDescription] = useState("");

  const generatePrompt = () => {
    if (!subjectMessage.trim()) {
      toast.error("Please enter a subject/message for your CTA post");
      return;
    }

    const selectedOptions = [
      platform && `Platform: ${ctaPromptOptions.platforms.find(p => p.value === platform)?.label}`,
      postFormat && `Post Format: ${ctaPromptOptions.postFormats.find(f => f.value === postFormat)?.label}`,
      contentType && `Content Type: ${ctaPromptOptions.contentTypes.find(c => c.value === contentType)?.label}`,
      toneOfVoice && `Tone: ${ctaPromptOptions.toneOfVoice.find(t => t.value === toneOfVoice)?.label}`,
      audienceSegmentation && `Audience: ${ctaPromptOptions.audienceSegmentation.find(a => a.value === audienceSegmentation)?.label}`,
      geoLocation && `Location: ${ctaPromptOptions.geoLocations.find(g => g.value === geoLocation)?.label}`,
      engagementGoal && `Goal: ${ctaPromptOptions.engagementGoals.find(e => e.value === engagementGoal)?.label}`,
      visualStyle && `Visual Style: ${ctaPromptOptions.visualStyles.find(v => v.value === visualStyle)?.label}`,
      ctaStyle && `CTA Style: ${ctaPromptOptions.ctaStyles.find(c => c.value === ctaStyle)?.label}`,
      hashtagStrategy && `Hashtag Strategy: ${ctaPromptOptions.hashtagStrategies.find(h => h.value === hashtagStrategy)?.label}`,
      postingTimeframe && `Posting Time: ${ctaPromptOptions.postingTimeframes.find(p => p.value === postingTimeframe)?.label}`,
      powerWords.length > 0 && `Power Words: ${powerWords.map(pw => ctaPromptOptions.powerWords.find(p => p.value === pw)?.label).join(", ")}`,
    ].filter(Boolean);

    let prompt = "Create a compelling social media call-to-action post with the following specifications:\n\n";
    
    prompt += `Subject/Message: ${subjectMessage}\n\n`;
    
    if (selectedOptions.length > 0) {
      prompt += selectedOptions.join("\n") + "\n\n";
    }
    
    if (customDescription) {
      prompt += `Additional context: ${customDescription}\n\n`;
    }
    
    prompt += "Please include:\n";
    prompt += "- Engaging copy that resonates with the target audience\n";
    prompt += "- A clear and compelling call-to-action\n";
    prompt += "- Relevant hashtags based on the strategy\n";
    prompt += "- Visual description or suggestions\n";
    prompt += "- Optimal posting recommendations\n";
    prompt += "- Engagement tactics to maximize reach and interaction";

    onPromptGenerated(prompt);
    toast.success("CTA prompt generated successfully!");
  };

  const resetForm = () => {
    setSubjectMessage("");
    setPlatform("");
    setPostFormat("");
    setContentType("");
    setToneOfVoice("");
    setAudienceSegmentation("");
    setGeoLocation("");
    setEngagementGoal("");
    setVisualStyle("");
    setCtaStyle("");
    setHashtagStrategy("");
    setPostingTimeframe("");
    setPowerWords([]);
    setCustomDescription("");
  };

  const addPowerWord = (word: string) => {
    if (!powerWords.includes(word)) {
      setPowerWords([...powerWords, word]);
    }
  };

  const removePowerWord = (word: string) => {
    setPowerWords(powerWords.filter(w => w !== word));
  };

  return (
    <div className="space-y-6">
      {/* Subject/Message - Mandatory Field */}
      <div className="space-y-2">
        <Label htmlFor="subjectMessage">Subject/Message *</Label>
        <Input
          id="subjectMessage"
          placeholder="Enter the main topic or message for your CTA post..."
          value={subjectMessage}
          onChange={(e) => setSubjectMessage(e.target.value)}
          className="w-full"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Choose platform" />
            </SelectTrigger>
            <SelectContent>
              {ctaPromptOptions.platforms.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="postFormat">Post Format</Label>
          <Select value={postFormat} onValueChange={setPostFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Choose format" />
            </SelectTrigger>
            <SelectContent>
              {ctaPromptOptions.postFormats.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contentType">Content Type</Label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger>
              <SelectValue placeholder="Choose content type" />
            </SelectTrigger>
            <SelectContent>
              {ctaPromptOptions.contentTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="toneOfVoice">Tone of Voice</Label>
          <Select value={toneOfVoice} onValueChange={setToneOfVoice}>
            <SelectTrigger>
              <SelectValue placeholder="Choose tone" />
            </SelectTrigger>
            <SelectContent>
              {ctaPromptOptions.toneOfVoice.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="audienceSegmentation">Audience Segmentation</Label>
          <Select value={audienceSegmentation} onValueChange={setAudienceSegmentation}>
            <SelectTrigger>
              <SelectValue placeholder="Choose audience" />
            </SelectTrigger>
            <SelectContent>
              {ctaPromptOptions.audienceSegmentation.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="geoLocation">Geo Location</Label>
          <Select value={geoLocation} onValueChange={setGeoLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Choose location" />
            </SelectTrigger>
            <SelectContent>
              {ctaPromptOptions.geoLocations.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="engagementGoal">Engagement Goal</Label>
          <Select value={engagementGoal} onValueChange={setEngagementGoal}>
            <SelectTrigger>
              <SelectValue placeholder="Choose goal" />
            </SelectTrigger>
            <SelectContent>
              {ctaPromptOptions.engagementGoals.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="visualStyle">Visual Style</Label>
          <Select value={visualStyle} onValueChange={setVisualStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Choose style" />
            </SelectTrigger>
            <SelectContent>
              {ctaPromptOptions.visualStyles.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ctaStyle">CTA Style</Label>
          <Select value={ctaStyle} onValueChange={setCtaStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Choose CTA style" />
            </SelectTrigger>
            <SelectContent>
              {ctaPromptOptions.ctaStyles.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hashtagStrategy">Hashtag Strategy</Label>
          <Select value={hashtagStrategy} onValueChange={setHashtagStrategy}>
            <SelectTrigger>
              <SelectValue placeholder="Choose hashtag strategy" />
            </SelectTrigger>
            <SelectContent>
              {ctaPromptOptions.hashtagStrategies.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="postingTimeframe">Posting Timeframe</Label>
          <Select value={postingTimeframe} onValueChange={setPostingTimeframe}>
            <SelectTrigger>
              <SelectValue placeholder="Choose timeframe" />
            </SelectTrigger>
            <SelectContent>
              {ctaPromptOptions.postingTimeframes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Power Words - Multi-select */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Power Words</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {ctaPromptOptions.powerWords
            .filter(word => !powerWords.includes(word.value))
            .map((word) => (
              <Button
                key={word.value}
                variant="outline"
                size="sm"
                onClick={() => addPowerWord(word.value)}
                className="justify-start text-xs"
              >
                + {word.label}
              </Button>
            ))}
        </div>
        
        {/* Selected Power Words */}
        {powerWords.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {powerWords.map((word) => (
                <Badge key={word} variant="secondary" className="text-xs">
                  {ctaPromptOptions.powerWords.find(pw => pw.value === word)?.label}
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

      <div className="space-y-2">
        <Label htmlFor="customDescription">Additional Context (Optional)</Label>
        <Textarea
          id="customDescription"
          placeholder="Add any specific requirements, brand guidelines, or context for your CTA post..."
          value={customDescription}
          onChange={(e) => setCustomDescription(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={generatePrompt} className="flex-1">
          Generate CTA Prompt
        </Button>
        <Button onClick={resetForm} variant="outline">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CTAPromptCrafter;