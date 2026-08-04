const CACHE_NAME = 'indus-jobcard-v1.0.0';

// Core static assets to cache for offline application load
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  './icons/icon-maskable-192x192.png',
  './icons/icon-maskable-512x512.png',
  'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap'
];

// Install Event — Pre-cache static shell & assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v1.0.0...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching app shell & static dependencies');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache partial warning:', err);
        // Continue install even if a single CDN asset is temporarily unreachable
        return Promise.allSettled(STATIC_ASSETS.map(url => cache.add(url)));
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event — Clean up old caches & take control immediately
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event Handler
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // ⚠️ CRITICAL: Never intercept or cache Supabase API calls or WebSocket connections!
  // Pass through directly to network to maintain Realtime sync & database integrity.
  if (
    url.hostname.includes('supabase.co') ||
    url.protocol === 'wss:' ||
    url.protocol === 'ws:' ||
    req.headers.get('Upgrade') === 'websocket'
  ) {
    return; // Browser default network handling
  }

  // Non-GET requests (POST, PUT, DELETE, etc.) pass straight through to network
  if (req.method !== 'GET') {
    return;
  }

  // Network-First for main HTML page, falling back to cached index.html if offline
  if (req.mode === 'navigate' || url.pathname.endsWith('index.html') || url.pathname === '/') {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          }
          return response;
        })
        .catch(() => {
          console.log('[SW] Offline mode: serving cached index.html shell');
          return caches.match('./index.html') || caches.match('./');
        })
    );
    return;
  }

  // Stale-While-Revalidate Strategy for static assets (CSS, JS, Fonts, Images)
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        })
        .catch((err) => {
          // Silent catch for network failures when offline
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Listen for SKIP_WAITING message from app UI to trigger instant update
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
