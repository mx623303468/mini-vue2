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
    const result = originalArrayProto[method].apply(this, args);
    console.log("数组改变触发", method);
    return result;
  };
});
