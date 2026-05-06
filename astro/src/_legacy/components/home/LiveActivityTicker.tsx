import React, { useState, useEffect } from 'react';

interface Activity {
  id: string;
  user: string;
  location: string;
  action: string;
  timeAgo: string;
  flag: string;
  initials: string;
  color: string;
}

const activities: Activity[] = [
  {
    id: '1',
    user: 'Ayu',
    location: 'Jakarta',
    action: 'optimized a prompt in Bahasa',
    timeAgo: '3s ago',
    flag: '🇮🇩',
    initials: 'AY',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: '2',
    user: 'Wei Lin',
    location: 'Singapore',
    action: 'copied a ChatGPT prompt',
    timeAgo: '8s ago',
    flag: '🇸🇬',
    initials: 'WL',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: '3',
    user: 'Nguyen',
    location: 'Ho Chi Minh City',
    action: 'generated a sales email prompt',
    timeAgo: '12s ago',
    flag: '🇻🇳',
    initials: 'NG',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    id: '4',
    user: 'Sarah',
    location: 'Sydney',
    action: 'used Scout AI for marketing',
    timeAgo: '18s ago',
    flag: '🇦🇺',
    initials: 'SR',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: '5',
    user: 'Rizal',
    location: 'Kuala Lumpur',
    action: 'optimized a Bahasa prompt',
    timeAgo: '25s ago',
    flag: '🇲🇾',
    initials: 'RZ',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: '6',
    user: 'Thanh',
    location: 'Hanoi',
    action: 'generated a Vietnamese prompt',
    timeAgo: '32s ago',
    flag: '🇻🇳',
    initials: 'TH',
    color: 'from-violet-500 to-purple-500',
  },
];

export function LiveActivityTicker() {
  const [cycleCount, setCycleCount] = useState(0);

  // Simulate activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCycleCount((prev) => prev + 1);
    }, 8000); // Reset animation every 8 seconds

    return () => clearInterval(interval);
  }, []);

  // Duplicate activities for seamless loop
  const displayActivities = [...activities, ...activities];

  return (
    <section className="w-full py-12 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 border-y border-primary/10 overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Activity
          </div>
          <h3 className="text-2xl font-bold">See What's Happening Right Now</h3>
          <p className="text-muted-foreground mt-2">Real-time activity from professionals across Southeast Asia</p>
        </div>

        {/* Ticker Container */}
        <div className="relative overflow-hidden">
          {/* Left Gradient Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

          {/* Right Gradient Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Ticker Content */}
          <div className="relative">
            <style>{`
              @keyframes slide-ticker {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }

              .ticker-content {
                animation: slide-ticker 20s linear infinite;
              }

              .ticker-content:hover {
                animation-play-state: paused;
              }
            `}</style>

            <div className="ticker-content flex gap-6 min-w-max">
              {displayActivities.map((activity, idx) => (
                <div
                  key={`${activity.id}-${idx}`}
                  className="flex items-center gap-3 px-4 py-3 bg-card rounded-lg border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 flex-shrink-0 group"
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${activity.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {activity.initials}
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        <span className="mr-1">{activity.flag}</span>
                        {activity.user}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.location}</p>
                    </div>

                    {/* Separator */}
                    <div className="h-4 w-px bg-border mx-1" />

                    {/* Action */}
                    <div>
                      <p className="text-sm text-foreground">
                        {activity.action}
                      </p>
                    </div>

                    {/* Time */}
                    <div className="h-4 w-px bg-border mx-1" />
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.timeAgo}
                    </p>
                  </div>

                  {/* Action Badge */}
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 group-hover:animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Join <span className="font-semibold text-foreground">1,947,438+</span> professionals optimizing prompts across Southeast Asia
          </p>
        </div>
      </div>
    </section>
  );
}
