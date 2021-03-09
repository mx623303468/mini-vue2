import { initGlobalAPI } from "../global-api/index";
import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./render";

function Vue(options) {
  if (!(this instanceof Vue)) {
    console.error("Vue是一个构造函数，应该使用“new”关键字来调用它");
  }
  this._init(options);
}

initMixin(Vue); // 扩展状态初始化方法
lifecycleMixin(Vue); // 扩展 _update 方法
renderMixin(Vue); // 扩展 _render 方法

initGlobalAPI(Vue);

export default Vue;
