import { isHTMLTag, isObject } from "../util/index";

export function createElement(vm, tag, data = {}, ...children) {
  if (isHTMLTag(tag, true)) {
    return new VNode(vm, tag, data, data.key, children, undefined);
  } else {
    // 组件 也有可能是对象，暂时先不考虑
    const Ctor = vm.$options.components[tag];
    return createComponent(vm, tag, data, data.key, children, Ctor);
  }
}

function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor);
  }
  data.hook = {
    init(vnode) {
      let child = (vnode.componentInstance = new vnode.componentOptions.Ctor(
        {}
      ));
      child.$mount();
    }, // 初始化的钩子
  };

  // 组件的虚拟节点拥有 hook 和当前组件的componentOptions 中存放了组件的构造函数
  return new VNode(
    vm,
    `vue-component-${tag}-${Ctor.cid}`,
    data,
    key,
    undefined,
    undefined,
    { Ctor }
  );
}

export function createTextVNode(vm, text) {
  return new VNode(vm, undefined, undefined, undefined, undefined, text);
}

class VNode {
  constructor(vm, tag, data, key, children, text, componentOptions) {
    this.vm = vm;
    this.tag = tag;
    this.data = data;
    this.key = key;
    this.children = children;
    this.text = text;
    this.componentOptions = componentOptions;
  }
}
