const esbuild = require("esbuild");

const buildType = ["browser", "node", "neutral"];
async function buildMian() {
  const list = [];
  for (const type of buildType) {
    list.push(
      esbuild.build({
        entryPoints: ["./src/index.ts"], //fileList.filter((item) => ["src\\adapter\\PiniaStorageAdapter.ts"].indexOf(item) === -1),
        bundle: true,
        outfile: "./dist/index." + type + ".min.js",
        minify: true,
        platform: type,
        sourcemap: true,
        // plugins: [dtsPlugin({ outDir: "./dist" })], //生成d.ts文件，拖慢了打包速度
      })
    );
  }
  Promise.all(list).catch(() => process.exit(1));
}
buildMian();
