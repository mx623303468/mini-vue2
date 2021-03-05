const originalArrayProto = Array.prototype;

export const arrayMethods = Object.create(originalArrayProto);

const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "reverse",
  "sort",
  "splice",
];

methodsToPatch.forEach((method) => {
  arrayMethods[method] = function (...args) {
    const original = originalArrayProto[method]; // 缓存原来的数组方法
    const result = original.apply(this, args); // 改变指向到现在的数组上

    // 用户新增的数据有可能是对象格式，也需要进行拦截
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
        break;
    }

    if (inserted) this.__ob__.observeArray(inserted);

    console.log("数组改变触发", method);
    return result;
  };
});
