import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    ViteImageOptimizer({
      includePublic: true,
      logStats: false,
      // Balanced PNG optimization
      png: { 
        quality: 70,  // Better quality for crisp images
        compressionLevel: 6,
        adaptiveFiltering: true
      },
      // Balanced JPEG compression
      jpeg: { 
        quality: 75,  // Better quality
        progressive: true
      },
      // Balanced WebP settings
      webp: { 
        quality: 70,  // Better quality
        method: 4,    // Good compression vs speed balance
        autoFilter: true
      },
      // Balanced AVIF compression
      avif: { 
        quality: 55,  // Better quality
        speed: 4      // Good compression vs speed balance
      },
      svg: { 
        multipass: true,
        plugins: [
          { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
          { name: 'removeDimensions' },
          { name: 'removeUselessStrokeAndFill' }
        ]
      },
      // Enable caching
      cache: true,
      cacheLocation: 'node_modules/.vite-imageopt'
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize CSS and JS loading
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Generate preload directives for CSS chunks
        manualChunks: {
          // Keep critical UI components together for better caching
          'ui-core': ['@radix-ui/react-slot', '@radix-ui/react-toast'],
        }
      }
    }
  },
  // Optimize CSS processing
  css: {
    devSourcemap: mode === 'development'
  }
}));
