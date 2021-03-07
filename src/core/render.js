import { createElement, createTextVNode } from "../vdom/index";

export function renderMixin(Vue) {
  Vue.prototype._render = function () {
    const vm = this;
    let render = vm.$options.render; // 获得编译后的render
    let vnode = render.call(vm); // 调用 render 方法产生虚拟节点

    return vnode;
  };

  Vue.prototype._c = function (...args) {
    // 创建元素节点
    return createElement(this, ...args);
  };
  Vue.prototype._v = function (text) {
    // 创建文本节点
    return createTextVNode(this, text);
  };
  Vue.prototype._s = function (val) {
    // 转化为字符串
    return val === null
      ? ""
      : typeof val === "object"
      ? JSON.stringify(val)
      : val;
  };
}
