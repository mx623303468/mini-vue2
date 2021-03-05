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

  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      value = newValue;
    },
  });
}
