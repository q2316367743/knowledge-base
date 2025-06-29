// vite.config.js
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import {defineConfig, PluginOption} from "vite";
import {resolve} from "path";
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import {ArcoResolver, TDesignResolver} from 'unplugin-vue-components/resolvers';
import {VitePWA} from 'vite-plugin-pwa';

function _resolve(dir: string) {
  return resolve(__dirname, dir);
}

export default defineConfig(({mode}) => {
  let outDir = 'dist';
  if (mode === 'web') {
    outDir = 'src-server/public';
  } else if (mode === 'utools') {
    outDir = 'src-utools/dist';
  }
  return {
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
      }),
      VitePWA({
        disable: mode !== 'web',
        injectRegister: 'script',
        includeAssets: [
          'user.png',
          'mind-map/img/structures/*.png', 'mind-map/img/themes/*.jpg',
          "js/*.js"
        ],
        strategies: 'generateSW',
        manifest: {
          name: '知识库',
          short_name: '知识库',
          description: '支持markdown、富文本、代码、思维导图、流程图、表格笔记，支持文件夹形式组织自己的笔记结构。支持markdown模板。支持待办、卡片布局、日历布局。',
          theme_color: '#fcb73f',
          icons: [
            {
              src: 'logo.png',
              sizes: '256x256',
              type: 'image/png',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 1024 * 1024 * 20,
        }
      })
    ],
    base: "./",
    build: {
      outDir,
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
    envDir: 'env',
    server: {
      proxy: {
        // 字符串简写（等价于对象写法）
        '/api': 'http://localhost:13456',
      },
    },
  }
});
