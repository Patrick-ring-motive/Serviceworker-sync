/* This section will run in the main thread */
void async function MainWindow() {
  if (!self?.window?.Worker) { return; }
  self?.navigator?.serviceWorker?.register?.(document.currentScript.src);
  const myWorker = new Worker(document.currentScript.src);
}?.();

/* This section will run inside our regular worker thread */
void function DedicatedWorker() {
  if (!self?.DedicatedWorkerGlobalScope) { return; }
  
  function sync(func, args) {
    const pack = '/'+encodeURIComponent(JSON.stringify({ "action":"SYNCHRONIZE" , "func": func, "args": args }));
    const request = new XMLHttpRequest();
    request.open("GET", pack, false);
    request.send(null);
    return request.responseText;
  }
}?.();

/* This section will run inside out service worker thread */
void function ServiceWorkerScript() {
  if (!self?.ServiceWorkerGlobalScope) { return; }
  
  /* install asap */
  self.addEventListener('install', e=>e.waitUntil.(self.skipWaiting());
  
  /* activate asap */
  self.addEventListener('activate', e=>e.waitUntil.(clients.claim());
  let syncCache = caches.open('sync-cache');
  
  let asyncFunctions = {
    match: async function () {
      const cache = await syncCache;
      const match = cache.match(...arguments);
      if(!match==undefined){return undefined;}
      const matchClone = match.clone();
      const body = await matchClone.arrayBuffer();
    }
  }
  self.addEventListener('fetch',(event)=> {
    console.log(event.request.url);
    return synchronize(event.request.url);
    function synchronize(url){
      const xhr = JSON.parse(decodeURIComponent(url.split('/')[3]));
      console.log(xhr);
      event.waitUntil((async function(){
        const result = await asyncFunctions[xhr.func](...xhr.args);
        event.respondWith(new Response(result));
        return result;
      })());
    }
  });
}?.();

 
