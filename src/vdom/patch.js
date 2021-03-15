export function patch(oldVNode, vnode) {
  if (!oldVNode) {
    return createElm(vnode);
  }
  const isRealElement = oldVNode.nodeType;
  if (isRealElement) {
    // 初次渲染
    const oldElm = oldVNode; // id="app"
    const parentElm = oldElm.parentNode; // body

    let el = createElm(vnode); // 根据虚拟节点创建真实的节点
    parentElm.insertBefore(el, oldElm.nextSibling); // 将创建的节点插入到原有节点的下一个
    parentElm.removeChild(oldElm); // 删除原来的节点
    return el;
  } else {
    // diff 算法
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

function createElm(vnode) {
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

function updateProperties(vnode) {
  let newProps = vnode.data || {};
  let el = vnode.el;
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
