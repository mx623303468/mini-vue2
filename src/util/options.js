import { isObject } from "./index";

const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destroyed",
  "activated",
  "deactivated",
  "errorCaptured",
  "serverPrefetch",
];

const strats = Object.create(null);

LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook;
});

strats.components = function (parentVal, childVal) {
  const res = Object.create(parentVal);

  if (childVal) {
    for (const key in childVal) {
      res[key] = childVal[key];
    }
  }

  return res;
};

function mergeHook(parentVal, childVal) {
  const res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
      ? childVal
      : [childVal]
    : parentVal;
  return res;
}

export function mergeOptions(parent, child) {
  const options = {};
  let key;
  for (key in parent) {
    mergeField(key);
  }

  for (key in child) {
    if (!Object.hasOwnProperty.call(parent, key)) {
      mergeField(key);
    }
  }

  function mergeField(key) {
    if (strats[key]) {
      return (options[key] = strats[key](parent[key], child[key]));
    }
    if (isObject(parent[key]) && isObject(child[key])) {
      options[key] = { ...parent[key], ...child[key] };
    } else {
      child[key] ? (options[key] = child[key]) : (options[key] = parent[key]);
    }
  }
  return options;
}
