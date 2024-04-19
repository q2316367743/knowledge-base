// vite.config.js
// @ts-ignore
import vue from "@vitejs/plugin-vue";
// @ts-ignore
import vueJsx from "@vitejs/plugin-vue-jsx";
// @ts-ignore
import {defineConfig} from "vite";
// @ts-ignore
import path from "path";
import UnoCSS from 'unocss/vite';

function _resolve(dir: string) {
// @ts-ignore
    return path.resolve(__dirname, '../', dir);
}

export default defineConfig({
    resolve: {
        alias: {
            "@": _resolve("src")
        },
    },
    plugins: [
        vue(), vueJsx(), UnoCSS()
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
