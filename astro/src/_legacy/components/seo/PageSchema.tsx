import { Helmet } from "react-helmet-async";

interface PageSchemaProps {
  type: "CollectionPage" | "AboutPage" | "ContactPage" | "WebPage";
  name: string;
  description: string;
  url?: string;
  breadcrumb?: Array<{
    name: string;
    url: string;
  }>;
  mainEntity?: object;
  additionalType?: string;
}

export const PageSchema = ({ 
  type, 
  name, 
  description, 
  url,
  breadcrumb,
  mainEntity,
  additionalType
}: PageSchemaProps) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://promptandgo.ai";
  const pageUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
    name: name,
    description: description,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "promptandgo.ai",
      url: `${origin}/`
    },
    ...(additionalType && { additionalType }),
    ...(mainEntity && { mainEntity })
  };

  const breadcrumbSchema = breadcrumb ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${origin}${item.url}`
    }))
  } : null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(baseSchema)}
      </script>
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};