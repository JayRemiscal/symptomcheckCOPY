import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icons/*.png', 'screenshots/*.png'],
        manifest: false, // use existing public/manifest.json
        workbox: {
          // Cache the app shell (HTML, JS, CSS) so the app loads offline
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          // Navigation fallback: any page request returns index.html (SPA)
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/api\//],
          // Runtime caching for external resources
          runtimeCaching: [
            {
              // OpenStreetMap tiles — cache up to 500 tiles for 30 days
              urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'osm-tiles',
                expiration: { maxEntries: 500, maxAgeSeconds: 30 * 24 * 60 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // Leaflet marker images from unpkg CDN
              urlPattern: /^https:\/\/unpkg\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'unpkg-assets',
                expiration: { maxEntries: 20, maxAgeSeconds: 30 * 24 * 60 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // Nominatim geocoding — network-first so fresh data is preferred
              urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'nominatim',
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // Overpass API — network-first
              urlPattern: /^https:\/\/(overpass-api\.de|overpass\.kumi\.systems|lz4\.overpass-api\.de)\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'overpass',
                networkTimeoutSeconds: 10,
                expiration: { maxEntries: 20, maxAgeSeconds: 24 * 60 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
