import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Heart, Download, ChevronUp, ChevronDown, X, Sparkles } from "lucide-react";

interface Activity {
  id: string;
  type: 'copy' | 'save' | 'download';
  user: string;
  title: string;
  timeAgo: string;
  url: string;
}

const activityTypes = ['copy', 'save', 'download'] as const;
const userNames = [
  'Sarah M.', 'David L.', 'Maria G.', 'Alex K.', 'Jessica R.', 
  'Michael B.', 'Emma W.', 'James H.', 'Anna C.', 'Robert T.',
  'Lisa S.', 'Mark D.', 'Jennifer P.', 'Daniel F.', 'Ashley N.'
];

const promptData = [
  { title: 'Email Marketing Campaign Strategy', url: '/library?search=email+marketing' },
  { title: 'Social Media Content Calendar', url: '/library?search=social+media' },
  { title: 'Product Launch Announcement', url: '/library?search=product+launch' },
  { title: 'Customer Support Response Templates', url: '/library?search=customer+support' },
  { title: 'SEO Blog Post Outline', url: '/library?search=seo+blog' },
  { title: 'Meeting Summary Generator', url: '/library?search=meeting+summary' },
  { title: 'Real Estate Property Description', url: '/library?search=real+estate' },
  { title: 'Job Interview Preparation', url: '/library?search=job+interview' },
  { title: 'Business Proposal Framework', url: '/library?search=business+proposal' },
  { title: 'Sales Pitch Generator', url: '/library?search=sales+pitch' },
  { title: 'Content Creation Workflow', url: '/library?search=content+creation' },
  { title: 'Brand Voice Guidelines', url: '/library?search=brand+voice' },
  { title: 'Market Research Analysis', url: '/library?search=market+research' }
];

const generateActivity = (): Activity => {
  const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
  const user = userNames[Math.floor(Math.random() * userNames.length)];
  const promptInfo = promptData[Math.floor(Math.random() * promptData.length)];
  const timeAgo = ['just now', '1m ago', '2m ago', '3m ago', '5m ago'][Math.floor(Math.random() * 5)];
  
  return {
    id: `${Date.now()}-${Math.random()}`,
    type,
    user,
    title: promptInfo.title,
    url: promptInfo.url,
    timeAgo
  };
};

const LiveActivityTicker = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the ticker permanently
    const dismissed = localStorage.getItem('ticker-dismissed') === 'true';
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Initialize with some activities
    setActivities([
      generateActivity(),
      generateActivity(),
      generateActivity(),
      generateActivity(),
      generateActivity()
    ]);

    // Add new activities every 8-15 seconds
    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity = generateActivity();
        const updated = [newActivity, ...prev];
        return updated.slice(0, 10); // Keep only latest 10
      });
    }, Math.random() * 7000 + 8000); // 8-15 seconds

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'copy': return <Copy className="h-3 w-3" />;
      case 'save': return <Heart className="h-3 w-3" />;
      case 'download': return <Download className="h-3 w-3" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'copy': return 'copied';
      case 'save': return 'saved';
      case 'download': return 'downloaded';
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'copy': return 'bg-blue-100 text-blue-700';
      case 'save': return 'bg-red-100 text-red-700';
      case 'download': return 'bg-green-100 text-green-700';
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('ticker-dismissed', 'true');
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (isDismissed) return null;

    return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-t border-primary/10 shadow-lg transition-all duration-300 ${
      isMinimized ? 'h-12' : 'h-16'
    }`}>
      {/* Header with controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-background/80 backdrop-blur-sm border-b border-primary/10">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="font-medium text-primary">Live Activity</span>
          {!isMinimized && (
            <Badge variant="secondary" className="text-xs">
              {activities.length} recent
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleMinimize}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            {isMinimized ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0 hover:bg-primary/10 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Ticker content */}
      {!isMinimized && (
        <div className="overflow-hidden">
          <div className="flex animate-[slide-right_60s_linear_infinite] pause-animation">
            {/* Duplicate activities for seamless loop */}
            {[...activities, ...activities, ...activities].map((activity, index) => (
              <Link
                key={`${activity.id}-${index}`}
                to={activity.url}
                className="flex items-center gap-3 px-6 py-2 whitespace-nowrap flex-shrink-0 hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-foreground">{activity.user}</span>
                  
                  <Badge variant="secondary" className={`text-xs ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                    <span className="ml-1">{getActivityText(activity)}</span>
                  </Badge>
                  
                  <span className="text-muted-foreground max-w-[200px] truncate">
                    "{activity.title}"
                  </span>
                  
                  <span className="text-xs text-muted-foreground/70">
                    {activity.timeAgo}
                  </span>
                </div>
                
                {/* Separator */}
                <div className="w-1 h-1 bg-primary/20 rounded-full mx-4" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveActivityTicker;