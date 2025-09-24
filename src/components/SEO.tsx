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

const SITE_NAME = "**Prompt**and**Go**";
const DEFAULT_OG_IMAGE =
  typeof window !== "undefined"
    ? `${window.location.origin}/og-default.png`
    : "/og-default.png";

const normalizeCanonical = (url?: string) => {
  if (typeof window === "undefined") return url;
  try {
    const u = new URL(url || window.location.href);
    u.hash = "";
    u.search = "";
    return u.toString();
  } catch {
    return url || window.location.href;
  }
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
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1"} />
      
      {/* Enhanced meta tags */}
      <meta name="author" content="**Prompt**and**Go**.ai" />
      <meta name="publisher" content="**Prompt**and**Go**.ai" />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="theme-color" content="hsl(220, 90%, 55%)" />
      
      {/* Open Graph */}
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
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@**Prompt**and**Go**" />
      <meta name="twitter:creator" content="@**Prompt**and**Go**" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Additional meta for better indexing */}
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Mobile optimization */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />

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
