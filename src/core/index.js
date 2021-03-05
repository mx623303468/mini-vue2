import { initMixin } from "./init";

function Vue(options) {
  if (!(this instanceof Vue)) {
    console.error("Vue是一个构造函数，应该使用“new”关键字来调用它");
  }
  this._init(options);
}

initMixin(Vue);

export default Vue;
