// PromptAndGo Service Worker - Minimal for PWA installability
const CACHE_NAME = 'promptandgo-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Basic fetch handler - pass through to network
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
