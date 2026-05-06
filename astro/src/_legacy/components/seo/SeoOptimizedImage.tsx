import { useState } from "react";

interface SeoOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  srcSet?: string;
  title?: string;
  placeholder?: string;
}

export const SeoOptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  loading = "lazy",
  fetchPriority = "auto",
  sizes,
  srcSet,
  title,
  placeholder
}: SeoOptimizedImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (imageError && placeholder) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ width, height }}
        aria-label={alt}
      >
        <span className="text-muted-foreground text-sm">{placeholder}</span>
      </div>
    );
  }

  // Generate optimized sources for better performance
  const getOptimizedSources = (originalSrc: string) => {
    if (!originalSrc.match(/\.(png|jpg|jpeg)$/i)) {
      return [];
    }
    
    const basePath = originalSrc.replace(/\.(png|jpg|jpeg)$/i, '');
    return [
      { srcSet: `${basePath}.avif`, type: 'image/avif' },
      { srcSet: `${basePath}.webp`, type: 'image/webp' }
    ];
  };

  const optimizedSources = getOptimizedSources(src);
  
  // Use picture element for format optimization when available
  if (optimizedSources.length > 0) {
    return (
      <picture>
        {optimizedSources.map((source, index) => (
          <source
            key={index}
            srcSet={source.srcSet}
            type={source.type}
            sizes={sizes}
          />
        ))}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          loading={loading}
          fetchPriority={fetchPriority}
          sizes={sizes}
          srcSet={srcSet}
          title={title}
          onError={handleError}
          onLoad={handleLoad}
          decoding="async"
          // Add structured data for better SEO
          itemProp="image"
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        />
      </picture>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
      sizes={sizes}
      srcSet={srcSet}
      title={title}
      onError={handleError}
      onLoad={handleLoad}
      decoding="async"
      // Add structured data for better SEO
      itemProp="image"
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }}
    />
  );
};