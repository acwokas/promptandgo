import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeInput } from "@/lib/inputValidation";

interface PostGoogleAuthFormProps {
  onComplete: () => void;
  userEmail: string;
  userName?: string;
}

const PostGoogleAuthForm = ({ onComplete, userEmail, userName }: PostGoogleAuthFormProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Optional context fields for better prompt personalization
  const [industry, setIndustry] = useState("");
  const [projectType, setProjectType] = useState("");
  const [preferredTone, setPreferredTone] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing",
    "Marketing & Advertising", "Real Estate", "Legal Services", "Consulting",
    "Media & Entertainment", "Non-profit", "Other"
  ];

  const projectTypes = [
    "Content Creation", "Marketing Campaigns", "Business Strategy", "Customer Support",
    "Product Development", "Research & Analysis", "Educational Content", "Creative Writing",
    "Technical Documentation", "Sales & Outreach", "Other"
  ];

  const tones = [
    "Professional", "Casual", "Friendly", "Authoritative", "Conversational",
    "Formal", "Creative", "Direct", "Empathetic", "Persuasive"
  ];

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Sanitize inputs
      const sanitizedIndustry = industry ? sanitizeInput(industry) : null;
      const sanitizedProjectType = projectType ? sanitizeInput(projectType) : null;
      const sanitizedPreferredTone = preferredTone ? sanitizeInput(preferredTone) : null;
      const sanitizedDesiredOutcome = desiredOutcome ? sanitizeInput(desiredOutcome) : null;
      
      // Check if any context fields are filled
      const hasContextFields = !!(industry || projectType || preferredTone || desiredOutcome);
      
      // Update user profile with the additional info
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          display_name: userName || userEmail?.split("@")[0] || "",
          industry: sanitizedIndustry,
          project_type: sanitizedProjectType,
          preferred_tone: sanitizedPreferredTone,
          desired_outcome: sanitizedDesiredOutcome,
          context_fields_completed: hasContextFields,
          context_popup_dismissed: true
        }, {
          onConflict: 'id'
        });

      if (profileError) throw profileError;

      // Send signup notification email
      try {
        await supabase.functions.invoke('send-signup-notification', {
          body: {
            user: {
              email: userEmail,
              name: userName,
              signupMethod: 'google',
              industry: sanitizedIndustry,
              projectType: sanitizedProjectType,
              preferredTone: sanitizedPreferredTone,
              desiredOutcome: sanitizedDesiredOutcome,
            }
          }
        });
      } catch (emailError) {
        console.error("Failed to send signup notification:", emailError);
        // Don't block the user flow if email fails
      }

      toast({
        title: "Profile updated!",
        description: "Your preferences have been saved.",
      });
      
      onComplete();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    try {
      // Send signup notification email without additional info
      try {
        await supabase.functions.invoke('send-signup-notification', {
          body: {
            user: {
              email: userEmail,
              name: userName,
              signupMethod: 'google',
            }
          }
        });
      } catch (emailError) {
        console.error("Failed to send signup notification:", emailError);
      }

      // Mark popup as dismissed
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            display_name: userName || userEmail?.split("@")[0] || "",
            context_popup_dismissed: true
          }, {
            onConflict: 'id'
          });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold">🎯 Personalize Your Experience</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Help us recommend better prompts for you (optional)
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-sm">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectType" className="text-sm">Main Use Case</Label>
              <Select value={projectType} onValueChange={setProjectType}>
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
              <Label htmlFor="preferredTone" className="text-sm">Preferred Tone</Label>
              <Select value={preferredTone} onValueChange={setPreferredTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your preferred tone" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {tones.map((tone) => (
                    <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desiredOutcome" className="text-sm">Desired Outcome</Label>
              <Input
                id="desiredOutcome"
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                placeholder="e.g., Increase engagement, Save time"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="flex-1"
            >
              Skip for now
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="flex-1"
            >
              {saving ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostGoogleAuthForm;