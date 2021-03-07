import { compileToFunctions } from "../compiler/index";
import { mountComponent } from "./lifecycle";
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
    vm.$options.el = el;

    // 如果有 render 就直接使用 render
    // 没有 render 看有没有 template 属性
    // 没有 template 就接着找外部模板

    if (!options.render) {
      let template = options.template;
      if (!template && el) {
        template = el.outerHTML; // 火狐不兼容 可以使用 document.createElement('div').appendChild('app').innerHTML
      }

      const render = compileToFunctions(template.trim()); // 将模板编译成 render 函数
      options.render = render;
    }

    mountComponent(vm, el); //组件挂载
  };
}
