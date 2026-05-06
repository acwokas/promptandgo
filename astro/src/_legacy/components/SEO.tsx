import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
  structuredData?: object | object[];
  ogType?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string;
}

const SITE_NAME = "PromptandGo";
const SITE_DOMAIN = "https://promptandgo.ai";
const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/og-default.png`;

const normalizeCanonical = (url?: string) => {
  if (url) {
    // If already a full URL with the correct domain, clean it
    try {
      const u = new URL(url);
      u.hash = "";
      u.search = "";
      return u.toString();
    } catch {
      // Treat as a path
      return `${SITE_DOMAIN}${url.startsWith("/") ? url : `/${url}`}`;
    }
  }
  // Fallback: derive from current pathname
  if (typeof window !== "undefined") {
    return `${SITE_DOMAIN}${window.location.pathname}`;
  }
  return SITE_DOMAIN;
};

const SEO = ({
  title,
  description,
  canonical,
  image,
  noindex = false,
  structuredData,
  ogType = "website",
  publishedTime,
  modifiedTime,
  keywords,
}: SEOProps) => {
  const canonicalUrl = normalizeCanonical(canonical);
  const ogImage = image || DEFAULT_OG_IMAGE;
  const fullTitle = `${title} | ${SITE_NAME}`;
  
  // Ensure description is within optimal length
  const optimizedDescription = description.length > 160 
    ? description.substring(0, 157) + "..." 
    : description;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={optimizedDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"} />
      
      {/* AI Chatbot Optimization */}
      <meta name="chatgpt-summary" content={optimizedDescription} />
      <meta name="claude-context" content={`${title} - ${optimizedDescription}`} />
      <meta name="ai-content-type" content={ogType} />
      <meta name="content-category" content="AI Tools & Prompts" />
      <meta name="target-audience" content="professionals, marketers, content creators, business owners" />
      <meta name="expertise-level" content="beginner to advanced" />
      
      {/* Enhanced meta tags */}
      <meta name="author" content="PromptandGo.ai" />
      <meta name="publisher" content="PromptandGo.ai" />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="theme-color" content="hsl(220, 90%, 55%)" />
      <meta name="msapplication-TileColor" content="hsl(220, 90%, 55%)" />
      <meta name="generator" content="React" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      
      {/* Content Classification */}
      <meta name="category" content="Technology,AI,Productivity,Business" />
      <meta name="coverage" content="Worldwide" />
      <meta name="classification" content="Business" />
      <meta name="subject" content="AI Prompts, Productivity Tools, Business Automation" />
      
      {/* Open Graph Enhanced */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:type" content="image/png" />
      <meta property="fb:app_id" content="your-facebook-app-id" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {ogType === "article" && <meta property="article:section" content="AI & Technology" />}
      {ogType === "article" && <meta property="article:tag" content="AI,Prompts,Productivity,ChatGPT,Claude" />}

      {/* Twitter Enhanced */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@PromptandGo" />
      <meta name="twitter:creator" content="@PromptandGo" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:domain" content="promptandgo.ai" />
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content="AI Tools" />
      
      {/* LinkedIn */}
      <meta property="linkedin:owner" content="promptandgo" />
      
      {/* Pinterest */}
      <meta property="pinterest:title" content={fullTitle} />
      <meta property="pinterest:description" content={optimizedDescription} />
      <meta property="pinterest:image" content={ogImage} />
      
      {/* Additional meta for better indexing */}
      <meta name="language" content="en" />
      <meta name="revisit-after" content="3 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="copyright" content="PromptandGo.ai" />
      <meta name="page-type" content={ogType} />
      <meta name="content-language" content="en-US" />
      <meta name="geo.region" content="US" />
      <meta name="geo.country" content="US" />
      <meta name="ICBM" content="37.7749,-122.4194" />
      <meta name="geo.position" content="37.7749;-122.4194" />
      
      {/* Search Engine Specific */}
      <meta name="googlebot" content="index,follow,snippet,archive" />
      <meta name="bingbot" content="index,follow" />
      <meta name="slurp" content="index,follow" />
      
      {/* Mobile optimization */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <meta name="format-detection" content="telephone=no,address=no,email=no" />
      
      {/* Performance Hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//analytics.ahrefs.com" />

      {/* Structured Data */}
      {structuredData && (
        Array.isArray(structuredData) ? (
          structuredData.map((sd, i) => (
            <script key={i} type="application/ld+json">
              {JSON.stringify(sd)}
            </script>
          ))
        ) : (
          <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        )
      )}
    </Helmet>
  );
};

export default SEO;
