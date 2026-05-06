import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Copy, Heart } from "lucide-react";

interface Activity {
  id: string;
  type: 'copy' | 'favorite' | 'download';
  user: string;
  title: string;
  timeAgo: string;
  role?: string;
}

// Simulated real-time activity feed
const generateActivity = (): Activity => {
  const users = [
    { name: "Sarah M.", role: "Marketing Dir." },
    { name: "Mike R.", role: "Content Writer" },
    { name: "Lisa K.", role: "Startup Founder" },
    { name: "John D.", role: "Freelancer" },
    { name: "Emma W.", role: "Social Media Mgr" },
    { name: "Alex T.", role: "Business Owner" },
    { name: "Maya P.", role: "Consultant" },
    { name: "Chris L.", role: "Designer" }
  ];

  const prompts = [
    "Email Subject Line Generator",
    "Social Media Content Calendar",
    "Product Description Writer",
    "Blog Post Outline Creator",
    "Customer Support Response",
    "Meeting Summary Template",
    "Content Strategy Framework",
    "Sales Email Sequence"
  ];

  const types: Activity['type'][] = ['copy', 'favorite', 'copy', 'copy', 'favorite'];
  const user = users[Math.floor(Math.random() * users.length)];
  const type = types[Math.floor(Math.random() * types.length)];
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  return {
    id: Date.now().toString(),
    type,
    user: user.name,
    role: user.role,
    title: prompt,
    timeAgo: "just now"
  };
};

const SocialProofStream = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Initial activities
    const initialActivities = Array.from({ length: 3 }, () => ({
      ...generateActivity(),
      timeAgo: Math.random() > 0.5 ? "2m ago" : "5m ago"
    }));
    setActivities(initialActivities);

    // Add new activity every 8-15 seconds
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]); // Keep only 5 activities
    }, Math.random() * 7000 + 8000); // 8-15 seconds

    return () => clearInterval(interval);
  }, []);

  if (activities.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">Live Activity</span>
      </div>
      
      <div className="space-y-2">
        {activities.slice(0, 3).map((activity, index) => (
          <div 
            key={activity.id}
            className={`flex items-center gap-3 text-sm transition-all duration-500 ${
              index === 0 ? 'opacity-100' : 'opacity-70'
            }`}
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-primary/10">
                {activity.user.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <span className="font-medium">{activity.user}</span>
              {activity.role && (
                <span className="text-muted-foreground"> ({activity.role})</span>
              )}
              <span className="text-muted-foreground"> {
                activity.type === 'copy' ? 'copied' : 
                activity.type === 'favorite' ? 'saved' : 'downloaded'
              }</span>
              <span className="font-medium"> "{activity.title}"</span>
            </div>
            
            <div className="flex items-center gap-1">
              {activity.type === 'copy' && <Copy className="h-3 w-3 text-primary" />}
              {activity.type === 'favorite' && <Heart className="h-3 w-3 text-red-500" />}
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.timeAgo}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-2 border-t border-primary/10">
        <p className="text-xs text-muted-foreground text-center">
          Join 2,500+ professionals using our prompts daily
        </p>
      </div>
    </div>
  );
};

export default SocialProofStream;