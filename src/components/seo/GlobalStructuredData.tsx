import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useMemo, useEffect } from "react";

const SITE_NAME = "PromptandGo";

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
    "@type": ["Organization", "SoftwareApplication", "WebApplication"],
    name: SITE_NAME,
    alternateName: ["promptandgo", "Prompt and Go", "PromptAndGo"],
    legalName: "PromptandGo.ai",
    url: `${origin}/`,
    logo: {
      "@type": "ImageObject",
      url: `${origin}/og-default.png`,
      width: 1200,
      height: 630,
      caption: "PromptandGo.ai - AI Prompt Library Logo"
    },
    image: `${origin}/og-default.png`,
    description: "Curated AI prompts that get results. Browse 3,000+ tested prompts, use Scout AI optimization, and access specialized Power Packs for ChatGPT, Claude, and more.",
    slogan: "Better and faster AI results, every time",
    foundingDate: "2024",
    numberOfEmployees: "1-10",
    industry: "Artificial Intelligence",
    knowsAbout: ["AI Prompts", "ChatGPT", "Claude", "Artificial Intelligence", "Productivity Tools", "Business Automation", "Content Creation", "Marketing"],
    contactPoint: [{
      "@type": "ContactPoint",
      email: "support@promptandgo.ai",
      contactType: "customer support",
      availableLanguage: ["en", "en-US"],
      areaServed: "Worldwide",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59"
      }
    }],
    sameAs: [
      `${origin}/`,
      `${origin}/rss.xml`,
      "https://twitter.com/promptandgo",
      "https://linkedin.com/company/promptandgo"
    ],
    mainEntityOfPage: `${origin}/`,
    offers: [{
      "@type": "Offer",
      name: "Free AI Prompt Library",
      description: "Access to 3,000+ curated AI prompts completely free",
      price: "0",
      priceCurrency: "USD",
      category: "AI Tools",
      availability: "https://schema.org/InStock",
      validFrom: "2024-01-01",
      url: `${origin}/library`
    }, {
      "@type": "Offer", 
      name: "Scout AI Optimization",
      description: "AI-powered prompt optimization for better results",
      price: "0",
      priceCurrency: "USD",
      category: "AI Services",
      availability: "https://schema.org/InStock",
      validFrom: "2024-01-01",
      url: `${origin}/scout`
    }],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1800",
      bestRating: "5",
      worstRating: "1",
      ratingExplanation: "Based on user feedback and prompt effectiveness ratings"
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressRegion: "California"
    },
    applicationCategory: ["ProductivityApplication", "BusinessApplication"],
    operatingSystem: "Web Browser",
    browserRequirements: "Modern web browser with JavaScript enabled",
    softwareVersion: "2024.1",
    applicationSubCategory: "AI Tools",
    downloadUrl: `${origin}/`,
    installUrl: `${origin}/`,
    screenshot: `${origin}/og-default.png`,
    featureList: [
      "3000+ curated AI prompts",
      "Scout AI optimization",
      "Power Packs collections", 
      "Multi-platform support",
      "Free access",
      "Regular updates"
    ]
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: ["promptandgo", "Prompt and Go", "PromptAndGo"],
    url: `${origin}/`,
    description: "Curated AI prompts that get results. Browse 3,000+ tested prompts, use Scout AI optimization, and access specialized Power Packs for ChatGPT, Claude, and more.",
    inLanguage: "en-US",
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      "@type": "Organization",
      name: SITE_NAME
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${origin}/`
    },
    creator: {
      "@type": "Organization", 
      name: SITE_NAME
    },
    audience: {
      "@type": "Audience",
      audienceType: ["professionals", "marketers", "content creators", "business owners", "entrepreneurs", "students"],
      geographicArea: "Worldwide"
    },
    keywords: "AI prompts, ChatGPT prompts, Claude prompts, AI tools, productivity, business automation, content creation, marketing prompts",
    about: {
      "@type": "Thing",
      name: "AI Prompt Library and Optimization Tools",
      description: "Comprehensive collection of AI prompts with optimization features"
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${origin}/library?q={search_term_string}`,
          description: "Search AI prompts by keyword or category"
        },
        "query-input": "required name=search_term_string",
        actionStatus: "ActiveActionStatus"
      },
      {
        "@type": "ReadAction",
        target: `${origin}/tips/`,
        description: "Read AI prompt guides and tutorials"
      },
      {
        "@type": "UseAction",
        target: `${origin}/scout`,
        description: "Optimize prompts with Scout AI"
      },
      {
        "@type": "DownloadAction",
        target: `${origin}/packs`,
        description: "Download AI prompt Power Packs"
      }
    ],
    mainEntity: {
      "@type": "WebPage",
      "@id": `${origin}/`,
      name: "PromptandGo.ai - AI Prompt Library"
    },
    hasPart: [
      {
        "@type": "WebPage",
        name: "Prompt Library",
        url: `${origin}/library`,
        description: "Browse 3,000+ AI prompts by category"
      },
      {
        "@type": "WebPage", 
        name: "Scout AI",
        url: `${origin}/scout`,
        description: "AI-powered prompt optimization tool"
      },
      {
        "@type": "WebPage",
        name: "Power Packs",
        url: `${origin}/packs`, 
        description: "Specialized prompt collections"
      },
      {
        "@type": "WebPage",
        name: "How It Works",
        url: `${origin}/how-it-works`,
        description: "Complete guide to using PromptandGo tools"
      }
    ]
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
