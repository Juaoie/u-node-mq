const esbuild = require("esbuild");
const chalk = require("chalk");
const fs = require("fs-extra");

const minify = true;
const bundle = true;
const platform = "neutral";
const now = new Date().getTime();

async function buildMian() {
  await Promise.all([fs.remove("u-node-mq"), fs.remove("packages/test-vue3/u-node-mq")]);
  console.log(chalk.blue("缓存清除成功！"));
  // unmq
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
    outdir: "u-node-mq/operators",
    platform,
    bundle,
    minify,
    sourcemap: true,
  });
  //先复杂类型
  await fs.copy("types", "u-node-mq");
  await Promise.all([
    unmq,
    plugin,
    operators,
    fs.copy("package.json", "u-node-mq/package.json"),
    fs.copy("LICENSE", "u-node-mq/LICENSE"),
    fs.copy("README.md", "u-node-mq/README.md"),
  ]);
  await fs.copy("u-node-mq", "packages/test-vue3/u-node-mq");

  console.log(chalk.cyanBright("执行时长：" + (new Date().getTime() - now) / 1000 + "秒"));
}
buildMian();
