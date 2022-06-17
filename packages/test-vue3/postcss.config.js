const Autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [
    // 兼容浏览器，添加前缀
    Autoprefixer({
      overrideBrowserslist: ["Android 4.1", "iOS 7.1", "Chrome > 31", "ff > 31", "ie >= 8"],
      grid: true,
    }),
  ],
};
