import { nextTick } from "../../util/next-tick";

let has = {};
let queue = [];
let waiting = false;

function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    const watcher = queue[i];
    watcher.run();
  }
  queue = [];
  has = {};
  waiting = false;
}

export function queueWatcher(watcher) {
  let id = watcher.id;
  if (has[id] == null) {
    queue.push(watcher);
    has[id] = true;
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}
