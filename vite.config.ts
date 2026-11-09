import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import pkg from "./package.json";

// MAIN world 注入脚本必须是无 import/export 残留的 IIFE 单文件，
// 因此使用 Vite library 模式输出 iife 格式。
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    minify: "esbuild",
    lib: {
      entry: "src/inject.ts",
      name: "ZhihuMobileWebEnhancer",
      formats: ["iife"],
      fileName: () => "inject.js",
    },
    rollupOptions: {
      output: {
        // 防御：确保产物不携带 export 语句
        exports: "none",
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/manifest.json",
          dest: ".",
          // 版本号以 package.json 为唯一数据源，构建时注入
          transform: (content) =>
            JSON.stringify(
              { ...JSON.parse(content.toString()), version: pkg.version },
              null,
              2
            ),
        },
        { src: "assets/icons", dest: "." },
      ],
    }),
  ],
});
