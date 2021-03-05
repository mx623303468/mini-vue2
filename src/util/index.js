/**
 * 检测是否为对象
 */
export function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

/**
 * 检查一个对象是否具有该属性
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
