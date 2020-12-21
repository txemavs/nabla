
var cacheName = 'v1:static';

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        './static/js/vue.js',
        './static/js/vuex.js',
        './static/js/vue-router.js',
        './static/js/vuetify.js',
        './static/js/axios.js',
        './static/js/lodash.min.js'
      ]).then(function() {
        self.skipWaiting();
      });
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});