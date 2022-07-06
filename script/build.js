import esbuild from "esbuild";
import chalk from "chalk";
import fs from "fs-extra";
import { execa } from "execa";
import path from "path";

const minify = true;
const bundle = true;
const platform = "neutral";
const now = new Date().getTime();

async function buildMain() {
  //清除缓存
  await execa("pnpm", ["clr"]);

  /**
   //配置执行目录失效
  const data = await execa("dir", [], {
    // cmd: path.join(process.cwd(), "./termui"),
    // execPath: path.join(process.cwd(), "./termui"),
    nodePath: path.join(process.cwd(), "./termui"),
  });
  console.log(data);
   */

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

  await Promise.all([unmq, plugin, operators, execa("pnpm", ["gobuild"]), execa("tsc")]);

  // 使用tsc输出operators d.ts文件进行覆盖，会改变源码
  await fs.copy("dist/operators", "types/operators", {
    //过滤.js文件，只要d.js文件
    filter: src => src.slice(-3) !== ".js",
  });
  //生成u-node-mq包
  await Promise.all([
    fs.copy("package.json", "u-node-mq/package.json"),
    fs.copy("LICENSE", "u-node-mq/LICENSE"),
    fs.copy("README.md", "u-node-mq/README.md"),
    fs.copy("types", "u-node-mq"),
    fs.copy("./termui/u-node-mq-termui.exe", "u-node-mq/bin/u-node-mq-termui.exe"),
  ]);

  console.log(chalk.cyanBright("执行时长：" + (new Date().getTime() - now) / 1000 + "秒"));
}
buildMain();
