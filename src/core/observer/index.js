import { isObject } from "../../util/index";

class Observer {
  constructor(value) {
    this.value = value;

    this.walk(value);
  }

  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }
}

export function observe(data) {
  // data 必须是一个对象 否则无法观测
  if (!isObject(data)) {
    return;
  }

  return new Observer(data);
}

export function defineReactive(obj, key) {
  let value = obj[key];

  observe(value); // 如果 value 还是一个对象，也进行代理；
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      observe(newValue); // 如果新设置的值是一个对象，也需要重新代理
      value = newValue;
    },
  });
}
