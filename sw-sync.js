globalThis.AsyncFunction = async function () { }.constructor;
globalThis.await = _ => _;
globalThis.async = async a => await a();

void async function DedicatedWindow() {

  if (!self?.window?.Worker) { return; }

const first = document.querySelector('#number1');

  const second = document.querySelector('#number2');

 

  const result = document.querySelector('.result');

 

  if (!globalThis.workerMessageMap) {

    globalThis.workerMessageMap = new Map();

  }

 

  function getWorkerMessageId() {

 

    let wmi = ('WorkerMessageId' + new Date().getTime() + "" + performance.now() + "" + Math.random()).replaceAll('.', '_');

    let wmip = {};

    wmip.promise = new Promise((resolve) => { wmip.resolve = resolve; });

    workerMessageMap.set(wmi, wmip);

    return wmi;

 

  }

 

  const myWorker = new Worker(document?.currentScript?.src);

 

  first.onchange = valueChange;

 

  second.onchange = valueChange;

 

  async function valueChange() {

    console.log('Message posted to worker');

    let multiple = await processWorkerMessage('multiply', [first.value, second.value]);

    result.textContent = multiple;

  }

 

  async function processWorkerMessage(func, values) {

 

    let workerId = getWorkerMessageId();

    let workerFunction = func;

    myWorker.postMessage([workerId, workerFunction, [first.value, second.value]]);

    let workerPromise = workerMessageMap.get(workerId).promise;

    let workerReturnValue = await workerPromise;

    setTimeout(X => workerMessageMap.delete(workerId), 100);

    return workerReturnValue;

 

  }

 

  myWorker.onmessage = async function (e) {

 

    let workerId = e.data[0];

    let workerReturnValue = e.data[1];

    workerMessageMap.get(workerId).resolve(workerReturnValue);

    console.log('Message received from worker');

 

  }

 

}?.();

 

 

void function DedicatedWorker() {

 

  if (!self?.DedicatedWorkerGlobalScope) { return; }

  let functions = {};

  self.onmessage = function (e) {

 

    console.log('Worker: Message received from main script');

    let currentFunction = functions[e.data[1]];

    if (currentFunction instanceof AsyncFunction) {

      async(async I => postMessage([e.data[0], await currentFunction(e.data[2])]));

    } else {

      postMessage([e.data[0], currentFunction(e.data[2])]);

    }

 

  }

 

 

  functions = {

    multiply: function (nums) {

      const result = sync('multiply',nums);

      return result;

    }

 

  }

 

  function sync(func, args) {

 

    const pack = '/'+encodeURIComponent(JSON.stringify({ "action":"SYNCHRONIZE" , "func": func, "args": args }));

    const request = new XMLHttpRequest();

    request.open("GET", pack, false);

    request.send(null);

 

    if (request.status === 200) {

      console.log(request.responseText);

    }

 

    return request.responseText;

  }

 

}?.();

 

void function ServiceWorkerScript() {

 

  /* Register service worker to this url */

  self.navigator?.serviceWorker?.['register']?.(onRegister());

  function onRegister() {

    console.log('Registering Service Worker');

    return document.currentScript.src;

  }

 

  if (!self?.ServiceWorkerGlobalScope) { return; }

 

  /* On install, cache core assets */

  self.addEventListener('install', onInstall);

  function onInstall(event) {

    console.log('Installing Service Worker');

    /* start working immediately */

    let skipWait = self.skipWaiting();

    event.waitUntil(skipWait);

    const baseAssets = ['offline.html'];

    event.waitUntil(cacheAssets(baseAssets));

    async function cacheAssets(assets) {

      await skipWait;

      let cache = await caches.open('app');

      try{

      await cache.addAll(assets);

      }catch(e){

        console.log(e.message);

      }

      return cache;

    }

    return;

  }

 

  /* Activate and start using available caches */

  self.addEventListener('activate', onActivate);

  function onActivate(event) {

    console.log('Activating Service Worker');

    event.waitUntil(clients.claim());

    return;

  }

 

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

 

  /* Listen for request events */

  self.addEventListener('fetch', onFetch);

  function onFetch(event) {

  console.log(event.request.url);

    if(event.request.url.includes("SYNCHRONIZE")){

      return synchronize(event.request.url);

    }

 

    function synchronize(str){

      const obj = JSON.parse(decodeURIComponent(str.split('/')[3]));

      const func = obj.func;

      const args = obj.args;

      console.log(func);

      console.log(args);

     

 

     event.waitUntil((async function(){

 

      let result = await asyncFunctions[func](args);

      event.respondWith(new Response(result));

      return result;

 

      })());

 

    

      

      return;

 

    }

 

 

    /* Define levels of cache search */

    const loose = { ignoreVary: true, ignoreMethod: false, ignoreSearch: false };

    const looser = { ignoreVary: true, ignoreMethod: true, ignoreSearch: false };

    const loosest = { ignoreVary: true, ignoreMethod: false, ignoreSearch: true };

    const lost = { ignoreVary: true, ignoreMethod: true, ignoreSearch: true };

 

    async function cascadeMatchesTier1(req) {

      res = await caches.match(req);

      if (res && (res.status < 400)) { return res; }

      res = await caches.match(req, loose);

      return res;

    }

 

    async function cascadeMatchesTier2(req) {

      res = await caches.match(req, looser);

      if (res && (res.status < 400)) { return res; }

      res = await caches.match(req, loosest);

      if (res && (res.status < 400)) { return res; }

      res = await caches.match(req, lost);

      return res;

    }

 

    async function cacheResponse(req, res) {

      let copy = res.clone();

      let cache = await caches.open('app');

      return await cache.put(req, copy);

    }

 

    const endings =

      ['.js',

        '.jsx',

        '.ts',

        '.tsx',

        '.css',

        '.scss',

        '.json',

        '.jpg',

        '.png',

        '.pnj',

        '.gif',

        '.webp',

        '.svg',

        '.ico',

        '.woff',

        '.woff2'];

    const endings_length = endings.length;

    function matchEndings(fileURL) {

      shortURL = fileURL.toLowerCase().split('?')[0].split('#')[0];

      for (let i = 0; i < endings_length; i++) {

        if (shortURL.endsWith(endings[i])) {

          return true;

        }

      }

      return false;

    }

 

    const hosts = [self.location.host];

    const hosts_length = endings.length;

    function matchHosts(fileURL) {

      shortURL = fileURL.toLowerCase().split('?')[0].split('#')[0];

      for (let i = 0; i < hosts_length; i++) {

        if (shortURL.startsWith(hosts[i])) {

          return true;

        }

      }

      return false;

    }

 

    try {

      let processRequest = fetchCache();

      async function fetchCache() {

        let request = event.request;

        const lowURL = request.url.toLowerCase();

        /* Always send google analytics */

        if (lowURL.includes('GoogleAnalytics')) { return; }

        if (!lowURL.startsWith('https://')) { return; }

        if (!matchHosts(lowURL)) { return; }

 

        /* Images */

        /* CSS & JavaScript */

        /* Offline-first */

        const accept = request.headers.get('accept').toLowerCase();

        if (accept.includes('text/css')

          || accept.includes('javascript')

          || accept.includes('image')

          || matchEndings(request.url)) {

          let offlineFirst = offlineFirstFetch();

          async function offlineFirstFetch() {

            let res = await cascadeMatchesTier1(request);

            if (res && (res.status < 400)) { return res; }

            try {

              res = await fetch(request);

              if (res && (res.status < 400)) {

                /* Save a copy of it in cache */

                await cacheResponse(request, res);

                return res;

              }

              res = await cascadeMatchesTier2(request);

              return res;

            } catch (e) {

              console.log(e.message);

              res = await cascadeMatchesTier2(request);

              return res;

            }

          }

          /* Don't turn off Service Worker until this is done */

          event.waitUntil(offlineFirst);

          event.respondWith(offlineFirst);

          await offlineFirst;

          return;

        }

        /* HTML files */

        /* Network-first */

        if (accept.includes('html')) {

          let networkFirst = networkFirstFetch();

          async function networkFirstFetch() {

            try {

              let res = await fetch(request);

              /* Save a copy of it in cache */

              /* Return the response */

              if (res && (res.status < 400)) {

                await cacheResponse(request, res);

                return res;

              }

              res = await cascadeMatchesTier1(request);

              if (res && (res.status < 400)) { return res; }

              res = await cascadeMatchesTier2(request);

              return res;

            } catch (e) {

              console.log(e.message);

              let res = await cascadeMatchesTier1(request);

              if (res && (res.status < 400)) { return res; }

              res = await cascadeMatchesTier2(request);

              return res;

            }

          }

          /* Don't turn off Service Worker until this is done */

          event.waitUntil(networkFirst);

          event.respondWith(networkFirst);

          await networkFirst;

          return;

        }

      }

      /* Don't turn off Service Worker until everything is done */

      event.waitUntil(processRequest);

      return;

    } catch (e) {

      console.log(e.message);

      return;

    }

  }

}?.();

 
