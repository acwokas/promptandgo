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
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
        page_title: document.title,
        page_location: window.location.href,
      });
    } catch (_) {
      // no-op
    }
  }, [location.pathname, location.search]);

  return null;
};

export default GAListener;
