import Watcher from "./observer/watcher";

export function mountComponent(vm, el) {
  // vue 默认是通过 watcher 来进行渲染的， 也就是渲染 watcher （每一个组件都有自己的渲染 watcher）
  let updateComponent = () => {
    vm._update(vm._render());
  };
  new Watcher(vm, updateComponent, () => {}, true);
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    console.log("_update", vnode);
  };
}
