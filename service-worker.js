const CACHE_NAME = 'daylog-final-stability-v145';
const CACHE_PREFIX = 'daylog-complete-';
// Older DAYLOG builds used different names. Delete only these known cache IDs;
// Cache Storage is origin-wide, so a broad 'daylog-' prefix could affect another app.
const LEGACY_DAYLOG_CACHES = new Set([
  'daylog-auto-stop-note-refined-v144',
  'daylog-explanation-copy-refined-v143',
  'daylog-analysis-json-import-entry-removed-v142',
  'daylog-weekday-note-graph-wide-v141',
  'daylog-analysis-single-settings-disclosure-v140',
  'daylog-analysis-divider-spacing-v139',
  'daylog-analysis-date-selector-inline-v138',
  'daylog-analysis-date-special-filter-disclosures-v137',
  'daylog-analysis-weekday-spacing-v136',
  'daylog-analysis-filter-group-order-v135',
  'daylog-analysis-day-filter-disclosures-v134',
  'daylog-analysis-day-label-hierarchy-v133',
  'daylog-analysis-weekday-dark-muted-buttons-v132',
  'daylog-analysis-weekday-sunday-start-v131',
  'daylog-analysis-weekday-filter-v130',
  'daylog-timer-animation-switch-contrast-v129',
  'daylog-background-harmonized-label-palette-v128',
  'daylog-dark-label-micro-dimmer-v127',
  'daylog-light-label-brightness-nudge-v126',
  'daylog-dark-label-dimmer-v125',
  'daylog-warm-muted-palette-v124',
  'daylog-warm-muted-palette-v123',
  'daylog-label-theme-tuned-v122',
  'daylog-label-palette-balanced-v121',
  'daylog-routine-progress-includes-cycle-v120',
  'daylog-cycle-routine-quota-controls-v119',
  'daylog-cycle-routine-compact-v117',
  'daylog-timewheel-selection-layer-v116',
  'daylog-timewheel-speed-cap-v115',
  'daylog-timewheel-speed-snap-v114',
  'daylog-timewheel-inertia-reduced-motion-v113',
  'daylog-timewheel-touch-velocity-v112',
  'daylog-timewheel-long-inertia-v111',
  'daylog-routine-meter-fix-v110',
  'daylog-routine-touch-speed-v109',
  'daylog-routine-apple-scroll-v108',
  'daylog-routine-wheel-loop-v107',
  'daylog-routine-time-wheel-v106',
  'daylog-routine-custom-input-v105',
  'daylog-routine-options-size-v104',
  'daylog-routine-summary-progress-v100',
  'daylog-routine-sublabel-style-v103',
  'daylog-routine-contrast-v102',
  'daylog-routine-custom-select-v101',
  'daylog-spacing-v99',
  'daylog-calendar-responsive-v98',
  'daylog-toast-wrap-v97',
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
  'daylog-analysis-label-colors-v84',
  'daylog-stability-v85',
  'daylog-proportional-colors-v86',
  'daylog-json-analysis-import-v87',
  'daylog-ios-file-picker-v88',
  'daylog-ios-file-picker-v89',
  'daylog-routine-reset-time-v90',
  'daylog-periodic-routines-v91',
  'daylog-routine-add-unified-v92',
  'daylog-settings-unified-v93',
  'daylog-dark-label-comfort-v94',
  'daylog-label-color-full-spectrum-v95',
  'daylog-analysis-label-stack-v96'
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
