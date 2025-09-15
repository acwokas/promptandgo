import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ArrowDown } from "lucide-react";
import { eventPromptOptions } from "@/data/promptStudioOptions";

interface EventPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: {
    eventType?: string;
    tone?: string;
  };
  initialSubject?: string;
}

export const EventPromptCrafter = ({ onPromptGenerated, initialSelections, initialSubject }: EventPromptCrafterProps) => {
  const [eventName, setEventName] = useState(initialSubject || "");
  const [eventType, setEventType] = useState(initialSelections?.eventType || "");
  const [eventFormat, setEventFormat] = useState("");
  const [audienceType, setAudienceType] = useState("");
  const [audienceSize, setAudienceSize] = useState("");
  const [tone, setTone] = useState(initialSelections?.tone || "");
  const [theme, setTheme] = useState("");
  const [venueType, setVenueType] = useState("");
  const [geoLocation, setGeoLocation] = useState("");
  const [engagementFormat, setEngagementFormat] = useState("");
  const [ctaStyle, setCtaStyle] = useState("");
  const [followUpOutcome, setFollowUpOutcome] = useState("");
  const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // Auto-generate prompt when initial selections are provided
  useEffect(() => {
    if (initialSelections?.eventType || initialSelections?.tone || initialSubject) {
      // Small delay to allow component to render first
      setTimeout(() => {
        const prompt = buildPrompt();
        if (prompt) onPromptGenerated(prompt);
      }, 100);
    }
  }, []);

  const buildPrompt = () => {
    const parts = [];
    
    if (eventName) parts.push(`Event: ${eventName}`);
    if (eventType) {
      const eventTypeLabel = eventPromptOptions.eventTypes.find(t => t.value === eventType)?.label;
      if (eventTypeLabel) parts.push(`Type: ${eventTypeLabel}`);
    }
    if (eventFormat) {
      const formatLabel = eventPromptOptions.eventFormats.find(f => f.value === eventFormat)?.label;
      if (formatLabel) parts.push(`Format: ${formatLabel}`);
    }
    if (audienceType) {
      const audienceLabel = eventPromptOptions.audienceTypes.find(a => a.value === audienceType)?.label;
      if (audienceLabel) parts.push(`Audience: ${audienceLabel}`);
    }
    if (audienceSize) {
      const sizeLabel = eventPromptOptions.audienceSizes.find(s => s.value === audienceSize)?.label;
      if (sizeLabel) parts.push(`Size: ${sizeLabel}`);
    }
    if (tone) {
      const toneLabel = eventPromptOptions.tones.find(t => t.value === tone)?.label;
      if (toneLabel) parts.push(`Tone: ${toneLabel}`);
    }
    if (theme) {
      const themeLabel = eventPromptOptions.themes.find(t => t.value === theme)?.label;
      if (themeLabel) parts.push(`Purpose: ${themeLabel}`);
    }
    if (venueType) {
      const venueLabel = eventPromptOptions.venueTypes.find(v => v.value === venueType)?.label;
      if (venueLabel) parts.push(`Venue: ${venueLabel}`);
    }
    if (geoLocation) {
      const locationLabel = eventPromptOptions.geoLocations.find(g => g.value === geoLocation)?.label;
      if (locationLabel) parts.push(`Location: ${locationLabel}`);
    }
    if (engagementFormat) {
      const engagementLabel = eventPromptOptions.engagementFormats.find(e => e.value === engagementFormat)?.label;
      if (engagementLabel) parts.push(`Format: ${engagementLabel}`);
    }
    if (ctaStyle) {
      const ctaLabel = eventPromptOptions.ctaStyles.find(c => c.value === ctaStyle)?.label;
      if (ctaLabel) parts.push(`CTA: ${ctaLabel}`);
    }
    if (followUpOutcome) {
      const outcomeLabel = eventPromptOptions.followUpOutcomes.find(f => f.value === followUpOutcome)?.label;
      if (outcomeLabel) parts.push(`Follow-up: ${outcomeLabel}`);
    }
    
    if (additionalFeatures.length > 0) {
      parts.push(`Additional features: ${additionalFeatures.join(", ")}`);
    }

    return parts.join(". ");
  };

  useEffect(() => {
    const prompt = buildPrompt();
    setGeneratedPrompt(prompt);
    onPromptGenerated(prompt);
  }, [eventName, eventType, eventFormat, audienceType, audienceSize, tone, theme, venueType, geoLocation, engagementFormat, ctaStyle, followUpOutcome, additionalFeatures, onPromptGenerated]);

  const addFeature = (feature: string) => {
    if (!additionalFeatures.includes(feature)) {
      setAdditionalFeatures([...additionalFeatures, feature]);
    }
  };

  const removeFeature = (feature: string) => {
    setAdditionalFeatures(additionalFeatures.filter(f => f !== feature));
  };

  const clearAll = () => {
    setEventName("");
    setEventType("");
    setEventFormat("");
    setAudienceType("");
    setAudienceSize("");
    setTone("");
    setTheme("");
    setVenueType("");
    setGeoLocation("");
    setEngagementFormat("");
    setCtaStyle("");
    setFollowUpOutcome("");
    setAdditionalFeatures([]);
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

  const availableFeatures = [
    "Live streaming", "Q&A session", "Breakout rooms", "Networking app", "Photo booth",
    "Live polling", "Gamification", "Food & beverages", "Welcome gifts", "Certificate of attendance",
    "Recording available", "Simultaneous translation", "Accessibility features", "Mobile app",
    "Social media wall", "Exhibition booths", "Sponsor presentations", "Award ceremony"
  ].filter(feature => !additionalFeatures.includes(feature));

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="space-y-4">
        <div>
          <Label htmlFor="event-name">Event Name</Label>
          <Input
            id="event-name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter your event name..."
            className="mt-1"
          />
        </div>

        <div>
          <Label>Event Type</Label>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose event type" />
            </SelectTrigger>
            <SelectContent>
              {eventPromptOptions.eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Event Format</Label>
          <Select value={eventFormat} onValueChange={setEventFormat}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose event format" />
            </SelectTrigger>
            <SelectContent>
              {eventPromptOptions.eventFormats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Audience Type</Label>
          <Select value={audienceType} onValueChange={setAudienceType}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose audience type" />
            </SelectTrigger>
            <SelectContent>
              {eventPromptOptions.audienceTypes.map((audience) => (
                <SelectItem key={audience.value} value={audience.value}>
                  {audience.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Audience Size</Label>
          <Select value={audienceSize} onValueChange={setAudienceSize}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose audience size" />
            </SelectTrigger>
            <SelectContent>
              {eventPromptOptions.audienceSizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tone / Atmosphere</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose tone" />
            </SelectTrigger>
            <SelectContent>
              {eventPromptOptions.tones.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Theme / Purpose</Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose theme" />
            </SelectTrigger>
            <SelectContent>
              {eventPromptOptions.themes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Venue Type</Label>
          <Select value={venueType} onValueChange={setVenueType}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose venue type" />
            </SelectTrigger>
            <SelectContent>
              {eventPromptOptions.venueTypes.map((venue) => (
                <SelectItem key={venue.value} value={venue.value}>
                  {venue.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Geographic Location</Label>
          <Select value={geoLocation} onValueChange={setGeoLocation}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose location" />
            </SelectTrigger>
            <SelectContent>
              {eventPromptOptions.geoLocations.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Engagement Format</Label>
          <Select value={engagementFormat} onValueChange={setEngagementFormat}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose engagement format" />
            </SelectTrigger>
            <SelectContent>
              {eventPromptOptions.engagementFormats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>CTA Style</Label>
          <Select value={ctaStyle} onValueChange={setCtaStyle}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose CTA style" />
            </SelectTrigger>
            <SelectContent>
              {eventPromptOptions.ctaStyles.map((cta) => (
                <SelectItem key={cta.value} value={cta.value}>
                  {cta.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Follow-up / Outcome</Label>
          <Select value={followUpOutcome} onValueChange={setFollowUpOutcome}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose follow-up outcome" />
            </SelectTrigger>
            <SelectContent>
              {eventPromptOptions.followUpOutcomes.map((outcome) => (
                <SelectItem key={outcome.value} value={outcome.value}>
                  {outcome.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Additional Features */}
      <div>
        <Label>Additional Features</Label>
        <div className="mt-2 space-y-3">
          {availableFeatures.length > 0 && (
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
              {availableFeatures.map((feature) => (
                <Button
                  key={feature}
                  variant="outline"
                  size="sm"
                  onClick={() => addFeature(feature)}
                  className="text-xs"
                >
                  + {feature}
                </Button>
              ))}
            </div>
          )}
          
          {additionalFeatures.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {additionalFeatures.map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs">
                  {feature}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(feature)}
                    className="ml-1 h-auto p-0.5 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearAll} className="flex-1">
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

      <div className="text-center text-sm text-muted-foreground">
        Scout is crafting your event prompt...
      </div>
    </div>
  );
};