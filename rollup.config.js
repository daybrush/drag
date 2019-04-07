import builder from "@daybrush/builder";

export default builder([
  {
    name: "utils",
    input: "src/index.ts",
    output: "./dist/drag.js",
    exports: "named",
  },
  {
    name: "utils",
    input: "src/index.ts",
    output: "./dist/drag.min.js",
    uglify: true,
    exports: "named",
  },
  {
    name: "utils",
    input: "src/index.ts",
    output: "./dist/drag.pkgd.js",
    resolve: true,
    exports: "named",
  },
  {
    name: "utils",
    input: "src/index.ts",
    output: "./dist/drag.pkgd.min.js",
    resolve: true,
    uglify: true,
    exports: "named",
  },
  {
    name: "utils",
    input: "src/index.ts",
    output: "./dist/drag.esm.js",
    format: "es",
    exports: "named",
  },

]);
