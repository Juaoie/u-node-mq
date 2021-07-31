import { dest, src, parallel } from "gulp";

//用ts创建项目
import * as ts from "gulp-typescript";
const tsProject = ts.createProject("tsconfig.json");

/**
 * ts项目
 * @returns
 */
const _ts = (): NodeJS.ReadWriteStream => {
  return src("./src/**/*.ts").pipe(tsProject()).js.pipe(dest("dist"));
};

export const _state = (): NodeJS.ReadWriteStream => {
  return src(["./package.json", "./README.md"]).pipe(dest("./dist"));
};

export default parallel(_ts, _state);
