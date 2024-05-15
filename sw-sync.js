void async function MainWindow() {
  if (!self?.window?.Worker) { return; }
  const myWorker = new Worker(document.currentScript.src);
}?.();

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

void function ServiceWorkerScript() {
  self.navigator?.serviceWorker?.register?.(document.currentScript.src);
  if (!self?.ServiceWorkerGlobalScope) { return; }
  self.addEventListener('install', e=>e.waitUntil.(self.skipWaiting());
  self.addEventListener('activate', e=>e.waitUntil.(clients.claim());
  let asyncFunctions = {
    multiply: function (nums) {
      const result = nums[0] * nums[1];
      if (isNaN(result)) {
        return 'Please write two numbers';
      } else {
        const workerResult = 'Result: ' + result;
        console.log('Worker: Posting message back to main script');
        return result;
      }
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

 
