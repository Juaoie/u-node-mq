import express from "express";
import chalk from "chalk";
import inquirer from "inquirer";

function main() {
    /**
  const app = express();
  const port = 8000;

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    // console.log(chalk.greenBright(`请将u-node-mq日志消息发送至 ${port} 端口`));

  });
 */

  var ui = new inquirer.ui.BottomBar();

  // pipe a Stream to the log zone
  outputStream.pipe(ui.log);

  // Or simply write output
  ui.log.write("something just happened.");
  ui.log.write("Almost over, standby!");

  // During processing, update the bottom bar content to display a loader
  // or output a progress bar, etc
  ui.updateBottomBar("new bottom bar content");
}
main();
