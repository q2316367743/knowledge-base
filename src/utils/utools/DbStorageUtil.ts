import {toRaw} from "vue";
import {clone} from "@/utils/lang/ObjUtil";
import {utools} from '@/plugin/utools';


// 对象

/**
 * 获取一个值
 * @param key 键
 */
export function getItem<T>(key: string): T | null {
    let value = utools.dbStorage.getItem(key);
    if (typeof value === 'undefined' || value == null) {
        return null;
    }
    return value;
}

/**
 * 获取一个值，如果不存在，则返回默认值
 * @param key 键
 * @param defaultValue 默认值
 */
export function getItemByDefault<T>(key: string, defaultValue: T): T {
    let value = utools.dbStorage.getItem(key);
    if (typeof value === 'undefined' || value == null) {
        return defaultValue;
    }
    return value;
}

/**
 * 设置一个值
 * @param key 键
 * @param value 值
 */
export function setItem<T = any>(key: string, value: T) {
    utools.dbStorage.setItem(key, toRaw(value));
}

// --------------------------------------- 基础对象 ---------------------------------------

export interface DbList<T> {

    list: Array<T>;

    rev?: string;

}

export interface DbRecord<T> {

    id: string;

    record: T;

    rev?: string;

}

// --------------------------------------- 列表操作 ---------------------------------------

/**
 * 异步获取一个对象，并且对象需要时数组
 *
 * 如果一个存储是是个数组，可以使用此方法
 * @param key 键
 */
export async function listByAsync<T = any>(key: string): Promise<DbList<T>> {
    const res = await utools.db.promises.get(key);
    if (res) {
        return {
            list: res.value || new Array<T>(),
            rev: res._rev
        };
    }
    return {list: []};
}

/**
 * 异步保存一个数组到一个存储中
 * @param key 键
 * @param records 数组
 * @param rev 恢复值
 */
export async function saveListByAsync<T>(key: string, records: Array<T>, rev?: string): Promise<undefined | string> {
    try {
        const res = await utools.db.promises.put({
            _id: key,
            _rev: rev,
            value: toRaw(records)
        });
        if (res.error) {
            if (res.message === "Document update conflict") {
                // 查询后更新
                const res = await utools.db.promises.get(key);
                return await saveListByAsync(key, records, res ? res._rev : undefined);
            } else if (res.message === 'An object could not be cloned.') {
                return await saveListByAsync(key, clone(records, true), rev);
            } else if (res.message === "DataCloneError: Failed to execute 'put' on 'IDBObjectStore': [object Array] could not be cloned.") {
                return await saveListByAsync(key, clone(records, true), rev);
            } else if (res.message === "DataCloneError: Failed to execute 'put' on 'IDBObjectStore': #<Object> could not be cloned.") {
                return await saveListByAsync(key, clone(records, true), rev);
            }
            console.error(res)
            return Promise.reject(res.message);
        }
        return res.rev;
    } catch (e: any) {
        if (e.message === "An object could not be cloned.") {
            // 查询后更新
            return await saveListByAsync(key, clone(records, true), rev);
        } else {
            return Promise.reject(e);
        }
    }
}

/**
 * 通过多个键，获取多个值
 * @param key 多个键，如果是数组，则绝对匹配，如果是字符串，则前缀匹配
 */
export async function listRecordByAsync<T>(key?: string | string[]): Promise<Array<DbRecord<T>>> {
    // @ts-ignore
    const items = await utools.db.promises.allDocs(key);
    return items.filter(e => !!e).map(item => ({
        id: item._id,
        record: item.value,
        rev: item._rev
    }));
}

// --------------------------------------- 单一对象操作 ---------------------------------------

/**
 * 获取一个值，如果不存在，则使用默认值
 * @param key 键
 * @param defaultValue 默认值
 */
export async function getFromOneWithDefaultByAsync<T>(key: string, defaultValue: T): Promise<DbRecord<T>> {
    const res = await utools.db.promises.get(key);
    if (!res) {
        return {record: defaultValue, id: key}
    }
    return Promise.resolve({
        id: key,
        record: Object.assign(defaultValue || {}, res.value),
        rev: res._rev
    });
}

/**
 * 获取一个值，不存在则返回null
 * @param key 键
 */
export async function getFromOneByAsync<T = any>(key: string): Promise<DbRecord<T | null>> {
    const res = await utools.db.promises.get(key);
    if (!res) {
        return {record: null, id: key}
    }
    return Promise.resolve({
        id: key,
        record: res.value,
        rev: res._rev
    });
}

/**
 * 保存一条数据
 * @param key 键
 * @param value 值
 * @param rev 恢复
 * @param err 错误处理函数
 */
export async function saveOneByAsync<T>(key: string, value: T, rev?: string, err?: (e: Error) => void): Promise<undefined | string> {
    try {
        const res = await utools.db.promises.put({
            _id: key,
            _rev: rev,
            value: toRaw(value)
        });
        if (res.error) {
            if (res.message === "Document update conflict") {
                // 查询后更新
                const res = await utools.db.promises.get(key);
                return await saveOneByAsync(key, value, res ? res._rev : undefined);
            } else if (res.message === "DataCloneError: Failed to execute 'put' on 'IDBObjectStore': #<Object> could not be cloned.") {
                return await saveOneByAsync(key, clone(value, true), rev);
            }
            console.error(res);
            if (err) {
                err(new Error(res.message));
            } else {
                return Promise.reject(res.message);
            }
        }
        return Promise.resolve(res.rev);
    } catch (e: any) {
        if (e.message === "An object could not be cloned.") {
            // 查询后更新
            return await saveOneByAsync(key, clone(value, true), rev);
        } else if (e.message === "DataCloneError: Failed to execute 'put' on 'IDBObjectStore': #<Object> could not be cloned.") {
            return await saveOneByAsync(key, clone(value, true), rev);
        } else {
            console.error(e);
            return Promise.reject(e);
        }
    }
}

/**
 * 删除一条记录
 * @param key 键
 * @param ignoreError 是否忽略异常
 */
export async function removeOneByAsync(key: string, ignoreError: boolean = false): Promise<void> {
    const res = await utools.db.promises.remove(key);
    if (res.error) {
        if (!ignoreError) {
            return Promise.reject(res.message);
        }
    }
}

// --------------------------------------- 批量操作 ---------------------------------------

/**
 * 批量删除指定key开头的文档
 * @param key ID前缀
 * @param ignoreError 是否忽略异常，默认不忽略
 */
export async function removeMultiByAsync(key: string, ignoreError: boolean = false): Promise<void> {
    const items = await utools.db.promises.allDocs(key);
    for (let item of items) {
        await removeOneByAsync(item._id, ignoreError);
    }
}


// --------------------------------------- 临时存储 ---------------------------------------

export function getStrBySession<T>(key: string): T | null {
    const item = sessionStorage.getItem(key);
    if (!item) {
        return null
    }
    try {
        return JSON.parse(item)['value'];
    } catch (e) {
        sessionStorage.removeItem(key);
        return null;
    }
}

export function setStrBySession(key: string, value: string) {
    sessionStorage.setItem(key, value);
}

// --------------------------------------- 附件 ---------------------------------------

/**
 * 存储附件到新文档
 * @param docId 文档ID
 * @param attachment 附件 buffer
 * @return url
 */
export async function postAttachment(docId: string, attachment: Blob | File): Promise<string> {
    const buffer = await attachment.arrayBuffer();
    const res = await utools.db.promises.postAttachment(docId, new Uint8Array(buffer), "application/octet-stream");
    if (res.error) {
        return Promise.reject(res.message);
    }
    return Promise.resolve("attachment:" + docId);
}

/**
 * 异步获取附件
 * @param docId 文档ID
 * @return 文件链接
 */
export async function getAttachmentByAsync(docId: string): Promise<Blob | null> {
    const data = await utools.db.promises.getAttachment(docId);
    if (!data) {
        return null;
    }
    return  new Blob([data]);
}

/**
 * 同步获取附件，并转为url链接
 * @param docId 文档ID
 */
export function getAttachmentBySync(docId: string): string {
    const data = utools.db.getAttachment(docId);
    if (!data) {
        return "./logo.png";
    }
    const blob = new Blob([data]);
    return window.URL.createObjectURL(blob);

}
