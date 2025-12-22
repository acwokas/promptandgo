import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

const GA_MEASUREMENT_ID = "G-K67F088N0D";

interface EventData {
  event_type: string;
  event_name: string;
  event_category?: string;
  metadata?: Record<string, any>;
}

interface SessionData {
  session_id: string;
  session_start: string;
  pages_viewed: number;
  events_count: number;
  max_scroll_depth: number;
  entry_page: string;
  referrer: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  device_type: string;
  browser: string;
  os: string;
}

// Get device info
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  
  let deviceType = 'desktop';
  if (/Mobile|Android|iPhone|iPad/.test(ua)) {
    deviceType = /iPad|Tablet/.test(ua) ? 'tablet' : 'mobile';
  }
  
  let browser = 'unknown';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  let os = 'unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  
  return { deviceType, browser, os };
};

// Get UTM parameters
const getUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
  };
};

// Generate a simple hash for IP anonymization
const generateIpHash = async () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(7);
  return `${timestamp}-${random}`;
};

// Session storage key
const SESSION_KEY = 'pag_analytics_session';

// Get or create session
const getOrCreateSession = (): SessionData => {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall through to create new session
    }
  }
  
  const { deviceType, browser, os } = getDeviceInfo();
  const utmParams = getUtmParams();
  
  const newSession: SessionData = {
    session_id: crypto.randomUUID(),
    session_start: new Date().toISOString(),
    pages_viewed: 0,
    events_count: 0,
    max_scroll_depth: 0,
    entry_page: window.location.pathname,
    referrer: document.referrer,
    ...utmParams,
    device_type: deviceType,
    browser,
    os,
  };
  
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  return newSession;
};

// Update session in storage
const updateSession = (updates: Partial<SessionData>) => {
  const session = getOrCreateSession();
  const updated = { ...session, ...updates };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return updated;
};

export const useAnalytics = () => {
  const location = useLocation();
  const { user } = useSupabaseAuth();
  const sessionRef = useRef<SessionData>(getOrCreateSession());
  const pageStartTimeRef = useRef<number>(Date.now());
  const lastPageRef = useRef<string>('');
  const scrollDepthRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  // Send event to GA4
  const sendToGA = useCallback((eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window === 'undefined') return;
    
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function() {
        window.dataLayer.push(arguments as unknown as any);
      } as any;
    }
    
    try {
      window.gtag('event', eventName, {
        ...eventParams,
        session_id: sessionRef.current.session_id,
      });
    } catch (e) {
      console.error('GA4 event error:', e);
    }
  }, []);

  // Track event in Supabase and GA4
  const trackEvent = useCallback(async (data: EventData) => {
    const session = sessionRef.current;
    const { deviceType, browser, os } = getDeviceInfo();
    
    // Update session event count
    const updatedSession = updateSession({
      events_count: session.events_count + 1,
    });
    sessionRef.current = updatedSession;
    
    // Send to GA4
    sendToGA(data.event_name, {
      event_category: data.event_category || data.event_type,
      ...data.metadata,
    });
    
    // Store in Supabase
    try {
      await supabase.from('site_analytics_events').insert({
        session_id: session.session_id,
        user_id: user?.id,
        event_type: data.event_type,
        event_name: data.event_name,
        event_category: data.event_category,
        page_path: location.pathname,
        page_title: document.title,
        referrer: document.referrer,
        metadata: data.metadata || {},
        device_type: deviceType,
        browser,
        os,
      });
    } catch (e) {
      console.error('Analytics event error:', e);
    }
  }, [user?.id, location.pathname, sendToGA]);

  // Track page view
  const trackPageView = useCallback(async (pagePath: string, pageTitle: string) => {
    const session = sessionRef.current;
    const { deviceType, browser, os } = getDeviceInfo();
    
    // Calculate time on previous page
    const timeOnPage = Math.round((Date.now() - pageStartTimeRef.current) / 1000);
    
    // Update session
    const updatedSession = updateSession({
      pages_viewed: session.pages_viewed + 1,
    });
    sessionRef.current = updatedSession;
    
    // Reset page tracking
    pageStartTimeRef.current = Date.now();
    scrollDepthRef.current = 0;
    
    // Send to GA4
    sendToGA('page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: window.location.href,
    });
    
    // Save previous page view with time spent
    if (lastPageRef.current && timeOnPage > 0) {
      try {
        await supabase.from('analytics_page_views').insert({
          session_id: session.session_id,
          user_id: user?.id,
          page_path: lastPageRef.current,
          page_title: document.title,
          referrer: document.referrer,
          time_on_page_seconds: timeOnPage,
          scroll_depth: scrollDepthRef.current,
        });
      } catch (e) {
        console.error('Page view save error:', e);
      }
    }
    
    // Store current page view event
    try {
      await supabase.from('site_analytics_events').insert({
        session_id: session.session_id,
        user_id: user?.id,
        event_type: 'page_view',
        event_name: 'page_view',
        event_category: 'navigation',
        page_path: pagePath,
        page_title: pageTitle,
        referrer: document.referrer,
        metadata: { 
          entry_page: session.entry_page,
          pages_in_session: updatedSession.pages_viewed,
        },
        device_type: deviceType,
        browser,
        os,
      });
    } catch (e) {
      console.error('Analytics page view error:', e);
    }
    
    lastPageRef.current = pagePath;
  }, [user?.id, sendToGA]);

  // Track scroll depth
  const trackScrollDepth = useCallback((depth: number) => {
    if (depth > scrollDepthRef.current) {
      scrollDepthRef.current = depth;
      
      // Track milestone scroll depths
      const milestones = [25, 50, 75, 90, 100];
      const milestone = milestones.find(m => depth >= m && scrollDepthRef.current < m);
      
      if (milestone) {
        trackEvent({
          event_type: 'scroll',
          event_name: `scroll_${milestone}`,
          event_category: 'engagement',
          metadata: { scroll_depth: depth, page: location.pathname },
        });
      }
    }
  }, [trackEvent, location.pathname]);

  // Track click
  const trackClick = useCallback((elementType: string, elementId?: string, elementText?: string) => {
    trackEvent({
      event_type: 'click',
      event_name: 'element_click',
      event_category: 'interaction',
      metadata: {
        element_type: elementType,
        element_id: elementId,
        element_text: elementText?.substring(0, 100),
      },
    });
  }, [trackEvent]);

  // Track conversion
  const trackConversion = useCallback((conversionType: string, value?: number, metadata?: Record<string, any>) => {
    updateSession({ converted: true } as any);
    
    trackEvent({
      event_type: 'conversion',
      event_name: conversionType,
      event_category: 'conversion',
      metadata: { value, ...metadata },
    });
    
    sendToGA('conversion', {
      conversion_type: conversionType,
      value,
      ...metadata,
    });
  }, [trackEvent, sendToGA]);

  // Track form submission
  const trackFormSubmit = useCallback((formName: string, success: boolean, metadata?: Record<string, any>) => {
    trackEvent({
      event_type: 'form',
      event_name: success ? 'form_submit_success' : 'form_submit_error',
      event_category: 'form',
      metadata: { form_name: formName, success, ...metadata },
    });
  }, [trackEvent]);

  // Track feature usage
  const trackFeatureUsage = useCallback((featureName: string, action: string, metadata?: Record<string, any>) => {
    trackEvent({
      event_type: 'feature',
      event_name: `${featureName}_${action}`,
      event_category: 'feature_usage',
      metadata: { feature: featureName, action, ...metadata },
    });
  }, [trackEvent]);

  // Track CTA click
  const trackCTAClick = useCallback((ctaName: string, ctaLocation: string, metadata?: Record<string, any>) => {
    trackEvent({
      event_type: 'cta',
      event_name: 'cta_click',
      event_category: 'engagement',
      metadata: { cta_name: ctaName, cta_location: ctaLocation, ...metadata },
    });
  }, [trackEvent]);

  // Track search
  const trackSearch = useCallback((searchTerm: string, resultsCount?: number, metadata?: Record<string, any>) => {
    trackEvent({
      event_type: 'search',
      event_name: 'search',
      event_category: 'search',
      metadata: { search_term: searchTerm, results_count: resultsCount, ...metadata },
    });
    
    sendToGA('search', { search_term: searchTerm });
  }, [trackEvent, sendToGA]);

  // Initialize session in Supabase
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    
    const initSession = async () => {
      const session = sessionRef.current;
      const { deviceType, browser, os } = getDeviceInfo();
      const utmParams = getUtmParams();
      
      try {
        await supabase.from('analytics_sessions').insert({
          id: session.session_id,
          user_id: user?.id,
          session_start: session.session_start,
          entry_page: session.entry_page,
          referrer: session.referrer,
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          device_type: deviceType,
          browser,
          os,
        });
      } catch (e) {
        console.error('Session init error:', e);
      }
    };
    
    initSession();
  }, [user?.id]);

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location.pathname, location.search, trackPageView]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const depth = scrollHeight > 0 ? Math.round((scrolled / scrollHeight) * 100) : 100;
      trackScrollDepth(depth);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth]);

  // Update session on unload
  useEffect(() => {
    const handleBeforeUnload = async () => {
      const session = sessionRef.current;
      const totalTime = Math.round((Date.now() - new Date(session.session_start).getTime()) / 1000);
      
      // Use sendBeacon for reliable delivery
      const sessionUpdate = {
        id: session.session_id,
        session_end: new Date().toISOString(),
        pages_viewed: session.pages_viewed,
        events_count: session.events_count,
        max_scroll_depth: scrollDepthRef.current,
        total_time_seconds: totalTime,
        exit_page: location.pathname,
        is_bounce: session.pages_viewed <= 1,
      };
      
      // Try to update via beacon
      navigator.sendBeacon?.(
        `https://mncxspmtqvqgvtrxbxzb.supabase.co/rest/v1/analytics_sessions?id=eq.${session.session_id}`,
        JSON.stringify(sessionUpdate)
      );
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location.pathname]);

  return {
    trackEvent,
    trackPageView,
    trackClick,
    trackConversion,
    trackFormSubmit,
    trackFeatureUsage,
    trackCTAClick,
    trackSearch,
    trackScrollDepth,
    sessionId: sessionRef.current.session_id,
  };
};

export default useAnalytics;
