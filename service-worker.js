const CACHE_NAME = 'daylog-stability-v85';
const CACHE_PREFIX = 'daylog-complete-';
// Older DAYLOG builds used different names. Delete only these known cache IDs;
// Cache Storage is origin-wide, so a broad 'daylog-' prefix could affect another app.
const LEGACY_DAYLOG_CACHES = new Set([
  'daylog-logo-theme-adaptive-v53',
  'daylog-home-icon-v54',
  'daylog-home-icon-v55',
  'daylog-weekly-monthly-v56',
  'daylog-advanced-analysis-v57',
  'daylog-period-switch-v58',
  'daylog-custom-date-responsive-v59',
  'daylog-date-input-overflow-v60',
  'daylog-ios-date-webkit-fix-v61',
  'daylog-custom-calendar-v62',
  'daylog-multi-series-v63',
  'daylog-daily-routine-v64',
  'daylog-stable-routines-svg-v65',
  'daylog-immersive-timer-v66',
  'daylog-immersive-timer-v67',
  'daylog-immersive-timer-v68',
  'daylog-session-merge-v69',
  'daylog-session-merge-v70',
  'daylog-session-merge-v71',
  'daylog-timer-layout-v72',
  'daylog-session-merge-v73',
  'daylog-performance-v74',
  'daylog-performance-v75',
  'daylog-performance-v76',
  'daylog-status-balance-v77',
  'daylog-performance-v78',
  'daylog-analysis-definition-v79',
  'daylog-custom-delete-confirm-v80',
  'daylog-unrecorded-in-label-v81',
  'daylog-soft-fade-v82',
  'daylog-progress-v83',
  'daylog-analysis-label-colors-v84'
]);
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
    const oldDaylogCaches = keys.filter(key => (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) || LEGACY_DAYLOG_CACHES.has(key));
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
