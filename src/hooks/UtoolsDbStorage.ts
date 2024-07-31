import {ref, Ref, shallowRef, toRaw, watch} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";

export interface UseUtoolsDbOptions {
    flush?: 'pre' | 'post' | 'sync';
    deep?: boolean;
    shallow?: boolean;

    onError?(e: any): void;
}

interface DbStorageLike {
    setItem(key: string, value: any): void

    getItem(key: string): any

    removeItem(key: string): void
}

export const webDbStorage: DbStorageLike = {
    /**
     * 键值对存储，如果键名存在，则更新其对应的值
     * @param key 键名(同时为文档ID)
     * @param value 键值
     */
    setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify({
            value: value
        }));
    },
    /**
     * 获取键名对应的值
     */
    getItem(key: string): any {
        const value = localStorage.getItem(key);
        if (!value) {
            return null;
        }
        const val = JSON.parse(value).value;
        if (typeof val === 'undefined') {
            return null;
        }
        return val;
    },
    /**
     * 删除键值对(删除文档)
     */
    removeItem(key: string): void {
        localStorage.removeItem(key);
    },
}

/**
 * 同步对象存储
 */

/**
 * 异步对象存储
 */
export function useUtoolsDbStorage<T extends (string | number | boolean | object | null)>(
    key: string,
    initialValue: T,
    options: UseUtoolsDbOptions = {},
): Ref<T> {
    const {
        flush = 'pre',
        deep = true,
        shallow,
        onError = (e) => {
            MessageUtil.error('数据保存失败', e)
        },
    } = options

    const dbStorage: DbStorageLike = window.utools ? window.utools.dbStorage : webDbStorage;
    const sourceValue = dbStorage.getItem(key);
    const data = (shallow ? shallowRef : ref)((typeof sourceValue === 'undefined' || sourceValue === null) ? initialValue : sourceValue) as Ref<T>;

    watch(
        data,
        () => {
            try {
                if (data.value == null)
                    dbStorage.removeItem(key)
                else
                    dbStorage.setItem(key, toRaw(data.value))
            } catch (e) {
                onError(e)
            }
        },
        {
            flush,
            deep,
        },
    )

    return data as Ref<T>
}

