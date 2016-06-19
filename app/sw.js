console.log('Service Worker started: ', self);

var urlsToCache = [
    '/ronco/',
    '/ronco/css/style.min.css',
    '/ronco/js/main.min.js',
    '/ronco/images/hand-of-god.png',
    '/ronco/images/just-the-tip.png',
    '/ronco/images/polka-pattern.png',
    '/ronco/images/ronco.png',
    '/ronco/sounds/gagging.mp3',
    '/ronco/sounds/pop.mp3',
    // '/ronco/sounds/ah-ma-e-ronco.mp3'
];


self.addEventListener('install', function(event) {
    console.log('Installed: ', event);

    event.waitUntil(
        caches.open('ronco').then(function(cache) {
            console.log('Opened cache: ', cache);

            return cache.addAll(urlsToCache).then(function() {
                return self.skipWaiting();
            });
            
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('Activated: ', event);

    // Sets itself as main Service Worker
    event.waitUntil(self.clients.claim());
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