globalThis.AsyncFunction = async function () { }.constructor;
void async function MainWindow() {
  if (!self?.window?.Worker) { return; }
  const first = document.querySelector('#number1');
  const second = document.querySelector('#number2');
  const result = document.querySelector('.result');
  globalThis.workerMessageMap ??= new Map();
  function getWorkerMessageId() {
    let wmi = ('WorkerMessageId' + new Date().getTime() + "" + performance.now() + "" + Math.random()).replaceAll('.', '_');
    let wmip = {};
    wmip.promise = new Promise((resolve) => { wmip.resolve = resolve; });
    workerMessageMap.set(wmi, wmip);
    return wmi;
  }
  const myWorker = new Worker(document.currentScript.src);
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
    setTimeout(()=> workerMessageMap.delete(workerId), 100);
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
      (async()=>postMessage([e.data[0], await currentFunction(e.data[2])]))();
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
    }
  });
}?.();

 
