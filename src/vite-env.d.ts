/// <reference types="vite/client" />

declare module 'simple-mind-map/src/plugins/MiniMap.js';
declare module 'simple-mind-map/src/plugins/Export.js';
declare module 'simple-mind-map/src/plugins/ExportPDF.js';
declare module 'simple-mind-map/src/plugins/ExportXMind.js';
declare module 'simple-mind-map/src/parse/xmind.js';
declare module 'simple-mind-map/src/parse/markdown.js';
declare module 'simple-mind-map/src/plugins/AssociativeLine.js';

declare global {
    interface Window {
        onImagePreview: (src: string) => void;
    }
}
