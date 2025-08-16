import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [projectType, setProjectType] = useState("");
  const [preferredTone, setPreferredTone] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, industry, project_type, preferred_tone, desired_outcome")
        .eq("id", user.id)
        .maybeSingle();
      if (data) {
        setDisplayName(data.display_name || "");
        setAvatarUrl(data.avatar_url || "");
        setIndustry(data.industry && data.industry !== "none" ? data.industry : "");
        setProjectType(data.project_type && data.project_type !== "none" ? data.project_type : "");
        setPreferredTone(data.preferred_tone && data.preferred_tone !== "none" ? data.preferred_tone : "");
        setDesiredOutcome(data.desired_outcome || "");
      }
    }
    load();
  }, [user?.id]);

  const onSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Check if context fields are filled to mark as completed (treat "none" as empty)
      const hasContextFields = Boolean(
        (industry && industry !== "none") || 
        (projectType && projectType !== "none") || 
        (preferredTone && preferredTone !== "none") || 
        desiredOutcome
      );
      
      const { error } = await supabase
        .from("profiles")
        .update({ 
          display_name: displayName || null, 
          avatar_url: avatarUrl || null,
          industry: (industry && industry !== "none") ? industry : null,
          project_type: (projectType && projectType !== "none") ? projectType : null,
          preferred_tone: (preferredTone && preferredTone !== "none") ? preferredTone : null,
          desired_outcome: desiredOutcome || null,
          context_fields_completed: hasContextFields
        })
        .eq("id", user.id);
      if (error) throw error;
      toast({ title: "Profile updated successfully!" });
    } catch (e: any) {
      toast({ title: "Update failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.email || "?").slice(0, 2).toUpperCase();

  return (
    <>
      <SEO title="My Account – Profile" description="Edit your display name and avatar for PromptAndGo." />
      <PageHero title={<>Profile</>} subtitle={<>Manage your personal details.</>} minHeightClass="min-h-[25vh]" />

      <main className="container py-8 max-w-3xl">
        <div className="rounded-xl border bg-card p-6 grid gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={avatarUrl} alt="User avatar" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm text-muted-foreground">Signed in as <span className="font-medium text-foreground">{user?.email}</span></div>
              <div className="text-xs text-muted-foreground mt-1">
                Your avatar is used in interactive AI toolkits and chat responses
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Alex" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">🎯 Context Preferences</h3>
              <p className="text-sm text-muted-foreground">Help us show you more relevant prompts by sharing these optional details.</p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="none">None selected</SelectItem>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="projectType">Main Use Case</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger>
                      <SelectValue placeholder="What do you mainly use AI for?" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="none">None selected</SelectItem>
                      {projectTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="preferredTone">Preferred Tone</Label>
                  <Select value={preferredTone} onValueChange={setPreferredTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred tone" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="none">None selected</SelectItem>
                      {tones.map((tone) => (
                        <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="desiredOutcome">Desired Outcome</Label>
                  <Input
                    id="desiredOutcome"
                    value={desiredOutcome}
                    onChange={(e) => setDesiredOutcome(e.target.value)}
                    placeholder="e.g., Increase engagement, Save time, Generate leads"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onSave} disabled={saving} variant="cta">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
