// vite.config.js
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import {defineConfig} from "vite";
import {resolve} from "path";
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import {ArcoResolver, TDesignResolver} from 'unplugin-vue-components/resolvers';

function _resolve(dir: string) {
  return resolve(__dirname, dir);
}

export default defineConfig({
  resolve: {
    alias: {
      "@": _resolve("src")
    },
  },
  plugins: [
    vue(), vueJsx(), UnoCSS(),
    AutoImport({
      resolvers: [ArcoResolver(), TDesignResolver({
        library: 'vue-next'
      })],
      imports: ['vue', '@vueuse/core', 'vue-router'],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true
        }),
        TDesignResolver({
          library: 'vue-next'
        })
      ]
    })
  ],
  base: "./",
  build: {
    outDir: "src-utools/dist",
    rollupOptions: {
      input: {
        main: _resolve('index.html'),
        chat: _resolve('chat.html'),
        preview: _resolve('preview.html'),
        todo: _resolve('todo.html'),
      },
    },
  },
  // 强制预构建插件包
  optimizeDeps: {
    include: [
      `monaco-editor/esm/vs/language/json/json.worker`,
      `monaco-editor/esm/vs/language/css/css.worker`,
      `monaco-editor/esm/vs/language/html/html.worker`,
      `monaco-editor/esm/vs/language/typescript/ts.worker`,
      `monaco-editor/esm/vs/editor/editor.worker`
    ],
  },
  envDir: 'env'
});
