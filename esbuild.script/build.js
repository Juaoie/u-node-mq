const esbuild = require("esbuild");
// const { dtsPlugin } = require("esbuild-plugin-d.ts");

const buildType = ["browser", "node", "neutral"];

async function buildMian() {
  const list = [];
  for (const type of buildType) {
    list.push(
      esbuild.build({
        entryPoints: ["./src/index.ts"],
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

////plugins
const pluginsList = [
  {
    entryPoint: "./src/plugins/iframe/index.ts",
    bundle: true,
    minify: true,
    sourcemap: true,
    outfiles: {
      node: "./dist/plugins/iframe/index.node.js",
      browser: "./dist/plugins/iframe/index.browser.js",
      neutral: "./dist/plugins/iframe/index.neutral.js",
    },
    // plugins: [dtsPlugin({ outDir: "./dist" })], //生成d.ts文件，拖慢了打包速度
  },
  // {
  //   entryPoint: "./src/plugins/storage/index.ts",
  //   bundle: true,
  //   minify: true,
  //   sourcemap: true,
  //   outfiles: {
  //     node: "./dist/plugins/storage/index.node.js",
  //     browser: "./dist/plugins/storage/index.browser.js",
  //     neutral: "./dist/plugins/storage/index.neutral.js", //暂时无法打包
  //   },
  // },
  // {
  //   entryPoint: "./src/adapter/PiniaStorageAdapter.ts",
  //   bundle: false,
  //   minify: true,
  //   sourcemap: true,
  //   outfiles: {
  //     node: "./dist/adapter/PiniaStorageAdapter.node.js",
  //     browser: "./dist/adapter/PiniaStorageAdapter.browser.js",
  //     neutral: "./dist/adapter/PiniaStorageAdapter.neutral.js",
  //   },
  // },
];

async function pluginsBuild() {
  const list = [];
  for (const item of pluginsList) {
    for (const key in item.outfiles) {
      list.push(
        esbuild.build({
          entryPoints: [item.entryPoint],
          platform: key,
          bundle: item.bundle,
          outfile: item.outfiles[key],
          minify: item.minify,
          sourcemap: item.sourcemap,
        })
      );
    }
  }

  Promise.all(list).catch(() => process.exit(1));
}
pluginsBuild();
