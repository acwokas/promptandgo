import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AI_PROVIDERS } from '@/lib/promptRewriter';
import { useAIPreferences } from '@/hooks/useAIPreferences';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const AIPreferencesSelector: React.FC = () => {
  const { preferences, updatePreference, loading, isLoggedIn } = useAIPreferences();

  if (!isLoggedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Provider Preferences</CardTitle>
          <CardDescription>
            Sign in to customise which AI providers appear in your prompt rewriter dropdown.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const textProviders = AI_PROVIDERS.filter(p => p.category === 'text');
  const imageProviders = AI_PROVIDERS.filter(p => p.category === 'image');

  const isProviderEnabled = (providerId: string) => {
    const pref = preferences.find(p => p.provider_id === providerId);
    return pref ? pref.is_enabled : false;
  };

  const handleToggle = (providerId: string, enabled: boolean) => {
    updatePreference(providerId, enabled);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Provider Preferences</CardTitle>
          <CardDescription>Loading your preferences...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Provider Preferences</CardTitle>
        <CardDescription>
          Choose which AI providers appear in your prompt rewriter dropdown. Only selected providers will be shown.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3">Text Generation</h4>
          <div className="space-y-3">
            {textProviders.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{provider.icon}</span>
                  <div>
                    <Label htmlFor={provider.id} className="text-sm font-medium">
                      {provider.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {provider.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={provider.id}
                  checked={isProviderEnabled(provider.id)}
                  onCheckedChange={(checked) => handleToggle(provider.id, checked)}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium mb-3">Image Generation</h4>
          <div className="space-y-3">
            {imageProviders.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{provider.icon}</span>
                  <div>
                    <Label htmlFor={provider.id} className="text-sm font-medium">
                      {provider.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {provider.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={provider.id}
                  checked={isProviderEnabled(provider.id)}
                  onCheckedChange={(checked) => handleToggle(provider.id, checked)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};