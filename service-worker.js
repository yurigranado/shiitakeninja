const CACHE_NAME = 'sushi-ninja-v2';
const APP_SHELL = [
  './index.html',
  './recover.html',
  './manifest.json',
  './service-worker.js',
  // Se quiser, liste aqui também seus ícones e assets (imagens, CSS, JS externos)
];

// Instala e faz cache do “app shell”
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
  );
});

// Intercepta requests e responde do cache se disponível
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(resp => resp || fetch(e.request))
  );
});

// Ativa imediatamente o novo SW
self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});
