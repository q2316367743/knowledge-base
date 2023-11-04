import {DbDriver} from "@/components/AuthDriver/DbDriver";
import {getRandomChar} from "@/utils/BrowserUtil";
import {AttachmentDriver} from "@/components/AuthDriver/AttachmentDriver";


export class FileDiverImpl implements DbDriver, AttachmentDriver {
    getAttachmentBy(docId: string): string {
        return docId;
    }

    private readonly root: string;

    constructor(root: string) {
        this.root = root;
    }


    allDocKeys(key?: string | undefined): Promise<string[]> {
        return window.preload.listFile(this.root, key)
    }

    async allDocs(key?: string): Promise<DbDoc[]> {
        const docs = new Array<DbDoc>();


        // 每一个文件获取内容
        for (let path of await this.allDocKeys(key)) {
            try {
                let doc = await this.get(path);
                if (doc) {
                    docs.push(doc);
                }
            } catch (e) {
                console.error(e);
            }
        }


        return Promise.resolve(docs);
    }

    async get(id: string): Promise<DbDoc | null> {

        const content = await window.preload.readFileByText(this.root, id + '.json');

        if (!content) {
            return Promise.resolve(null);
        }

        return Promise.resolve(JSON.parse(content));
    }

    getAttachment(docId: string): Promise<string> {
        // 路径渲染
        return Promise.resolve(window.preload.pathJoin(this.root, docId + '.png'));
    }

    async postAttachment(docId: string, attachment: Blob | File): Promise<string> {

        // 处理文件路径
        const fileName = docId + '.png';

        const buffer = await attachment.arrayBuffer();
        await window.preload.saveFile(this.root, fileName, new Uint8Array(buffer));

        return Promise.resolve(window.preload.pathJoin(this.root, fileName));
    }

    async put(doc: DbDoc): Promise<DbReturn> {

        // 处理内容
        let rev = getRandomChar(16);

        if (doc._rev) {
            const split = doc._rev.split("-");
            const version = parseInt(split[0]);
            rev = `${version + 1}-${rev}`;
        } else {
            rev = "1-" + rev;
        }
        const item: DbDoc = {
            ...doc,
            _rev: rev
        }


        // 处理文件路径
        let fileName = doc._id + '.json';

        await window.preload.saveFile(this.root, fileName, JSON.stringify(item));

        return Promise.resolve({
            id: doc._id,
            error: false,
            ok: true,
            rev: rev
        })
    }

    async remove(doc: string | DbDoc): Promise<DbReturn> {

        const _id = typeof doc === 'string' ? doc : doc._id;

        // 删除
        await window.preload.removeFile(this.root, _id + '.json');

        return Promise.resolve({
            id: _id,
            error: false,
            ok: true,
        })

    }

}
