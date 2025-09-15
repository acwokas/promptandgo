import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, X } from "lucide-react";
import { salesEmailPromptOptions } from "@/data/promptStudioOptions";

interface SalesEmailPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: {
    emailPurpose?: string;
    recipientRole?: string;
  };
  initialSubject?: string;
}

export const SalesEmailPromptCrafter = ({ onPromptGenerated, initialSelections, initialSubject }: SalesEmailPromptCrafterProps) => {
  const [emailPurpose, setEmailPurpose] = useState(initialSelections?.emailPurpose || "");
  const [recipientRole, setRecipientRole] = useState(initialSelections?.recipientRole || "");
  const [valueProposition, setValueProposition] = useState(initialSubject || "");
  const [toneOfVoice, setToneOfVoice] = useState("");
  const [ctaStyle, setCtaStyle] = useState("");
  const [followUpPlan, setFollowUpPlan] = useState("");
  const [personalizationHooks, setPersonalizationHooks] = useState<string[]>([]);

  // Auto-generate prompt when initial selections are provided
  useEffect(() => {
    if (initialSelections?.emailPurpose || initialSelections?.recipientRole || initialSubject) {
      setTimeout(() => {
        const prompt = buildPrompt();
        if (prompt) onPromptGenerated(prompt);
      }, 100);
    }
  }, []);

  const buildPrompt = () => {
    if (!valueProposition.trim()) return "";

    const promptParts: string[] = [];
    
    promptParts.push("Create a compelling sales email with the following specifications:");
    promptParts.push(`\nValue Proposition: ${valueProposition.trim()}`);
    
    if (emailPurpose) {
      const purposeLabel = salesEmailPromptOptions.emailPurposes.find(p => p.value === emailPurpose)?.label;
      if (purposeLabel) promptParts.push(`Email Purpose: ${purposeLabel}`);
    }
    
    if (recipientRole) {
      const roleLabel = salesEmailPromptOptions.recipientRoles.find(r => r.value === recipientRole)?.label;
      if (roleLabel) promptParts.push(`Recipient Role: ${roleLabel}`);
    }
    
    if (toneOfVoice) {
      const toneLabel = salesEmailPromptOptions.toneOfVoice.find(t => t.value === toneOfVoice)?.label;
      if (toneLabel) promptParts.push(`Tone: ${toneLabel}`);
    }
    
    if (ctaStyle) {
      const ctaLabel = salesEmailPromptOptions.ctaStyles.find(c => c.value === ctaStyle)?.label;
      if (ctaLabel) promptParts.push(`CTA Style: ${ctaLabel}`);
    }
    
    if (followUpPlan) {
      const followUpLabel = salesEmailPromptOptions.followUpPlans.find(f => f.value === followUpPlan)?.label;
      if (followUpLabel) promptParts.push(`Follow-up Plan: ${followUpLabel}`);
    }
    
    if (personalizationHooks.length > 0) {
      promptParts.push(`Personalization Hooks: ${personalizationHooks.join(", ")}`);
    }
    
    promptParts.push("\nPlease include:");
    promptParts.push("- Attention-grabbing subject line");
    promptParts.push("- Personalized opening");
    promptParts.push("- Clear value proposition");
    promptParts.push("- Social proof or credibility indicators");
    promptParts.push("- Strong call-to-action");
    promptParts.push("- Professional closing");
    promptParts.push("- Follow-up strategy recommendations");
    
    return promptParts.join("\n");
  };

  useEffect(() => {
    const prompt = buildPrompt();
    onPromptGenerated(prompt);
  }, [emailPurpose, recipientRole, valueProposition, toneOfVoice, ctaStyle, followUpPlan, personalizationHooks, onPromptGenerated]);

  const availablePersonalizationHooks = [
    "Reference to company news",
    "Mention shared connection", 
    "Highlight industry stat",
    "Acknowledge recent challenge"
  ];

  const addPersonalizationHook = (hook: string) => {
    if (!personalizationHooks.includes(hook)) {
      setPersonalizationHooks([...personalizationHooks, hook]);
    }
  };

  const removePersonalizationHook = (hook: string) => {
    setPersonalizationHooks(personalizationHooks.filter(h => h !== hook));
  };

  const clearAll = () => {
    setEmailPurpose("");
    setRecipientRole("");
    setValueProposition("");
    setToneOfVoice("");
    setCtaStyle("");
    setFollowUpPlan("");
    setPersonalizationHooks([]);
  };

  return (
    <div className="space-y-6 w-full mobile-safe">
      {/* Email Purpose */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Email Purpose *</Label>
        <Select value={emailPurpose} onValueChange={setEmailPurpose}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose email purpose" />
          </SelectTrigger>
          <SelectContent>
            {salesEmailPromptOptions.emailPurposes.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Recipient Role */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Recipient Role</Label>
        <Select value={recipientRole} onValueChange={setRecipientRole}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose recipient role" />
          </SelectTrigger>
          <SelectContent>
            {salesEmailPromptOptions.recipientRoles.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Value Proposition - Free text */}
      <div className="space-y-2">
        <Label htmlFor="value-proposition" className="text-sm font-medium">
          Value Proposition *
        </Label>
        <Textarea
          id="value-proposition"
          placeholder="What are you offering/solving?"
          value={valueProposition}
          onChange={(e) => setValueProposition(e.target.value)}
          className="w-full min-h-[100px] bg-background"
        />
      </div>

      {/* Tone of Voice */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tone of Voice</Label>
        <Select value={toneOfVoice} onValueChange={setToneOfVoice}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose tone" />
          </SelectTrigger>
          <SelectContent>
            {salesEmailPromptOptions.toneOfVoice.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* CTA Style */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">CTA Style</Label>
        <Select value={ctaStyle} onValueChange={setCtaStyle}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose CTA style" />
          </SelectTrigger>
          <SelectContent>
            {salesEmailPromptOptions.ctaStyles.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Personalization Hooks */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Personalisation Hooks</Label>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          {availablePersonalizationHooks
            .filter(hook => !personalizationHooks.includes(hook))
            .map((hook) => (
              <Button
                key={hook}
                variant="outline"
                size="sm"
                onClick={() => addPersonalizationHook(hook)}
                className="justify-start text-xs"
              >
                + {hook}
              </Button>
            ))}
        </div>
        
        {/* Selected Personalization Hooks */}
        {personalizationHooks.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {personalizationHooks.map((hook) => (
                <Badge key={hook} variant="secondary" className="text-xs">
                  {hook}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePersonalizationHook(hook)}
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

      {/* Follow-up Plan */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Follow-up Plan</Label>
        <Select value={followUpPlan} onValueChange={setFollowUpPlan}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose follow-up plan" />
          </SelectTrigger>
          <SelectContent>
            {salesEmailPromptOptions.followUpPlans.map((option) => (
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
          disabled={!emailPurpose && !recipientRole && !valueProposition && !toneOfVoice && !ctaStyle && !followUpPlan && personalizationHooks.length === 0}
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