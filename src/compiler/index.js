import { generate } from "./generate";
import { parseHTML } from "./parse";

export function compileToFunctions(template) {
  let astElement = parseHTML(template);

  let code = generate(astElement);

  let render = `with(this){return ${code}}`;

  let fn = new Function(render);
  return fn;
}
