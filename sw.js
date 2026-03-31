// 환기설비 PWA Service Worker — MANMIN-Ver2.0
const CACHE = 'ventilation-v2';
const ASSETS = ['./', './index.html', './manifest.json',
  './hero-bg.jpg',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&family=Noto+Serif+KR:wght@700&display=swap'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(c=>{
    if(c) return c;
    return fetch(e.request).then(r=>{
      if(!r||r.status!==200||r.type==='opaque') return r;
      const clone=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,clone)); return r;
    }).catch(()=>e.request.destination==='document'?caches.match('./index.html'):undefined);
  }));
});
