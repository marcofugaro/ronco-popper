console.log('Service Worker started: ', self);

var CACHE_VERSION = 'ronco-v1.1.0';
var urlsToCache = [
    '/',
    '/css/style.min.css',
    '/js/main.min.js',
    '/images/hand-of-god.png',
    '/images/just-the-tip.png',
    '/images/polka-pattern.png',
    '/images/ronco.png',
    '/sounds/gagging.mp3',
    '/sounds/pop.mp3',
    '/sounds/ah-ma-e-ronco.mp3'
];


self.addEventListener('install', function(event) {
    console.log('Installed: ', event);

    event.waitUntil(
        caches.open(CACHE_VERSION).then(function(cache) {
            console.log('Opened cache: ', cache);

            return cache.addAll(urlsToCache).then(function() {
                return self.skipWaiting();
            });
            
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('Activated: ', event);

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(cacheName) {
                if (cacheName !== CACHE_VERSION) {
                    return caches.delete(cacheName);
                }
            })).then(function() {
                // Sets itself as main Service Worker
                return self.clients.claim();
            });
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log('Fetch: ', event);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            // Cache hit - return response, otherwhise make a new request
            return response || fetch(event.request);
        })
    );
});