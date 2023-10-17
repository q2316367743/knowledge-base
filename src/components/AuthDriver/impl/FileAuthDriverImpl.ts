import {AuthDriver} from "@/components/AuthDriver/AuthDriver";
import MessageUtil from "@/utils/MessageUtil";
import {PathIndex} from "@/components/AuthDriver/domain/FileListItem";
import {getRandomChar} from "@/utils/BrowserUtil";


let lock = false;
let todo = false;

const INDEX_JSON: string = '/index.json';


export class FileAuthDriverImpl implements AuthDriver {

    private readonly root: string;
    private readonly pathMap: Map<string, string>;

    constructor(root: string) {
        this.root = root;
        this.pathMap = new Map<string, string>();
    }

    /**
     * 同步索引文件
     */
    private sync(): void {
        if (lock) {
            todo = true;
            return;
        }
        lock = true;
        this._sync()
            .then(() => {
                lock = false;
                if (todo) {
                    this._sync().then(() => console.debug("存在待办"));
                }
            })
            .catch(e => {
                lock = false;
                todo = false;
                MessageUtil.error("同步远程服务器错误", e);
            })

    }

    private async _sync() {
        const indexes = new Array<PathIndex>();
        Array.from(this.pathMap.keys()).forEach(key => {
            const value = this.pathMap.get(key);
            if (value) {
                indexes.push({
                    key,
                    value
                })
            }
        })
        await window.preload.saveTextFile(this.root, INDEX_JSON, JSON.stringify(indexes));
    }

    async init(): Promise<void> {
        // 读取索引文件
        const index = await window.preload.readFile(this.root, '/index.json')
        if (index) {
            const items = JSON.parse(index);
            for (let index of items) {
                this.pathMap.set(index.key, index.value)
            }
        }
        return Promise.resolve();
    }

    allDocKeys(key?: string | undefined): Promise<string[]> {
        let keys = Array.from(this.pathMap.keys());

        // 基于key过滤
        if (key) {
            keys = keys.filter(item => item.startsWith(key));
        }

        return Promise.resolve(keys);
    }

    async allDocs(key?: string): Promise<DbDoc[]> {
        const docs = new Array<DbDoc>();

        let keys = Array.from(this.pathMap.keys());

        // 基于key过滤
        if (key) {
            keys = keys.filter(item => item.startsWith(key));
        }

        // 每一个文件获取内容
        for (let item of keys) {
            try {
                let doc = await this.get(item);
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
        const path = this.pathMap.get(id);
        if (!path) {
            return Promise.resolve(null);
        }

        const content = await window.preload.readFile(this.root, path);

        if (!content) {
            return Promise.resolve(null);
        }

        return Promise.resolve(JSON.parse(content));
    }

    getAttachment(docId: string): Promise<string> {

        // 路径渲染
        const path = this.pathMap.get(docId);
        if (!path) {
            return Promise.resolve("./logo.png");
        }
        return Promise.resolve(window.preload.pathJoin(this.root, path));
    }

    async postAttachment(docId: string, attachment: Blob): Promise<DbReturn> {

        // 处理文件路径
        const fileName = `/${new Date().getTime()}.png`;

        // 再新增索引
        this.pathMap.set(docId, fileName);
        this.sync();

        const buffer = await attachment.arrayBuffer();
        await window.preload.saveBinaryFile(this.root, fileName, new Uint8Array(buffer));

        return Promise.resolve({
            id: docId,
            error: false,
            ok: true,
        });
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
        let fileName = `/${doc._id.replaceAll("/", ">")}.json`;

        await window.preload.saveTextFile(this.root, fileName, JSON.stringify(item));

        this.sync();

        return Promise.resolve({
            id: doc._id,
            error: false,
            ok: true,
            rev: rev
        })
    }

    async remove(doc: string | DbDoc): Promise<DbReturn> {

        const _id = typeof doc === 'string' ? doc : doc._id;
        // 先删除索引
        const id = this.pathMap.get(_id);
        if (!id) {
            return Promise.resolve({
                id: _id,
                error: true,
                ok: false,
                message: "文件不存在"
            });
        }
        this.pathMap.delete(_id);
        // 同步
        this.sync();

        // 删除
        await window.preload.removeFile(this.root, id);

        return Promise.resolve({
            id: _id,
            error: false,
            ok: true,
        })

    }

}
