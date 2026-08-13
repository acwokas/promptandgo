// PromptAndGo Service Worker - PWA with offline support
// NOTE: We intentionally do NOT cache Vite dev-server module paths
// (e.g. /node_modules/.vite/, /@vite/, /src/) because caching them can
// cause "Invalid hook call" / "useRef is null" errors from mismatched React.

const CACHE_NAME = "pag-v2";
const PRECACHE_URLS = ["/", "/offline.html", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Clean up old caches
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
      )
      .then(() => self.clients.claim())
  );
});

function shouldBypassCache(req) {
  try {
    const url = new URL(req.url);
    // Only cache same-origin assets
    if (url.origin !== self.location.origin) return true;

    const p = url.pathname;
    // Vite dev server paths / module graph
    if (p.startsWith("/node_modules/") || p.startsWith("/@vite/") || p.startsWith("/src/")) return true;

    // Common dev cache-buster query
    if (url.searchParams.has("v")) return true;

    return false;
  } catch {
    return true;
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== "GET") return;

  // Skip non-http(s) requests
  if (!req.url.startsWith("http")) return;

  // Never cache dev-server module paths
  if (shouldBypassCache(req)) {
    event.respondWith(fetch(req));
    return;
  }

  // Navigation requests: network first, fallback to offline page
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          return cached || caches.match("/offline.html");
        })
    );
    return;
  }

  // Asset requests: cache first, then network
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          // Only cache successful responses
          if (res.ok && (res.type === "basic" || res.type === "cors")) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => new Response("", { status: 503, statusText: "Service Unavailable" }));
    })
  );
});
