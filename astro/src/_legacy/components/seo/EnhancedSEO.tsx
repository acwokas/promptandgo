import { Helmet } from "react-helmet-async";

interface ProductSEOProps {
  title: string;
  description: string;
  price?: string;
  image?: string;
  inStock?: boolean;
  category?: string;
  brand?: string;
  sku?: string;
  canonical?: string;
}

export const ProductSEO = ({ 
  title, 
  description, 
  price = "0", 
  image, 
  inStock = true, 
  category,
  brand = "promptandgo.ai",
  sku,
  canonical
}: ProductSEOProps) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://promptandgo.ai";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: description,
    brand: {
      "@type": "Brand",
      name: brand
    },
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: "USD",
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: canonical || (typeof window !== "undefined" ? window.location.href : ""),
      seller: {
        "@type": "Organization",
        name: brand
      }
    },
    ...(image && { image: image.startsWith('http') ? image : `${origin}${image}` }),
    ...(category && { category: category }),
    ...(sku && { sku: sku })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      <meta property="product:price:amount" content={price} />
      <meta property="product:price:currency" content="USD" />
      {category && <meta property="product:category" content={category} />}
      {inStock && <meta property="product:availability" content="in stock" />}
    </Helmet>
  );
};

interface ServiceSEOProps {
  name: string;
  description: string;
  provider: string;
  areaServed?: string;
  serviceType?: string;
  url?: string;
}

export const ServiceSEO = ({ 
  name, 
  description, 
  provider = "promptandgo.ai", 
  areaServed = "Worldwide",
  serviceType = "AI Prompt Library",
  url
}: ServiceSEOProps) => {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: name,
    description: description,
    provider: {
      "@type": "Organization",
      name: provider
    },
    areaServed: areaServed,
    serviceType: serviceType,
    ...(url && { url: url })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  );
};

interface HowToSEOProps {
  name: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
  totalTime?: string;
  estimatedCost?: string;
}

export const HowToSEO = ({ 
  name, 
  description, 
  steps, 
  totalTime,
  estimatedCost 
}: HowToSEOProps) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://promptandgo.ai";
  
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: name,
    description: description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { 
        image: step.image.startsWith('http') ? step.image : `${origin}${step.image}` 
      })
    })),
    ...(totalTime && { totalTime: totalTime }),
    ...(estimatedCost && { estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: estimatedCost } })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(howToSchema)}
      </script>
    </Helmet>
  );
};

interface FAQSEOProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQSEO = ({ faqs }: FAQSEOProps) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};