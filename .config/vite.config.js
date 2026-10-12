import { defineConfig } from "vite";
import pagesConfig from "./vite.pages.config.js";

// 通常開発と公開ビルドは同じ静的サイト設定を使用する．
export default defineConfig({
  ...pagesConfig,
  server: { forwardConsole: false }
});
