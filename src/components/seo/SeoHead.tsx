import { Helmet } from "react-helmet-async";

interface SeoHeadProps {
  preloadImages?: string[];
  criticalCss?: string;
  deferredScripts?: string[];
}

export const SeoHead = ({ 
  preloadImages = [], 
  criticalCss,
  deferredScripts = []
}: SeoHeadProps) => {
  return (
    <Helmet>
      {/* Performance optimizations */}
      {preloadImages.map((src, index) => (
        <link
          key={index}
          rel="preload"
          as="image"
          href={src}
          fetchPriority={index === 0 ? "high" : "low"}
        />
      ))}
      
      {criticalCss && (
        <style type="text/css">
          {criticalCss}
        </style>
      )}
      
      {/* DNS prefetching for better performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//api.fontshare.com" />
      
      {/* Preconnect to important domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      {/* Prevent AI tools from blocking navigation due to referrers */}
      <meta httpEquiv="Referrer-Policy" content="no-referrer" />
      
      {/* Load deferred scripts */}
      {deferredScripts.map((src, index) => (
        <script key={index} src={src} defer />
      ))}
    </Helmet>
  );
};