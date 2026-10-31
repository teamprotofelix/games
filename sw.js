/* Offline shell: keep new assets while retaining original games. */
const CACHE='games-world-2026-10-31-classic-v3';
const CORE=['./','./index.html','./css/style.css','./js/script.js','./js/adventures.js','./manifest.webmanifest','./images/favicon.png',
  './images/adventure/forest.webp','./images/adventure/ocean.webp','./images/adventure/garden.webp','./images/adventure/cosmos.webp','./images/adventure/candy.webp',
  './images/adventure/fox-run.webp','./images/adventure/submarine.webp','./images/adventure/pearl.webp','./images/adventure/jelly.webp','./images/adventure/flowers.webp',
  './images/adventure/hero-world.webp',...['moon-run','pearl-dive','flower-beat','star-path','candy-stack'].map(n=>'./images/adventure/thumb-'+n+'.webp'),
  ...['whack-mole','memory','catch-star','rps','snake','math-quiz','game2048','bug-catch','tictactoe','reaction','number-baseball','color-word','bubble-pop','slide-puzzle','speed-tap','simon-says'].map(n=>'./images/classic/'+n+'.webp'),
  ...['whack-mole','memory','snake','game2048','bubble-pop','slide-puzzle'].map(n=>'./images/classic/'+n+'-scene.webp'),
  ...['mole-sticker','snake-sticker','puzzle-picture','bubble-sprite'].map(n=>'./images/classic/'+n+'.webp'),
  ...['dog','cat','rabbit','panda','koala','frog','fox','tiger'].map(n=>'./images/classic/animal-'+n+'.webp')];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});}return r;}).catch(()=>caches.match(e.request)));});
