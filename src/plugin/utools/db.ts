import {DbPromiseInstance} from "@/plugin/utools/types";
import {createStore, del, get, getMany, keys, set, values} from "idb-keyval";
import {DbDoc, DbReturn} from "@/plugin/utools/index";
import Constant from "@/global/Constant";


const store = createStore(Constant.id, "store");

const dbByWeb: DbPromiseInstance = {
    /**
     * 创建/更新文档
     */
    async put(doc: DbDoc): Promise<DbReturn> {
        try {
            await set(doc._id, doc, store)
            return Promise.resolve({
                id: doc._id,
                rev: ''
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
    get(id: string): Promise<DbDoc | undefined> {
        return get(id, store)
    },
    /**
     * 删除文档
     */
    async remove(id: string): Promise<DbReturn> {
        try {
            await del(id, store);
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
     * 获取所有文档 可根据文档id前缀查找
     */
    async allDocs(key?: string | string[]): Promise<DbDoc[]> {
        if (key && key instanceof Array) {
            return getMany(key, store);
        } else if (key && typeof key === 'string') {
            let itemKeys = await keys(store);
            itemKeys = itemKeys.filter(itemKey => {
                if (typeof itemKey === 'string') {
                    return itemKey.startsWith(key)
                }
                return false;
            })
            return getMany(itemKeys, store);
        }
        return values(store);
    },

    /**
     * 存储附件到新文档
     * @param docId 文档ID
     * @param attachment 附件 buffer
     * @param type 附件类型，示例：image/png, text/plain
     */
    async postAttachment(docId: string, attachment: Uint8Array, type: string): Promise<DbReturn> {
        return Promise.reject("web不支持上传附件")
    },

    /**
     * 获取附件
     * @param docId 文档ID
     */
    async getAttachment(docId: string): Promise<Uint8Array | null> {
        return Promise.reject("web不支持上传附件")
    },

    /**
     * 获取附件类型
     * @param docId 文档ID
     */
    getAttachmentType(docId: string): Promise<string | null> {
        return Promise.reject("Web不支持保存附件")
    },
}

const dbByTs: DbPromiseInstance = {
    allDocs(key?: string | string[]): Promise<DbDoc[]> {
        return Promise.resolve(window.bs.db.allDocs(key));
    }, get(id: string): Promise<DbDoc | undefined> {
        const items = window.bs.db.allDocs([id]);
        return Promise.resolve(items[0]);
    }, getAttachment(docId: string): Promise<Uint8Array | null> {
        return Promise.reject("天天工作台不支持附件");
    }, getAttachmentType(docId: string): Promise<string | null> {
        return Promise.reject("天天工作台不支持附件");
    }, postAttachment(docId: string, attachment: Uint8Array, type: string): Promise<DbReturn> {
        return Promise.reject("天天工作台不支持附件");
    }, put(doc: DbDoc): Promise<DbReturn> {
        window.bs.db.put(doc)
        return Promise.resolve({
            id: doc._id,
        });
    }, remove(id: string): Promise<DbReturn> {
        window.bs.db.remove(id);
        return Promise.resolve({
            id
        });
    }

}


export function createDbPromiseInstance(): DbPromiseInstance {
    if (window.bs) {
        return dbByTs;
    }
    return dbByWeb;
}
