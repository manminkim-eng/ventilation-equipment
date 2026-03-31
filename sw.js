/* ═══════════════════════════════════════
   환기설비 PWA Service Worker
   MANMIN-Ver2.0  |  Cache-First
═══════════════════════════════════════ */
const CACHE = 'hwangi-v2.0';
const ASSETS = [
  './', './index.html', './manifest.json', './sw.js',
  './icons/brand-icon.jpg', './icons/icon-192.png',
  './icons/icon-512.png',   './icons/apple-touch-icon.png',
  './icons/favicon-32.png', './icons/favicon-16.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(ASSETS.map(u =>
        c.add(u).catch(err => console.warn('[SW] skip:', u, err))
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  if(!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(res => {
        if(!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

self.addEventListener('message', e => {
  if(e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
