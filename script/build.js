const esbuild = require("esbuild");

const minify = false;
const bundle = true;
const platform = "neutral";

async function buildMian() {
  // unmq
  esbuild.build({
    entryPoints: ["src/index.ts"],
    outfile: "index.js",
    platform,
    bundle,
    minify,
    sourcemap: true,
  });
  esbuild.build({
    entryPoints: ["src/plugins/iframe/index.ts"],
    external: [],
    outdir: "plugins",
    platform,
    bundle,
    minify,
    sourcemap: true,
  });

  esbuild.build({
    entryPoints: [
      "src/operators/debounceTime/index.ts",
      "src/operators/filter/index.ts",
      "src/operators/instant/index.ts",
      "src/operators/interval/index.ts",
      "src/operators/localStorage/index.ts",
      "src/operators/map/index.ts",
      "src/operators/newsTime/index.ts",
      "src/operators/of/index.ts",
      "src/operators/removeDuplicates/index.ts",
      "src/operators/session/index.ts",
      "src/operators/state/index.ts",
      "src/operators/task/index.ts",
      "src/operators/throttleTime/index.ts",
    ],
    external: [],
    outdir: "operators",
    platform,
    bundle,
    minify,
    sourcemap: true,
  });
}
buildMian();
