// PromptAndGo Service Worker - PWA with offline support
const CACHE_NAME = 'pag-v1';
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!req.url.startsWith('http')) return;

  // Navigation requests: network first, fallback to offline page
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Cache successful navigation responses
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(async () => {
          // Try to serve from cache first
          const cached = await caches.match(req);
          if (cached) return cached;
          // Fallback to offline page
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // Asset requests: cache first, then network
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      
      return fetch(req).then((res) => {
        // Only cache successful responses for same-origin or CORS requests
        if (res.ok && (res.type === 'basic' || res.type === 'cors')) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => {
        // Return nothing for failed asset requests
        return new Response('', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});