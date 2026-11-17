const CACHE = 'localcheck-pwa-v2';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './pwa.js', './favicon.svg', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const req = event.request;
  const u = new URL(req.url);
  if (req.method !== 'GET' || u.origin !== self.location.origin || u.pathname.startsWith('/api/') || u.pathname.includes('/api/')) return;
  event.respondWith(fetch(req).then(r => {
    if (r.ok) {const copy=r.clone();caches.open(CACHE).then(cache => cache.put(req, copy)).catch(() => {});}
    return r;
  }).catch(() => caches.match(req).then(cached => cached || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
});