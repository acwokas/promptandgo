import React, { createContext, useContext, useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface AnalyticsContextType {
  trackEvent: (data: { event_type: string; event_name: string; event_category?: string; metadata?: Record<string, any> }) => void;
  trackClick: (elementType: string, elementId?: string, elementText?: string) => void;
  trackConversion: (conversionType: string, value?: number, metadata?: Record<string, any>) => void;
  trackFormSubmit: (formName: string, success: boolean, metadata?: Record<string, any>) => void;
  trackFeatureUsage: (featureName: string, action: string, metadata?: Record<string, any>) => void;
  trackCTAClick: (ctaName: string, ctaLocation: string, metadata?: Record<string, any>) => void;
  trackSearch: (searchTerm: string, resultsCount?: number, metadata?: Record<string, any>) => void;
  sessionId: string;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within AnalyticsProvider');
  }
  return context;
};

// Safe version that returns null if not in provider
export const useAnalyticsSafe = () => {
  return useContext(AnalyticsContext);
};

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const analytics = useAnalytics();

  // Auto-track clicks on interactive elements
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      const link = target.closest('a');
      const interactiveElement = button || link;
      
      if (interactiveElement) {
        const elementType = button ? 'button' : 'link';
        const elementId = interactiveElement.id || interactiveElement.getAttribute('data-analytics-id');
        const elementText = interactiveElement.textContent?.trim();
        
        // Skip tracking if explicitly disabled
        if (interactiveElement.getAttribute('data-no-track') === 'true') return;
        
        analytics.trackClick(elementType, elementId || undefined, elementText || undefined);
      }
    };
    
    document.addEventListener('click', handleClick, { passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, [analytics]);

  // Track visibility changes (tab switches)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        analytics.trackEvent({
          event_type: 'visibility',
          event_name: 'tab_hidden',
          event_category: 'engagement',
        });
      } else {
        analytics.trackEvent({
          event_type: 'visibility',
          event_name: 'tab_visible',
          event_category: 'engagement',
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [analytics]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
