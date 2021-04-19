import { compileToFunctions } from "../compiler/index";
import { initGlobalAPI } from "../global-api/index";
import { createElm, patch } from "../vdom/patch";
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

// let vm1 = new Vue({
//   data() {
//     return {
//       name: "yy",
//     };
//   },
// });

// let render1 = compileToFunctions(
//   `<div id="a">
//       <li key="A">A</li>
//       <li key="B">B</li>
//       <li key="C">C</li>
//       <li key="D">D</li>
//       <li key="F">F</li>
//     </div>`
// );
// let oldVnode = render1.call(vm1);
// let el1 = createElm(oldVnode);
// document.body.appendChild(el1);

// let vm2 = new Vue({
//   data() {
//     return {
//       name: "qq",
//     };
//   },
// });

// let render2 = compileToFunctions(
//   `<div id="b">
//   <li key="N">N</li>
//   <li key="A">A</li>
//   <li key="C">C</li>
//   <li key="B">B</li>
//   <li key="E">E</li></div>`
// );
// let newVnode = render2.call(vm2);
// // let el2 = createElm(newVnode)
// // document.body.appendChild(el2)

// setTimeout(() => {
//   patch(oldVnode, newVnode);
// }, 2000);

export default Vue;
