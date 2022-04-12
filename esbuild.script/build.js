const esbuild = require("esbuild");
const { dtsPlugin } = require("esbuild-plugin-d.ts");
//TODO:自己些声明文件
// esbuild
//   .build({
//     entryPoints: ["./src/index.ts"],
//     bundle: true,
//     outfile: "index.min.js",
//     target: ["chrome58", "firefox57", "safari11", "edge16"],
//     minify: true,
//     plugins: [dtsPlugin({ outDir: "./types" })], //生成d.ts文件，拖慢了打包速度
//   })
//   .catch(() => process.exit(1));

const buildType = ["browser", "node", "neutral"];

async function buildMian() {
  const list = [];
  for (const type of buildType) {
    list.push(
      esbuild.build({
        entryPoints: ["./src/index.ts"],
        bundle: true,
        outfile: "./index." + type + ".min.js",
        minify: true,
        platform: "browser",
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
    outfiles: {
      node: "./plugins/iframe/index.node.js",
      browser: "./plugins/iframe/index.browser.js",
      neutral: "./plugins/iframe/index.js",
    },
  },
  {
    entryPoint: "./src/plugins/storage/index.ts",
    bundle: true,
    outfiles: {
      node: "./plugins/storage/index.node.js",
      browser: "./plugins/storage/index.browser.js",
      // neutral: "./plugins/storage/index.js", //暂时无法打包
    },
  },
  {
    entryPoint: "./src/adapter/PiniaStorageAdapter.ts",
    bundle: false,
    outfiles: {
      neutral: "./adapter/PiniaStorageAdapter.js",
    },
  },
];

async function pluginsBuild() {
  const list = [];
  for (const item of pluginsList) {
    for (const key in item.outfiles) {
      list.push(
        esbuild.build({
          entryPoints: [item.entryPoint],
          bundle: item.bundle,
          outfile: item.outfiles[key],
          minify: true,
          platform: key,
        })
      );
    }
  }

  Promise.all(list).catch(() => process.exit(1));
}
pluginsBuild();
