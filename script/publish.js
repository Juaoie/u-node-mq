const execa = require("execa");
const package = require("../package.json");
const chalk = require("chalk");
const now = new Date().getTime();
const fs = require("fs-extra");
/**
 * 发布项目文件
 */

(async () => {
  await execa("pnpm", ["build"]);
  console.log(chalk.blue("build成功！"));

  const { stdout } = await execa("npm", ["view", "u-node-mq", "versions"]);
  console.log(chalk.blue("预发布版本号：", package.version));
  if (-1 !== stdout.indexOf(package.version)) return console.log(chalk.redBright("版本号已存在！"));

  //生成包
  const data = await execa("npm", ["pack", "./u-node-mq"]);
  try {
    //发布正式包
    if (package.version.search("beta") === -1) await execa("npm", ["publish", data.stdout, "--tag", "next"]);
    //发布测试包
    else await execa("npm", ["publish", data.stdout, "--tag", "beta"]);
  } finally {
    await fs.remove(data.stdout);
  }

  console.log(chalk.blue("publish成功！"));

  console.log(chalk.cyanBright("执行时长：" + (new Date().getTime() - now) / 1000 + "秒"));
})();
