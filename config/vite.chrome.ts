// vite.config.js
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import {defineConfig} from "vite";
import path from "path";
import UnoCSS from 'unocss/vite';

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
        vue(), vueJsx(), UnoCSS()
    ],
    base: "./",
    build: {
        outDir: "src-chrome/dist",
        rollupOptions: {
            input: {
                main: _resolve('index.html'),
                note: _resolve('note.html'),
                todo: _resolve('todo.html'),
                canvas: _resolve('canvas.html'),
                preview: _resolve('preview.html'),
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
