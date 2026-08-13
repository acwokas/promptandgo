import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Clock, Save, Eye, EyeOff } from "lucide-react";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import CountdownTimer from "@/components/conversion/CountdownTimer";

interface CountdownSettings {
  id: string;
  enabled: boolean;
  offer_text: string;
  expiry_hours: number;
}

const AdminCountdownSettings = () => {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<CountdownSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Redirect non-admins
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
      toast({
        title: "Access denied",
        description: "You must be an admin to access this page.",
        variant: "destructive"
      });
    }
  }, [isAdmin, adminLoading, navigate, toast]);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('countdown_settings')
          .select('*')
          .single();

        if (error) {
          console.error('Error loading countdown settings:', error);
          toast({
            title: "Error loading settings",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        if (data) {
          setSettings(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin && !adminLoading) {
      loadSettings();
    }
  }, [isAdmin, adminLoading, toast]);

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('countdown_settings')
        .update({
          enabled: settings.enabled,
          offer_text: settings.offer_text,
          expiry_hours: settings.expiry_hours
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Countdown timer settings have been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAdmin || !settings) {
    return null;
  }

  return (
    <>
      <SEO 
        title="Admin - Countdown Timer Settings" 
        description="Manage countdown timer settings for promotional campaigns."
      />
      
      <PageHero 
        title="Countdown Timer Settings" 
        subtitle="Control promotional countdown timer display and configuration"
        variant="admin"
        minHeightClass="min-h-[25svh]"
      />

      <main className="container py-8 max-w-4xl">
        <AdminBreadcrumb 
          items={[
            { label: "Admin Tools", href: "/admin" },
            { label: "Countdown Settings" }
          ]}
        />

        <div className="space-y-6">
          {/* Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timer Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Countdown Timer</Label>
                  <div className="text-sm text-muted-foreground">
                    Show the countdown timer on the homepage
                  </div>
                </div>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={(enabled) => 
                    setSettings(prev => prev ? { ...prev, enabled } : null)
                  }
                />
              </div>

              {/* Offer Text */}
              <div className="space-y-2">
                <Label htmlFor="offer-text">Offer Text</Label>
                <Textarea
                  id="offer-text"
                  value={settings.offer_text}
                  onChange={(e) => 
                    setSettings(prev => prev ? { ...prev, offer_text: e.target.value } : null)
                  }
                  placeholder="Enter your promotional offer text..."
                  className="min-h-[80px]"
                />
                <div className="text-sm text-muted-foreground">
                  This text will appear in the countdown banner. Use emojis and compelling copy!
                </div>
              </div>

              {/* Expiry Hours */}
              <div className="space-y-2">
                <Label htmlFor="expiry-hours">Timer Duration (Hours)</Label>
                <Input
                  id="expiry-hours"
                  type="number"
                  min="1"
                  max="168"
                  value={settings.expiry_hours}
                  onChange={(e) => 
                    setSettings(prev => prev ? { 
                      ...prev, 
                      expiry_hours: parseInt(e.target.value) || 24 
                    } : null)
                  }
                />
                <div className="text-sm text-muted-foreground">
                  How many hours the countdown should run (1-168 hours, max 7 days)
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-4 pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Settings"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Show Preview
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {settings.enabled ? (
                  <CountdownTimer
                    variant="banner"
                    offer={settings.offer_text}
                    expiryHours={settings.expiry_hours}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    Countdown timer is currently disabled
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminCountdownSettings;