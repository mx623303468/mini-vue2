import { compileToFunctions } from "../compiler/index";
import { initState } from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;

    vm.$options = options; // 实例上有个 $options 的属性，保存用户传入的所有属性。
    initState(vm); // 初始化状态

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };

  Vue.prototype.$mount = function (el) {
    el = document.querySelector(el);
    const vm = this;
    const options = vm.$options;

    if (!options.render) {
      let template = options.template;
      if (!template && el) {
        template = el.outerHTML;
      }

      const render = compileToFunctions(template.trim());
      options.render = render;
      console.log(options.render);
    }
  };
}
