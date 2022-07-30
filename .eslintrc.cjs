module.exports = {
  env: {
    node: false,
    browser: true,
  },
  extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"], //定义文件继承的子规范
  parser: "@typescript-eslint/parser", //定义ESLint的解析器
  plugins: ["@typescript-eslint"], //定义了该eslint文件所依赖的插件

  globals: {},

  rules: {
    "@typescript-eslint/no-explicit-any": "off", //允许使用any类型
  },
  // parserOptions: {
  //   project: "./tsconfig.json",
  // },
};
