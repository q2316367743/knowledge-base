import {DbDriver} from "@/components/AuthDriver/DbDriver";
import {AttachmentDriver} from "@/components/AuthDriver/AttachmentDriver";
import {convertFileSrc} from '@tauri-apps/api/tauri';
import {createDir, exists, writeBinaryFile} from '@tauri-apps/api/fs'
import {extname, join, pictureDir} from '@tauri-apps/api/path';
import Constant from "@/global/Constant";

export default class TauriDriverImpl implements DbDriver, AttachmentDriver {

    getAttachmentBy(docId: string): string {
        return convertFileSrc(docId);
    }

    allDocs(key?: string): Promise<DbDoc[]> {
        return utools.db.promises.allDocs(key);
    }

    allDocKeys(key?: string | undefined): Promise<string[]> {
        return utools.db.promises.allDocs(key).then(docs => docs.map(doc => doc.id));
    }

    get(id: string): Promise<DbDoc | null> {
        return utools.db.promises.get(id);
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

    put(doc: DbDoc): Promise<DbReturn> {
        return utools.db.promises.put(doc);
    }

    remove(doc: string | DbDoc): Promise<DbReturn> {
        return utools.db.promises.remove(doc);
    }
}
