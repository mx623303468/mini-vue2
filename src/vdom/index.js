export function createElement(vm, tag, data = {}, ...children) {
  return new VNode(vm, tag, data, data.key, children, undefined);
}

export function createTextVNode(vm, text) {
  return new VNode(vm, undefined, undefined, undefined, undefined, text);
}

class VNode {
  constructor(vm, tag, data, key, children, text) {
    this.vm = vm;
    this.tag = tag;
    this.data = data;
    this.key = key;
    this.children = children;
    this.text = text;
  }
}
