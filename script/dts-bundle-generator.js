import { generateDtsBundle } from "dts-bundle-generator";
import fs from "fs-extra";
const operatorsDirList = fs.readdirSync("src/operators");

const output = {
  sortNodes: true,
  exportReferencedTypes: false,
};
generateDtsBundle(
  [
    {
      filePath: "src/index.ts",
      outFile: "src/u-node-mq/index.d.ts",
      output,
    },
    {
      filePath: "src/plugins/iframe/index.ts",
      outFile: "src/u-node-mq/plugins/iframe/index.d.ts",
      output,
    },
    ...operatorsDirList.map(item => {
      return {
        filePath: `src/operators/${item}/index.ts`,
        outFile: `src/u-node-mq/operators/${item}/index.d.ts`,
        output,
      };
    }),
  ],
  {
    preferredConfigPath: "./tsconfig.json",
  },
);
