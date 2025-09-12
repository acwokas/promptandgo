import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<HTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  priority?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  sizes,
  loading = "lazy",
  decoding = "async",
  priority = false,
  className,
  ...props
}: OptimizedImageProps) => {
  // Generate WebP and AVIF versions of the image path if it's a PNG/JPG
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
          sizes={sizes}
          loading={priority ? "eager" : loading}
          decoding={decoding}
          className={cn(className)}
          {...props}
        />
      </picture>
    );
  }

  // Fallback to regular img element
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? "eager" : loading}
      decoding={decoding}
      className={cn(className)}
      {...props}
    />
  );
};