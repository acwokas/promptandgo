import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Bell, 
  BellRing, 
  Plus, 
  Trash2, 
  Mail, 
  Monitor,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Users,
  Target
} from 'lucide-react';
import { useAnalyticsAlerts } from '@/hooks/useAnalyticsAlerts';

const metricOptions = [
  { value: 'sessions', label: 'Sessions', icon: Users },
  { value: 'conversions', label: 'Conversions', icon: Target },
  { value: 'page_views', label: 'Page Views', icon: Eye },
  { value: 'events', label: 'Events', icon: Activity },
];

const comparisonOptions = [
  { value: 'greater_than', label: 'Greater than', icon: TrendingUp },
  { value: 'less_than', label: 'Less than', icon: TrendingDown },
];

const timeWindowOptions = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 180, label: '3 hours' },
  { value: 360, label: '6 hours' },
  { value: 720, label: '12 hours' },
  { value: 1440, label: '24 hours' },
];

const AnalyticsAlertSettings = () => {
  const {
    thresholds,
    thresholdsLoading,
    notifications,
    unreadCount,
    browserNotificationsEnabled,
    requestNotificationPermission,
    createThreshold,
    updateThreshold,
    deleteThreshold,
    acknowledgeNotification,
    acknowledgeAllNotifications,
  } = useAnalyticsAlerts();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newThreshold, setNewThreshold] = useState({
    threshold_name: '',
    metric_type: 'sessions',
    comparison: 'greater_than',
    threshold_value: 50,
    time_window_minutes: 60,
    is_active: true,
    notify_email: true,
    notify_browser: true,
  });

  const handleCreate = () => {
    createThreshold.mutate(newThreshold);
    setIsCreateOpen(false);
    setNewThreshold({
      threshold_name: '',
      metric_type: 'sessions',
      comparison: 'greater_than',
      threshold_value: 50,
      time_window_minutes: 60,
      is_active: true,
      notify_email: true,
      notify_browser: true,
    });
  };

  const handleToggleActive = (id: string, currentValue: boolean) => {
    updateThreshold.mutate({ id, is_active: !currentValue });
  };

  const getMetricIcon = (metricType: string) => {
    const metric = metricOptions.find(m => m.value === metricType);
    return metric?.icon || Activity;
  };

  return (
    <div className="space-y-6">
      {/* Header with notification status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Analytics Alerts
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure thresholds to receive notifications for important metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Browser notification toggle */}
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg">
            <Monitor className="h-4 w-4" />
            <span className="text-sm">Browser Notifications</span>
            {browserNotificationsEnabled ? (
              <Badge variant="default" className="bg-green-500">Enabled</Badge>
            ) : (
              <Button variant="outline" size="sm" onClick={requestNotificationPermission}>
                Enable
              </Button>
            )}
          </div>

          {/* Unread notifications badge */}
          {unreadCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unreadCount} unread
            </Badge>
          )}

          {/* Create new threshold */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Alert Threshold</DialogTitle>
                <DialogDescription>
                  Set up a new alert to notify you when metrics reach certain thresholds
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Alert Name</Label>
                  <Input
                    placeholder="e.g., Traffic Spike Alert"
                    value={newThreshold.threshold_name}
                    onChange={(e) => setNewThreshold({ ...newThreshold, threshold_name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Metric</Label>
                    <Select
                      value={newThreshold.metric_type}
                      onValueChange={(value) => setNewThreshold({ ...newThreshold, metric_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {metricOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select
                      value={newThreshold.comparison}
                      onValueChange={(value) => setNewThreshold({ ...newThreshold, comparison: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {comparisonOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Threshold Value</Label>
                    <Input
                      type="number"
                      min={1}
                      value={newThreshold.threshold_value}
                      onChange={(e) => setNewThreshold({ ...newThreshold, threshold_value: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Time Window</Label>
                    <Select
                      value={newThreshold.time_window_minutes.toString()}
                      onValueChange={(value) => setNewThreshold({ ...newThreshold, time_window_minutes: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeWindowOptions.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newThreshold.notify_browser}
                        onCheckedChange={(checked) => setNewThreshold({ ...newThreshold, notify_browser: checked })}
                      />
                      <Label className="flex items-center gap-1">
                        <Monitor className="h-3 w-3" /> Browser
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newThreshold.notify_email}
                        onCheckedChange={(checked) => setNewThreshold({ ...newThreshold, notify_email: checked })}
                      />
                      <Label className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> Email
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!newThreshold.threshold_name}>
                  Create Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Thresholds</CardTitle>
          <CardDescription>Manage your analytics alert configurations</CardDescription>
        </CardHeader>
        <CardContent>
          {thresholdsLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : thresholds && thresholds.length > 0 ? (
            <div className="space-y-3">
              {thresholds.map((threshold) => {
                const MetricIcon = getMetricIcon(threshold.metric_type);
                const timeWindow = timeWindowOptions.find(t => t.value === threshold.time_window_minutes);
                
                return (
                  <div 
                    key={threshold.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      threshold.is_active ? 'bg-card' : 'bg-muted/30 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${threshold.is_active ? 'bg-primary/10' : 'bg-muted'}`}>
                        <MetricIcon className={`h-5 w-5 ${threshold.is_active ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-medium">{threshold.threshold_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {threshold.comparison === 'greater_than' ? '>' : '<'} {threshold.threshold_value} {threshold.metric_type} in {timeWindow?.label || `${threshold.time_window_minutes}m`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {threshold.notify_browser && <Monitor className="h-4 w-4 text-muted-foreground" />}
                        {threshold.notify_email && <Mail className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      
                      <Switch
                        checked={threshold.is_active}
                        onCheckedChange={() => handleToggleActive(threshold.id, threshold.is_active)}
                      />
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteThreshold.mutate(threshold.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No alert thresholds configured</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Alert
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      {notifications && notifications.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Unacknowledged analytics alerts</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => acknowledgeAllNotifications.mutate()}>
              Acknowledge All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <BellRing className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.sent_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => acknowledgeNotification.mutate(notification.id)}
                  >
                    Dismiss
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsAlertSettings;
