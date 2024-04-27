import { generateDtsBundle } from "dts-bundle-generator";
import fs from "fs-extra";

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
