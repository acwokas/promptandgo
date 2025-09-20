import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface UserAction {
  type: 'page_view' | 'scroll' | 'click' | 'time_spent' | 'form_interaction' | 'search' | 'download';
  page: string;
  timestamp: number;
  data?: Record<string, any>;
}

interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  actions: UserAction[];
  totalTimeSpent: number;
  pagesViewed: string[];
  scrollDepth: Record<string, number>;
  interactions: number;
}

const BehaviorTracker = () => {
  const location = useLocation();
  const { user } = useSupabaseAuth();
  const sessionRef = useRef<UserSession | null>(null);
  const timeTrackerRef = useRef<{ start: number; page: string } | null>(null);
  const scrollTrackerRef = useRef<{ maxScroll: number; tracked: Set<number> }>({ 
    maxScroll: 0, 
    tracked: new Set() 
  });

  // Initialize or get existing session
  const getSession = (): UserSession => {
    if (sessionRef.current) return sessionRef.current;

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: UserSession = {
      sessionId,
      userId: user?.id,
      startTime: Date.now(),
      actions: [],
      totalTimeSpent: 0,
      pagesViewed: [],
      scrollDepth: {},
      interactions: 0
    };

    sessionRef.current = session;
    return session;
  };

  // Track user action
  const trackAction = (type: UserAction['type'], data?: Record<string, any>) => {
    const session = getSession();
    const action: UserAction = {
      type,
      page: location.pathname,
      timestamp: Date.now(),
      data
    };

    session.actions.push(action);
    
    // Update session data
    if (type === 'page_view' && !session.pagesViewed.includes(location.pathname)) {
      session.pagesViewed.push(location.pathname);
    }
    
    if (type === 'click' || type === 'form_interaction') {
      session.interactions++;
    }

    // Save to localStorage for persistence
    localStorage.setItem('user-session', JSON.stringify(session));

    // Send to analytics if available
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', type, {
        event_category: 'user_behavior',
        event_label: location.pathname,
        custom_parameter: data
      });
    }
  };

  // Track page views
  useEffect(() => {
    // End time tracking for previous page
    if (timeTrackerRef.current) {
      const timeSpent = Date.now() - timeTrackerRef.current.start;
      trackAction('time_spent', { 
        page: timeTrackerRef.current.page,
        duration: timeSpent 
      });
    }

    // Start tracking new page
    timeTrackerRef.current = {
      start: Date.now(),
      page: location.pathname
    };

    trackAction('page_view');
    
    // Reset scroll tracking for new page
    scrollTrackerRef.current = { maxScroll: 0, tracked: new Set() };
  }, [location.pathname]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      scrollTrackerRef.current.maxScroll = Math.max(scrollTrackerRef.current.maxScroll, scrollPercent);

      // Track milestone scrolls (25%, 50%, 75%, 100%)
      const milestones = [25, 50, 75, 100];
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !scrollTrackerRef.current.tracked.has(milestone)) {
          scrollTrackerRef.current.tracked.add(milestone);
          trackAction('scroll', { depth: milestone });
        }
      });

      // Update session scroll depth
      const session = getSession();
      session.scrollDepth[location.pathname] = scrollPercent;
      localStorage.setItem('user-session', JSON.stringify(session));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Track clicks on important elements
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Track clicks on buttons, links, and other interactive elements
      if (target.matches('button, a, [data-track-click], .cta-button, [role="button"]')) {
        const elementInfo = {
          tagName: target.tagName,
          className: target.className,
          textContent: target.textContent?.substring(0, 100),
          href: target.getAttribute('href'),
          id: target.id
        };

        trackAction('click', { element: elementInfo });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Track form interactions
  useEffect(() => {
    const handleFormInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.matches('input, textarea, select')) {
        trackAction('form_interaction', {
          fieldType: target.tagName,
          fieldName: target.getAttribute('name') || target.getAttribute('id'),
          formId: target.closest('form')?.id
        });
      }
    };

    document.addEventListener('focus', handleFormInteraction, { capture: true });
    return () => document.removeEventListener('focus', handleFormInteraction, { capture: true });
  }, []);

  // Track exit intent
  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0) {
        trackAction('scroll', { type: 'exit_intent' });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  // Send session data before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (timeTrackerRef.current) {
        const timeSpent = Date.now() - timeTrackerRef.current.start;
        const session = getSession();
        session.totalTimeSpent += timeSpent;
        localStorage.setItem('user-session', JSON.stringify(session));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Update user ID when auth state changes
  useEffect(() => {
    if (sessionRef.current && user) {
      sessionRef.current.userId = user.id;
      localStorage.setItem('user-session', JSON.stringify(sessionRef.current));
    }
  }, [user]);

  return null; // This component doesn't render anything
};

// Hook to access behavior data
export const useBehaviorData = () => {
  const getSessionData = (): UserSession | null => {
    try {
      const sessionData = localStorage.getItem('user-session');
      return sessionData ? JSON.parse(sessionData) : null;
    } catch {
      return null;
    }
  };

  const getEngagementScore = (): number => {
    const session = getSessionData();
    if (!session) return 0;

    let score = 0;
    
    // Page views (up to 5 points)
    score += Math.min(session.pagesViewed.length * 1, 5);
    
    // Time spent (up to 10 points, 1 point per minute)
    score += Math.min(session.totalTimeSpent / (1000 * 60), 10);
    
    // Interactions (up to 5 points)
    score += Math.min(session.interactions * 0.5, 5);
    
    // Scroll depth (up to 5 points)
    const avgScrollDepth = Object.values(session.scrollDepth).reduce((a, b) => a + b, 0) / Object.keys(session.scrollDepth).length || 0;
    score += (avgScrollDepth / 100) * 5;

    return Math.round(score);
  };

  const isHighIntent = (): boolean => {
    const session = getSessionData();
    if (!session) return false;

    return (
      session.pagesViewed.length >= 3 ||
      session.interactions >= 5 ||
      session.totalTimeSpent > 3 * 60 * 1000 || // 3 minutes
      session.pagesViewed.some(page => page.includes('/auth') || page.includes('/checkout'))
    );
  };

  return {
    getSessionData,
    getEngagementScore,
    isHighIntent
  };
};

export default BehaviorTracker;