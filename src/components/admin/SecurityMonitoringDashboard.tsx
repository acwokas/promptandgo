import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Key, Activity, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminAccessPattern {
  user_id: string;
  action_count: number;
  last_action: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface ApiKeyStatus {
  service_name: string;
  last_rotation: string;
  days_since_rotation: number;
  rotation_recommended: boolean;
}

export default function SecurityMonitoringDashboard() {
  const [adminActivity, setAdminActivity] = useState<AdminAccessPattern[]>([]);
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      // Load admin activity patterns
      const { data: activityData, error: activityError } = await supabase.functions.invoke(
        'security-monitoring',
        {
          body: { action: 'detect_admin_access' }
        }
      );

      if (activityError) {
        console.error('Activity error:', activityError);
      } else if (activityData?.success) {
        setAdminActivity(activityData.data || []);
      }

      // Load API key rotation status
      const { data: keyData, error: keyError } = await supabase.functions.invoke(
        'security-monitoring',
        {
          body: { action: 'check_api_rotation' }
        }
      );

      if (keyError) {
        console.error('API key error:', keyError);
      } else if (keyData?.success) {
        setApiKeyStatus(keyData.data || []);
      }

    } catch (error) {
      console.error('Error loading security data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load security monitoring data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const logSecurityEvent = async (eventType: string, severity: string, description: string) => {
    try {
      await supabase.functions.invoke('security-monitoring', {
        body: {
          action: 'log_security_event',
          eventType,
          severity,
          description,
          metadata: { timestamp: new Date().toISOString() }
        }
      });
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  };

  useEffect(() => {
    loadSecurityData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadSecurityData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'outline';
      case 'LOW': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Monitoring</h2>
          <p className="text-muted-foreground">Monitor admin activity and security status</p>
        </div>
        <Button 
          onClick={loadSecurityData} 
          disabled={loading}
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Admin Activity Monitoring */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">Admin Activity Patterns</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Unusual admin access patterns in the last hour
            </CardDescription>
            {adminActivity.length === 0 ? (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-500" />
                <span>No unusual activity detected</span>
              </div>
            ) : (
              <div className="space-y-3">
                {adminActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        User ID: {activity.user_id.slice(0, 8)}...
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.action_count} actions • Last: {new Date(activity.last_action).toLocaleString()}
                      </div>
                    </div>
                    <Badge variant={getRiskBadgeVariant(activity.risk_level)}>
                      {activity.risk_level}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Key Rotation Status */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">API Key Rotation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              API key age and rotation recommendations
            </CardDescription>
            <div className="space-y-3">
              {apiKeyStatus.map((key, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{key.service_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {key.days_since_rotation} days since rotation
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {key.rotation_recommended && (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                    <Badge variant={key.rotation_recommended ? 'outline' : 'secondary'}>
                      {key.rotation_recommended ? 'Rotate Soon' : 'Current'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Actions</span>
          </CardTitle>
          <CardDescription>
            Quick security actions and monitoring tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              variant="outline"
              onClick={() => logSecurityEvent('MANUAL_SECURITY_CHECK', 'INFO', 'Manual security dashboard review')}
              className="h-auto p-4 flex-col items-start"
            >
              <Activity className="h-5 w-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Log Security Check</div>
                <div className="text-xs text-muted-foreground">Record manual review</div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://supabase.com/dashboard/project/mncxspmtqvqgvtrxbxzb/auth/providers', '_blank')}
              className="h-auto p-4 flex-col items-start"
            >
              <Shield className="h-5 w-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Auth Settings</div>
                <div className="text-xs text-muted-foreground">Manage authentication</div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://supabase.com/dashboard/project/mncxspmtqvqgvtrxbxzb/settings/functions', '_blank')}
              className="h-auto p-4 flex-col items-start"
            >
              <Key className="h-5 w-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Manage Secrets</div>
                <div className="text-xs text-muted-foreground">Update API keys</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}