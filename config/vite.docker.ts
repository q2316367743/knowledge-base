// vite.config.js
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import path from "path";

function _resolve(dir: string) {
    return path.resolve(__dirname, '../', dir);
}

export default defineConfig({
    resolve: {
        alias: {
            "@": _resolve("src")
        },
    },
    plugins: [
        vue(),
    ],
    base: "./",
    build: {
        outDir: "../src-java/src/main/resources/static/"
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
