/// <reference types="vite/client" />

declare interface Window {
    onImagePreview: (src: string) => void,
    preload: {
        readFileByText(root: string, path: string): Promise<string | null>,
        saveFile(root: string, path: string, content: string | Uint8Array): Promise<void>,
        removeFile(root: string, path: string): Promise<void>,
        pathJoin(root: string, path: string): string;
        listFile(root: string, path?: string): Promise<Array<string>>;
    }
}
