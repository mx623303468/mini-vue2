import { hasOwn, isObject } from "../../util/index";
import { arrayMethods } from "./array";

class Observer {
  constructor(value) {
    this.value = value;
    // 增加自定义属性 __ob__ 保存 this
    Object.defineProperty(value, "__ob__", {
      value: this,
      enumerable: false, // 不能被枚举 不能被循环
      configurable: false, // 不能删除此属性
    });

    if (Array.isArray(value)) {
      // 如果是数组，使用 defineProperty 代理，性能不好
      // 重写劫持会改变数组的 7 个方法，增加自定义的更新逻辑
      // push pop shift unshift reverse splice sort
      protoAugment(value, arrayMethods);

      // 数组中有对象的情况
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }

  observeArray(array) {
    for (let i = 0; i < array.length; i++) {
      observe(array[i]);
    }
  }
}

export function observe(data) {
  // data 必须是一个对象 否则无法观测
  if (!isObject(data)) {
    return;
  }

  if (hasOwn(data, "__ob__") && data.__ob__ instanceof Observer) {
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

function protoAugment(target, src) {
  target.__proto__ = src;
}
