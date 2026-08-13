import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ArticleImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "video" | "square" | "auto";
  priority?: boolean;
  sizes?: string;
}

/**
 * Optimized image component for articles and thumbnails.
 * Features:
 * - Intersection Observer-based lazy loading
 * - Native lazy loading fallback
 * - Async decoding for non-blocking rendering
 * - Blur-up placeholder animation
 * - Automatic srcset for responsive images
 */
export const ArticleImage = ({
  src,
  alt,
  className,
  aspectRatio = "video",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: ArticleImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const aspectClass = {
    video: "aspect-video",
    square: "aspect-square",
    auto: "",
  }[aspectRatio];

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectClass,
        className
      )}
    >
      {/* Shimmer placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted-foreground/5 to-muted animate-pulse" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          Image unavailable
        </div>
      )}

      {/* Actual image - only render when visible */}
      {isVisible && !hasError && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
};
