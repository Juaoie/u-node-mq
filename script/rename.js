var fs = require("fs");
var path = require("path");

const oldPath = path.resolve("./docs/.vuepress/dist");
const newPath = path.resolve("./");

function rename(oldPath, newPath) {
  console.log("🚀 ~ file: rename.js ~ line 8 ~ rename ~ oldPath", oldPath);
  const pathList = fs.readdirSync(oldPath);

  pathList.forEach((item) => {
    const oldPathTemp = path.join(oldPath, item);
    const newPathTemp = path.join(newPath, item);

    const stats = fs.statSync(oldPathTemp);
    if (stats.isFile()) {
      // fs.renameSync(oldPathTemp, newPathTemp);
      fs.copyFileSync(oldPathTemp, newPathTemp);
    } else if (stats.isDirectory()) {
      try {
        fs.mkdirSync(newPathTemp);
      } catch (error) {}
      rename(oldPathTemp, newPathTemp);
    }
  });
}
rename(oldPath, newPath);
