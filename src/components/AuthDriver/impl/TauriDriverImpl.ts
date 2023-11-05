import {DbDriver} from "@/components/AuthDriver/DbDriver";
import {AttachmentDriver} from "@/components/AuthDriver/AttachmentDriver";
import {convertFileSrc} from '@tauri-apps/api/tauri';
import {
    createDir,
    exists,
    FileEntry,
    readDir,
    readTextFile,
    removeFile,
    writeBinaryFile,
    writeTextFile
} from '@tauri-apps/api/fs'
import {appDataDir, BaseDirectory, extname, join, pictureDir} from '@tauri-apps/api/path';
import Constant from "@/global/Constant";

interface PathEntry {
    dir: string;
    file: string;
}

export default class TauriDriverImpl implements DbDriver, AttachmentDriver {


    private async renderFullPath(id: string): Promise<string> {
        return join(await appDataDir(), Constant.id, id);
    }

    private async renderPath(id: string): Promise<PathEntry> {
        const index = id.lastIndexOf("/");
        let dir = '';
        let file = id;
        if (index > -1) {
            dir = id.slice(0, index);
            file = id.slice(index + 1, id.length);
        }
        const basePath = await join(await appDataDir(), Constant.id, dir);
        if (!await exists(basePath)) {
            await createDir(basePath, {
                dir: BaseDirectory.AppData,
                recursive: true
            });
        }
        console.log({dir: basePath, file})
        return Promise.resolve({dir: basePath, file});
    }

    async allDocs(key?: string): Promise<DbDoc[]> {
        const docKeys = await this.allDocKeys(key);
        const docs = new Array<DbDoc>();
        for (let docKey of docKeys) {
            const doc = await this.get(docKey);
            if (doc) {
                docs.push(doc);
            }
        }
        return docs;
    }

    async allDocKeys(key?: string | undefined): Promise<string[]> {
        const path = await join(await appDataDir(), Constant.id);
        const dirs = await readDir(path);
        const paths = new Array<string>();
        await this.allKeys(dirs, paths);
        return Promise.resolve(paths);
    }

    private async allKeys(entities: Array<FileEntry>, paths: Array<string>) {
        for (let entity of entities) {

        }
    }

    async get(id: string): Promise<DbDoc | null> {
        const entry = await this.renderPath(id);
        if (!await exists(entry.dir)) {
            await createDir(entry.dir, {
                dir: BaseDirectory.AppData,
                recursive: true
            });
        }
        const path = await join(entry.dir, entry.file);
        if (!await exists(path)) {
            return Promise.resolve(null);
        }
        const content = await readTextFile(path, {
            dir: BaseDirectory.AppData
        });
        if (content.length === 0) {
            return Promise.resolve(null);
        }
        try {
            return Promise.resolve(JSON.parse(content));
        } catch (e) {
            console.error(e);
            return Promise.resolve(null);
        }
    }

    async put(doc: DbDoc): Promise<DbReturn> {
        const {dir, file} = await this.renderPath(doc._id);
        if (!await exists(dir)) {
            await createDir(dir, {
                dir: BaseDirectory.AppData,
                recursive: true
            });
        }
        const path = await join(dir, file);

        let version = 0;
        let oldVersion = 0;
        if (doc._rev) {
            const split = doc._rev.split("-");
            version = parseInt(split[0]);
        }

        // 读取文件
        const old = await this.get(doc._id);
        if (old != null) {
            const rev = old._rev;
            if (rev) {
                try {
                    const split = rev.split("-");
                    oldVersion = parseInt(split[0]);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        version += 1;

        if (version <= oldVersion) {
            //
            return Promise.resolve({
                id: doc._id,
                ok: false,
                error: true,
                message: "Document update conflict"
            });
        }

        let _rev = version + '-' + new Date().getTime();

        await writeTextFile(path, JSON.stringify({
            _id: doc._id,
            _rev: _rev,
            value: doc.value
        }));
        return Promise.resolve({
            id: doc._id,
            ok: true,
            error: false,
            rev: _rev,
        });
    }

    async remove(doc: string | DbDoc): Promise<DbReturn> {
        const id = typeof doc === 'string' ? doc : doc._id;
        const file = await this.renderFullPath(id);
        if (await exists(file)) {
            await removeFile(file, {
                dir: BaseDirectory.AppData
            })
        }
        return Promise.resolve({
            id: id,
            ok: true,
            error: false,
        });
    }

    async getAttachment(docId: string): Promise<string> {
        return Promise.resolve(this.getAttachmentBy(docId));
    }

    async postAttachment(docId: string, attachment: Blob | File): Promise<string> {
        const dir = await pictureDir();
        const now = new Date().getTime();
        const basePath = await join(dir, Constant.id);
        if (!await exists(basePath)) {
            await createDir(basePath);
        }
        let ext = 'png';
        if (attachment instanceof File) {
            if (attachment.name) {
                ext = await extname(attachment.name)
            }
        }
        const path = await join(basePath, now + '.' + ext);
        await writeBinaryFile(path, new Uint8Array(await attachment.arrayBuffer()))
        return path;
    }

    getAttachmentBy(docId: string): string {
        return convertFileSrc(docId);
    }

}
