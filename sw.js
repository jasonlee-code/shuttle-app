const CACHE_NAME = 'shuttle-v1';
// 캐싱할 파일 목록 (실제 파일명과 일치해야 합니다)
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/admin.html',
  '/bus.html',
  '/parent.html',
  '/support.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// 서비스 워커 설치 및 리소스 캐싱
self.addEventListener('install', (e) => {
  console.log('[Service Worker] 설치 중...');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] 전체 파일 캐싱 중');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// 네트워크 요청 가로채기 (캐시 우선 전략)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // 캐시에 있으면 캐시 반환, 없으면 네트워크 요청
      return response || fetch(e.request);
    })
  );
});

// 오래된 캐시 삭제
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] 오래된 캐시 삭제 중', key);
          return caches.delete(key);
        }
      }));
    })
  );
});