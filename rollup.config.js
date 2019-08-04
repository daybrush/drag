import builder from "@daybrush/builder";

export default builder([
  {
    name: "Dragger",
    input: "src/index.ts",
    output: "./dist/drag.js",
    exports: "named",
    resolve: true,
  },
  {
    name: "Dragger",
    input: "src/index.ts",
    output: "./dist/drag.min.js",
    resolve: true,
    uglify: true,
    exports: "named",
  },
  {
    name: "Dragger",
    input: "src/index.ts",
    output: "./dist/drag.esm.js",
    format: "es",
    exports: "named",
  },
  {
    name: "Dragger",
    input: "src/index.umd.ts",
    output: "./dist/drag.cjs.js",
    format: "cjs",
    exports: "named",
  },
]);
