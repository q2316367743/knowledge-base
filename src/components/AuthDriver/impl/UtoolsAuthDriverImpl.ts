import {AuthDriver} from "@/components/AuthDriver/AuthDriver";

export class UtoolsAuthDriverImpl implements AuthDriver {

    init(): Promise<void> {
        return Promise.resolve();
    }
    allDocs(key?: string): Promise<DbDoc[]> {
        return utools.db.promises.allDocs(key);
    }

    get(id: string): Promise<DbDoc | null> {
        return utools.db.promises.get(id);
    }

    async getAttachment(docId: string): Promise<string> {
        const data = await utools.db.promises.getAttachment(docId);
        if (!data) {
            return Promise.reject(`资源【${docId}】加载失败`)
        }
        const blob = new Blob([data]);
        return Promise.resolve(window.URL.createObjectURL(blob));
    }

    async postAttachment(docId: string, attachment: Blob): Promise<DbReturn> {
        const buffer = await attachment.arrayBuffer();
        return utools.db.promises.postAttachment(docId, new Uint8Array(buffer), "application/octet-stream");
    }

    put(doc: DbDoc): Promise<DbReturn> {
        return utools.db.promises.put(doc);
    }

    remove(doc: string | DbDoc): Promise<DbReturn> {
        return utools.db.promises.remove(doc);
    }

}
