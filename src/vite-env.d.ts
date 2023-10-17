/// <reference types="vite/client" />

declare interface Window {
    onImagePreview: (src: string) => void,
    preload: {
        readFile(root: string, path: string): Promise<string | null>,
        saveTextFile(root: string, path: string, content: string): Promise<void>,
        removeFile(root: string, path: string): Promise<void>,
        saveBinaryFile(root: string, path: string, content: Uint8Array): Promise<void>,
        pathJoin(root: string, path: string): string;
    }
}
