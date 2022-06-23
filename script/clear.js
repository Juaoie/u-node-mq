// const chalk = require("chalk");
// const fs = require("fs-extra");

import chalk from "chalk";
import fs from "fs-extra";

(async () => {
  await Promise.all([fs.remove("u-node-mq"), fs.remove("dist")]);
  console.log(chalk.blue("缓存清除成功！"));
})();
