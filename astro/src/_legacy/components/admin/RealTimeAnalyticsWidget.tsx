import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Eye, 
  Activity, 
  Globe,
  Smartphone,
  Monitor,
  ArrowUpRight,
  Clock,
  MousePointer,
  Bell,
  BellRing
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAnalyticsAlerts } from '@/hooks/useAnalyticsAlerts';

interface LiveSession {
  id: string;
  entry_page: string;
  device_type: string;
  browser: string;
  country: string;
  pages_viewed: number;
  session_start: string;
}

interface RecentEvent {
  id: string;
  event_type: string;
  event_name: string;
  page_path: string;
  created_at: string;
  device_type: string;
}

interface ActivePage {
  page_path: string;
  count: number;
}

const RealTimeAnalyticsWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { unreadCount, triggeredThresholds } = useAnalyticsAlerts();

  // Update time every second for "time ago" displays
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch active sessions (last 30 minutes)
  const { data: activeSessions } = useQuery({
    queryKey: ['realtime-active-sessions'],
    queryFn: async () => {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from('analytics_sessions')
        .select('id, entry_page, device_type, browser, country, pages_viewed, session_start')
        .gte('session_start', thirtyMinutesAgo)
        .order('session_start', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return (data || []) as LiveSession[];
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch recent events (last 5 minutes)
  const { data: recentEvents } = useQuery({
    queryKey: ['realtime-recent-events'],
    queryFn: async () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from('site_analytics_events')
        .select('id, event_type, event_name, page_path, created_at, device_type')
        .gte('created_at', fiveMinutesAgo)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return (data || []) as RecentEvent[];
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Calculate active pages from sessions
  const activePages: ActivePage[] = React.useMemo(() => {
    if (!activeSessions) return [];
    
    const pageCounts: Record<string, number> = {};
    activeSessions.forEach(session => {
      const page = session.entry_page || '/';
      pageCounts[page] = (pageCounts[page] || 0) + 1;
    });
    
    return Object.entries(pageCounts)
      .map(([page_path, count]) => ({ page_path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [activeSessions]);

  // Device breakdown
  const deviceBreakdown = React.useMemo(() => {
    if (!activeSessions) return { desktop: 0, mobile: 0, tablet: 0 };
    
    return activeSessions.reduce((acc, session) => {
      const device = session.device_type || 'desktop';
      acc[device as keyof typeof acc] = (acc[device as keyof typeof acc] || 0) + 1;
      return acc;
    }, { desktop: 0, mobile: 0, tablet: 0 });
  }, [activeSessions]);

  const liveVisitorCount = activeSessions?.length || 0;

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'page_view': return <Eye className="h-3 w-3" />;
      case 'click': return <MousePointer className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'page_view': return 'bg-blue-500/10 text-blue-500';
      case 'click': return 'bg-green-500/10 text-green-500';
      case 'conversion': return 'bg-purple-500/10 text-purple-500';
      case 'form': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="col-span-full lg:col-span-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="h-6 w-6 text-primary" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
            <div>
              <CardTitle className="text-lg">Real-Time Analytics</CardTitle>
              <CardDescription>Live visitor activity</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                <BellRing className="h-3 w-3 mr-1" />
                {unreadCount} alerts
              </Badge>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/analytics">
                View Full Dashboard
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Live Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{liveVisitorCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Active Now</p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{deviceBreakdown.desktop}</span>
            </div>
            <p className="text-xs text-muted-foreground">Desktop</p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{deviceBreakdown.mobile}</span>
            </div>
            <p className="text-xs text-muted-foreground">Mobile</p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{recentEvents?.length || 0}</span>
            </div>
            <p className="text-xs text-muted-foreground">Events (5m)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Pages */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Active Pages
            </h4>
            <div className="space-y-2">
              {activePages.length > 0 ? (
                activePages.map((page, index) => (
                  <div key={page.page_path} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <span className="text-sm truncate flex-1 mr-2">{page.page_path}</span>
                    <Badge variant="secondary" className="shrink-0">
                      {page.count} {page.count === 1 ? 'visitor' : 'visitors'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No active pages</p>
              )}
            </div>
          </div>

          {/* Recent Events */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Events
            </h4>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {recentEvents && recentEvents.length > 0 ? (
                recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded-md text-sm">
                    <span className={`p-1 rounded ${getEventColor(event.event_type)}`}>
                      {getEventIcon(event.event_type)}
                    </span>
                    <span className="flex-1 truncate">{event.event_name}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(event.created_at), { addSuffix: false })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No recent events</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeAnalyticsWidget;
