/// <reference types="vite/client" />

declare global {
    interface Window {
        onImagePreview: (src: string) => void;
        $: any
    }
}
