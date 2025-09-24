import { useState, useRef, useEffect } from "react";
import { SeoOptimizedImage } from "@/components/seo/SeoOptimizedImage";

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  placeholder?: string;
}

export const LazyImage = ({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  placeholder
}: LazyImageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1 
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef} 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }}
    >
      {/* Placeholder while loading */}
      {(!isVisible || !isLoaded) && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center"
          style={{ 
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : '100%'
          }}
        >
          {placeholder && (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          )}
        </div>
      )}
      
      {/* Actual image */}
      {isVisible && (
        <SeoOptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes={sizes}
        />
      )}
    </div>
  );
};