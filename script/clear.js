const chalk = require("chalk");
const fs = require("fs-extra");

(async () => {
  await Promise.all([fs.remove("u-node-mq"), fs.remove("packages/test-vue3/u-node-mq")]);
  console.log(chalk.blue("缓存清除成功！"));
})();
