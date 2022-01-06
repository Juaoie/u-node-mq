module.exports = {
  title: "u-node-mq",
  base: "/u-node-mq/",
  description: "一个简单的插件",
  themeConfig: {
    logo: "/unmq.png",
    displayAllHeaders: true, // 默认值：false
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/" },
      { text: "External", link: "https://github.com/Juaoie/u-node-mq" },
    ],
    sidebar: [
      {
        title: "指南", // 必要的
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1, // 可选的, 默认值是 1
        children: [
          {
            title: "介绍",
            path: "/guide/",
          },
          {
            title: "快速上手",
            path: "/guide/getting-started.md",
          },
          {
            title: "基础组件",
            path: "/guide/basic-components.md",
          },
        ],
      },
    ],
  },
};
