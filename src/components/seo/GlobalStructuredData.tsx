import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useMemo, useEffect } from "react";

const SITE_NAME = "promptandgo";

const getOrigin = () =>
  typeof window !== "undefined" ? window.location.origin : "https://promptandgo.ai";

const toTitle = (seg: string) =>
  seg
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

const GlobalStructuredData = () => {
  const location = useLocation();
  const origin = getOrigin();
  const pathname = location.pathname || "/";
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumb = useMemo(() => {
    const items: any[] = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${origin}/`,
      },
    ];

    let pathAcc = "";
    segments.forEach((seg, idx) => {
      pathAcc += `/${seg}`;
      items.push({
        "@type": "ListItem",
        position: idx + 2,
        name: toTitle(seg),
        item: `${origin}${pathAcc}`,
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items,
    };
  }, [origin, segments]);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "PromptAndGo",
    url: `${origin}/`,
    logo: {
      "@type": "ImageObject",
      url: `${origin}/og-default.png`,
      width: 1200,
      height: 630
    },
    description: "Curated AI prompts that get results. Browse, copy, and run practical prompts for ChatGPT, Claude, and more.",
    foundingDate: "2024",
    contactPoint: [{
      "@type": "ContactPoint",
      email: "support@promptandgo.ai",
      contactType: "customer support",
      availableLanguage: ["en"],
      areaServed: "Worldwide"
    }],
    sameAs: [
      `${origin}/`,
      `${origin}/rss.xml`,
    ],
    offers: {
      "@type": "Offer",
      category: "AI Tools",
      availability: "https://schema.org/InStock"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "50000",
      bestRating: "5",
      worstRating: "1"
    }
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "PromptAndGo",
    url: `${origin}/`,
    description: "Curated AI prompts that get results. Browse, copy, and run practical prompts for ChatGPT, Claude, and more.",
    inLanguage: "en-US",
    copyrightYear: new Date().getFullYear(),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: `${origin}/library?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
      {
        "@type": "ReadAction",
        target: `${origin}/tips/`
      }
    ],
    mainEntity: {
      "@type": "WebPage",
      "@id": `${origin}/`
    }
  };

  // IndexNow ping (once per path)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const key = '8c1f9f5e5c124d0a8a7a9a2b1c3d4e5f';
      const url = `${origin}${pathname}`;
      const lsKey = `indexnow_ping_${url}`;
      if (!localStorage.getItem(lsKey)) {
        fetch(`https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=${key}`, { mode: 'no-cors' }).catch(() => {});
        localStorage.setItem(lsKey, String(Date.now()));
      }
    } catch {}
  }, [origin, pathname]);

  return (
    <Helmet>
      {/* Global structured data */}
      <script type="application/ld+json">{JSON.stringify(organization)}</script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
      {segments.length > 0 && (
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      )}
      {/* Site-wide head links */}
      <link rel="alternate" type="application/rss+xml" title="promptandgo RSS" href={`${origin}/rss.xml`} />
      <link rel="search" type="application/opensearchdescription+xml" title="promptandgo Search" href={`${origin}/opensearch.xml`} />
    </Helmet>
  );
};

export default GlobalStructuredData;
