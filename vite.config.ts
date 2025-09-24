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
      // Much more aggressive PNG optimization
      png: { 
        quality: 40,  // Heavily compress PNGs
        compressionLevel: 9,
        adaptiveFiltering: true
      },
      // Aggressive JPEG compression
      jpeg: { 
        quality: 50,  // Lower quality for smaller files
        progressive: true
      },
      // Aggressive WebP settings
      webp: { 
        quality: 50,  // Lower quality
        method: 6,    // Best compression
        autoFilter: true
      },
      // Very aggressive AVIF compression
      avif: { 
        quality: 35,  // Very low quality but excellent compression
        speed: 0      // Best compression
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
