// vite.config.js
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import path from "path";
import VueDevTools from 'vite-plugin-vue-devtools'

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
        vue(),
        VueDevTools()
    ],
    base: "./",
    build: {
        outDir: "src-utools/dist"
    },

});
