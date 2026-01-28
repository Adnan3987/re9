/* ======================================================
   SERVICE WORKER - PWA OFFLINE SUPPORT
====================================================== */

const CACHE_NAME = 're9-cache-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/css/menu.css',
  '/static/css/likovi.css',
  '/static/css/multimedija.css',
  '/static/css/admin.css',
  '/static/css/pagination.css',
  '/static/css/updates.css',
  '/static/js/menu.js',
  '/static/js/intro.js',
  '/static/js/likovi.js',
  '/static/js/multimedija.js',
  '/static/js/hronika.js',
  '/static/js/audio.js',
  '/static/js/updates.js',
  '/static/img/logo/logo.png',
  '/static/img/bg/raccoon_city.jpg',
  '/static/img/bg/hotel_interior.jpg',
  '/static/img/bg/documents_ruins.jpg'
];

// Instalacija - cache fajlova
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache otvoren');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Aktivacija - čišćenje starih cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Brišem stari cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - offline first strategija
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Ako je u cache, vrati iz cache
        if (response) {
          return response;
        }

        // Ako nije, fetch sa mreže
        return fetch(event.request).then(response => {
          // Proveri da li je validna response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response za cache
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Ako nema mreže, vrati offline stranicu
        return caches.match('/');
      })
  );
});
