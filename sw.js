/* Offline shell: keep new assets while retaining original games. */
const CACHE='games-world-2026-10-31-v2';
const CORE=['./','./index.html','./css/style.css','./js/script.js','./js/adventures.js','./manifest.webmanifest','./images/favicon.png',
  './images/adventure/forest.webp','./images/adventure/ocean.webp','./images/adventure/garden.webp','./images/adventure/cosmos.webp','./images/adventure/candy.webp',
  './images/adventure/fox-run.webp','./images/adventure/submarine.webp','./images/adventure/pearl.webp','./images/adventure/jelly.webp','./images/adventure/flowers.webp',
  './images/adventure/hero-world.webp',...['moon-run','pearl-dive','flower-beat','star-path','candy-stack'].map(n=>'./images/adventure/thumb-'+n+'.webp')];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});}return r;}).catch(()=>caches.match(e.request)));});
