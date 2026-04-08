import { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Notification {
  id: string;
  type: "feature" | "content" | "tip" | "system";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const BORDER_COLORS: Record<string, string> = {
  feature: "border-l-blue-500",
  content: "border-l-green-500",
  tip: "border-l-primary",
  system: "border-l-destructive",
};

const TYPE_ICONS: Record<string, string> = {
  feature: "🚀",
  content: "📄",
  tip: "💡",
  system: "⚙️",
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "content", title: "New Japanese Business Email Templates Added", description: "12 new keigo-aware email templates for B2B communication in Japan.", timestamp: "2 hours ago", read: false },
  { id: "2", type: "feature", title: "Qwen 2.5 Platform Now Supported", description: "Optimize prompts for Alibaba's latest Qwen model with full Mandarin support.", timestamp: "5 hours ago", read: false },
  { id: "3", type: "tip", title: "Tip: Use formal keigo in Japanese B2B prompts", description: "Adding 敬語 context improves output quality by 40% for business Japanese.", timestamp: "Yesterday", read: false },
  { id: "4", type: "system", title: "Community milestone: 10,000 prompts optimized", description: "The PromptAndGo community has collectively optimized 10,000 prompts!", timestamp: "Yesterday", read: false },
  { id: "5", type: "content", title: "New Hindi marketing prompt pack available", description: "25 marketing prompts tailored for Indian market audiences.", timestamp: "2 days ago", read: true },
  { id: "6", type: "feature", title: "API rate limits increased to 1000/day", description: "Pro users now get 1000 API calls per day, up from 500.", timestamp: "3 days ago", read: true },
  { id: "7", type: "content", title: "Mandarin tone guide updated for 2025", description: "Updated guide covers four tones plus neutral tone markers in AI content.", timestamp: "4 days ago", read: true },
  { id: "8", type: "content", title: "Korean honorifics cheat sheet released", description: "Quick-reference guide for 존댓말 and 반말 levels in AI prompts.", timestamp: "5 days ago", read: true },
];

const STORAGE_KEY = "pag_notification_read";

const loadReadState = (): Set<string> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? new Set(JSON.parse(data) as string[]) : new Set();
  } catch { return new Set(); }
};

const saveReadState = (readIds: Set<string>) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...readIds])); } catch { /* noop */ }
};

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(loadReadState);
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const notifications = INITIAL_NOTIFICATIONS.map(n => ({
    ...n,
    read: readIds.has(n.id),
  }));

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const markAllRead = () => {
    const all = new Set(INITIAL_NOTIFICATIONS.map(n => n.id));
    setReadIds(all);
    saveReadState(all);
  };

  const handleNotificationClick = (n: Notification) => {
    const updated = new Set(readIds);
    updated.add(n.id);
    setReadIds(updated);
    saveReadState(updated);
    toast({ title: "Opening notification...", description: n.title });
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 flex items-center justify-center text-foreground hover:text-primary transition-colors rounded-md hover:bg-muted/50 relative"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={isOpen}
        aria-controls="notification-panel"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id="notification-panel"
          className="absolute right-0 top-full mt-2 w-[380px] max-h-[500px] bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-fade-in z-50"
          role="region"
          aria-label="Notifications"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-[400px]">
            {notifications.map(n => (
              <button
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`w-full text-left px-4 py-3 border-l-4 ${BORDER_COLORS[n.type]} hover:bg-muted/50 transition-colors flex gap-3 ${
                  !n.read ? "bg-primary/5" : ""
                }`}
              >
                <span className="text-lg shrink-0 mt-0.5">{TYPE_ICONS[n.type]}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-tight line-clamp-1 ${!n.read ? "font-semibold text-foreground" : "text-foreground/80"}`}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.timestamp}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-border text-center">
            <button
              onClick={() => { toast({ title: "View all notifications coming soon!" }); setIsOpen(false); }}
              className="text-xs text-primary hover:underline"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
