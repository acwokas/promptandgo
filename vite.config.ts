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
      png: { 
        quality: 60,  // More aggressive compression
        compressionLevel: 9,
        adaptiveFiltering: true
      },
      jpeg: { 
        quality: 65,
        progressive: true
      },
      webp: { 
        quality: 65,
        method: 6  // Better compression
      },
      avif: { 
        quality: 45,
        speed: 0  // Best compression
      },
      svg: { 
        multipass: true,
        plugins: [
          { name: 'preset-default', params: { overrides: { removeViewBox: false } } }
        ]
      },
      // Enable format conversion to WebP for better performance
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
