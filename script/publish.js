// const _package = require("../package.json");
import chalk from "chalk";
import fs from "fs-extra";
import { execaSync } from "execa";

const _package = JSON.parse(fs.readFileSync("./package.json"));

const now = new Date().getTime();
/**
 * 发布项目文件
 */

execaSync("pnpm", ["build"]);
console.log(chalk.blue("build成功！"));

const { stdout } = execaSync("npm", ["view", "u-node-mq", "versions"]);
console.log(chalk.blue("预发布版本号：", _package.version));
if (-1 !== stdout.indexOf(_package.version)) {
  console.log(chalk.redBright("版本号已存在！"));
  process.exit(1);
}

//生成包
const data = execaSync("npm", ["pack", "./u-node-mq"]);
try {
  //发布正式包
  if (_package.version.search("beta") === -1) execaSync("npm", ["publish", data.stdout, "--tag", "next"]);
  //发布测试包
  else execaSync("npm", ["publish", data.stdout, "--tag", "beta"]);
} finally {
  fs.removeSync(data.stdout);
}

console.log(chalk.blue("publish成功！"));

console.log(chalk.cyanBright("执行时长：" + (new Date().getTime() - now) / 1000 + "秒"));
