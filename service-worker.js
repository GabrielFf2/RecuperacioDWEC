const CACHE_NAME = "score-finder-cache-v1";
const FILES_TO_CACHE = [
    "/",
    "/piano.html",
    "/css/piano.css",
    "/views/piano.js",
    "/imgs/logo-192.jpg",
    "/imgs/logo-512.jpg",
    "/audio/do.mp3",
    "/audio/do-sust.mp3",
    "/audio/re.mp3",
    "/audio/re-sust.mp3",
    "/audio/mi.mp3",
    "/audio/fa.mp3",
    "/audio/fa-sust.mp3",
    "/audio/sol.mp3",
    "/audio/sol-sust.mp3",
    "/audio/la-sust.mp3",
    "/audio/si.mp3",
    "/audio/si0.mp3",
    "/audio/do7.mp3"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Fitxers en cache");
            return Promise.all(
                FILES_TO_CACHE.map((file) =>
                    cache.add(file).catch((error) => {
                        console.error(`Error en cachejar el fitxer: ${file}`, error);
                    })
                )
            );
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("Eliminant cache antiga:", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});