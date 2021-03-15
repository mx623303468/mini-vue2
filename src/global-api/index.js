import { initExtend } from "./extend";
// import { mergeOptions } from "../util/options";
import { initMixin } from "./mixin";

export function initGlobalAPI(Vue) {
  Vue.options = Object.create(null); // 储存全局的配置

  initMixin(Vue);
  initExtend(Vue);

  Vue.options._base = Vue;
  Vue.options.components = {}; // 存放组件的定义
  Vue.component = function (id, definition) {
    definition.name = definition.name || id;
    definition = this.options._base.extend(definition);

    this.options.components[id] = definition;
  };
}
