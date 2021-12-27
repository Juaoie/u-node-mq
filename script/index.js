// import package from "../package.json"
const package = require("../package.json");
const [v1, v2, v3] = package.version.split(".");
package.version = [v1, v2, Number(v3) + 1].join(".");

const fs = require("fs");
const path = require("path");
const file = path.resolve(__dirname, "../package.json");

// 异步写入数据到文件
fs.writeFile(file, JSON.stringify(package, null, 2), { encoding: 'utf8' }, err => {})
