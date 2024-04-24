import esbuild from "esbuild";
import chalk from "chalk";
import fs from "fs-extra";
import { execa } from "execa";
const _package = JSON.parse(fs.readFileSync("./package.json"));
const platform = "neutral";
const now = new Date().getTime();
// const operatorsDirList = fs.readdirSync("src/operators");

async function buildMain() {
  const minify = _package.version.search("beta") === -1;
  //清除缓存
  await execa("pnpm", ["clr"]);

  // 构建core
  const unmq = esbuild.build({
    entryPoints: ["src/index.ts"],
    outfile: "u-node-mq/index.js",
    platform,
    bundle: true,
    minify,
    sourcemap: true,
  });

  //构建plugins
  const plugin = esbuild.build({
    entryPoints: ["src/plugins/iframe/index.ts", "src/plugins/process/index.ts", "src/plugins/wx-logs/index.ts"],
    external: [],
    outdir: "u-node-mq/plugins",
    platform,
    bundle: true,
    minify,
    sourcemap: true,
  });

  //构建utils
  const utils = esbuild.build({
    entryPoints: ["src/utils/tools.ts", "src/utils/types.ts"],
    external: [],
    outdir: "u-node-mq/utils",
    platform,
    bundle: true,
    minify,
    sourcemap: true,
  });

  await Promise.all([
    unmq,
    plugin,
    utils,
    // execa("pnpm", ["gobuild"]),
    execa("pnpm", ["gdts"]),
    fs.copy("package.json", "u-node-mq/package.json"),
    fs.copy("LICENSE", "u-node-mq/LICENSE"),
    fs.copy("README.md", "u-node-mq/README.md"),
  ]);
  // fs.copy("./termui/u-node-mq-termui.exe", "u-node-mq/bin/u-node-mq-termui.exe");
  console.log(chalk.cyanBright("执行时长：" + (new Date().getTime() - now) / 1000 + "秒"));
}
buildMain();
