import { generateDtsBundle } from "dts-bundle-generator";
import fs from "fs-extra";

import { execa } from "execa";

(async () => {
  await execa("tsc");
  // 使用tsc输出operators d.ts文件进行覆盖，会改变源码
  fs.copy("dist/operators", "u-node-mq/operators", {
    //过滤.js文件，只要d.js文件
    filter: src => src.slice(-3) !== ".js",
  });
  fs.copy("dist/plugins", "u-node-mq/plugins", {
    //过滤.js文件，只要d.js文件
    filter: src => src.slice(-3) !== ".js",
  });
})();

const options = [
  {
    filePath: "src/index.ts",
    outFile: "u-node-mq/index.d.ts",
    output: {
      sortNodes: true,
      exportReferencedTypes: false,
    },
  },
];

//generateDtsBundle 不能自动输出，需要手动输出
const res = generateDtsBundle(options, {
  preferredConfigPath: "./tsconfig.json",
});

options.forEach((item, index) => {
  fs.outputFile(item.outFile, res[index]);
});
