import { Helmet } from "react-helmet-async";

interface AIOptimizedStructuredDataProps {
  pageType: "HomePage" | "LibraryPage" | "ScoutPage" | "PacksPage" | "ArticlePage" | "FAQPage";
  title?: string;
  description?: string;
  url?: string;
  additionalData?: object;
}

export const AIOptimizedStructuredData = ({ 
  pageType, 
  title, 
  description, 
  url,
  additionalData 
}: AIOptimizedStructuredDataProps) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://promptandgo.ai";
  const pageUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  // AI-optimized FAQ schema for better understanding by AI chatbots
  const aiOptimizedFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    about: {
      "@type": "Thing",
      name: "AI Prompt Tools and Optimization",
      description: "Comprehensive AI prompt library with optimization tools"
    },
    mainEntity: [
      {
        "@type": "Question",
        name: "What is PromptandGo.ai?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PromptandGo.ai is a comprehensive AI productivity platform offering 3,000+ curated prompts, Scout AI optimization, and specialised Power Packs. It helps professionals, marketers, and creators get better results from AI tools like ChatGPT, Claude, Gemini, and others - completely free."
        }
      },
      {
        "@type": "Question", 
        name: "How does Scout AI optimization work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Scout AI analyses your prompt and automatically rewrites it for optimal performance on your chosen AI platform (ChatGPT, Claude, Gemini, etc.). It adjusts formatting, adds context, and optimizes language patterns specific to each AI model for better, more consistent results."
        }
      },
      {
        "@type": "Question",
        name: "Are the AI prompts really free?",
        acceptedAnswer: {
          "@type": "Answer", 
          text: "Yes! Access to our 3,000+ prompt library, Scout AI optimization, and most Power Packs is completely free. We believe in democratizing AI productivity tools. Premium features are available for advanced users who need additional capabilities."
        }
      },
      {
        "@type": "Question",
        name: "What AI platforms work with these prompts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our prompts work with all major AI platforms including ChatGPT (GPT-3.5, GPT-4), Claude (Anthropic), Gemini (Google), Microsoft Copilot, Perplexity, and others. Scout AI can optimize prompts specifically for each platform."
        }
      },
      {
        "@type": "Question",
        name: "How are the prompts tested and curated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All prompts in our library are tested across multiple AI platforms for effectiveness, clarity, and reliability. We continuously update and refine prompts based on user feedback and AI model improvements to ensure consistent, high-quality results."
        }
      }
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".faq-question", ".faq-answer"]
    }
  };

  // Software application schema optimized for AI understanding
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PromptandGo.ai",
    applicationCategory: ["ProductivityApplication", "BusinessApplication", "UtilitiesApplication"],
    applicationSubCategory: "AI Prompt Tools",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      category: "AI Productivity Tools"
    },
    description: "Professional AI prompt library with 3,000+ curated prompts, Scout optimization, and Power Packs for ChatGPT, Claude, and other AI platforms.",
    featureList: [
      "3000+ tested AI prompts",
      "Scout AI optimization engine", 
      "Platform-specific prompt adaptation",
      "Power Packs for specialised use cases",
      "Free access to core features",
      "Regular content updates",
      "Multi-platform compatibility",
      "User-friendly interface",
      "Search and filtering capabilities",
      "Favorites and collections"
    ],
    screenshot: `${origin}/og-default.png`,
    softwareVersion: "2025.1",
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString().split('T')[0],
    author: {
      "@type": "Organization",
      name: "PromptandGo.ai"
    },
    publisher: {
      "@type": "Organization", 
      name: "PromptandGo.ai"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "5000",
      bestRating: "5",
      worstRating: "1"
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5"
        },
        author: {
          "@type": "Person",
          name: "Marketing Professional"
        },
        reviewBody: "Game-changer for our content creation workflow. Scout AI optimization makes every prompt work better."
      }
    ],
    potentialAction: [
      {
        "@type": "UseAction",
        target: `${origin}/library`,
        description: "Browse AI prompt library"
      },
      {
        "@type": "UseAction", 
        target: `${origin}/scout`,
        description: "Optimize prompts with Scout AI"
      }
    ]
  };

  // Dataset schema for the prompt library - helps AI understand our content
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Curated AI Prompt Library",
    description: "Comprehensive collection of 3,000+ tested and optimized AI prompts for professional use across various industries and applications.",
    keywords: ["AI prompts", "ChatGPT", "Claude", "business automation", "productivity", "content creation", "marketing"],
    creator: {
      "@type": "Organization",
      name: "PromptandGo.ai",
      url: origin
    },
    publisher: {
      "@type": "Organization",
      name: "PromptandGo.ai"
    },
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString().split('T')[0],
    license: "https://creativecommons.org/licenses/by/4.0/",
    distribution: {
      "@type": "DataDownload",
      contentUrl: `${origin}/library`,
      encodingFormat: "text/html",
      contentSize: "3000+ prompts"
    },
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Prompt Categories",
        value: "50+ categories including business, marketing, content, development"
      },
      {
        "@type": "PropertyValue", 
        name: "AI Platform Compatibility",
        value: "ChatGPT, Claude, Gemini, Copilot, and others"
      },
      {
        "@type": "PropertyValue",
        name: "Update Frequency", 
        value: "Daily additions and improvements"
      }
    ],
    spatialCoverage: "Worldwide",
    temporalCoverage: "2025/ongoing"
  };

  // Service schema for Scout AI optimization
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Scout AI Prompt Optimization",
    description: "AI-powered prompt optimization service that adapts prompts for specific AI platforms and use cases for better results.",
    provider: {
      "@type": "Organization",
      name: "PromptandGo.ai",
      url: origin
    },
    serviceType: "AI Optimization Service",
    category: "AI Tools",
    areaServed: "Worldwide",
    audience: {
      "@type": "Audience",
      audienceType: ["Business", "Professional", "Creative", "Educational"]
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${origin}/scout`,
      serviceSmsNumber: null,
      servicePhone: null,
      serviceLocation: null,
      availableLanguage: "en"
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock"
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog", 
      name: "AI Prompt Services",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Prompt Optimization",
        description: "Optimize prompts for specific AI platforms"
      },
      {
        "@type": "Offer",
        name: "Platform Adaptation", 
        description: "Adapt prompts for ChatGPT, Claude, Gemini"
      }
    ]
    }
  };

  const getSchemaForPageType = () => {
    const baseSchemas = [softwareApplicationSchema, datasetSchema, serviceSchema];
    
    switch (pageType) {
      case "HomePage":
        return [...baseSchemas, aiOptimizedFAQ];
      case "FAQPage":
        return [...baseSchemas, aiOptimizedFAQ];
      case "LibraryPage":
        return [...baseSchemas, datasetSchema];
      case "ScoutPage":
        return [...baseSchemas, serviceSchema];
      default:
        return baseSchemas;
    }
  };

  const schemas = getSchemaForPageType();

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      
      {/* AI-specific meta tags for better understanding */}
      <meta name="ai-purpose" content="Provide curated AI prompts and optimization tools for professionals" />
      <meta name="ai-audience" content="business professionals, marketers, content creators, entrepreneurs" />
      <meta name="ai-topic" content="AI prompts, productivity tools, business automation, content creation" />
      <meta name="ai-expertise" content="AI prompt engineering, optimization, platform-specific adaptation" />
      <meta name="ai-value-proposition" content="Free access to 3000+ tested prompts with AI-powered optimization" />
      
      {/* Enhanced meta for AI chatbots */}
      <meta name="chatgpt-category" content="productivity-tools" />
      <meta name="claude-topic" content="ai-prompts-optimization" />
      <meta name="perplexity-subject" content="ai-prompt-library" />
      
      {additionalData && (
        <script type="application/ld+json">
          {JSON.stringify(additionalData)}
        </script>
      )}
    </Helmet>
  );
};