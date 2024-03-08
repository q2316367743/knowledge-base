// vite.config.js
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { defineConfig } from "vite";
import path from "path";
import { visualizer } from 'rollup-plugin-visualizer'

function _resolve(dir: string) {
    return path.resolve(__dirname, dir);
}

export default defineConfig({
    resolve: {
        alias: {
            "@": _resolve("src")
        },
    },
    plugins: [
        vue(),vueJsx(),
        // 打包体积分析
        visualizer({
            open: true,
            filename: 'visualizer.html' //分析图生成的文件名
        }),
    ],
    base: "./",
    build: {
        outDir: "src-utools/dist"
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
