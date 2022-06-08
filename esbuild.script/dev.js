const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    minify: false,
    outfile: "./test-node/u-node-mq.js",
    sourcemap: true,
    platform: "node",
  })
  .catch(() => process.exit(1));
