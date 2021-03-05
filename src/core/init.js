import { initState } from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;

    vm.$options = options; // 实例上有个 $options 的属性，保存用户传入的所有属性。
    initState(vm); // 初始化状态
  };
}
