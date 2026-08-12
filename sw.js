/* Flip 7 Scorekeeper — service worker.
   Network first so a new upload is picked up straight away, falling back to
      the cache so the app still opens with no signal at the table. */
      const CACHE = 'flip7-app';
      self.addEventListener('install', e => {
        e.waitUntil(
            caches.open(CACHE)
                  .then(c => c.addAll(['./', './index.html']))
                        .catch(() => {})
                              .then(() => self.skipWaiting())
                                );
                                });
                                self.addEventListener('activate', e => {
                                  e.waitUntil(
                                      caches.keys()
                                            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
                                                  .then(() => self.clients.claim())
                                                    );
                                                    });
                                                    self.addEventListener('fetch', e => {
                                                      if (e.request.method !== 'GET') return;
                                                        e.respondWith(
                                                            fetch(e.request)
                                                                  .then(res => {
                                                                          const copy = res.clone();
                                                                                  caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
                                                                                          return res;
                                                                                                })
                                                                                                      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
                                                                                                        );
                                                                                                        });
