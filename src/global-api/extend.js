import { mergeOptions } from "../util/options";

export function initExtend(Vue) {
  Vue.cid = 0;
  let cid = 1;

  Vue.extend = function (componentOptions) {
    const Super = this; // 永远是 根Vue

    const Sub = function VueComponent(componentOptions) {
      // new Vue 生成组件
      this._init(componentOptions);
    };

    Sub.prototype = Object.create(Super.prototype); // 改变原型指向
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;

    Sub.component = Super.component;

    Sub.options = mergeOptions(Super.options, componentOptions);

    Sub["super"] = Super;

    return Sub;
  };
}
