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

    // Ensure dataLayer exists even if the script hasn't loaded yet
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
      // Fallback gtag that pushes to dataLayer
      window.gtag = function () {
        // Fallback: queue to dataLayer until gtag script is ready
        window.dataLayer.push(arguments as unknown as any);
      } as any;
    }

    try {
      // Enhanced tracking with more detailed page information
      const pageTitle = document.title;
      const pageUrl = window.location.href;
      const referrer = document.referrer;
      
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
        page_title: pageTitle,
        page_location: pageUrl,
        custom_map: {
          custom_parameter_1: 'page_category'
        }
      });

      // Track page category for better analytics
      let pageCategory = 'general';
      if (location.pathname.includes('/library')) pageCategory = 'library';
      else if (location.pathname.includes('/packs')) pageCategory = 'packs';
      else if (location.pathname.includes('/tips')) pageCategory = 'blog';
      else if (location.pathname.includes('/scout')) pageCategory = 'ai-tools';
      else if (location.pathname === '/') pageCategory = 'homepage';

      window.gtag("event", "page_view", {
        page_category: pageCategory,
        page_referrer: referrer
      });
    } catch (_) {
      // no-op
    }
  }, [location.pathname, location.search]);

  return null;
};

export default GAListener;
