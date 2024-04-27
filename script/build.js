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

  await Promise.all([
    unmq,
    execa("pnpm", ["gdts"]),
    fs.copy("package.json", "u-node-mq/package.json"),
    fs.copy("LICENSE", "u-node-mq/LICENSE"),
    fs.copy("README.md", "u-node-mq/README.md"),
  ]);
  console.log(chalk.cyanBright("执行时长：" + (new Date().getTime() - now) / 1000 + "秒"));
}
buildMain();
