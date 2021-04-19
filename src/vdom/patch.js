import { isSameVNode } from "./index.js";

export function patch(oldVNode, vnode) {
  // lodVNode 是一个真实的元素
  // 1. 如果是一个组件 oldVNode 是null, $mount()
  if (!oldVNode) {
    return createElm(vnode); // 根据虚拟节点创建元素
  }
  const isRealElement = oldVNode.nodeType;
  // 2. 初次渲染 oldVNode 是一个真实的 Dom
  if (isRealElement) {
    // 初次渲染
    const oldElm = oldVNode; // id="app"
    const parentElm = oldElm.parentNode; // body

    let el = createElm(vnode); // 根据虚拟节点创建真实的节点
    parentElm.insertBefore(el, oldElm.nextSibling); // 将创建的节点插入到原有节点的下一个
    parentElm.removeChild(oldElm); // 删除原来的节点
    return el;
  } else {
    // console.log(oldVNode, vnode);
    // 3. diff 算法 两个虚拟节点的比对

    // 1. 如果两个虚拟节点的标签不一致， 那就直接替换掉
    if (oldVNode.tag !== vnode.tag) {
      return oldVNode.el.parentNode.replaceChild(createElm(vnode), oldVNode.el);
    }

    // 2. 如果标签一样，但是是两个文本元素 {tag: undefined, text}
    if (!oldVNode.tag) {
      // 标签相同， 而且是文本
      if (oldVNode.text !== vnode.text) {
        return (oldVNode.el.textContent = vnode.text);
      }
    }

    // 3. 如果元素相同, 复用老节点，并且更新属性
    let el = (vnode.el = oldVNode.el);
    updateProperties(vnode, oldVNode.data);

    // 4. 更新子节点

    let oldChildren = oldVNode.children || [];
    let newChildren = vnode.children || [];

    if (oldChildren.length > 0 && newChildren.length > 0) {
      // a. 老的有子节点，新的也有子节点， dom-diff
      updateChildren(el, oldChildren, newChildren);
    } else if (oldChildren.length > 0) {
      // b. 老的有子节点，新的没有子节点 => 删除老的子节点
      el.innerHTML = "";
    } else if (newChildren.length > 0) {
      // c. 老的没有子节点，新的有子节点， => 在老节点上面增加子节点即可
      newChildren.forEach((child) => el.appendChild(createElm(child)));
    }
  }
}

function updateChildren(parent, oldChildren, newChildren) {
  let oldStartIndex = 0;
  let oldEndIndex = oldChildren.length - 1;
  let oldStartVNode = oldChildren[oldStartIndex];
  let oldEndVNode = oldChildren[oldEndIndex];

  let newStartIndex = 0;
  let newEndIndex = newChildren.length - 1;
  let newStartVNode = newChildren[newStartIndex];
  let newEndVNode = newChildren[newEndIndex];

  function makeIndexByKey(children) {
    let map = {};
    children.forEach((child, index) => {
      map[child.key] = index;
    });
    return map;
  }

  let map = makeIndexByKey(oldChildren);

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVNode) {
      // 如果节点为空，前面的指针跳过
      oldStartVNode = oldChildren[++oldStartIndex];
    } else if (!oldEndVNode) {
      // 如果节点为空，后面的指针跳过
      oldEndVNode = oldChildren[--oldEndIndex];
    } else if (isSameVNode(oldStartVNode, newStartVNode)) {
      // 向后插入
      patch(oldStartVNode, newStartVNode);
      oldStartVNode = oldChildren[++oldStartIndex];
      newStartVNode = newChildren[++newStartIndex];
    } else if (isSameVNode(oldEndVNode, newEndVNode)) {
      // 向前插入
      patch(oldEndVNode, newEndVNode);
      oldEndVNode = oldChildren[--oldEndIndex];
      newEndVNode = newChildren[--newEndIndex];
    } else if (isSameVNode(oldStartVNode, newEndVNode)) {
      // 头移动到尾部
      patch(oldStartVNode, newEndVNode);
      parent.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibling);
      oldStartVNode = oldChildren[++oldStartIndex];
      newEndVNode = newChildren[--newEndIndex];
    } else if (isSameVNode(oldEndVNode, newStartVNode)) {
      // 尾部移动到头部
      patch(oldEndVNode, newStartVNode);
      parent.insertBefore(oldEndVNode.el, oldStartVNode.el);
      oldEndVNode = oldChildren[--oldEndIndex];
      newStartVNode = newChildren[++newStartIndex];
    } else {
      let moveIndex = map[newStartVNode.key];
      if (moveIndex == undefined) {
        parent.insertBefore(createElm(newStartVNode), oldStartVNode.el);
      } else {
        let moveVNode = oldChildren[moveIndex];
        oldChildren[moveIndex] = undefined;
        patch(moveVNode, newStartVNode);
        parent.insertBefore(moveVNode.el, oldStartVNode.el);
      }
      newStartVNode = newChildren[++newStartIndex];
    }
  }

  if (newStartIndex <= newEndIndex) {
    // 新的比老的多， 插入新节点
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      let nextEle =
        newChildren[newEndIndex + 1] === null
          ? null
          : newChildren[newEndIndex + 1].el;
      parent.insertBefore(createElm(newChildren[i]), nextEle);
      // parent.appendChild(createElm(newChildren[i]));
    }
  }

  if (oldStartIndex <= oldEndIndex) {
    // 如果老的还有剩余，删除多余的
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i];
      if (child != undefined) {
        parent.removeChild(child.el);
      }
    }
  }
}

function createComponent(vnode) {
  let i = vnode.data;
  if ((i = i.hook) && (i = i.init)) {
    i(vnode);
  }
  if (vnode.componentInstance) {
    return true;
  }
  return false;
}

export function createElm(vnode) {
  let { tag, children, key, data, text, vm } = vnode;
  if (typeof tag === "string") {
    // 也可能是组件
    if (createComponent(vnode)) {
      // 如果是组件 就将组件渲染后的真实元素返回
      return vnode.componentInstance.$el;
    }
    vnode.el = document.createElement(tag);
    updateProperties(vnode);

    if (children) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        vnode.el.appendChild(createElm(child));
      }
    }
  } else {
    vnode.el = document.createTextNode(text);
  }

  return vnode.el;
}

function updateProperties(vnode, oldProps = {}) {
  let newProps = vnode.data || {}; // 属性
  let el = vnode.el; // dom 元素

  // 1. 老的属性，新的没有，删除属性
  for (const key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key);
    }
  }

  // style 需要特殊处理
  let newStyle = newProps.style || {};
  let oldStyle = oldProps.style || {};
  for (const key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = "";
    }
  }

  // 2. 新的属性，老的没有, 直接用新的覆盖，不考虑老的属性
  for (const key in newProps) {
    if (key === "style") {
      for (const styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === "class") {
      el.className = newProps.class;
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}
