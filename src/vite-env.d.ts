/// <reference types="vite/client" />

declare module 'simple-mind-map/src/plugins/MiniMap.js';
declare module 'simple-mind-map/src/plugins/Export.js';
declare module 'simple-mind-map/src/plugins/ExportPDF.js';
declare module 'simple-mind-map/src/plugins/ExportXMind.js';
declare module 'simple-mind-map/src/parse/xmind.js';
declare module 'simple-mind-map/src/parse/markdown.js';
declare module 'simple-mind-map/src/plugins/AssociativeLine.js';
declare module 'simple-mind-map/src/plugins/Select.js';
declare module 'simple-mind-map/src/plugins/Drag.js';

declare global {
    interface Window {
        /**
         * 打开图片预览
         * @param src 图片链接
         */
        onImagePreview: (src: string) => void;
        /**
         * 跳转到文章
         * @param title 文章标题
         */
        jumpToArticle: (title: string) => void;
    }
}
