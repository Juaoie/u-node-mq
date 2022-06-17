const execa = require("execa");
const package = require("../package.json");
const chalk = require("chalk");
const now = new Date().getTime();
/**
 * 发布项目文件
 */

(async () => {
  const { stdout } = await execa("npm", ["view", "u-node-mq", "version"]);
  console.log(chalk.blue("线上最新版本号为：", stdout));
  if (package.version === stdout.slice(1, -1)) return console.log(chalk.redBright("版本没有更新！"));

  await execa("pnpm", ["build"]);
  console.log(chalk.blue("build成功！"));

  await execa("cd", ["../u-node-mq"]);
  await execa("npm", ["publish"]);
  console.log(chalk.blue("publish成功！"));

  console.log(chalk.cyanBright("执行时长：" + (new Date().getTime() - now) / 1000 + "秒"));
})();
