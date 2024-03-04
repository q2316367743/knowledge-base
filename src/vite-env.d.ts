/// <reference types="vite/client" />

declare module 'simple-mind-map/src/plugins/MiniMap.js';
declare module 'simple-mind-map/src/plugins/Export.js';

declare global {
    interface Window {
        onImagePreview: (src: string) => void;
        $: any
    }
}
