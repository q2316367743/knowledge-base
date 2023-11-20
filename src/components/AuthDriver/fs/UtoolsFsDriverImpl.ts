import {FileItem, FsBinaryFileContents, FsDriver} from "@/components/AuthDriver/FsDriver";

/**
 * utools文件相关操作
 */
export class UtoolsFsDriverImpl implements FsDriver {
    move(source: string, destination: string): Promise<void> {
        return window.fs.move(source, destination);
    }

    copyFile(source: string, destination: string): Promise<void> {
        return window.fs.copyFile(source, destination);
    }

    copyFolder(source: string, destination: string): Promise<void> {
        return window.fs.copyFolder(source, destination);
    }

    createDir(dir: string): Promise<void> {
        return window.fs.createDir(dir);
    }

    exists(path: string): Promise<boolean> {
        return window.fs.exists(path);
    }

    readBinaryFile(filePath: string): Promise<Uint8Array> {
        return window.fs.readBinaryFile(filePath);
    }

    async readDir(dir: string): Promise<FileItem[]> {
        return window.fs.readDir(dir);
    }

    readTextFile(filePath: string): Promise<string> {
        return window.fs.readTextFile(filePath);
    }

    removeDir(dir: string, recursive?: boolean): Promise<void> {
        return window.fs.removeDir(dir, recursive);
    }

    removeFile(file: string): Promise<void> {
        return window.fs.removeFile(file);
    }

    rename(oldPath: string, newPath: string): Promise<void> {
        return window.fs.rename(oldPath, newPath);
    }

    async writeBinaryFile(path: string, contents: FsBinaryFileContents): Promise<void> {
        const data = contents instanceof Blob ? await contents.arrayBuffer() : contents;
        return window.fs.writeBinaryFile(path, new Uint8Array(data));
    }

    writeTextFile(path: string, contents: string): Promise<void> {
        return window.fs.writeTextFile(path, contents);
    }

}
