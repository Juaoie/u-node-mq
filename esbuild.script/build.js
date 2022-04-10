const esbuild = require("esbuild");
const { dtsPlugin } = require("esbuild-plugin-d.ts");

esbuild
  .build({
    entryPoints: ["./src/index.ts", "./src/plugins/iframe/index.ts", "./src/plugins/storage/index.ts"],
    bundle: true,
    outdir: "./",
    minify: true,
    plugins: [dtsPlugin({outDir:"./types"})],//生成d.ts文件，拖慢了打包速度
  })
  .catch(() => process.exit(1));
