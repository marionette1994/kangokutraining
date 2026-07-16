// =============================================================
// 鍛帳 — Service Worker (単一ファイル版 / v3)
//
// 旧版(tancho-v1 / v2)は index.html を cache-first で配信したため、
// 再デプロイしても古い画面が出続ける罠がありました。
// v3 では:
//   - 起動時に古いキャッシュを全削除
//   - HTML は network-first(更新を必ず拾う / オフライン時のみキャッシュ)
//   - 画像等の静的物のみ cache-first
// =============================================================

const CACHE_NAME = 'tancho-v3';

// 単一ファイル版なので必須はこれだけ。icons/manifest は任意。
const CORE_ASSETS = [
  './',
  './index.html',
];

const OPTIONAL_ASSETS = [
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/icon-180.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 個別に追加。1つ欠けても install 全体を失敗させない。
      await Promise.all(
        [...CORE_ASSETS, ...OPTIONAL_ASSETS].map((url) =>
          cache.add(url).catch(() => { /* optional file, ignore */ })
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 旧バージョンのキャッシュを確実に破棄する
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }

  // 自オリジン以外(フォント等)はブラウザ任せ
  if (url.origin !== self.location.origin) return;

  const isHTML =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    // network-first: 更新を必ず反映。落ちている時だけキャッシュ。
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          }
          return res;
        })
        .catch(async () => {
          return (await caches.match(req)) || (await caches.match('./index.html'));
        })
    );
    return;
  }

  // 静的物: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          }
          return res;
        })
        .catch(() => undefined);
    })
  );
});
