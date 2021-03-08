import { hasOwn, isObject } from "../../util/index";
import { arrayMethods } from "./array";
import Dep from "./dep";

class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
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

// 让里层的数组收集外层数组的watcher
// 里层和外层收集的是同一个watcher
function dependArray(array) {
  for (let i = 0; i < array.length; i++) {
    const current = array[i];
    current.__ob__ && current.__ob__.dep.depend();
    if (Array.isArray(current)) {
      dependArray(current);
    }
  }
}

export function defineReactive(obj, key) {
  let value = obj[key];

  let childOb = observe(value); // 如果 value 还是一个对象，也进行代理；
  let dep = new Dep(); // 每次都会给属性创建一个 Dep
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.depend(); // 依赖收集，让这个属性的dep记住自己的watcher ，同时watcher 也记住这个dep

        // childOb 可能是对象，也可以是数组
        // 如果是 将当前的watcher 进行关联
        if (childOb) {
          childOb.dep.depend();

          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      observe(newValue); // 如果新设置的值是一个对象，也需要重新代理
      value = newValue;

      dep.notify(); // 通知记录的watcher 执行，进行渲染更新
    },
  });
}

function protoAugment(target, src) {
  target.__proto__ = src;
}
