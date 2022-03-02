import { dest, src, series } from "gulp";
import del from "del";

//用ts创建项目
import ts from "gulp-typescript";
const tsProject = ts.createProject("tsconfig.json");

/**
 * ts项目
 * @returns
 */
const _ts = (): NodeJS.ReadWriteStream => {
  return src("./src/**/*.ts").pipe(tsProject()).pipe(dest("dist"));
};

const _del = () => {
  return del(["./dist"]);
};

export default series(_del, _ts);
