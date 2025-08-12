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
}

const SITE_NAME = "PromptAndGo";
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
}: SEOProps) => {
  const canonicalUrl = normalizeCanonical(canonical);
  const ogImage = image || DEFAULT_OG_IMAGE;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

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
