const CACHE = "routine-v7";
const FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];
const SORTABLE_CDN = "https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => {
    // 정렬 라이브러리도 오프라인용으로 캐시 (실패해도 설치는 계속)
    c.add(new Request(SORTABLE_CDN, { mode: "no-cors" })).catch(() => {});
    return c.addAll(FILES);
  }));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  // 구글 API/로그인 요청은 캐시하지 않고 항상 네트워크로
  if (e.request.url.includes("googleapis.com") || e.request.url.includes("accounts.google.com")) return;
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
