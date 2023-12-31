import {AuthDriver} from "@/components/AuthDriver/AuthDriver";

export class UtoolsAuthDriverImpl implements AuthDriver {

    init(): Promise<void> {
        return Promise.resolve();
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
        const data = await utools.db.promises.getAttachment(docId);
        if (!data) {
            return Promise.resolve("./logo.png")
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
