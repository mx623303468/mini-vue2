import { patch } from "../vdom/patch";
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
    // 将虚拟节点转换成真实的dom
    const vm = this;
    // 初始化渲染的时候，会创建一个新节点，并且把老节点删除掉；
    // vm.$el = patch(vm.$options.el, vnode);
    vm.$options.el = patch(vm.$options.el, vnode);
  };
}
