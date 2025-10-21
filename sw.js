// Service Worker for Ilmu Alam PWA
const CACHE_NAME = 'ilmualam-cache-v1';
const OFFLINE_URL = '/offline.html';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles.css',
  OFFLINE_URL
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.log('Service Worker: Cache failed', err);
      })
  );
  // Activate new service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Take control of uncontrolled clients as soon as activated
  self.clients.claim();
});

// Fetch event - serve from cache when offline, only cache same-origin GET success responses
self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching', event.request.url);
  event.respondWith((async () => {
    try {
      // Return cached response if present
      const cached = await caches.match(event.request);
      if (cached) return cached;

      // Fetch from network
      const networkResponse = await fetch(event.request);

      // Only cache GET requests from the same origin and successful responses
      try {
        const requestUrl = new URL(event.request.url);
        if (
          event.request.method === 'GET' &&
          requestUrl.origin === self.location.origin &&
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type !== 'opaque'
        ) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }
      } catch (e) {
        // If URL parsing fails or caching fails, continue without blocking the response
        console.log('Service Worker: Cache condition/put failed', e);
      }

      return networkResponse;
    } catch (err) {
      // Network failed — return offline page if available
      console.log('Service Worker: Fetch failed, offline mode', err);
      const offlineResponse = await caches.match(OFFLINE_URL);
      return offlineResponse || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
  })());
});
