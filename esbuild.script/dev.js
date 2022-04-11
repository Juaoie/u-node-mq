const esbuild = require("esbuild");
const { dtsPlugin } = require("esbuild-plugin-d.ts");

esbuild
  .build({
    entryPoints: ["./src/index.ts", "./src/plugins/iframe/index.ts", "./src/plugins/storage/index.ts"],
    bundle: false,
    minify: true,
    outdir: "./",
  })
  .catch(() => process.exit(1));
