import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  root: "./docs/",

  build: {
    outDir: "../",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "docs"),
      "&": resolve(__dirname, "src"),
      "@a": resolve(__dirname, "docs/assets/"),
      "@s": resolve(__dirname, "docs/socket/"),
      "@t": resolve(__dirname, "docs/tools/"),
      "@p": resolve(__dirname, "docs/pages/"),
    },
  },
});
