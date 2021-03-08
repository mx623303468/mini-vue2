let callbacks = [];
let pending = false;

let timerFunc;

if (typeof Promise !== "undefined") {
  const p = Promise.resolve();
  timerFunc = () => p.then(flushCallbacks);
}

export function nextTick(cb) {
  callbacks.push(cb);
  if (!pending) {
    pending = true;
    timerFunc();
  }
}

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}
