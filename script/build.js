import esbuild from "esbuild";
import chalk from "chalk";
import fs from "fs-extra";
import { execa } from "execa";

const minify = true;
const bundle = true;
const platform = "neutral";
const now = new Date().getTime();
const operatorsDirList = fs.readdirSync("src/operators");

async function buildMain() {
  //清除缓存
  await execa("pnpm", ["clr"]);

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
    entryPoints: operatorsDirList.map(item => `src/operators/${item}/index.ts`),
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
    execa("pnpm", ["gobuild"]),
    execa("pnpm", ["gdts"]),
    fs.copy("package.json", "u-node-mq/package.json"),
    fs.copy("LICENSE", "u-node-mq/LICENSE"),
    fs.copy("README.md", "u-node-mq/README.md"),
  ]);
  fs.copy("./termui/u-node-mq-termui.exe", "u-node-mq/bin/u-node-mq-termui.exe");
  console.log(chalk.cyanBright("执行时长：" + (new Date().getTime() - now) / 1000 + "秒"));
}
buildMain();
