import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { Settings, User, Bell, Shield, Palette, Globe, Monitor, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const TABS = ["Profile", "Preferences", "Notifications", "Account"] as const;
type Tab = typeof TABS[number];

const TAB_ICONS: Record<Tab, typeof User> = { Profile: User, Preferences: Palette, Notifications: Bell, Account: Shield };

const COUNTRIES = ["Japan", "China", "South Korea", "India", "Thailand", "Vietnam", "Indonesia", "Malaysia", "Singapore", "Philippines", "Taiwan", "Hong Kong"];
const LANGUAGES = ["English", "Japanese", "Mandarin", "Korean", "Hindi", "Thai", "Vietnamese", "Bahasa Indonesia", "Bahasa Malay"];
const PLATFORMS = ["ChatGPT", "Claude", "Gemini", "Copilot", "Perplexity", "DeepSeek", "Qwen", "Meta AI", "Ernie Bot", "Grok"];

interface UserSettings {
  displayName: string;
  bio: string;
  location: string;
  profilePublic: boolean;
  defaultLanguage: string;
  preferredPlatforms: string[];
  contentDensity: "compact" | "comfortable" | "spacious";
  autoTranslate: boolean;
  showTypingAnimation: boolean;
  emailDigest: "daily" | "weekly" | "monthly" | "never";
  notifyFeatures: boolean;
  notifyContent: boolean;
  notifyCommunity: boolean;
  notifyTips: boolean;
  notifySecurity: boolean;
  notifyFeaturesEmail: boolean;
  notifyContentEmail: boolean;
  notifyCommunityEmail: boolean;
  notifyTipsEmail: boolean;
  notifySecurityEmail: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  displayName: "Asian Guest",
  bio: "",
  location: "Singapore",
  profilePublic: true,
  defaultLanguage: "English",
  preferredPlatforms: ["ChatGPT", "Claude"],
  contentDensity: "comfortable",
  autoTranslate: true,
  showTypingAnimation: true,
  emailDigest: "weekly",
  notifyFeatures: true,
  notifyContent: true,
  notifyCommunity: false,
  notifyTips: true,
  notifySecurity: true,
  notifyFeaturesEmail: true,
  notifyContentEmail: false,
  notifyCommunityEmail: false,
  notifyTipsEmail: false,
  notifySecurityEmail: true,
};

const loadSettings = (): UserSettings => {
  try {
    const saved = localStorage.getItem("pag_user_settings");
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
};

const SettingsPage = () => {
  const [tab, setTab] = useState<Tab>("Profile");
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const update = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const togglePlatform = (p: string) => {
    setSettings(prev => ({
      ...prev,
      preferredPlatforms: prev.preferredPlatforms.includes(p)
        ? prev.preferredPlatforms.filter(x => x !== p)
        : [...prev.preferredPlatforms, p],
    }));
  };

  const handleSave = () => {
    try { localStorage.setItem("pag_user_settings", JSON.stringify(settings)); } catch { /* noop */ }
    setLastSaved("Just now");
    toast.success("Settings saved successfully!");
  };

  const initials = settings.displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <Helmet>
        <title>Settings | PromptAndGo</title>
        <meta name="description" content="Manage your PromptAndGo profile, preferences, and account settings." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-b from-card to-background border-b border-border/50 py-10 md:py-14">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl md:text-2xl font-bold shrink-0">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Your PromptAndGo Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">{settings.displayName} · {settings.location}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="container max-w-4xl mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex gap-1 mb-8 overflow-x-auto pb-2" role="tablist">
            {TABS.map(t => {
              const Icon = TAB_ICONS[t];
              return (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {t}
                </button>
              );
            })}
          </div>

          {/* Profile Tab */}
          {tab === "Profile" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input id="displayName" value={settings.displayName} onChange={e => update("displayName", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value="user@gmail.com" disabled className="mt-1.5 opacity-60" />
                  <p className="text-xs text-muted-foreground mt-1">Connected via Google</p>
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio <span className="text-muted-foreground font-normal">({settings.bio.length}/200)</span></Label>
                <Textarea id="bio" value={settings.bio} onChange={e => { if (e.target.value.length <= 200) update("bio", e.target.value); }} className="mt-1.5" rows={3} placeholder="Tell us about yourself..." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <select id="location" value={settings.location} onChange={e => update("location", e.target.value)} className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2">
                  <Label>Profile Visibility</Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Switch checked={settings.profilePublic} onCheckedChange={v => update("profilePublic", v)} />
                    <span className="text-sm text-muted-foreground">{settings.profilePublic ? "Public" : "Private"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {tab === "Preferences" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="defaultLang">Default Language</Label>
                <select id="defaultLang" value={settings.defaultLanguage} onChange={e => update("defaultLanguage", e.target.value)} className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <Label>Preferred AI Platforms</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {PLATFORMS.map(p => (
                    <label key={p} className="flex items-center gap-2 text-sm cursor-pointer text-muted-foreground hover:text-foreground">
                      <input type="checkbox" checked={settings.preferredPlatforms.includes(p)} onChange={() => togglePlatform(p)} className="rounded border-border text-primary" />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Theme</Label>
                <div className="flex gap-2 mt-2">
                  {(["Dark", "Light", "Auto"] as const).map(t => (
                    <button key={t} disabled={t !== "Dark"} className={`px-4 py-2 rounded-lg text-sm border transition-colors ${t === "Dark" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground opacity-50 cursor-not-allowed"}`}>
                      {t} {t === "Light" && <span className="text-[10px]">(soon)</span>}
                    </button>
                  ))}
                </div>
              </div>
              <fieldset>
                <legend className="text-sm font-medium mb-2">Content Density</legend>
                <div className="flex gap-2">
                  {(["compact", "comfortable", "spacious"] as const).map(d => (
                    <label key={d} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="density" checked={settings.contentDensity === d} onChange={() => update("contentDensity", d)} className="text-primary" />
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Auto-translate prompts</Label>
                  <Switch checked={settings.autoTranslate} onCheckedChange={v => update("autoTranslate", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show typing animation</Label>
                  <Switch checked={settings.showTypingAnimation} onCheckedChange={v => update("showTypingAnimation", v)} />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {tab === "Notifications" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="emailDigest">Email Digest Frequency</Label>
                <select id="emailDigest" value={settings.emailDigest} onChange={e => update("emailDigest", e.target.value as UserSettings["emailDigest"])} className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="never">Never</option>
                </select>
              </div>
              <div>
                <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground mb-2">
                  <span>Category</span><span className="text-center">In-App</span><span className="text-center">Email</span>
                </div>
                {([
                  { label: "New Features", app: "notifyFeatures", email: "notifyFeaturesEmail" },
                  { label: "Content Updates", app: "notifyContent", email: "notifyContentEmail" },
                  { label: "Community Activity", app: "notifyCommunity", email: "notifyCommunityEmail" },
                  { label: "Tips & Tricks", app: "notifyTips", email: "notifyTipsEmail" },
                  { label: "Security Alerts", app: "notifySecurity", email: "notifySecurityEmail" },
                ] as const).map(row => (
                  <div key={row.label} className="grid grid-cols-3 gap-2 items-center py-2 border-b border-border last:border-0">
                    <span className="text-sm text-foreground">{row.label}</span>
                    <div className="flex justify-center"><Switch checked={settings[row.app]} onCheckedChange={v => update(row.app, v)} /></div>
                    <div className="flex justify-center"><Switch checked={settings[row.email]} onCheckedChange={v => update(row.email, v)} /></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Account Tab */}
          {tab === "Account" && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-3">Connected Accounts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="text-lg">🔗</span><span className="text-sm">Google</span></div>
                    <span className="text-xs text-green-500 font-medium">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="text-lg">🐙</span><span className="text-sm">GitHub</span></div>
                    <Button variant="outline" size="sm" onClick={() => toast("GitHub connection coming soon!")}>Connect</Button>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-xl border-2 border-destructive/30 bg-destructive/5">
                <h3 className="font-semibold text-destructive mb-1">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">These actions are irreversible.</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => toast("Export feature coming soon!")}>Export Data</Button>
                  <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>Delete Account</Button>
                </div>
              </div>
            </div>
          )}

          {/* Save bar */}
          <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border mt-8 -mx-4 px-4 py-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{lastSaved ? `Last saved: ${lastSaved}` : ""}</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSettings(loadSettings())}>Cancel</Button>
              <Button onClick={handleSave} className="flex items-center gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
            </div>
          </div>
        </div>

        {/* Delete confirmation modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
            <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-foreground mb-2">Delete Account?</h3>
              <p className="text-sm text-muted-foreground mb-4">This will permanently delete your account and all associated data. This action cannot be undone.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <Button variant="destructive" onClick={() => { setShowDeleteModal(false); toast.error("Account deletion is not available in demo mode."); }}>Delete</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SettingsPage;
