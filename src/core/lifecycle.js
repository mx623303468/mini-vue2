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

    // 第一次初始化， 第二次走diff算法
    const prevVNode = vm._vnode; // 去上一次的 vnode
    vm._vnode = vnode; // 保存vnode

    if (!prevVNode) {
      // 如果上一次vnode 不存在，证明是第一次
      vm.$el = patch(vm.$el, vnode);
    } else {
      // 如果上次vnode 存在，则走diff对比
      vm.$el = patch(prevVNode, vnode);
    }
  };
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  if (handlers) {
    for (let i = 0, len = handlers.length; i < len; i++) {
      handlers[i].call(vm);
    }
  }
}
