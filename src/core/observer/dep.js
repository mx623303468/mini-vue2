let id = 0;

class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }

  depend() {
    Dep.target.addDep(this);
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }

  notify() {
    for (let i = 0; i < this.subs.length; i++) {
      this.subs[i].update();
    }
  }
}

Dep.target = null;

export function pushTarget(watcher) {
  Dep.target = watcher;
}

export function popTarget() {
  Dep.target = null;
}

export default Dep;
