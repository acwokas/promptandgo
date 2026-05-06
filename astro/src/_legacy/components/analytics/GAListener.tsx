import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID = "G-K67F088N0D";

const GAListener = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ensure dataLayer exists even if GTM hasn't loaded yet
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
      window.gtag = function () {
        window.dataLayer.push(arguments as unknown as any);
      } as any;
    }

    try {
      const pageTitle = document.title;
      const pageUrl = window.location.href;
      const referrer = document.referrer;

      // Track page category for better analytics
      let pageCategory = 'general';
      if (location.pathname.includes('/library')) pageCategory = 'library';
      else if (location.pathname.includes('/packs')) pageCategory = 'packs';
      else if (location.pathname.includes('/tips')) pageCategory = 'blog';
      else if (location.pathname.includes('/scout')) pageCategory = 'ai-tools';
      else if (location.pathname.includes('/optimize')) pageCategory = 'optimizer';
      else if (location.pathname === '/') pageCategory = 'homepage';

      // Push to dataLayer for GTM triggers
      window.dataLayer.push({
        event: 'virtualPageview',
        pagePath: location.pathname + location.search,
        pageTitle: pageTitle,
        pageCategory: pageCategory,
        pageReferrer: referrer,
      });

      // Send via gtag for GA4 (GTM will also load GA4 Config)
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
        page_title: pageTitle,
        page_location: pageUrl,
        send_page_view: false, // GTM handles page views
      });

      window.gtag("event", "page_view", {
        page_category: pageCategory,
        page_referrer: referrer,
      });
    } catch (_) {
      // no-op
    }
  }, [location.pathname, location.search]);

  return null;
};

export default GAListener;

// Helper to push custom events to dataLayer for GTM
export const pushToDataLayer = (eventName: string, params?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
};

// Track prompt copy events
export const trackPromptCopy = (promptTitle: string, promptCategory: string) => {
  pushToDataLayer('prompt_copy', {
    prompt_title: promptTitle,
    prompt_category: promptCategory,
    page_path: window.location.pathname,
  });
};

// Track signup CTA clicks
export const trackSignupClick = (source: string) => {
  pushToDataLayer('signup_click', {
    click_source: source,
    page_path: window.location.pathname,
  });
};

// Track category browse
export const trackCategoryBrowse = (categoryName: string) => {
  pushToDataLayer('category_browse', {
    category_name: categoryName,
    page_path: window.location.pathname,
  });
};

// Track optimizer usage
export const trackOptimizerUsage = (action: string, metadata?: Record<string, any>) => {
  pushToDataLayer('optimizer_usage', {
    optimizer_action: action,
    page_path: window.location.pathname,
    ...metadata,
  });
};

// Track outbound clicks
export const trackOutboundClick = (url: string, text: string) => {
  pushToDataLayer('outbound_click', {
    click_url: url,
    click_text: text,
    page_path: window.location.pathname,
  });
};
