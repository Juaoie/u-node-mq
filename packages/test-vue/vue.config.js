const path = require("path");

module.exports = {
  /** 区分打包环境与开发环境
   * process.env.NODE_ENV==='production'  (打包环境)
   * process.env.NODE_ENV==='development' (开发环境)
   */
  //当前项目在服务器的访问目录
  publicPath: "/",
  // 编译打包时候的文件夹名称
  outputDir: "dist",
  //用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: "assets",
  //是否开启eslint代码检测，会在编译时候检测代码，可选值有true|false|'error'
  lintOnSave: "error",
  //默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变)
  filenameHashing: false,
  //指定生成的 index.html 的输出路径  (打包之后，改变系统默认的index.html的文件名)
  indexPath: "index.html",
  //是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。(默认false)
  runtimeCompiler: false,
  /**
   * 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
   *  打包之后发现map文件过大，项目文件体积很大，设置为false就可以不输出map文件
   *  map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
   *  有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
   * */
  productionSourceMap: false,

  transpileDependencies: [
    /* string or regex */
  ],

  chainWebpack: config => {
    config.optimization.minimize(true);
    config.optimization.splitChunks({
      chunks: "all",
    });
  },
  // 路径别名
  configureWebpack: {
    name: "postCode",
    resolve: {
      alias: {
        "@": path.join(__dirname, "./src"),
        "@p": path.join(__dirname, "./src/pages"),
        "@c": path.join(__dirname, "./src/components"),
        "@u": path.join(__dirname, "./src/utils"),
        "@a": path.join(__dirname, "./src/assets"),
      },
    },
  },
  // css的处理
  css: {
    // 当为true时，css文件名可省略 module 默认为 false
    requireModuleExtension: true,
    // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中,当作为一个库构建时，你也可以将其设置为 false 免得用户自己导入 CSS
    // 默认生产环境下是 true，开发环境下是 false
    extract: true,
    // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能
    sourceMap: false,
    //向 CSS 相关的 loader 传递选项(支持 css-loader postcss-loader sass-loader less-loader stylus-loader)
    loaderOptions: {},
  },
  // 所有 webpack-dev-server 的选项都支持
  devServer: {
    proxy: {
      "/postCode/user": {
        target: "https://uaoie.top/", //0目标接口域名
        changeOrigin: true, //是否跨域
        secure: false, // 使用的是http协议则设置为false，https协议则设置为true
        pathRewrite: { "^/postCode/user": "/postCode/user" },
      },
      "/postCode/chat": {
        target: "https://uaoie.top/",
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/postCode/chat": "/postCode/chat" },
      },
    },
  }, // 第三方插件配置

  // 是否为 Babel 或 TypeScript 使用 thread-loader
  parallel: require("os").cpus().length > 1,
  // 向 PWA 插件传递选项
  pwa: {},
  // 可以用来传递任何第三方插件选项
  pluginOptions: {},
};
