/**
 * Zawr Industries — Custom Service Worker
 * Implements:
 * - CacheFirst for Cloudinary images (instant load, 1 year cache)
 * - NetworkFirst with offline fallback for HTML pages
 * - CacheFirst for Next.js static JS/CSS chunks
 * - Offline fallback page for when network is unavailable
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `zawr-static-${CACHE_VERSION}`;
const PAGE_CACHE = `zawr-pages-${CACHE_VERSION}`;
const IMAGE_CACHE = `zawr-images-${CACHE_VERSION}`;

const OFFLINE_URL = '/offline.html';

// Assets to pre-cache on install (app shell)
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon-dark.png',
];

// ── INSTALL ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache failed for some assets:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const allowedCaches = [STATIC_CACHE, PAGE_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !allowedCaches.includes(key))
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // 1. Cloudinary images → CacheFirst (instant load, serve from cache)
  if (url.hostname === 'res.cloudinary.com') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, 365 * 24 * 60 * 60));
    return;
  }

  // 2. Next.js static chunks (_next/static/) → CacheFirst (content-hashed)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, 365 * 24 * 60 * 60));
    return;
  }

  // 3. Next.js image optimization → CacheFirst
  if (url.pathname.startsWith('/_next/image')) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, 30 * 24 * 60 * 60));
    return;
  }

  // 4. Static files (icons, fonts, manifest) → CacheFirst
  if (
    url.pathname.match(/\.(png|jpg|jpeg|webp|avif|svg|gif|ico|woff2|woff|ttf|otf|pdf)$/) ||
    url.pathname === '/manifest.json'
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, 365 * 24 * 60 * 60));
    return;
  }

  // 5. HTML page navigations → NetworkFirst with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // 6. Everything else → NetworkFirst
  event.respondWith(networkFirst(request, PAGE_CACHE));
});

// ── STRATEGIES ─────────────────────────────────────────────────────────────

/**
 * CacheFirst: Serve from cache. If not cached, fetch, store and return.
 */
async function cacheFirst(request, cacheName, maxAgeSeconds) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    // Validate freshness via Date header
    const dateHeader = cached.headers.get('date');
    if (dateHeader) {
      const cachedTime = new Date(dateHeader).getTime();
      const now = Date.now();
      if ((now - cachedTime) / 1000 < maxAgeSeconds) {
        return cached;
      }
    } else {
      return cached; // No date header — serve from cache anyway
    }
  }

  try {
    const response = await fetch(request);
    if (response.ok || response.type === 'opaque') {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return cached || new Response('Network error', { status: 408 });
  }
}

/**
 * NetworkFirst: Try network, fall back to cache.
 */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

/**
 * NetworkFirst for page navigations — serves /offline.html when both
 * network and cache miss.
 */
async function networkFirstWithOfflineFallback(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;

    // Serve offline page
    const offlineResponse = await caches.match(OFFLINE_URL);
    return offlineResponse || new Response('<h1>You are offline</h1>', {
      headers: { 'Content-Type': 'text/html' },
      status: 503,
    });
  }
}
