import { unicodeRegExp } from "../util/index";

const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const doctype = /^<!DOCTYPE [^>]+>/i;
const comment = /^<!\--/;
const conditionalComment = /^<!\[/;

export function parseHTML(html) {
  function createASTElement(tag, attrs) {
    // 创建 AST语法树
    return {
      tag,
      type: 1,
      children: [],
      attrs,
      parent: null,
    };
  }

  let root = null; // 标记是否为根节点
  let currentParent; // 记录父节点
  let stack = [];

  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs);
    if (!root) {
      // 如果不是根节点
      root = element;
    }
    currentParent = element; // 如果是根节点，记录下来，作为子节点的 父节点
    stack.push(element);
  }

  function chars(text) {
    text = text.replace(/\s/g, "");
    if (text) {
      currentParent.children.push({
        type: 3,
        text,
      });
    }
  }

  function end(tagName) {
    let element = stack.pop();
    currentParent = stack[stack.length - 1];
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }

  function advance(n) {
    html = html.substring(n);
  }

  function parseStartTag() {
    const start = html.match(startTagOpen); // 匹配开始标签

    if (start) {
      let match = {
        tagName: start[1],
        attrs: [],
      };

      advance(start[0].length); // 删除已匹配过的

      let end, attr;
      // 不是开头标签的结尾就一直解析
      // 如果是开头标签的结尾，并且属性解析完毕
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
      }

      // 删除已解析的
      if (end) {
        advance(end[0].length);
        return match;
      }
    }
  }

  while (html) {
    let textEnd = html.indexOf("<"); // 定位开头标签
    if (textEnd === 0) {
      let startTagMatch = parseStartTag(); // 匹配开始标签的名称和属性
      if (startTagMatch) {
        // 如果匹配完成继续接下来的解析
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }

      let endTagMatch = html.match(endTag); // 匹配结束标签
      if (endTagMatch) {
        // 匹配完成删除
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }

    let text;
    if (textEnd > 0) {
      // 如果不是开头
      text = html.substring(0, textEnd);
    }

    if (text) {
      // 如果匹配到文本节点
      advance(text.length);
      chars(text);
    }
  }

  return root;
}
