import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface ContextPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDismissPermanently: () => void;
  onComplete: () => void;
}

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Marketing & Advertising",
  "Real Estate",
  "Legal Services",
  "Consulting",
  "Media & Entertainment",
  "Non-profit",
  "Other"
];

const projectTypes = [
  "Content Creation",
  "Marketing Campaigns",
  "Business Strategy",
  "Customer Support",
  "Product Development",
  "Research & Analysis",
  "Educational Content",
  "Creative Writing",
  "Technical Documentation",
  "Sales & Outreach",
  "Other"
];

const tones = [
  "Professional",
  "Casual",
  "Friendly",
  "Authoritative",
  "Conversational",
  "Formal",
  "Creative",
  "Direct",
  "Empathetic",
  "Persuasive"
];

const ContextPopup = ({ isOpen, onClose, onDismissPermanently, onComplete }: ContextPopupProps) => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    industry: "",
    project_type: "",
    preferred_tone: "",
    desired_outcome: ""
  });

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          industry: formData.industry || null,
          project_type: formData.project_type || null,
          preferred_tone: formData.preferred_tone || null,
          desired_outcome: formData.desired_outcome || null,
          context_fields_completed: true
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your preferences will help us show more relevant prompts."
      });
      
      onComplete();
    } catch (error: any) {
      toast({
        title: "Failed to save",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>🎯 Get Better Prompts</DialogTitle>
          <DialogDescription className="mt-2">
            Help us personalize your experience with a few optional details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry (Optional)</Label>
            <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_type">Project Type (Optional)</Label>
            <Select value={formData.project_type} onValueChange={(value) => setFormData(prev => ({ ...prev, project_type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="What do you mainly use AI for?" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {projectTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_tone">Preferred Tone (Optional)</Label>
            <Select value={formData.preferred_tone} onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_tone: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="What tone do you prefer?" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {tones.map((tone) => (
                  <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desired_outcome">Desired Outcome (Optional)</Label>
            <Input
              id="desired_outcome"
              value={formData.desired_outcome}
              onChange={(e) => setFormData(prev => ({ ...prev, desired_outcome: e.target.value }))}
              placeholder="e.g., Increase engagement, Save time, Generate leads"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              onClick={handleSkip}
              className="flex-1 text-sm"
            >
              Skip for now
            </Button>
            <Button 
              variant="ghost" 
              onClick={onDismissPermanently}
              className="flex-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Don't ask again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContextPopup;