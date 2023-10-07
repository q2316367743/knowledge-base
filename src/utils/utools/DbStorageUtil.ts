import { useAuthStore } from "@/store/components/AuthStore";
import {toRaw} from "vue";
import {clone} from "xe-utils";

// 对象

export function getItem<T>(key: string): T | null {
    let value = utools.dbStorage.getItem(key);
    if (typeof value === 'undefined' || value == null) {
        return null;
    }
    return value;

}

export function getItemByDefault<T>(key: string, defaultValue: T) {
    let value = utools.dbStorage.getItem(key);
    if (typeof value === 'undefined' || value == null) {
        return defaultValue;
    }
    return value;
}

export function setItem(key: string, value: any) {
    utools.dbStorage.setItem(key, toRaw(value));
}

// --------------------------------------- 基础对象 ---------------------------------------

export interface DbList<T> {

    list: Array<T>;

    rev?: string;

}

export interface DbRecord<T> {

    record: T;

    rev?: string;

}

// --------------------------------------- 列表操作 ---------------------------------------

export async function listByAsync<T = any>(key: string): Promise<DbList<T>> {
    const res = await useAuthStore().authDriver.get(key);
    if (res) {
        return {
            list: res.value,
            rev: res._rev
        };
    }
    return {list: []};
}

export async function saveListByAsync<T>(key: string, records: Array<T>, rev?: string): Promise<undefined | string> {
    const res = await useAuthStore().authDriver.put({
        _id: key,
        _rev: rev,
        value: toRaw(records)
    });
    if (res.error) {
        if (res.message === "Document update conflict") {
            // 查询后更新
            const res = await useAuthStore().authDriver.get(key);
            return await saveListByAsync(key, records, res ? res._rev : undefined);
        }else if (res.message === 'An object could not be cloned.') {
            return await saveListByAsync(key, clone(records, true), rev);
        }
        console.log(res)
        return Promise.reject(res.message);
    }
    return Promise.resolve(res.rev);
}

export async function listRecordByAsync<T>(key: string): Promise<Array<DbRecord<T>>> {
    const items = await useAuthStore().authDriver.allDocs(key);
    return items.map(item => ({
        record: item.value,
        rev: item._rev
    }));
}

// --------------------------------------- 单一对象操作 ---------------------------------------

export async function getFromOneByAsync<T extends Record<string, any>>(key: string, record: T): Promise<DbRecord<T>> {
    const res = await useAuthStore().authDriver.get(key);
    if (!res) {
        return {record}
    }
    return Promise.resolve({
        record: Object.assign(record, res.value),
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
    const res = await useAuthStore().authDriver.put({
        _id: key,
        _rev: rev,
        value: toRaw(value)
    });
    if (res.error) {
        if (res.message === "Document update conflict") {
            // 查询后更新
            const res = await useAuthStore().authDriver.get(key);
            return await saveOneByAsync(key, value, res ? res._rev : undefined);
        }
        if (err) {
            err(new Error(res.message));
        }else {
            return Promise.reject(res.message);
        }
    }
    return Promise.resolve(res.rev);
}

/**
 * 删除一条记录
 * @param key 键
 * @param ignoreError 是否忽略异常
 */
export async function removeOneByAsync(key: string, ignoreError: boolean = false): Promise<void> {
    const res = await useAuthStore().authDriver.remove(key);
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
    const items = await useAuthStore().authDriver.allDocs(key);
    for (let item of items) {
        await removeOneByAsync(item._id, ignoreError);
    }
}


// --------------------------------------- 临时存储 ---------------------------------------

export function getStrBySession(key: string): string {
    return sessionStorage.getItem(key) || '';
}

export function setStrBySession(key: string, value: string) {
    sessionStorage.setItem(key, value);
}
