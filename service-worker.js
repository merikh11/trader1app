const CACHE_NAME = 'trade-journal-pro-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/icon.svg',
  '/manifest.json'
];

// Install event: opens a cache and adds the core app shell files to it.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serves requests from the cache first (cache-then-network strategy).
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((response) => {
                // Return the cached response if found.
                if (response) {
                    return response;
                }

                // If not in cache, fetch from the network.
                return fetch(event.request).then((networkResponse) => {
                    const responseToCache = networkResponse.clone();
                    
                    if (event.request.url.startsWith('http')) {
                       cache.put(event.request, responseToCache);
                    }

                    return networkResponse;
                });
            }).catch(error => {
                console.error('Service Worker fetch error:', error);
            });
        })
    );
});

// Activate event: cleans up old caches.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
