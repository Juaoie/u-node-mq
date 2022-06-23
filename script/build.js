const esbuild = require("esbuild");
const chalk = require("chalk");
const fs = require("fs-extra");
const execa = require("execa");

const minify = true;
const bundle = true;
const platform = "neutral";
const now = new Date().getTime();

async function buildMian() {
  //清除缓存和使用tsc构建
  await Promise.all([execa("pnpm", ["clr"]), execa("tsc")]);
  // 使用tsc输出operators d.ts文件进行覆盖
  await fs.copy("dist/operators", "types/operators", {
    filter: src => src.slice(-3) !== ".js",
  });
  //先复制类型
  await fs.copy("types", "u-node-mq");
  // 构建
  const unmq = esbuild.build({
    entryPoints: ["src/index.ts"],
    outfile: "u-node-mq/index.js",
    platform,
    bundle,
    minify,
    sourcemap: true,
  });
  const plugin = esbuild.build({
    entryPoints: ["src/plugins/iframe/index.ts", "src/plugins/process/index.ts"],
    external: [],
    outdir: "u-node-mq/plugins",
    platform,
    bundle,
    minify,
    sourcemap: true,
  });

  const operators = esbuild.build({
    entryPoints: [
      "src/operators/debounceTime/index.ts",
      "src/operators/filter/index.ts",
      "src/operators/instant/index.ts",
      "src/operators/interval/index.ts",
      "src/operators/map/index.ts",
      "src/operators/newsTime/index.ts",
      "src/operators/of/index.ts",
      "src/operators/removeDuplicates/index.ts",
      "src/operators/task/index.ts",
      "src/operators/throttleTime/index.ts",
    ],
    external: [],
    outdir: "u-node-mq/operators",
    platform,
    bundle,
    minify,
    sourcemap: true,
  });

  await Promise.all([
    unmq,
    plugin,
    operators,
    fs.copy("package.json", "u-node-mq/package.json"),
    fs.copy("LICENSE", "u-node-mq/LICENSE"),
    fs.copy("README.md", "u-node-mq/README.md"),
  ]);
  // await fs.copy("u-node-mq", "packages/test-vue3/src/u-node-mq");

  //删除dist
  await fs.remove("dist");

  console.log(chalk.cyanBright("执行时长：" + (new Date().getTime() - now) / 1000 + "秒"));
}
buildMian();
