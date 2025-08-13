import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MessageCircle, HelpCircle, Save } from "lucide-react";

interface WidgetSetting {
  id: string;
  setting_key: string;
  setting_value: boolean;
  description: string | null;
}

const AdminWidgetSettings = () => {
  const { loading: authLoading } = useSupabaseAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<WidgetSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Wait for both auth and admin checks to complete
  if (authLoading || adminLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("widget_settings")
        .select("*")
        .order("setting_key");

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error("Error loading settings:", error);
      toast({
        title: "Error",
        description: "Failed to load widget settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (settingKey: string, value: boolean) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("widget_settings")
        .update({ 
          setting_value: value,
          updated_at: new Date().toISOString()
        })
        .eq("setting_key", settingKey);

      if (error) throw error;

      setSettings(prev => 
        prev.map(setting => 
          setting.setting_key === settingKey 
            ? { ...setting, setting_value: value }
            : setting
        )
      );

      toast({
        title: "Settings updated",
        description: "Widget settings have been saved successfully"
      });

    } catch (error) {
      console.error("Error updating setting:", error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getSettingIcon = (key: string) => {
    switch (key) {
      case "feedback_widget_enabled":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "context_popup_enabled":
        return <HelpCircle className="h-5 w-5 text-green-500" />;
      default:
        return <MessageCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSettingTitle = (key: string) => {
    switch (key) {
      case "feedback_widget_enabled":
        return "Feedback Widget";
      case "context_popup_enabled":
        return "Context Popup";
      default:
        return key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getSettingDescription = (key: string, description: string | null) => {
    if (description) return description;
    
    switch (key) {
      case "feedback_widget_enabled":
        return "Show/hide the feedback widget that appears on all pages for users to submit feedback, bug reports, and suggestions.";
      case "context_popup_enabled":
        return "Show/hide the context popup that helps new users personalize their experience.";
      default:
        return "Control the visibility of this widget.";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHero title="Widget Settings" subtitle="Loading..." variant="admin" />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading widget settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Widget Settings - Admin"
        description="Manage widget visibility and settings"
      />
      
      <PageHero
        title="Widget Settings"
        subtitle="Control widget visibility and behavior"
        variant="admin"
      />

      <div className="container mx-auto px-4 py-12">
        <AdminBreadcrumb
          items={[
            { label: "Admin Tools", href: "/admin" },
            { label: "Widget Settings" }
          ]}
        />

        <div className="max-w-4xl mx-auto mt-8">
          <div className="grid gap-6">
            {settings.map((setting) => (
              <Card key={setting.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getSettingIcon(setting.setting_key)}
                      <div>
                        <CardTitle>{getSettingTitle(setting.setting_key)}</CardTitle>
                        <CardDescription className="mt-1">
                          {getSettingDescription(setting.setting_key, setting.description)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={setting.setting_key} className="text-sm font-medium">
                        {setting.setting_value ? "Enabled" : "Disabled"}
                      </Label>
                      <Switch
                        id={setting.setting_key}
                        checked={setting.setting_value}
                        onCheckedChange={(checked) => updateSetting(setting.setting_key, checked)}
                        disabled={saving}
                      />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {settings.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No widget settings found.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWidgetSettings;