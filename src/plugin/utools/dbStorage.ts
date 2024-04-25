import {DbStorage} from "@/plugin/utools/types";

const dbStorageByWeb: DbStorage = {
    /**
     * 键值对存储，如果键名存在，则更新其对应的值
     * @param key 键名(同时为文档ID)
     * @param value 键值
     */
    setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify({
            value: value
        }))
    },
    /**
     * 获取键名对应的值
     */
    getItem(key: string): any {
        const value = localStorage.getItem(key);
        if (!value) {
            return null;
        }
        try {
            const valueWrap = JSON.parse(value);
            return valueWrap['value'];
        } catch (e) {
            console.error(e);
            return null;
        }
    },
    /**
     * 删除键值对(删除文档)
     */
    removeItem(key: string): void {
        localStorage.removeItem(key)
    }
}
const dbStorageByBs: DbStorage = {
    /**
     * 键值对存储，如果键名存在，则更新其对应的值
     * @param key 键名(同时为文档ID)
     * @param value 键值
     */
    setItem(key: string, value: any): void {
        console.log(key, value)
        window.bs.db.put({
            _id: key,
            value: value
        });
    },
    /**
     * 获取键名对应的值
     */
    getItem(key: string): any {
        const items = window.bs.db.allDocs([key]);
        const item = items[0];
        return Promise.resolve(item ? item.value : null);
    },
    /**
     * 删除键值对(删除文档)
     */
    removeItem(key: string): void {
        window.bs.db.remove(key);
    }
}

export function createDbStorage(): DbStorage {
    if (window.bs) {
        return dbStorageByBs;
    }
    return dbStorageByWeb;
}
