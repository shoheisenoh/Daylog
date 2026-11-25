const CACHE_NAME = 'daylog-home-icon-v55';
const CACHE_PREFIX = 'daylog-';
const APP_SHELL = [
  './', './index.html', './manifest.webmanifest',
  './icon.svg', './icon-light.svg', './icon-dark.svg',
  './logo.svg', './logo-light.svg', './logo-dark.svg',
  './icon-180.png', './icon-192.png', './icon-512.png',
  './icon-dark-192.png', './icon-dark-512.png', './icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const oldDaylogCaches = keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME);
    await Promise.all(oldDaylogCaches.map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);
  if (requestUrl.origin !== scopeUrl.origin || !requestUrl.href.startsWith(scopeUrl.href)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        const copy = response.clone();
        cache.put(request, copy).catch(() => {});
      }
      return response;
    } catch (error) {
      if (request.mode === 'navigate') {
        const offlinePage = await cache.match(new URL('./index.html', scopeUrl).href);
        if (offlinePage) return offlinePage;
      }
      throw error;
    }
  })());
});
