import { popTarget, pushTarget } from "./dep";
import { queueWatcher } from "./scheduler";

let id = 0;

class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.getter = exprOrFn;
    this.cb = cb;
    this.options = options;
    this.id = ++id;
    this.deps = [];
    this.depsId = new Set();
    this.get();
  }

  get() {
    pushTarget(this); //Dep.target = watcher
    this.getter(); // 会执行 vm._update(vm._render())
    popTarget(); // Dep.target = null;
  }

  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      // dep 去重
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }

  run() {
    this.get();
  }

  update() {
    // 如果多次更改，合并成一次执行（防抖）
    queueWatcher(this);
  }
}

export default Watcher;
