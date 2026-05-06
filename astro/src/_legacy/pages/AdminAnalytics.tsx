import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  MousePointer,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Target,
  Bell
} from 'lucide-react';
import { format, subDays, subHours, startOfDay, endOfDay } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import SEO from '@/components/SEO';
import Header from '@/components/layout/Header';
import AnalyticsAlertSettings from '@/components/admin/AnalyticsAlertSettings';
import { useAnalyticsAlerts } from '@/hooks/useAnalyticsAlerts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#22c55e', '#f59e0b', '#ef4444'];

const timeRanges = [
  { value: '24h', label: 'Last 24 Hours', days: 1 },
  { value: '7d', label: 'Last 7 Days', days: 7 },
  { value: '30d', label: 'Last 30 Days', days: 30 },
  { value: '90d', label: 'Last 90 Days', days: 90 },
];

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const selectedRange = timeRanges.find(r => r.value === timeRange) || timeRanges[1];
  
  const startDate = startOfDay(subDays(new Date(), selectedRange.days));
  const endDate = endOfDay(new Date());

  // Fetch analytics summary
  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ['analytics-summary', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_analytics_summary', {
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      });
      if (error) throw error;
      return data?.[0] || {
        total_sessions: 0,
        total_page_views: 0,
        total_events: 0,
        unique_visitors: 0,
        avg_session_duration: 0,
        bounce_rate: 0,
        conversion_rate: 0,
      };
    },
  });

  // Fetch top pages
  const { data: topPages } = useQuery({
    queryKey: ['analytics-top-pages', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_pages', {
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
        p_limit: 10,
      });
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch event counts
  const { data: eventCounts } = useQuery({
    queryKey: ['analytics-events', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_event_counts', {
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      });
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch sessions over time
  const { data: sessionsTimeline } = useQuery({
    queryKey: ['analytics-sessions-timeline', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_sessions')
        .select('session_start, device_type, browser, is_bounce, converted')
        .gte('session_start', startDate.toISOString())
        .lte('session_start', endDate.toISOString())
        .order('session_start', { ascending: true });
      
      if (error) throw error;
      
      // Group by date
      const grouped: Record<string, { date: string; sessions: number; bounces: number; conversions: number }> = {};
      data?.forEach(session => {
        const date = format(new Date(session.session_start), 'MMM dd');
        if (!grouped[date]) {
          grouped[date] = { date, sessions: 0, bounces: 0, conversions: 0 };
        }
        grouped[date].sessions++;
        if (session.is_bounce) grouped[date].bounces++;
        if (session.converted) grouped[date].conversions++;
      });
      
      return Object.values(grouped);
    },
  });

  // Fetch device distribution
  const { data: deviceData } = useQuery({
    queryKey: ['analytics-devices', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_sessions')
        .select('device_type')
        .gte('session_start', startDate.toISOString())
        .lte('session_start', endDate.toISOString());
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data?.forEach(session => {
        const device = session.device_type || 'unknown';
        counts[device] = (counts[device] || 0) + 1;
      });
      
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    },
  });

  // Fetch recent events
  const { data: recentEvents } = useQuery({
    queryKey: ['analytics-recent-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch user journeys
  const { data: userJourneys } = useQuery({
    queryKey: ['analytics-journeys', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_sessions')
        .select('id, entry_page, exit_page, pages_viewed, total_time_seconds, converted, conversion_type')
        .gte('session_start', startDate.toISOString())
        .lte('session_start', endDate.toISOString())
        .order('session_start', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleRefresh = () => {
    refetchSummary();
  };

  return (
    <>
      <SEO title="Analytics Dashboard | Admin" description="View site analytics and user behavior" />
      <Header />
      
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track user behavior, events, and conversions</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Visitors</span>
                </div>
                <p className="text-2xl font-bold">{summary?.unique_visitors || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-xs">Sessions</span>
                </div>
                <p className="text-2xl font-bold">{summary?.total_sessions || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-xs">Page Views</span>
                </div>
                <p className="text-2xl font-bold">{summary?.total_page_views || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MousePointer className="h-4 w-4" />
                  <span className="text-xs">Events</span>
                </div>
                <p className="text-2xl font-bold">{summary?.total_events || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Avg Duration</span>
                </div>
                <p className="text-2xl font-bold">{formatDuration(summary?.avg_session_duration || 0)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                  <span className="text-xs">Bounce Rate</span>
                </div>
                <p className="text-2xl font-bold">{summary?.bounce_rate || 0}%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-xs">Conversions</span>
                </div>
                <p className="text-2xl font-bold">{summary?.conversion_rate || 0}%</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="journeys">User Journeys</TabsTrigger>
              <TabsTrigger value="live">Live Feed</TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-1">
                <Bell className="h-3 w-3" />
                Alerts
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sessions Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Sessions Over Time</CardTitle>
                    <CardDescription>Daily sessions, bounces, and conversions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sessionsTimeline || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                            }} 
                          />
                          <Legend />
                          <Area type="monotone" dataKey="sessions" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} name="Sessions" />
                          <Area type="monotone" dataKey="conversions" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Conversions" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Device Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Devices</CardTitle>
                    <CardDescription>Traffic by device type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deviceData || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {deviceData?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Event Types Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Distribution</CardTitle>
                  <CardDescription>Top events by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={eventCounts?.slice(0, 10) || []} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis dataKey="event_name" type="category" width={150} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }} 
                        />
                        <Bar dataKey="event_count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pages Tab */}
            <TabsContent value="pages">
              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                  <CardDescription>Most visited pages and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPages?.map((page: any, index: number) => (
                      <div key={page.page_path} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-muted-foreground w-8">#{index + 1}</span>
                          <div>
                            <p className="font-medium">{page.page_path}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {page.view_count} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(page.avg_time_on_page || 0)} avg
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {page.avg_scroll_depth || 0}% scroll
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">{page.view_count} views</Badge>
                      </div>
                    ))}
                    
                    {(!topPages || topPages.length === 0) && (
                      <p className="text-center text-muted-foreground py-8">No page data available for this period</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Events by Type</CardTitle>
                    <CardDescription>Breakdown of tracked events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {eventCounts?.map((event: any) => (
                        <div key={`${event.event_type}-${event.event_name}`} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{event.event_type}</Badge>
                            <span className="font-medium">{event.event_name}</span>
                          </div>
                          <span className="font-bold">{event.event_count}</span>
                        </div>
                      ))}
                      
                      {(!eventCounts || eventCounts.length === 0) && (
                        <p className="text-center text-muted-foreground py-8">No events recorded for this period</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Event Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={eventCounts?.reduce((acc: any[], event: any) => {
                              const existing = acc.find(e => e.name === event.event_type);
                              if (existing) {
                                existing.value += event.event_count;
                              } else {
                                acc.push({ name: event.event_type, value: event.event_count });
                              }
                              return acc;
                            }, []) || []}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {eventCounts?.map((_: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* User Journeys Tab */}
            <TabsContent value="journeys">
              <Card>
                <CardHeader>
                  <CardTitle>User Journeys</CardTitle>
                  <CardDescription>Recent user sessions and their paths</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userJourneys?.map((journey: any) => (
                      <div key={journey.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant={journey.converted ? 'default' : 'secondary'}>
                              {journey.converted ? journey.conversion_type || 'Converted' : 'No Conversion'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {journey.pages_viewed} pages • {formatDuration(journey.total_time_seconds || 0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{journey.entry_page}</span>
                          {journey.exit_page && journey.exit_page !== journey.entry_page && (
                            <>
                              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{journey.exit_page}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {(!userJourneys || userJourneys.length === 0) && (
                      <p className="text-center text-muted-foreground py-8">No user journey data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Live Feed Tab */}
            <TabsContent value="live">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Live Events
                  </CardTitle>
                  <CardDescription>Real-time event stream (updates every 30 seconds)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {recentEvents?.map((event: any) => (
                      <div key={event.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg text-sm">
                        <span className="text-xs text-muted-foreground w-20">
                          {format(new Date(event.created_at), 'HH:mm:ss')}
                        </span>
                        <Badge variant="outline" className="w-24">{event.event_type}</Badge>
                        <span className="font-medium flex-1">{event.event_name}</span>
                        <span className="text-muted-foreground">{event.page_path}</span>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          {event.device_type === 'mobile' ? (
                            <Smartphone className="h-3 w-3" />
                          ) : (
                            <Monitor className="h-3 w-3" />
                          )}
                          <Globe className="h-3 w-3" />
                        </div>
                      </div>
                    ))}
                    
                    {(!recentEvents || recentEvents.length === 0) && (
                      <p className="text-center text-muted-foreground py-8">No recent events</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts">
              <AnalyticsAlertSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminAnalytics;
