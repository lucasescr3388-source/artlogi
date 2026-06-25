const C = 'artlogi-v1';
const FILES = [
  '/artlogi/',
  '/artlogi/index.html',
  '/artlogi/manifest.json',
  '/artlogi/icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(C).then(c => c.addAll(FILES).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks =>
      Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200) return res;
        const clone = res.clone();
        caches.open(C).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('/artlogi/index.html'));
    })
  );
});
