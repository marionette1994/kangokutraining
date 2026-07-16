// =============================================================
// 鍛帳 — Service Worker
// All core assets are same-origin, so the app works fully offline
// from the very first load. Web fonts are the only remote resource
// and are optional (system mincho fallback).
// =============================================================

const CACHE_NAME = 'tancho-v2';

const CORE_ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './vendor/tailwind.css',
  './vendor/react.min.js',
  './vendor/react-dom.min.js',
  './vendor/prop-types.min.js',
  './vendor/recharts.min.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/icon-180.png',
];

// Optional remote resources (fonts). Never block install on these.
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // addAll() is atomic: one failure aborts everything. Add individually
      // so a single missing file can't brick the whole install.
      await Promise.all(
        CORE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW] failed to cache:', url, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }

  // Fonts: stale-while-revalidate, failure is harmless
  if (FONT_HOSTS.some((h) => url.hostname.includes(h))) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(req);
        const network = fetch(req)
          .then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Only handle our own origin
  if (url.origin !== self.location.origin) return;

  // Cache-first for app shell
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => {
          if (req.mode === 'navigate') return caches.match('./index.html');
        });
    })
  );
});
