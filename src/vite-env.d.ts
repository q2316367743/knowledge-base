/// <reference types="vite/client" />


declare interface Window {
    onImagePreview: (src: string) => void,
    fs: {
        /**
         * 读取文本文件
         */
        readTextFile(filePath: string): Promise<string>;

        /**
         * 读取二进制文件
         */
        readBinaryFile(filePath: string): Promise<Uint8Array>;

        /**
         * 写入文本文件
         */
        writeTextFile(path: string, contents: string): Promise<void>;

        /**
         * 写入二进制文件
         */
        writeBinaryFile(path: string, contents: FsBinaryFileContents): Promise<void>;

        /**
         * 读取一个目录
         */
        readDir(dir: string): Promise<any[]>;

        /**
         * 创建目录
         */
        createDir(dir: string): Promise<void>;

        /**
         * 删除目录
         */
        removeDir(dir: string, recursive?: boolean): Promise<void>;

        /**
         * 拷贝一个文件、文件夹到目标目录
         */
        copyFile(source: string, destination: string): Promise<void>;

        /**
         * 删除文件
         */
        removeFile(file: string): Promise<void>;

        /**
         * 重命名文件
         */
        renameFile(oldPath: string, newPath: string): Promise<void>;

        /**
         * 判断一个文件是否存在
         */
        exists(path: string): Promise<boolean>;
    },
    path: {
        extname(path: string): string;
        basename(path: string): string;
        dirname(path: string): string;
        join(...paths: string[]): string;
    }
}
