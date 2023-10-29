import {DbDoc, DbReturn} from "@/plugin/utools";

/**
 * 认证驱动类
 * @since 1.1.0
 */
export interface DbDriver {

    /**
     * 创建/更新文档
     * @param doc 文档
     */
    put(doc: DbDoc): Promise<DbReturn>;

    /**
     * 获取文档
     */
    get(id: string): Promise<DbDoc | null>;

    /**
     * 删除文档
     * @param doc 文档
     */
    remove(doc: string | DbDoc): Promise<DbReturn>;

    /**
     * 获取所有文档 可根据文档id前缀查找
     * @param key 前缀
     */
    allDocs(key?: string): Promise<Array<DbDoc>>;

    /**
     * 获取全部的key
     * @param key key的前缀
     */
    allDocKeys(key?: string): Promise<Array<string>>;

}
