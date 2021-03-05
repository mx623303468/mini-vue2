import { observe } from "./observer/index";

export function initState(vm) {
  const opts = vm.$options;

  if (opts.data) {
    initData(vm);
  }
}

function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data === "function" ? data.call(vm) : data || {};

  const keys = Object.keys(data);
  let i = keys.length;

  while (i--) {
    const key = keys[i];

    proxy(vm, "_data", key);
  }

  observe(data);
}

export function proxy(target, sourceKey, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[sourceKey][key];
    },
    set(newVal) {
      target[sourceKey][key] = newVal;
    },
  });
}
