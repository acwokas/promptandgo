import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useCallback, useState } from 'react';
import { toast } from 'sonner';

interface AnalyticsThreshold {
  id: string;
  threshold_name: string;
  metric_type: string;
  comparison: string;
  threshold_value: number;
  time_window_minutes: number;
  is_active: boolean;
  notify_email: boolean;
  notify_browser: boolean;
  last_triggered_at: string | null;
}

interface AnalyticsNotification {
  id: string;
  threshold_id: string;
  metric_type: string;
  metric_value: number;
  threshold_value: number;
  message: string;
  notification_type: string;
  sent_at: string;
  acknowledged_at: string | null;
}

interface TriggeredThreshold {
  threshold_id: string;
  threshold_name: string;
  metric_type: string;
  current_value: number;
  threshold_value: number;
  is_triggered: boolean;
  message: string;
}

export const useAnalyticsAlerts = () => {
  const queryClient = useQueryClient();
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);

  // Check browser notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setBrowserNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Request browser notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast.error('Browser notifications not supported');
      return false;
    }

    const permission = await Notification.requestPermission();
    setBrowserNotificationsEnabled(permission === 'granted');
    
    if (permission === 'granted') {
      toast.success('Browser notifications enabled!');
      return true;
    } else {
      toast.error('Notification permission denied');
      return false;
    }
  }, []);

  // Send browser notification
  const sendBrowserNotification = useCallback((title: string, body: string, icon?: string) => {
    if (browserNotificationsEnabled && 'Notification' in window) {
      new Notification(title, {
        body,
        icon: icon || '/lovable-uploads/favicon.png',
        badge: '/lovable-uploads/favicon.png',
        tag: 'analytics-alert',
        requireInteraction: true,
      });
    }
  }, [browserNotificationsEnabled]);

  // Fetch thresholds
  const { data: thresholds, isLoading: thresholdsLoading } = useQuery({
    queryKey: ['analytics-thresholds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_thresholds')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as AnalyticsThreshold[];
    },
  });

  // Fetch unacknowledged notifications
  const { data: notifications, refetch: refetchNotifications } = useQuery({
    queryKey: ['analytics-notifications-unread'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_notifications')
        .select('*')
        .is('acknowledged_at', null)
        .order('sent_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as AnalyticsNotification[];
    },
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Check triggered thresholds
  const { data: triggeredThresholds, refetch: checkThresholds } = useQuery({
    queryKey: ['analytics-triggered-thresholds'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('check_analytics_thresholds');
      if (error) throw error;
      return (data || []) as TriggeredThreshold[];
    },
    refetchInterval: 60000, // Check every minute
  });

  // Show browser notifications for triggered thresholds
  useEffect(() => {
    if (triggeredThresholds && triggeredThresholds.length > 0 && browserNotificationsEnabled) {
      triggeredThresholds.forEach(threshold => {
        sendBrowserNotification(
          '📊 Analytics Alert',
          threshold.message
        );
      });
    }
  }, [triggeredThresholds, browserNotificationsEnabled, sendBrowserNotification]);

  // Create threshold
  const createThreshold = useMutation({
    mutationFn: async (threshold: Omit<AnalyticsThreshold, 'id' | 'last_triggered_at'>) => {
      const { data, error } = await supabase
        .from('analytics_thresholds')
        .insert(threshold)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics-thresholds'] });
      toast.success('Alert threshold created');
    },
    onError: (error) => {
      toast.error('Failed to create threshold: ' + error.message);
    },
  });

  // Update threshold
  const updateThreshold = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AnalyticsThreshold> & { id: string }) => {
      const { data, error } = await supabase
        .from('analytics_thresholds')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics-thresholds'] });
      toast.success('Alert threshold updated');
    },
    onError: (error) => {
      toast.error('Failed to update threshold: ' + error.message);
    },
  });

  // Delete threshold
  const deleteThreshold = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('analytics_thresholds')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics-thresholds'] });
      toast.success('Alert threshold deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete threshold: ' + error.message);
    },
  });

  // Acknowledge notification
  const acknowledgeNotification = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('analytics_notifications')
        .update({ 
          acknowledged_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics-notifications-unread'] });
    },
  });

  // Acknowledge all notifications
  const acknowledgeAllNotifications = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('analytics_notifications')
        .update({ acknowledged_at: new Date().toISOString() })
        .is('acknowledged_at', null);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics-notifications-unread'] });
      toast.success('All notifications acknowledged');
    },
  });

  return {
    thresholds,
    thresholdsLoading,
    notifications,
    triggeredThresholds,
    unreadCount: notifications?.length || 0,
    browserNotificationsEnabled,
    requestNotificationPermission,
    sendBrowserNotification,
    createThreshold,
    updateThreshold,
    deleteThreshold,
    acknowledgeNotification,
    acknowledgeAllNotifications,
    checkThresholds,
    refetchNotifications,
  };
};

export default useAnalyticsAlerts;
