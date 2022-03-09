import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";
console.log(resolve(__dirname, "src/"));
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
  root: "./src/",

  build: {
    outDir: "../",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src/"),
      "&": resolve(__dirname, "unmq/src/"),
      "@a": resolve(__dirname, "src/assets/"),
    },
  },
});
