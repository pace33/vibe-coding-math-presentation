const CACHE='localcheck-pwa-v4';
const ASSETS=['./','./index.html','./manifest.webmanifest','./pwa.js','./favicon.svg','./icons/icon-192.png','./icons/icon-512.png'];
const scope=new URL(self.registration.scope);
const studentPath=new URL('student/',scope).pathname;
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);await self.skipWaiting();})());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{for(const key of await caches.keys()){if(key.startsWith('localcheck-pwa-')&&key!==CACHE)await caches.delete(key);}await self.clients.claim();})());
});
self.addEventListener('fetch',event=>{
 const req=event.request,u=new URL(req.url);
 if(req.method!=='GET'||u.origin!==scope.origin||u.pathname.includes('/api/'))return;
 // Student navigations use fresh HTML. Static assets use normal HTTP caching, never the parent offline page.
 if(u.pathname===studentPath.slice(0,-1)||u.pathname.startsWith(studentPath)){
  if(req.mode!=='navigate')return;
  event.respondWith(fetch(req,{cache:'no-cache'}).catch(()=>req.mode==='navigate'
   ?new Response('<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>우리 지역 탐정</title><body><h1>인터넷 연결을 확인해 주세요.</h1><p>최신 학생용 페이지를 불러오지 못했어요.</p><a href="'+studentPath+'">다시 열기</a></body></html>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8'}})
   :Response.error()));
  return;
 }
 event.respondWith(fetch(req).then(r=>{
  if(r.ok){const copy=r.clone();caches.open(CACHE).then(cache=>cache.put(req,copy)).catch(()=>{});}
  return r;
 }).catch(async()=>{
  const saved=await caches.match(req);
  if(saved)return saved;
  // Only the original app's own entry may use its offline page.
  if(req.mode==='navigate'&&(u.pathname===scope.pathname||u.pathname===new URL('index.html',scope).pathname))return (await caches.match(new URL('index.html',scope).href))||Response.error();
  return Response.error();
 }));
});
