import babel from "@rollup/plugin-babel";
import serve from "rollup-plugin-serve";

export default {
  input: "src/core/index.js",
  output: {
    file: "dist/vue.js",
    name: "Vue",
    format: "umd",
    sourcemap: true,
  },
  plugins: [
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    serve({
      openPage: "/public/template.html",
      open: true,
      port: 3000,
      contentBase: "",
    }),
  ],
};
