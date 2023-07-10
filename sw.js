self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('tracker-app-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/stats.html',
        '/styles.css',
        '/stats.css',
        '/main.js',
        '/stats.js',
        '/manifest.json',
        'graph.png',
        'icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});