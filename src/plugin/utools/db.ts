import {DbPromiseInstance} from "@/plugin/utools/types";
import {openDB} from "idb";
import {DbDoc, DbReturn} from "@/plugin/utools";
import Constant from "@/global/Constant";


const DB = 'db';
const ATTACHMENT = 'attachment';

const dbPromise = openDB(Constant.id, 2, {
    upgrade(db) {
        db.createObjectStore(DB);
        db.createObjectStore(ATTACHMENT);
    },
});


const dbByWeb: DbPromiseInstance = {

    /**
     * 创建/更新文档
     */
    async put(doc: DbDoc): Promise<DbReturn> {
        try {
            await (await dbPromise).put(DB, doc, doc._id)
            return Promise.resolve({
                id: doc._id,
                rev: Date.now() + ''
            });
        } catch (e) {
            return Promise.resolve({
                id: doc._id,
                error: true,
                message: `${e}`,
                ok: false
            });
        }
    },
    /**
     * 获取文档
     */
    async get(id: string): Promise<DbDoc | null> {
        const res = await (await dbPromise).get(DB, id);
        return res || null;
    },
    /**
     * 删除文档
     */
    async remove(doc: string | DbDoc): Promise<DbReturn> {
        let id = '';
        if (typeof doc === 'string') {
            id = doc;
        } else {
            id = doc._id;
        }
        try {
            await (await dbPromise).delete(DB, id);
            // 判断是否存在附件
            await (await dbPromise).delete(ATTACHMENT, id);
            return Promise.resolve({
                id,
                rev: ''
            });
        } catch (e) {
            return Promise.resolve({
                id,
                error: true,
                message: `${e}`,
                ok: false
            });
        }

    },

    /**
     * 执行该方法将会批量更新数据库文档，传入需要更改的文档对象合并成数组进行批量更新。
     */
    bulkDocs(docs: DbDoc[]): Promise<DbReturn[]> {
        return Promise.all(docs.map(this.put));
    },

    /**
     * 获取所有文档 可根据文档id前缀查找
     */
    async allDocs(key?: string | string[]): Promise<DbDoc[]> {
        const c = await dbPromise;

        if (!key) {
            return c.getAll(DB);
        }

        let keys = new Array<IDBValidKey>();

        if (typeof key === 'string') {
            let itemKeys = await (await dbPromise).getAllKeys(DB);
            keys = itemKeys.filter(itemKey => {
                if (typeof itemKey === 'string') {
                    return itemKey.startsWith(key)
                }
                return false;
            })
        } else {
            keys = key;
        }

        const results = new Array<DbDoc>()
        let items = await Promise.all(keys.map(id => c.get(DB, id)));
        items.forEach(e => e && results.push(e));
        return results;
    },

    /**
     * 存储附件到新文档
     * @param docId 文档ID
     * @param buffer 附件 buffer
     * @param type 附件类型，示例：image/png, text/plain
     */
    async postAttachment(docId: string, buffer: Uint8Array, type: string): Promise<DbReturn> {
        await (await dbPromise).put(DB, {
            _id: docId,
            _attachment: {
                contentType: type,
                length: buffer.length,
            }
        }, docId);
        try {
            await (await dbPromise).put(ATTACHMENT, buffer, docId);
        } catch (e) {
            // 错误，删除
            console.error(e)
            await (await dbPromise).delete(DB, docId);
            return Promise.resolve({
                id: docId,
                error: true,
                message: `${e}`,
                ok: false
            });
        }
        return Promise.resolve({
            id: docId,
            rev: '',
            error: false,
            ok: true
        });
    },

    /**
     * 获取附件
     * @param docId 文档ID
     */
    async getAttachment(docId: string): Promise<Uint8Array | null> {
        const res = await (await dbPromise).get(DB, docId);
        if (!res) {
            return null;
        }
        const buffer = await (await dbPromise).get(ATTACHMENT, docId);
        return buffer || null;
    },

    /**
     * 获取附件类型
     * @param docId 文档ID
     */
    async getAttachmentType(docId: string): Promise<string | null> {
        const res = await (await dbPromise).get(DB, docId);
        if (!res) {
            return null;
        }
        const attachment = res['_attachment'];
        return attachment ? (attachment['contentType'] || null) : null;
    },
    replicateStateFromCloud(): Promise<null | 0 | 1> {
        return Promise.resolve(null);
    }
}

const dbByTs: DbPromiseInstance = {
    async allDocs(key?: string | string[]): Promise<DbDoc[]> {
        const res = await window.bs.db.allDocs(key);
        const docs = new Array<DbDoc>();
        for (let row of res.rows) {
            if (!row.error) {
                const doc = await this.get(row.key);
                if (doc) {
                    docs.push(doc);
                }
            }
        }
        return docs;
    },
    async get(id: string): Promise<DbDoc | null> {
        try {
            return await window.bs.db.get(id);
        } catch (e) {
            console.debug(`id: ${id} not found`);
            return null;
        }
    },
    getAttachment(docId: string): Promise<Uint8Array | null> {
        return Promise.reject("天天工作台不支持附件");
    },
    getAttachmentType(docId: string): Promise<string | null> {
        return Promise.reject("天天工作台不支持附件");
    },
    postAttachment(docId: string, attachment: Uint8Array, type: string): Promise<DbReturn> {
        return Promise.reject("天天工作台不支持附件");
    },
    async put(doc: DbDoc): Promise<DbReturn> {
        return window.bs.db.put(doc).catch(e => {
            return {
                id: e.docId,
                ok: false,
                error: e.error,
                name: e.name,
                message: e.message,
            };
        })
    },
    remove(id: string): Promise<DbReturn> {
        return window.bs.db.remove(id);
    },
    bulkDocs(docs: DbDoc[]): Promise<DbReturn[]> {
        return Promise.all(docs.map(this.put));
    },
    replicateStateFromCloud(): Promise<0 | 1 | null> {
        return Promise.resolve(null)
    }

}


export function createDbPromiseInstance(): DbPromiseInstance {
    if (window.bs) {
        return dbByTs;
    }
    return dbByWeb;
}
