import {DbDriver} from "@/components/AuthDriver/DbDriver";
import {AttachmentDriver} from "@/components/AuthDriver/AttachmentDriver";

export default class TauriDriverImpl implements DbDriver, AttachmentDriver {

    private readonly path: string

    constructor(path: string) {
        this.path = path;
    }

    allDocKeys(key?: string): Promise<Array<string>> {
        return Promise.resolve([]);
    }

    allDocs(key?: string): Promise<Array<DbDoc>> {
        return Promise.resolve([]);
    }

    get(id: string): Promise<DbDoc | null> {
        return Promise.resolve(null);
    }

    getAttachment(docId: string): Promise<string> {
        return Promise.resolve("");
    }

    postAttachment(docId: string, attachment: Blob): Promise<string> {
        return Promise.resolve("");
    }

    put(doc: DbDoc): Promise<DbReturn> {
        return Promise.resolve({
            id: doc._id
        });
    }

    remove(doc: string | DbDoc): Promise<DbReturn> {
        return Promise.resolve({
            id: typeof doc === 'string' ? doc : doc._id
        });
    }

}
